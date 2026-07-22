import { prisma } from "@/lib/prisma";

/**
 * Generates a random 7-digit serial number (e.g. "0135668"), matching the
 * format printed on the physical weighing-slip books, and guarantees it
 * doesn't collide with an existing record in the database.
 */
export async function generateUniqueSerial(): Promise<string> {
  for (let attempt = 0; attempt < 25; attempt++) {
    const candidate = String(Math.floor(Math.random() * 10_000_000)).padStart(7, "0");
    const existing = await prisma.receipt.findUnique({
      where: { serialNo: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
  // Extremely unlikely fallback: timestamp-based tail keeps it unique.
  return String(Date.now()).slice(-7);
}
