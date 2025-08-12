"use client";
import { useState, useRef, useEffect } from "react";
import { getCurrencyInfo, getAllCurrencies, searchCurrencies, type CurrencyInfo } from "@/lib/currency-info";

interface CurrencySelectorProps {
  value: string;
  onChange: (currency: string) => void;
  placeholder?: string;
}

export default function CurrencySelector({ value, onChange, placeholder = "Select currency" }: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredCurrencies, setFilteredCurrencies] = useState<CurrencyInfo[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedCurrency = getCurrencyInfo(value);
  
  useEffect(() => {
    if (search.trim()) {
      setFilteredCurrencies(searchCurrencies(search).slice(0, 20)); // Limit results
    } else {
      setFilteredCurrencies(getAllCurrencies().slice(0, 50)); // Show top 50
    }
  }, [search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectCurrency = (currency: CurrencyInfo) => {
    onChange(currency.code);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border px-3 py-2 rounded text-left bg-white hover:bg-gray-50 flex items-center justify-between min-w-[140px]"
      >
        <div className="flex items-center">
          {selectedCurrency ? (
            <>
              <span className="font-mono font-medium text-blue-600">{selectedCurrency.code}</span>
              <span className="ml-2 text-gray-600 truncate">{selectedCurrency.symbol}</span>
            </>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-80 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          {/* Search Input */}
          <div className="p-2 border-b">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search currencies..."
              className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Currency List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  type="button"
                  onClick={() => selectCurrency(currency)}
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <span className="font-mono font-medium text-blue-600 mr-2">{currency.code}</span>
                      <span className="text-gray-600 mr-2">{currency.symbol}</span>
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {currency.name} • {currency.country}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-sm">
                No currencies found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
