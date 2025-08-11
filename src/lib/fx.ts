import Decimal from "decimal.js";
import pRetry from "p-retry";
import { z } from "zod";
import { getMinorUnits } from "./currencies";

// FX Rate Caching (60-300 seconds as per requirements)
const fxCache = new Map<string, { result: FxRateResult; expires: number }>();
const CACHE_TTL = 180 * 1000; // 3 minutes (180 seconds, middle of 60-300s range)

function getCacheKey(base: string, quote: string): string {
  const date = currentBusinessDateUTC();
  return `${base}/${quote}:${date}`;
}

function logFxTransaction(data: {
  provider: string;
  pair: string;
  rate: number;
  delta?: number;
  asOf: string;
  stale: boolean;
}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type: "FX_RATE",
    ...data
  };
  console.log(`[FX] ${JSON.stringify(logEntry)}`);
}

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

  // Check cache first
  const cacheKey = getCacheKey(b, q);
  const now = Date.now();
  const cached = fxCache.get(cacheKey);
  if (cached && cached.expires > now) {
    logFxTransaction({
      provider: cached.result.source,
      pair: `${b}/${q}`,
      rate: cached.result.rate,
      delta: cached.result.deltaPct,
      asOf: cached.result.asOf,
      stale: cached.result.stale
    });
    return cached.result;
  }

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
        // Log divergence as per requirements
        console.log(`[FX] Rate divergence detected: ${deltaPct.toFixed(2)}% between ${primary.source} and ${secondary.source} for ${b}/${q}`);
        // choose newest
        if (secondary.asOf > primary.asOf) chosen = secondary; else chosen = primary;
      }
    }

    const asOf = chosen.asOf;
    const businessDate = currentBusinessDateUTC();
    const stale = asOf < businessDate;

    const result = {
      pair: { base: b, quote: q },
      rate: chosen.rate.toNumber(),
      asOf,
      source: chosen.source,
      stale,
      deltaPct,
    } satisfies FxRateResult;

    // Cache the result
    fxCache.set(cacheKey, { result, expires: now + CACHE_TTL });

    // Log the transaction
    logFxTransaction({
      provider: chosen.source,
      pair: `${b}/${q}`,
      rate: result.rate,
      delta: deltaPct,
      asOf: result.asOf,
      stale: result.stale
    });

    return result;
  };

  const result = await pRetry(attempt, { retries: 2, factor: 2 });
  return result;
}

export function roundAmount(amount: Decimal.Value, currency: string) {
  const units = getMinorUnits(currency);
  return new Decimal(amount).toDecimalPlaces(units, Decimal.ROUND_HALF_UP).toNumber();
}
