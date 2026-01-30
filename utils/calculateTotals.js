/**
 * Utility to calculate subtotal, tax, and final amount for SaaS Invoicing
 * Handles floating-point rounding for accurate billing.
 */
const calculateTotals = (items, discount = 0) => {
  let subtotal = 0;
  let totalTax = 0;

  // 1. Process items and accumulate totals
  const processedItems = items.map((item) => {
    // Ensure we are working with numbers
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1; // Default to 1 to avoid 0 totals
    const taxRate = Number(item.taxRate) || 0;

    const itemSubtotal = price * quantity;
    const itemTaxAmount = (itemSubtotal * taxRate) / 100;
    const itemTotal = itemSubtotal + itemTaxAmount;

    // Accumulate the raw values (unrounded) for accuracy
    subtotal += itemSubtotal;
    totalTax += itemTaxAmount;

    return {
      product: item.product, // Ensure the ID is passed back
      name: item.name,
      price: price,
      quantity: quantity,
      taxRate: taxRate,
      taxAmount: Number(itemTaxAmount.toFixed(2)),
      total: Number(itemTotal.toFixed(2)),
    };
  });

  // 2. Final Calculations
  const grossTotal = subtotal + totalTax;
  const discountAmount = Number(discount) || 0;
  const totalAmount = Math.max(0, grossTotal - discountAmount);

  // 3. Return rounded final values
  return {
    items: processedItems,
    subtotal: Number(subtotal.toFixed(2)),
    totalTax: Number(totalTax.toFixed(2)),
    discount: discountAmount,
    totalAmount: Number(totalAmount.toFixed(2)),
  };
};

module.exports = calculateTotals;