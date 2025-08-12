import { NextRequest } from "next/server";
import { z } from "zod";
import Decimal from "decimal.js";
import { fetchFxRate, roundAmount } from "@/lib/fx";

const schema = z.object({
  from: z.string().length(3).toUpperCase(),
  to: z.string().length(3).toUpperCase(),
  amount: z.coerce.number().positive(),
});

export async function POST(req: NextRequest) {
  let from: string | undefined;
  let to: string | undefined;
  
  try {
    const body = await req.json();
    const parsed = schema.parse(body);
    from = parsed.from;
    to = parsed.to;
    const { amount } = parsed;
    
    console.log(`[API] Convert request: ${amount} ${from} -> ${to}`);
    
    const fx = await fetchFxRate(from, to);
    const converted = roundAmount(new Decimal(amount).times(fx.rate), to);
    
    const response = {
      rate: fx.rate,
      asOf: fx.asOf,
      source: fx.source,
      stale: fx.stale,
      amount,
      converted,
    };
    
    console.log(`[API] Convert response: ${JSON.stringify(response)}`);
    return Response.json(response);
    
  } catch (error) {
    console.error(`[API] Convert error:`, error);
    
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }
    
    // Check for unsupported currency pair errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('All providers failed') || 
        errorMessage.includes('missing rate') || 
        errorMessage.includes('not found')) {
      return Response.json(
        { 
          error: "Unsupported currency pair or providers unavailable", 
          details: from && to ? { from, to } : undefined,
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
