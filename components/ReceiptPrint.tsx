import { Receipt } from "@/types/receipt";

function fmtDate(d: string | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-GB");
}

function fmtTime(d: string | null) {
  if (!d) return "-";
  return new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function partnerLabel(transType: Receipt["transType"]) {
  if (transType === "SALES") return "Customer";
  if (transType === "TRANSFER") return "Partner";
  return "Supplier";
}

const cell = "border border-ink px-[2mm] py-[0.8mm]";

export default function ReceiptPrint({ receipt }: { receipt: Receipt }) {
  return (
    <div className="receipt-print-area relative mx-auto flex bg-white text-ink">
      {/* left sprocket rail (screen only, decorative) */}
      <div className="sprocket-rail w-[6mm] shrink-0" />

      <div className="flex-1 px-[9mm] py-[6mm] font-body">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="text-left">
            <h1 className="font-display text-[16px] font-bold uppercase leading-tight tracking-wide">
              Impian Jaya Resources Sdn Bhd
            </h1>
            <p className="font-display text-[12px] font-semibold uppercase leading-tight tracking-wide">
              Mt Smart Trading [PG0118686-X]
            </p>
            <p className="mt-[1mm] text-[8.5px] italic">&quot;Dealers in All Kind of Scrap Metals&quot;</p>
            <p className="mt-[1mm] text-[8.5px]">Lot 71, P.T No. 1718, Taman Kemunting,</p>
            <p className="text-[8.5px]">Mukim Kulim, Daerah Kulim, Kedah.</p>
            <p className="text-[8.5px]">Tel: 017-0081 8191</p>
          </div>
          <div className="text-right text-[9.5px]">
            <p className="font-mono">
              Ticket No.: <span className="font-semibold">{receipt.serialNo}</span>
            </p>
            <p className="mt-[1mm] font-mono">D/O No.: <span className="font-semibold">{receipt.doNo || "-"}</span></p>
            <p className="font-mono">P/O No.: <span className="font-semibold">{receipt.poNo || "-"}</span></p>
          </div>
        </div>

        <div className="mt-[2mm] border-t-2 border-ink" />

        {/* Party info (left, unboxed) + Lorry/Product (right, boxed table) */}
        <div className="mt-[2mm] grid grid-cols-2 gap-x-[6mm] text-[9.5px]">
          <div className="space-y-[1.5mm] pt-[0.5mm]">
            <p>{partnerLabel(receipt.transType)} : {receipt.partner || ""}</p>
            <p>Trans. Type : {receipt.transType}</p>
            <p>Transporter : {receipt.transporter || ""}</p>
          </div>
          <table className="w-full border-collapse text-[9.5px]">
            <tbody>
              <tr>
                <td className={`${cell} w-1/2 font-semibold`}>Lorry No.</td>
                <td className={`${cell} font-mono`}>{receipt.vehicleNo}</td>
              </tr>
              <tr>
                <td className={`${cell} font-semibold`}>Product Description</td>
                <td className={cell}>{receipt.product}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Date / Time / Weight + pricing table */}
        <table className="mt-[2.5mm] w-full border-collapse text-[9.5px]">
          <thead>
            <tr>
              <th className={`${cell} w-[26%] font-display font-semibold uppercase`}>Date</th>
              <th className={`${cell} w-[30%] font-display font-semibold uppercase`}>Time</th>
              <th className={`${cell} font-display font-semibold uppercase`}>Weight (Kg)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={cell} rowSpan={2}>
                {fmtDate(receipt.docketDate)}
              </td>
              <td className={cell}>{fmtTime(receipt.timeIn)} &nbsp;IN</td>
              <td className={`${cell} font-mono`}>{receipt.firstWeight.toLocaleString()}</td>
            </tr>
            <tr>
              <td className={cell}>{fmtTime(receipt.timeOut)} OUT</td>
              <td className={`${cell} font-mono`}>{receipt.secondWeight.toLocaleString()}</td>
            </tr>
            <tr>
              <td className={cell} colSpan={2}>Deduct (Kg)</td>
              <td className={`${cell} font-mono`}>0</td>
            </tr>
            <tr>
              <td className={`${cell} font-semibold`} colSpan={2}>Net Weight (Kg)</td>
              <td className={`${cell} font-mono font-semibold`}>{receipt.nettWeight.toLocaleString()}</td>
            </tr>
            <tr>
              <td className={cell} colSpan={2}>Unit Price (RM/Kg)</td>
              <td className={`${cell} font-mono`}>{receipt.unitPrice.toFixed(3)}</td>
            </tr>
            <tr>
              <td className={cell} colSpan={2}>Amount (RM)</td>
              <td className={`${cell} font-mono`}>{receipt.amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td className={cell} colSpan={2}>GST @ {receipt.gstRate}% (RM)</td>
              <td className={`${cell} font-mono`}>{receipt.gstAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td className={`${cell} font-semibold`} colSpan={2}>Total Amount (RM)</td>
              <td className={`${cell} font-mono font-semibold`}>{receipt.totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Driver / Remarks / Weighing by */}
        <div className="mt-[3.5mm] grid grid-cols-2 gap-x-[8mm] text-[9.5px]">
          <div>
            <p>Driver : {receipt.driverName || ""}</p>
            <p className="mt-[2mm]">Remarks : {receipt.remarks || ""}</p>
          </div>
          <div>
            <p>Weighing By : {receipt.weighingBy || ""}</p>
          </div>
        </div>

        {/* Signatures */}
        <div className="mt-[5mm] grid grid-cols-2 gap-x-[8mm] text-center text-[9px]">
          <div>
            <div className="mb-[1mm] h-[7mm]" />
            <div className="border-t border-ink pt-[1mm]">( Clerk / Supervisor )</div>
          </div>
          <div>
            <div className="mb-[1mm] h-[7mm]" />
            <div className="border-t border-ink pt-[1mm]">( Lorry Driver / Received By )</div>
          </div>
        </div>
      </div>

      {/* right sprocket rail (screen only, decorative) */}
      <div className="sprocket-rail w-[6mm] shrink-0" />
    </div>
  );
}
