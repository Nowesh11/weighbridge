"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Receipt, ReceiptListResponse } from "@/types/receipt";
import SearchFilters, { defaultFilters, Filters } from "@/components/SearchFilters";

const PAGE_SIZE = 20;

export default function ReceiptsPage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<ReceiptListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = useMemo(() => {
    const sp = new URLSearchParams();
    if (filters.q) sp.set("q", filters.q);
    if (filters.product) sp.set("product", filters.product);
    if (filters.vehicleNo) sp.set("vehicleNo", filters.vehicleNo);
    if (filters.transType) sp.set("transType", filters.transType);
    if (filters.dateFrom) sp.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) sp.set("dateTo", filters.dateTo);
    if (filters.minNett) sp.set("minNett", filters.minNett);
    if (filters.maxNett) sp.set("maxNett", filters.maxNett);
    sp.set("sort", filters.sort);
    sp.set("page", String(page));
    sp.set("pageSize", String(PAGE_SIZE));
    return sp.toString();
  }, [filters, page]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/receipts?${query}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.error) throw new Error(json.error);
        setResult(json as ReceiptListResponse);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load records");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  function handleFilterChange(next: Filters) {
    setFilters(next);
    setPage(1);
  }

  function handleReset() {
    setFilters(defaultFilters);
    setPage(1);
  }

  const totalPages = result ? Math.max(1, Math.ceil(result.total / PAGE_SIZE)) : 1;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="font-display text-2xl font-semibold text-ink">Ticket Records</p>
          <p className="text-sm text-graphite-700">Search and review past weighbridge tickets.</p>
        </div>
        <Link
          href="/"
          className="rounded-sm bg-amber-500 px-4 py-2 font-display text-sm font-semibold uppercase tracking-wide text-graphite-900 transition hover:bg-amber-600"
        >
          + New Ticket
        </Link>
      </div>

      <SearchFilters filters={filters} onChange={handleFilterChange} onReset={handleReset} />

      <div className="mt-6 overflow-hidden rounded-sm border border-line bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-line bg-steel-100 px-5 py-3">
          <p className="text-sm text-graphite-700">
            {result ? `${result.total.toLocaleString()} ticket${result.total === 1 ? "" : "s"} found` : "Loading…"}
          </p>
        </div>

        {error && <p className="px-5 py-6 text-sm text-signal-red">{error}</p>}

        {!error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-steel-50 font-display text-xs uppercase tracking-wide text-graphite-700">
                  <th className="px-5 py-3">Serial No.</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Vehicle No.</th>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3 text-right">Nett Weight (Kg)</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-graphite-700">
                      Loading records…
                    </td>
                  </tr>
                )}
                {!loading && result && result.data.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-graphite-700">
                      No tickets match these filters.
                    </td>
                  </tr>
                )}
                {!loading &&
                  result?.data.map((r: Receipt) => (
                    <tr key={r.id} className="border-b border-line last:border-0 hover:bg-steel-50">
                      <td className="px-5 py-3">
                        <Link href={`/receipts/${r.id}`} className="font-mono font-semibold text-ink hover:underline">
                          {r.serialNo}
                        </Link>
                      </td>
                      <td className="px-5 py-3">{new Date(r.docketDate).toLocaleDateString("en-GB")}</td>
                      <td className="px-5 py-3 font-mono">{r.vehicleNo}</td>
                      <td className="px-5 py-3">{r.product}</td>
                      <td className="px-5 py-3">
                        <span className="rounded-sm bg-steel-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-graphite-700">
                          {r.transType}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-mono">{r.nettWeight.toLocaleString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-line px-5 py-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-sm border border-line px-3 py-1.5 text-sm font-semibold text-ink disabled:opacity-40"
          >
            Previous
          </button>
          <p className="text-sm text-graphite-700">
            Page {page} of {totalPages}
          </p>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-sm border border-line px-3 py-1.5 text-sm font-semibold text-ink disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
