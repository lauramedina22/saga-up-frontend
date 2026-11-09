import apiClient from "../api/apiClient.js"
import {
  toSuma21ProductModel,
  toSuma21AccountModel,
  toSuma21InventoryModel,
} from "../models/suma21Model.js"

export const suma21Service = {
  async getProducts() {
    const response = await apiClient.get("/api/suma21/products")
    const list = Array.isArray(response)
      ? response
      : Array.isArray(response?.items)
        ? response.items
        : Array.isArray(response?.data)
          ? response.data
          : []
    return list.map(toSuma21ProductModel)
  },

  async getAccounts() {
    try {
      const response = await apiClient.get("/api/suma21/accounts")
      const list = Array.isArray(response)
        ? response
        : Array.isArray(response?.items)
          ? response.items
          : Array.isArray(response?.data)
            ? response.data
            : []
      return list.map(toSuma21AccountModel)
    } catch {
      return []
    }
  },

  async getInventory() {
    try {
      const response = await apiClient.get("/api/suma21/inventory")
      const list = Array.isArray(response)
        ? response
        : Array.isArray(response?.items)
          ? response.items
          : Array.isArray(response?.data)
            ? response.data
            : []
      return list.map(toSuma21InventoryModel)
    } catch {
      return []
    }
  },
}

