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
  const amount = rawCents > 1000 ? rawCents / 100 : rawCents // Convertir centavos a pesos
  const completedAt = readValue(raw, "completed_at", "created_at", "date")
  const id = normalizeId(readValue(raw, "sale_id", "transaction_id", "id")) || `sale-${index + 1}`

  return {
    id,
    amount,
    paymentMethod: String(readValue(raw, "payment_method", "method") || "Efectivo / Transferencia"),
    completedAt: completedAt ? new Date(completedAt).toISOString() : new Date().toISOString(),
    items: Array.isArray(raw.items) ? raw.items : [],
    status: "Aprobada",
  }
}

export function toSuma21DonationTransactionModel(raw = {}, index = 0) {
  const rawCents = Number(readValue(raw, "amount_in_cents", "amount", "total")) || 0
  const amount = rawCents > 1000 ? rawCents / 100 : rawCents // Convertir centavos a pesos
  const completedAt = readValue(raw, "completed_at", "created_at", "date")
  const donationId = normalizeId(readValue(raw, "donation_id", "transaction_id", "id")) || `don-${index + 1}`

  return {
    id: donationId,
    donationId,
    amount,
    paymentMethod: String(readValue(raw, "payment_method", "method") || "Transferencia / Online"),
    completedAt: completedAt ? new Date(completedAt).toISOString() : new Date().toISOString(),
    status: "Aprobada",
  }
}
