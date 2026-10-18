const QTY_SCALE = 1000n;
function parseFixed(value, scale) {
  const raw = String(value ?? "").trim();
  const m = raw.match(/^(\d{1,12})(?:\.(\d{1,6}))?$/);
  if (!m) throw new Error("Enter a valid non-negative decimal amount.");
  const places = scale.toString().length - 1;
  const frac = (m[2] || "").padEnd(places,"0");
  if ((m[2] || "").length > places) throw new Error(`Use no more than ${places} decimal places.`);
  return BigInt(m[1]) * scale + BigInt(frac || "0");
}
function roundRatio(numerator,denominator){return (numerator + denominator/2n)/denominator;}
function fmt(cents){const sign=cents<0n?"-":"";const n=cents<0n?-cents:cents;return `${sign}${n/100n}.${String(n%100n).padStart(2,"0")}`;}
export function calculateQuote(items, discount="0", taxRate="0") {
  if (!Array.isArray(items) || items.length===0) throw new Error("Add at least one quotation line item.");
  let subtotal=0n;
  const rows=items.map(item=>{
    const qty=parseFixed(item.quantity,QTY_SCALE); if(qty<=0n) throw new Error("Quantity must be greater than zero.");
    const price=parseFixed(item.unit_price,100n); if(price<0n) throw new Error("Unit price cannot be negative.");
    const amount=roundRatio(qty*price,QTY_SCALE); subtotal+=amount;
    return {...item,amount:fmt(amount)};
  });
  const disc=parseFixed(discount,100n); if(disc<0n||disc>subtotal) throw new Error("Discount must be between zero and the subtotal.");
  const rate=parseFixed(taxRate||"0",100n); if(rate>10000n) throw new Error("Tax rate cannot exceed 100%.");
  const taxable=subtotal-disc; const tax=roundRatio(taxable*rate,10000n); const total=taxable+tax;
  if(total>99999999999999n) throw new Error("Quotation total is above the supported limit.");
  return {items:rows,subtotal:fmt(subtotal),discount:fmt(disc),tax:fmt(tax),total:fmt(total)};
}
export function formatPhp(amount){return new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",maximumFractionDigits:2}).format(Number(amount));}
