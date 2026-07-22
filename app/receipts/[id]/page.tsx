"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Receipt } from "@/types/receipt";
import ReceiptPrint from "@/components/ReceiptPrint";

export default function ReceiptDetailPage() {
  const params = useParams<{ id: string }>();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/receipts/${params.id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setReceipt(json.data as Receipt);
      })
      .catch((err) => setError(err.message || "Failed to load ticket"));
  }, [params.id]);

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <p className="text-sm text-signal-red">{error}</p>
        <Link href="/receipts" className="mt-4 inline-block text-sm underline">
          Back to records
        </Link>
      </div>
    );
  }

  if (!receipt) {
    return <div className="mx-auto max-w-4xl px-6 py-8 text-sm text-graphite-700">Loading ticket…</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="no-print mb-6 flex items-center justify-between rounded-sm border border-line bg-white px-5 py-4 shadow-sm">
        <div>
          <p className="font-display text-lg font-semibold text-ink">Ticket {receipt.serialNo}</p>
          <p className="text-sm text-graphite-700">Vehicle {receipt.vehicleNo} · {receipt.product}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="rounded-sm bg-amber-500 px-4 py-2 font-display text-sm font-semibold uppercase tracking-wide text-graphite-900 transition hover:bg-amber-600"
          >
            Print Slip
          </button>
          <Link
            href="/receipts"
            className="rounded-sm border border-line bg-white px-4 py-2 font-display text-sm font-semibold uppercase tracking-wide text-ink transition hover:bg-steel-100"
          >
            Back to Records
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto rounded-sm border border-line bg-steel-200 py-8 shadow-inner">
        <ReceiptPrint receipt={receipt} />
      </div>
    </div>
  );
}
