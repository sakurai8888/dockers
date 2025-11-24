"use client";

import React, { useEffect, useMemo, useState } from 'react';

type AnyRow = { [k: string]: any };

function useDebounced<Value>(value: Value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SampleSearch() {
  const [q, setQ] = useState('');
  const debouncedQ = useDebounced(q, 300);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnyRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function doSearch() {
      setError(null);
      if (!debouncedQ || debouncedQ.length < 4) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQ)}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Search failed');
          setResults([]);
        } else {
          setResults(data.results || []);
        }
      } catch (err: any) {
        setError(String(err));
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
    doSearch();
  }, [debouncedQ]);

  const columns = useMemo(() => {
    if (!results.length) return [] as string[];
    // get union of keys from first few rows
    const keys = new Set<string>();
    results.slice(0, 10).forEach((r) => Object.keys(r).forEach((k) => keys.add(k)));
    return Array.from(keys);
  }, [results]);

  return (
    <section className="p-4">
      <label className="block mb-2">
        <span className="text-sm font-medium">Search</span>
        <input
          className="mt-1 block w-full rounded border px-2 py-1"
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Type at least 4 characters to search..."
        />
      </label>

      {loading && <p>Searching...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !results.length && debouncedQ.length >= 4 && <p>No results</p>}

      {results.length > 0 && (
        <div className="overflow-auto mt-4">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c} className="border px-2 py-1 text-left bg-gray-100">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, i) => (
                <tr key={i} className={i % 2 ? 'bg-white' : 'bg-gray-50'}>
                  {columns.map((c) => (
                    <td key={c} className="border px-2 py-1 align-top">
                      {String(row[c] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
