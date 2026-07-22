import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateUniqueSerial } from "@/lib/serial";
import { Prisma, TransType } from "@prisma/client";

// GET /api/receipts?q=&product=&transType=&vehicleNo=&dateFrom=&dateTo=&minNett=&maxNett=&sort=&page=&pageSize=
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;

    const q = sp.get("q")?.trim();
    const product = sp.get("product")?.trim();
    const transType = sp.get("transType")?.trim();
    const vehicleNo = sp.get("vehicleNo")?.trim();
    const dateFrom = sp.get("dateFrom");
    const dateTo = sp.get("dateTo");
    const minNett = sp.get("minNett");
    const maxNett = sp.get("maxNett");
    const sort = sp.get("sort") || "docketDate:desc";
    const page = Math.max(1, Number(sp.get("page") || 1));
    const pageSize = Math.min(100, Math.max(1, Number(sp.get("pageSize") || 20)));

    const where: Prisma.ReceiptWhereInput = {};

    if (q) {
      where.OR = [
        { serialNo: { contains: q, mode: "insensitive" } },
        { vehicleNo: { contains: q, mode: "insensitive" } },
        { partner: { contains: q, mode: "insensitive" } },
        { driverName: { contains: q, mode: "insensitive" } },
        { product: { contains: q, mode: "insensitive" } },
        { doNo: { contains: q, mode: "insensitive" } },
      ];
    }
    if (product) where.product = { contains: product, mode: "insensitive" };
    if (vehicleNo) where.vehicleNo = { contains: vehicleNo, mode: "insensitive" };
    if (transType && ["PURCHASE", "SALES", "TRANSFER"].includes(transType)) {
      where.transType = transType as TransType;
    }
    if (dateFrom || dateTo) {
      const docketDate: Prisma.DateTimeFilter = {};
      if (dateFrom) docketDate.gte = new Date(dateFrom);
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        docketDate.lte = end;
      }
      where.docketDate = docketDate;
    }
    if (minNett || maxNett) {
      const nettWeight: Prisma.FloatFilter = {};
      if (minNett) nettWeight.gte = Number(minNett);
      if (maxNett) nettWeight.lte = Number(maxNett);
      where.nettWeight = nettWeight;
    }

    const sortableFields = ["docketDate", "nettWeight", "serialNo", "vehicleNo", "createdAt"] as const;
    const [rawSortField, sortDir] = sort.split(":");
    const sortField = (sortableFields as readonly string[]).includes(rawSortField)
      ? (rawSortField as (typeof sortableFields)[number])
      : "docketDate";
    const orderBy: Prisma.ReceiptOrderByWithRelationInput = {
      [sortField]: sortDir === "asc" ? "asc" : "desc",
    };

    const [data, total] = await Promise.all([
      prisma.receipt.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.receipt.count({ where }),
    ]);

    return NextResponse.json({ data, total, page, pageSize });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch receipts" }, { status: 500 });
  }
}

// POST /api/receipts
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const required = ["vehicleNo", "product", "timeIn", "firstWeight", "secondWeight"];
    for (const field of required) {
      if (body[field] === undefined || body[field] === "") {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    const serialNo = await generateUniqueSerial();
    const firstWeight = Number(body.firstWeight);
    const secondWeight = Number(body.secondWeight);
    const nettWeight = Math.abs(firstWeight - secondWeight);

    const receipt = await prisma.receipt.create({
      data: {
        serialNo,
        docketDate: body.docketDate ? new Date(body.docketDate) : new Date(),
        vehicleNo: body.vehicleNo,
        partner: body.partner || null,
        driverName: body.driverName || null,
        driverIc: body.driverIc || null,
        doNo: body.doNo || null,
        transType: (body.transType as TransType) || "PURCHASE",
        transporter: body.transporter || null,
        product: body.product,
        timeIn: new Date(body.timeIn),
        timeOut: body.timeOut ? new Date(body.timeOut) : null,
        firstWeight,
        secondWeight,
        nettWeight,
        remarks: body.remarks || null,
        weighingBy: body.weighingBy || null,
      },
    });

    return NextResponse.json({ data: receipt }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create receipt" }, { status: 500 });
  }
}
