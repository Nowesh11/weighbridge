/**
 * Shared pricing math so the create and update API routes (and any future
 * caller) always compute amount / GST / total the same way.
 */
export function computePricing(nettWeight: number, unitPrice: number, gstRate: number) {
  const amount = round2(nettWeight * unitPrice);
  const gstAmount = round2(amount * (gstRate / 100));
  const totalAmount = round2(amount + gstAmount);
  return { amount, gstAmount, totalAmount };
}

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
