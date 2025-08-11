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
  try {
    const body = await req.json();
    const { from, to, amount } = schema.parse(body);
    
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
    
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
