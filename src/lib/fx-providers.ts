import Decimal from "decimal.js";

/**
 * FX provider interface and implementations
 */
export interface FxProvider {
  name: string;
  fetch: (base: string, quote: string) => Promise<FxProviderResult>;
}

export interface FxProviderResult {
  rate: Decimal;
  asOf: string;
  source: string;
}

const fetchJson = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${res.statusText}`);
  return res.json();
};

export const providers: FxProvider[] = [
  {
    name: "Frankfurter",
    async fetch(base: string, quote: string): Promise<FxProviderResult> {
      const data = await fetchJson(`https://api.frankfurter.app/latest?from=${base}&to=${quote}`);
      const rate = data.rates?.[quote];
      if (typeof rate !== "number") throw new Error("Frankfurter missing rate");
      return { rate: new Decimal(rate), asOf: data.date as string, source: "Frankfurter" };
    }
  },
  {
    name: "ExchangeRate-API",
    async fetch(base: string, quote: string): Promise<FxProviderResult> {
      const data = await fetchJson(`https://open.er-api.com/v6/latest/${base}`);
      if (data.result !== "success") {
        throw new Error(`ExchangeRate-API error: ${data["error-type"] || "unknown"}`);
      }
      const rate = data.rates?.[quote];
      if (typeof rate !== "number") throw new Error("ExchangeRate-API missing rate");
      const asOf = data.time_last_update_utc 
        ? new Date(data.time_last_update_utc).toISOString().slice(0, 10) 
        : new Date().toISOString().slice(0, 10);
      return { rate: new Decimal(rate), asOf, source: "ExchangeRate-API" };
    }
  },
  {
    name: "exchangerate.host",
    async fetch(base: string, quote: string): Promise<FxProviderResult> {
      const data = await fetchJson(`https://api.exchangerate.host/latest?base=${base}&symbols=${quote}`);
      const rate = data.rates?.[quote];
      if (typeof rate !== "number") throw new Error("exchangerate.host missing rate");
      const asOf = data.date || new Date().toISOString().slice(0, 10);
      return { rate: new Decimal(rate), asOf, source: "exchangerate.host" };
    }
  }
];
