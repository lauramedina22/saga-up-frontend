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
  return {
    id: normalizeId(readValue(raw, "inventory_id", "product_id", "id")),
    productId: normalizeId(readValue(raw, "product_id")),
    productName: String(readValue(raw, "product_name", "name") || "Producto"),
    quantity: Number(readValue(raw, "quantity", "stock_qty", "stock")) || 0,
    unitPrice: Number(readValue(raw, "unit_price", "price")) || 0,
    updatedAt: readValue(raw, "updated_at", "last_updated"),
  }
}
