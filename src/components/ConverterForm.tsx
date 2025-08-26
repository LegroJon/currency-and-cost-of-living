"use client";
import { useState } from "react";

interface ConvertResponse {
  rate: number; asOf: string; source: string; stale: boolean; amount: number; converted: number;
}

export default function ConverterForm() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState(100);
  const [result, setResult] = useState<ConvertResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/convert", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ from, to, amount }) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setResult(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-4 border p-4 rounded-md bg-slate-50">
      <div className="flex gap-2">
        <input className="border px-2 py-1 rounded w-20" value={from} onChange={e=>setFrom(e.target.value.toUpperCase())} />
        <span>→</span>
        <input className="border px-2 py-1 rounded w-20" value={to} onChange={e=>setTo(e.target.value.toUpperCase())} />
        <input className="border px-2 py-1 rounded w-32" type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} />
        <button disabled={loading} className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50">{loading?"...":"Convert"}</button>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {result && (
        <div className="text-sm">
          <div><strong>Rate:</strong> {result.rate} ({result.source}) {result.stale && <span className="text-amber-600">stale</span>}</div>
          <div><strong>As Of:</strong> {result.asOf}</div>
          <div><strong>Converted:</strong> {result.converted}</div>
        </div>
      )}
    </form>
  );
}
