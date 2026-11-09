import { normalizeId, readValue } from "./modelUtils.js"

export function toSuma21ProductModel(raw = {}) {
  const id = normalizeId(readValue(raw, "product_id", "id"))
  const unitPrice = Number(readValue(raw, "unit_price", "price")) || 0
  const stockQty = Number(readValue(raw, "stock_qty", "stock", "quantity")) || 0

  return {
    id,
    name: String(readValue(raw, "name", "title") || "Producto sin nombre"),
    description: String(readValue(raw, "description", "details") || ""),
    imageUrl: readValue(raw, "image_url", "image") || null,
    unitPrice,
    stockQty,
    isAvailable: stockQty > 0,
  }
}

export function toSuma21AccountModel(raw = {}) {
  const id = normalizeId(readValue(raw, "account_id", "id"))
  const balance = Number(readValue(raw, "opening_balance", "balance", "amount")) || 0

  return {
    id,
    name: String(readValue(raw, "name", "account_name") || "Cuenta"),
    balance,
  }
}

export function toSuma21InventoryModel(raw = {}) {
  const id = normalizeId(
    readValue(raw, "inventory_item_id", "inventory_id", "product_id", "id")
  )
  const quantity = Number(readValue(raw, "stock", "quantity", "stock_qty")) || 0

  return {
    id,
    productName: String(readValue(raw, "name", "product_name") || "Ítem de inventario"),
    description: String(readValue(raw, "description", "details") || ""),
    quantity,
    unitPrice: Number(readValue(raw, "unit_price", "price")) || 0,
    updatedAt: readValue(raw, "updated_at", "last_updated"),
  }
}

export function toSuma21SaleTransactionModel(raw = {}, index = 0) {
  const rawCents = Number(readValue(raw, "amount_in_cents", "amount", "total")) || 0
  // Siempre dividir entre 100 para convertir centavos a pesos reales
  // Ej: 25000000 centavos = $250.000 COP, 1998 centavos = $19.98 COP
  const amount = rawCents / 100
  const completedAt = readValue(raw, "completed_at", "created_at", "date")
  const id = normalizeId(readValue(raw, "sale_id", "transaction_id", "id")) || `sale-${index + 1}`
  const reference = readValue(raw, "reference")
  const paymentMethod = readValue(raw, "payment_method", "method")

  return {
    id,
    transactionId: normalizeId(readValue(raw, "transaction_id")),
    reference: reference || null,
    amount,
    currency: String(readValue(raw, "currency") || "COP"),
    paymentMethod: paymentMethod ? String(paymentMethod) : "Sin registrar",
    completedAt: completedAt ? new Date(completedAt).toISOString() : null,
    items: Array.isArray(raw.items) ? raw.items : [],
    status: "Aprobada",
  }
}

export function toSuma21DonationTransactionModel(raw = {}, index = 0) {
  const rawCents = Number(readValue(raw, "amount_in_cents", "amount", "total")) || 0
  // 5000000 centavos = $50.000 COP
  const amount = rawCents / 100
  const completedAt = readValue(raw, "completed_at", "created_at", "date")
  const donationId = normalizeId(readValue(raw, "donation_id", "id")) || `don-${index + 1}`
  const reference = readValue(raw, "reference")
  const paymentMethod = readValue(raw, "payment_method", "method")

  return {
    id: donationId,
    donationId,
    transactionId: normalizeId(readValue(raw, "transaction_id")),
    reference: reference || null,
    amount,
    currency: String(readValue(raw, "currency") || "COP"),
    paymentMethod: paymentMethod ? String(paymentMethod) : "Aporte solidario",
    completedAt: completedAt ? new Date(completedAt).toISOString() : null,
    status: "Aprobada",
  }
}
