import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computePricing } from "@/lib/pricing";
import { TransType } from "@prisma/client";

interface Params {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const receipt = await prisma.receipt.findUnique({ where: { id: params.id } });
    if (!receipt) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: receipt });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch receipt" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const existing = await prisma.receipt.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const firstWeight = body.firstWeight !== undefined ? Number(body.firstWeight) : existing.firstWeight;
    const secondWeight = body.secondWeight !== undefined ? Number(body.secondWeight) : existing.secondWeight;
    const nettWeight = Math.abs(firstWeight - secondWeight);
    const unitPrice = body.unitPrice !== undefined ? Number(body.unitPrice) || 0 : existing.unitPrice;
    const gstRate = body.gstRate !== undefined ? Number(body.gstRate) || 0 : existing.gstRate;
    const { amount, gstAmount, totalAmount } = computePricing(nettWeight, unitPrice, gstRate);

    const data: Record<string, unknown> = {
      vehicleNo: body.vehicleNo,
      partner: body.partner || null,
      driverName: body.driverName || null,
      driverIc: body.driverIc || null,
      doNo: body.doNo || null,
      poNo: body.poNo || null,
      transporter: body.transporter || null,
      product: body.product,
      remarks: body.remarks || null,
      weighingBy: body.weighingBy || null,
      firstWeight,
      secondWeight,
      nettWeight,
      unitPrice,
      amount,
      gstRate,
      gstAmount,
      totalAmount,
    };
    if (body.docketDate) data.docketDate = new Date(body.docketDate);
    if (body.timeIn) data.timeIn = new Date(body.timeIn);
    if (body.timeOut !== undefined) data.timeOut = body.timeOut ? new Date(body.timeOut) : null;
    if (body.transType) data.transType = body.transType as TransType;

    const receipt = await prisma.receipt.update({ where: { id: params.id }, data });
    return NextResponse.json({ data: receipt });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update receipt" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await prisma.receipt.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete receipt" }, { status: 500 });
  }
}
