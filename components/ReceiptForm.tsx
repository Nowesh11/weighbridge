"use client";

import { useState } from "react";
import { Receipt, ReceiptFormValues, TransType } from "@/types/receipt";
import ReceiptPrint from "./ReceiptPrint";

const emptyForm: ReceiptFormValues = {
  vehicleNo: "",
  partner: "",
  driverName: "",
  driverIc: "",
  doNo: "",
  transType: "PURCHASE",
  transporter: "",
  product: "",
  docketDate: new Date().toISOString().slice(0, 10),
  timeIn: "",
  timeOut: "",
  firstWeight: "",
  secondWeight: "",
  remarks: "",
  weighingBy: "",
};

const inputClass =
  "w-full rounded-sm border border-line bg-white px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30";
const labelClass = "mb-1 block font-display text-[13px] font-semibold uppercase tracking-wide text-graphite-700";

export default function ReceiptForm() {
  const [form, setForm] = useState<ReceiptFormValues>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<Receipt | null>(null);

  const nett =
    form.firstWeight && form.secondWeight
      ? Math.abs(Number(form.firstWeight) - Number(form.secondWeight))
      : null;

  function update<K extends keyof ReceiptFormValues>(key: K, value: ReceiptFormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.vehicleNo || !form.product || !form.timeIn || !form.firstWeight || !form.secondWeight) {
      setError("Please fill in vehicle no., product, time in, first weight and second weight.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save ticket");
      setSaved(json.data as Receipt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  function startNewTicket() {
    setSaved(null);
    setForm(emptyForm);
  }

  if (saved) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="no-print mb-6 flex items-center justify-between rounded-sm border border-line bg-white px-5 py-4 shadow-sm">
          <div>
            <p className="font-display text-lg font-semibold text-ink">Ticket saved — Serial No. {saved.serialNo}</p>
            <p className="text-sm text-graphite-700">Review the slip below, then print it.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="rounded-sm bg-amber-500 px-4 py-2 font-display text-sm font-semibold uppercase tracking-wide text-graphite-900 transition hover:bg-amber-600"
            >
              Print Slip
            </button>
            <button
              onClick={startNewTicket}
              className="rounded-sm border border-line bg-white px-4 py-2 font-display text-sm font-semibold uppercase tracking-wide text-ink transition hover:bg-steel-100"
            >
              New Ticket
            </button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-sm border border-line bg-steel-200 py-8 shadow-inner">
          <ReceiptPrint receipt={saved} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <p className="font-display text-2xl font-semibold text-ink">New Weighbridge Ticket</p>
        <p className="text-sm text-graphite-700">
          Key in the docket details below. A serial number is generated automatically once it's saved.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-sm border border-line bg-white p-6 shadow-sm">
        {error && (
          <div className="rounded-sm border border-signal-red/40 bg-signal-red/10 px-4 py-3 text-sm text-signal-red">
            {error}
          </div>
        )}

        <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <legend className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-graphite-700">
            Vehicle &amp; party
          </legend>
          <div>
            <label className={labelClass}>Vehicle No. *</label>
            <input
              className={inputClass}
              value={form.vehicleNo}
              onChange={(e) => update("vehicleNo", e.target.value.toUpperCase())}
              placeholder="PLM5292"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Transaction type</label>
            <select
              className={inputClass}
              value={form.transType}
              onChange={(e) => update("transType", e.target.value as TransType)}
            >
              <option value="PURCHASE">Purchase</option>
              <option value="SALES">Sales</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Partner</label>
            <input
              className={inputClass}
              value={form.partner}
              onChange={(e) => update("partner", e.target.value)}
              placeholder="Cash / Company name"
            />
          </div>
          <div>
            <label className={labelClass}>DO No.</label>
            <input className={inputClass} value={form.doNo} onChange={(e) => update("doNo", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Driver name</label>
            <input
              className={inputClass}
              value={form.driverName}
              onChange={(e) => update("driverName", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Driver IC</label>
            <input
              className={inputClass}
              value={form.driverIc}
              onChange={(e) => update("driverIc", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Transporter</label>
            <input
              className={inputClass}
              value={form.transporter}
              onChange={(e) => update("transporter", e.target.value)}
            />
          </div>
        </fieldset>

        <fieldset className="grid grid-cols-1 gap-4 border-t border-line pt-5 sm:grid-cols-2">
          <legend className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-graphite-700">
            Goods
          </legend>
          <div>
            <label className={labelClass}>Product *</label>
            <input
              className={inputClass}
              value={form.product}
              onChange={(e) => update("product", e.target.value)}
              placeholder="Sotong / Scrap iron / Bonus"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Docket date</label>
            <input
              type="date"
              className={inputClass}
              value={form.docketDate}
              onChange={(e) => update("docketDate", e.target.value)}
            />
          </div>
        </fieldset>

        <fieldset className="grid grid-cols-1 gap-4 border-t border-line pt-5 sm:grid-cols-2">
          <legend className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-graphite-700">
            Weighing
          </legend>
          <div>
            <label className={labelClass}>Date / Time In *</label>
            <input
              type="datetime-local"
              className={inputClass}
              value={form.timeIn}
              onChange={(e) => update("timeIn", e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Date / Time Out</label>
            <input
              type="datetime-local"
              className={inputClass}
              value={form.timeOut}
              onChange={(e) => update("timeOut", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>First weight (Kg) *</label>
            <input
              type="number"
              step="any"
              className={`${inputClass} font-mono`}
              value={form.firstWeight}
              onChange={(e) => update("firstWeight", e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Second weight (Kg) *</label>
            <input
              type="number"
              step="any"
              className={`${inputClass} font-mono`}
              value={form.secondWeight}
              onChange={(e) => update("secondWeight", e.target.value)}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between rounded-sm bg-steel-100 px-4 py-3">
              <span className="font-display text-sm font-semibold uppercase tracking-wide text-graphite-700">
                Nett weight
              </span>
              <span className="font-mono text-lg font-semibold text-ink">
                {nett !== null ? `${nett.toLocaleString()} Kg` : "—"}
              </span>
            </div>
          </div>
        </fieldset>

        <fieldset className="grid grid-cols-1 gap-4 border-t border-line pt-5 sm:grid-cols-2">
          <legend className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-graphite-700">
            Notes
          </legend>
          <div>
            <label className={labelClass}>Weighing by</label>
            <input
              className={inputClass}
              value={form.weighingBy}
              onChange={(e) => update("weighingBy", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Remarks</label>
            <input className={inputClass} value={form.remarks} onChange={(e) => update("remarks", e.target.value)} />
          </div>
        </fieldset>

        <div className="flex justify-end gap-3 border-t border-line pt-5">
          <button
            type="button"
            onClick={() => setForm(emptyForm)}
            className="rounded-sm border border-line bg-white px-4 py-2 font-display text-sm font-semibold uppercase tracking-wide text-ink transition hover:bg-steel-100"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-sm bg-amber-500 px-6 py-2 font-display text-sm font-semibold uppercase tracking-wide text-graphite-900 transition hover:bg-amber-600 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save & Generate Slip"}
          </button>
        </div>
      </form>
    </div>
  );
}
