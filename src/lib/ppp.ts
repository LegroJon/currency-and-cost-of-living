import { z } from "zod";

interface PPPEntry { countryiso3code: string; date: string; value: number | null; }
interface PPPResult { year: number; value: number; }

const iso3Schema = z.string().length(3).toUpperCase();

const cache = new Map<string, { result: PPPResult; expires: number }>();
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

async function fetchWorldBank(countryIso3: string): Promise<PPPResult> {
  const url = `https://api.worldbank.org/v2/country/${countryIso3}/indicator/PA.NUS.PPPC.RF?format=json&per_page=60`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`World Bank PPP fetch failed ${res.status}`);
  const data = await res.json();
  const series: PPPEntry[] = data?.[1] || [];
  for (const row of series) {
    if (row.value != null) {
      return { year: parseInt(row.date, 10), value: row.value };
    }
  }
  throw new Error("No PPP value found");
}

export async function getPPP(countryIso3: string): Promise<PPPResult> {
  const iso3 = iso3Schema.parse(countryIso3.toUpperCase());
  const key = `ppp:${iso3}`;
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && cached.expires > now) return cached.result;
  const result = await fetchWorldBank(iso3);
  cache.set(key, { result, expires: now + THIRTY_DAYS_MS });
  return result;
}

export type { PPPResult };
