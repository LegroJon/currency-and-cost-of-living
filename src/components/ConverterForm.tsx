"use client";
import { useState } from "react";
import CurrencySelector from "./CurrencySelector";

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
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      setResult(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-4 border p-6 rounded-lg bg-gray-800 border-gray-700">
      <h3 className="text-lg font-semibold text-gray-100 text-center">Currency Converter</h3>
      
      {/* Quick Amount Buttons */}
      <div className="space-y-2 text-center">
        <label className="block text-sm font-medium text-gray-300">Quick Amounts</label>
        <div className="flex flex-wrap gap-2 justify-center">
          {[1, 5, 10, 100, 1000, 10000, 100000].map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => setAmount(quickAmount)}
              className={`px-3 py-1 text-sm rounded border transition-colors ${
                amount === quickAmount
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
              }`}
            >
              {quickAmount >= 1000 ? `${quickAmount / 1000}k` : quickAmount.toString()}
            </button>
          ))}
        </div>
      </div>
      
      <form onSubmit={submit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-1">From</label>
            <CurrencySelector value={from} onChange={setFrom} />
          </div>
          
          <div className="flex-shrink-0 pb-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-1">To</label>
            <CurrencySelector value={to} onChange={setTo} />
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
            <input 
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100 border-gray-600" 
              type="number" 
              value={amount} 
              onChange={e=>setAmount(Number(e.target.value))} 
              min="0.01"
              step="0.01"
            />
          </div>
          
          <button 
            disabled={loading || !from || !to} 
            className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? "Converting..." : "Convert"}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="p-3 bg-red-900/20 border border-red-800 rounded-md">
          <p className="text-red-400 text-sm font-medium">Error</p>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      {result && (
        <div className="p-4 bg-green-900/20 border border-green-800 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-green-400 font-medium">Conversion Result</h4>
            {result.stale && (
              <span className="text-xs bg-amber-900/30 text-amber-300 px-2 py-1 rounded">Stale Data</span>
            )}
          </div>
          <div className="text-2xl font-bold text-green-400 mb-2">
            {amount} {from} = {result.converted} {to}
          </div>
          <div className="text-sm text-green-300 space-y-1">
            <div>Exchange Rate: 1 {from} = {result.rate.toFixed(6)} {to}</div>
            <div>Source: {result.source} • As of: {result.asOf}</div>
          </div>
        </div>
      )}
    </div>
  );
}
