import apiClient from "../api/apiClient.js"
import {
  toSuma21ProductModel,
  toSuma21AccountModel,
  toSuma21InventoryModel,
  toSuma21SaleTransactionModel,
  toSuma21DonationTransactionModel,
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

  async getSaleTransactions() {
    try {
      // Intentar primero a través de la ruta del backend proxy
      let response
      try {
        response = await apiClient.get("/api/suma21/transactions/sales?page=1&limit=50")
      } catch {
        response = await apiClient.get("/api/v1/transactions/sales?page=1&limit=50")
      }
      const list = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : Array.isArray(response?.items)
            ? response.items
            : []
      return list.map(toSuma21SaleTransactionModel)
    } catch {
      return []
    }
  },

  async getDonationTransactions() {
    try {
      let response
      try {
        response = await apiClient.get("/api/suma21/transactions/donations?page=1&limit=50")
      } catch {
        response = await apiClient.get("/api/v1/transactions/donations?page=1&limit=50")
      }
      const list = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : Array.isArray(response?.items)
            ? response.items
            : []
      return list.map(toSuma21DonationTransactionModel)
    } catch {
      return []
    }
  },
}
