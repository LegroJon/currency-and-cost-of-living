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
  const body = await req.json();
  const { from, to, amount } = schema.parse(body);
  const fx = await fetchFxRate(from, to);
  const converted = roundAmount(new Decimal(amount).times(fx.rate), to);
  return Response.json({
    rate: fx.rate,
    asOf: fx.asOf,
    source: fx.source,
    stale: fx.stale,
    amount,
    converted,
  });
}
