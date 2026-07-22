"use client";

export interface Filters {
  q: string;
  product: string;
  vehicleNo: string;
  transType: string;
  dateFrom: string;
  dateTo: string;
  minNett: string;
  maxNett: string;
  sort: string;
}

export const defaultFilters: Filters = {
  q: "",
  product: "",
  vehicleNo: "",
  transType: "",
  dateFrom: "",
  dateTo: "",
  minNett: "",
  maxNett: "",
  sort: "docketDate:desc",
};

const inputClass =
  "w-full rounded-sm border border-line bg-white px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30";
const labelClass = "mb-1 block font-display text-[12px] font-semibold uppercase tracking-wide text-graphite-700";

export default function SearchFilters({
  filters,
  onChange,
  onReset,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
}) {
  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="rounded-sm border border-line bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-graphite-700">
          Advanced search
        </p>
        <button onClick={onReset} className="text-xs font-semibold uppercase tracking-wide text-signal-red">
          Reset filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <div className="sm:col-span-3 lg:col-span-2">
          <label className={labelClass}>Keyword (serial no., vehicle, partner, driver, product, DO no.)</label>
          <input className={inputClass} value={filters.q} onChange={(e) => set("q", e.target.value)} placeholder="e.g. PLM5292 or 0135668" />
        </div>
        <div>
          <label className={labelClass}>Vehicle no.</label>
          <input className={inputClass} value={filters.vehicleNo} onChange={(e) => set("vehicleNo", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Product</label>
          <input className={inputClass} value={filters.product} onChange={(e) => set("product", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Transaction type</label>
          <select className={inputClass} value={filters.transType} onChange={(e) => set("transType", e.target.value)}>
            <option value="">All</option>
            <option value="PURCHASE">Purchase</option>
            <option value="SALES">Sales</option>
            <option value="TRANSFER">Transfer</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Date from</label>
          <input type="date" className={inputClass} value={filters.dateFrom} onChange={(e) => set("dateFrom", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Date to</label>
          <input type="date" className={inputClass} value={filters.dateTo} onChange={(e) => set("dateTo", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Min nett weight (Kg)</label>
          <input type="number" className={`${inputClass} font-mono`} value={filters.minNett} onChange={(e) => set("minNett", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Max nett weight (Kg)</label>
          <input type="number" className={`${inputClass} font-mono`} value={filters.maxNett} onChange={(e) => set("maxNett", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Sort by</label>
          <select className={inputClass} value={filters.sort} onChange={(e) => set("sort", e.target.value)}>
            <option value="docketDate:desc">Date — newest first</option>
            <option value="docketDate:asc">Date — oldest first</option>
            <option value="nettWeight:desc">Nett weight — high to low</option>
            <option value="nettWeight:asc">Nett weight — low to high</option>
            <option value="serialNo:desc">Serial no. — descending</option>
            <option value="serialNo:asc">Serial no. — ascending</option>
          </select>
        </div>
      </div>
    </div>
  );
}
