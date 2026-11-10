import apiClient from "../api/apiClient.js"
import {
  toSuma21ProductModel,
  toSuma21AccountModel,
  toSuma21InventoryModel,
  toSuma21SaleTransactionModel,
  toSuma21DonationTransactionModel,
} from "../models/suma21Model.js"

const CACHE_TTL_MS = 60_000 // 60 segundos de caché para evitar errores 429 (Too Many Requests)
const inFlightRequests = new Map()
const responseCache = new Map()

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchWithCacheAndRetry(key, path, { force = false } = {}) {
  if (!force && responseCache.has(key)) {
    const cached = responseCache.get(key)
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data
    }
  }

  // Si ya hay una petición idéntica en curso (ej. por React StrictMode), reutilizarla
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key)
  }

  const requestPromise = (async () => {
    try {
      let response
      try {
        response = await apiClient.get(path)
      } catch (error) {
        // Si el servidor responde 429 (Too Many Requests), esperar un momento y reintentar una vez
        if (error?.status === 429) {
          await sleep(1500)
          response = await apiClient.get(path)
        } else {
          throw error
        }
      }

      responseCache.set(key, {
        data: response,
        timestamp: Date.now(),
      })
      return response
    } finally {
      inFlightRequests.delete(key)
    }
  })()

  inFlightRequests.set(key, requestPromise)
  return requestPromise
}

function extractList(response) {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.items)) return response.items
  return []
}

export const suma21Service = {
  clearCache() {
    responseCache.clear()
  },

  async getProducts(options) {
    const response = await fetchWithCacheAndRetry(
      "products",
      "/api/suma21/products",
      options,
    )
    return extractList(response).map(toSuma21ProductModel)
  },

  async getAccounts(options) {
    try {
      const response = await fetchWithCacheAndRetry(
        "accounts",
        "/api/suma21/accounts",
        options,
      )
      return extractList(response).map(toSuma21AccountModel)
    } catch {
      return []
    }
  },

  async getInventory(options) {
    try {
      const response = await fetchWithCacheAndRetry(
        "inventory",
        "/api/suma21/inventory",
        options,
      )
      return extractList(response).map(toSuma21InventoryModel)
    } catch {
      return []
    }
  },

  async getSaleTransactions(options) {
    try {
      const response = await fetchWithCacheAndRetry(
        "sales",
        "/api/suma21/transactions/sales?page=1&limit=50",
        options,
      )
      return extractList(response).map(toSuma21SaleTransactionModel)
    } catch {
      return []
    }
  },

  async getDonationTransactions(options) {
    try {
      const response = await fetchWithCacheAndRetry(
        "donations",
        "/api/suma21/transactions/donations?page=1&limit=50",
        options,
      )
      return extractList(response).map(toSuma21DonationTransactionModel)
    } catch {
      return []
    }
  },
}
