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
  try {
    const body = await req.json();
    const { fromCurrency, toCurrency, fromCountry, toCountry, amount } = schema.parse(body);
    
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
    
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
