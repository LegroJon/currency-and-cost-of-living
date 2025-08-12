import { NextRequest } from "next/server";
import { z } from "zod";
import Decimal from "decimal.js";
import { fetchFxRate, roundAmount } from "@/lib/fx";
import { getPPP } from "@/lib/ppp";

const schema = z.object({
  fromCurrency: z.string().length(3).toUpperCase(),
  toCurrency: z.string().length(3).toUpperCase(),
  fromCountry: z.string().length(3).toUpperCase(),
  toCountry: z.string().length(3).toUpperCase(),
  amount: z.coerce.number().positive(),
});

export async function POST(req: NextRequest) {
  let fromCurrency: string | undefined;
  let toCurrency: string | undefined;
  let fromCountry: string | undefined;
  let toCountry: string | undefined;
  
  try {
    const body = await req.json();
    const parsed = schema.parse(body);
    fromCurrency = parsed.fromCurrency;
    toCurrency = parsed.toCurrency;
    fromCountry = parsed.fromCountry;
    toCountry = parsed.toCountry;
    const { amount } = parsed;
    
    console.log(`[API] Compare-CoL request: ${amount} ${fromCurrency} (${fromCountry}) -> ${toCurrency} (${toCountry})`);
    
    const fx = await fetchFxRate(fromCurrency, toCurrency);
    const converted = new Decimal(amount).times(fx.rate);
    const sourcePPP = await getPPP(fromCountry);
    const targetPPP = await getPPP(toCountry);
    
    // Real adjustment: converted * (sourcePPP.value / targetPPP.value)
    const realAdjusted = converted.times(sourcePPP.value).div(targetPPP.value);
    const convertedRounded = roundAmount(converted, toCurrency);
    const realAdjustedRounded = roundAmount(realAdjusted, toCurrency);
    
    const response = {
      amount,
      from: fromCurrency,
      to: toCurrency,
      rate: fx.rate,
      asOf: fx.asOf,
      source: fx.source,
      stale: fx.stale,
      converted: convertedRounded,
      ppp: {
        source: sourcePPP,
        target: targetPPP,
      },
      realAdjusted: realAdjustedRounded,
    };
    
    console.log(`[API] Compare-CoL response: converted=${convertedRounded}, realAdjusted=${realAdjustedRounded} (PPP: ${sourcePPP.year}/${targetPPP.year})`);
    return Response.json(response);
    
  } catch (error) {
    console.error(`[API] Compare-CoL error:`, error);
    
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }
    
    // Check for unsupported currency pair or country errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('All providers failed') || 
        errorMessage.includes('missing rate') || 
        errorMessage.includes('not found') ||
        errorMessage.includes('Country not found') ||
        errorMessage.includes('PPP data unavailable')) {
      return Response.json(
        { 
          error: "Unsupported currency pair or country code", 
          details: {
            currencies: fromCurrency && toCurrency ? { from: fromCurrency, to: toCurrency } : undefined,
            countries: fromCountry && toCountry ? { from: fromCountry, to: toCountry } : undefined
          },
          message: errorMessage
        },
        { status: 400 }
      );
    }
    
    // All other errors are provider/network issues
    return Response.json(
      { error: "Provider error", message: errorMessage },
      { status: 502 }
    );
  }
}
