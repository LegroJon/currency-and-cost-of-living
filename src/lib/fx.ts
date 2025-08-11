import Decimal from "decimal.js";
import pRetry from "p-retry";
import { z } from "zod";

// Basic currency minor units mapping (extend/refresh weekly as per instructions)
export const currencyMinorUnits: Record<string, number> = {
  USD: 2, EUR: 2, GBP: 2, JPY: 0, CHF: 2, CAD: 2, AUD: 2, NZD: 2, CNY: 2, SEK: 2,
};

const pairSchema = z.object({
  base: z.string().length(3).toUpperCase(),
  quote: z.string().length(3).toUpperCase(),
});

export interface FxRateResult {
  pair: { base: string; quote: string };
  rate: number;
  asOf: string; // YYYY-MM-DD
  source: string;
  stale: boolean;
  deltaPct?: number;
}

const fetchJson = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
  return res.json();
};

async function getFrankfurter(base: string, quote: string) {
  const data = await fetchJson(`https://api.frankfurter.app/latest?from=${base}&to=${quote}`);
  const rate = data.rates?.[quote];
  if (typeof rate !== "number") throw new Error("Frankfurter missing rate");
  return { rate: new Decimal(rate), asOf: data.date as string, source: "frankfurter" };
}

async function getExchangeHost(base: string, quote: string) {
  const data = await fetchJson(`https://api.exchangerate.host/latest?base=${base}&symbols=${quote}`);
  const rate = data.rates?.[quote];
  if (typeof rate !== "number") throw new Error("exchangerate.host missing rate");
  const asOf = data.date || new Date().toISOString().slice(0, 10);
  return { rate: new Decimal(rate), asOf, source: "exchangerate.host" };
}

function isBusinessDay(date: Date) {
  const day = date.getUTCDay();
  return day !== 0 && day !== 6; // Sunday=0 Saturday=6
}

function currentBusinessDateUTC(): string {
  const now = new Date();
  // If weekend, roll back to Friday
  while (!isBusinessDay(now)) {
    now.setUTCDate(now.getUTCDate() - 1);
  }
  return now.toISOString().slice(0, 10);
}

export async function fetchFxRate(base: string, quote: string): Promise<FxRateResult> {
  const { base: b, quote: q } = pairSchema.parse({ base: base.toUpperCase(), quote: quote.toUpperCase() });
  if (b === q) return { pair: { base: b, quote: q }, rate: 1, asOf: currentBusinessDateUTC(), source: "identity", stale: false };

  const attempt = async () => {
    const primary = await getFrankfurter(b, q);
    let secondary; try { secondary = await getExchangeHost(b, q); } catch { /* ignore secondary error */ }

    let chosen = primary;
    let deltaPct: number | undefined;
    if (secondary) {
      const diff = primary.rate.minus(secondary.rate).abs();
      const avg = primary.rate.plus(secondary.rate).div(2);
      deltaPct = diff.div(avg).times(100).toNumber();
      if (deltaPct > 0.5) {
        // choose newest
        if (secondary.asOf > primary.asOf) chosen = secondary; else chosen = primary;
      }
    }

    const asOf = chosen.asOf;
    const businessDate = currentBusinessDateUTC();
    const stale = asOf < businessDate;

    return {
      pair: { base: b, quote: q },
      rate: chosen.rate.toNumber(),
      asOf,
      source: chosen.source,
      stale,
      deltaPct,
    } satisfies FxRateResult;
  };

  const result = await pRetry(attempt, { retries: 2, factor: 2 });
  return result;
}

export function roundAmount(amount: Decimal.Value, currency: string) {
  const units = currencyMinorUnits[currency] ?? 2;
  return new Decimal(amount).toDecimalPlaces(units, Decimal.ROUND_HALF_UP).toNumber();
}
