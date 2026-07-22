import { Receipt } from "@/types/receipt";

function fmtDate(d: string | null) {
  if (!d) return "-";
  const date = new Date(d);
  return date.toLocaleDateString("en-GB").replace(/\//g, "/");
}

function fmtDateTime(d: string | null) {
  if (!d) return "-";
  const date = new Date(d);
  const day = fmtDate(d);
  const time = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${day} (${time})`;
}

export default function ReceiptPrint({ receipt }: { receipt: Receipt }) {
  return (
    <div className="receipt-print-area relative mx-auto flex bg-white text-ink">
      {/* left sprocket rail (screen only, decorative) */}
      <div className="sprocket-rail w-[7mm] shrink-0" />

      <div className="flex-1 px-[10mm] py-[7mm] font-body">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display text-[20px] font-bold uppercase tracking-wide">
            Eng Heng Steel Sdn Bhd (345483-T)
          </h1>
          <p className="text-[9px] uppercase tracking-wide">Dealers In Used Metal &amp; Transport Agent</p>
          <p className="text-[9px]">Plot 3847, Lorong Perusahaan 1, 13600 Prai,</p>
          <p className="text-[9px]">Tel: 04-3971198, Fax: 04-3971796</p>
        </div>

        <div className="mt-[3mm] flex items-center justify-between border-y border-ink py-[1.5mm]">
          <p className="font-display text-[13px] font-semibold uppercase tracking-[0.2em]">Weighing Slip</p>
          <p className="font-mono text-[11px]">
            Serial No.: <span className="font-semibold">{receipt.serialNo}</span>
          </p>
        </div>

        {/* Meta grid */}
        <div className="mt-[3mm] grid grid-cols-2 gap-x-[8mm] text-[10.5px]">
          <div className="space-y-[1.6mm]">
            <Row label="Date" value={fmtDate(receipt.docketDate)} />
            <Row label="Vehicle No." value={receipt.vehicleNo} />
            <Row label="Partner" value={receipt.partner || "-"} mono={false} />
            <Row label="Driver Name & IC" value={receipt.driverName || "-"} />
          </div>
          <div className="space-y-[1.6mm]">
            <Row label="Do No." value={receipt.doNo || receipt.transType} />
            <Row label="Product" value={receipt.product} />
            <Row label="Transporter" value={receipt.transporter || "-"} />
          </div>
        </div>

        {/* Weighing block */}
        <div className="mt-[4mm] grid grid-cols-2 gap-x-[8mm] border-t border-dashed border-ink pt-[3mm] text-[10.5px]">
          <div className="space-y-[1.6mm]">
            <Row label="Date / Time In" value={fmtDateTime(receipt.timeIn)} />
            <Row label="Date / Time Out" value={fmtDateTime(receipt.timeOut)} />
          </div>
          <div className="space-y-[1.6mm]">
            <Row label="First Weight" value={`${receipt.firstWeight.toLocaleString()} (Kg)`} mono />
            <Row label="Second Weight" value={`${receipt.secondWeight.toLocaleString()} (Kg)`} mono />
            <div className="flex justify-between border-t border-ink pt-[1mm] font-semibold">
              <span>Nett Weight</span>
              <span className="font-mono">{receipt.nettWeight.toLocaleString()} (Kg)</span>
            </div>
          </div>
        </div>

        {receipt.remarks && (
          <p className="mt-[3mm] text-[9.5px] italic">Remarks: {receipt.remarks}</p>
        )}

        {/* Signatures */}
        <div className="mt-[7mm] grid grid-cols-2 gap-x-[8mm] text-center text-[9.5px]">
          <div>
            <div className="mb-[1mm] h-[9mm]" />
            <div className="border-t border-ink pt-[1mm]">( Clerk / Supervisor )</div>
          </div>
          <div>
            <div className="mb-[1mm] h-[9mm]" />
            <div className="border-t border-ink pt-[1mm]">( Lorry Driver / Received By )</div>
          </div>
        </div>
      </div>

      {/* right sprocket rail (screen only, decorative) */}
      <div className="sprocket-rail w-[7mm] shrink-0" />
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-[4mm]">
      <span className="text-graphite-700">{label}</span>
      <span className={mono ? "font-mono" : ""}>{value}</span>
    </div>
  );
}
