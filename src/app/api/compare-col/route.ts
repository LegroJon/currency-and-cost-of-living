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
  const body = await req.json();
  const { fromCurrency, toCurrency, fromCountry, toCountry, amount } = schema.parse(body);
  const fx = await fetchFxRate(fromCurrency, toCurrency);
  const converted = new Decimal(amount).times(fx.rate);
  const sourcePPP = await getPPP(fromCountry);
  const targetPPP = await getPPP(toCountry);
  // Real adjustment: converted * (sourcePPP.value / targetPPP.value)
  const realAdjusted = converted.times(sourcePPP.value).div(targetPPP.value);
  const convertedRounded = roundAmount(converted, toCurrency);
  const realAdjustedRounded = roundAmount(realAdjusted, toCurrency);
  return Response.json({
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
  });
}
