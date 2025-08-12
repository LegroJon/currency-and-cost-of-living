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
  if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${res.statusText}`);
  return res.json();
};

async function getFrankfurter(base: string, quote: string) {
  const data = await fetchJson(`https://api.frankfurter.app/latest?from=${base}&to=${quote}`);
  const rate = data.rates?.[quote];
  if (typeof rate !== "number") throw new Error("Frankfurter missing rate");
  return { rate: new Decimal(rate), asOf: data.date as string, source: "Frankfurter" };
}

// NEW: ExchangeRate-API (free, no key, supports 160+ currencies including COP)
async function getExchangeRateAPI(base: string, quote: string) {
  const data = await fetchJson(`https://open.er-api.com/v6/latest/${base}`);
  if (data.result !== "success") {
    throw new Error(`ExchangeRate-API error: ${data["error-type"] || "unknown"}`);
  }
  const rate = data.rates?.[quote];
  if (typeof rate !== "number") throw new Error("ExchangeRate-API missing rate");
  const asOf = data.time_last_update_utc ? new Date(data.time_last_update_utc).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
  return { rate: new Decimal(rate), asOf, source: "ExchangeRate-API" };
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
    const providers = [
      { name: "Frankfurter", fn: getFrankfurter },
      { name: "ExchangeRate-API", fn: getExchangeRateAPI },
      { name: "exchangerate.host", fn: getExchangeHost }
    ];

    const results = [];
    let chosen = null;

    // Try each provider
    for (const provider of providers) {
      try {
        console.log(`[FX] Trying ${provider.name} for ${b}/${q}`);
        const result = await provider.fn(b, q);
        results.push(result);
        if (!chosen) chosen = result; // Use first successful result as primary
        console.log(`[FX] ${provider.name} success: ${result.rate} (${result.asOf})`);
      } catch (error) {
        console.log(`[FX] ${provider.name} failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    // If no provider succeeded, throw error
    if (!chosen || results.length === 0) {
      throw new Error(`All providers failed for ${b}/${q}`);
    }

    // Cross-validation if multiple results
    let deltaPct: number | undefined;
    if (results.length >= 2) {
      const rates = results.map(r => r.rate.toNumber());
      const minRate = Math.min(...rates);
      const maxRate = Math.max(...rates);
      const avgRate = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
      
      deltaPct = ((maxRate - minRate) / avgRate) * 100;
      
      if (deltaPct > 0.5) {
        // Use newest rate on high divergence
        chosen = results.reduce((newest, current) => 
          current.asOf > newest.asOf ? current : newest
        );
        console.log(`[FX] Rate divergence ${deltaPct.toFixed(2)}% - using newest from ${chosen.source}`);
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
