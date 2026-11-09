import { useState, useEffect, useCallback } from "react"
import { suma21Service } from "../services/suma21Service.js"

export function useSuma21() {
  const [products, setProducts] = useState([])
  const [accounts, setAccounts] = useState([])
  const [inventory, setInventory] = useState([])
  const [sales, setSales] = useState([])
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const [
        productsData,
        accountsData,
        inventoryData,
        salesData,
        donationsData,
      ] = await Promise.allSettled([
        suma21Service.getProducts(),
        suma21Service.getAccounts(),
        suma21Service.getInventory(),
        suma21Service.getSaleTransactions(),
        suma21Service.getDonationTransactions(),
      ])

      if (productsData.status === "fulfilled") {
        setProducts(productsData.value)
      } else {
        setError(productsData.reason?.message || "No fue posible cargar los productos de SUMA 21.")
      }

      if (accountsData.status === "fulfilled") {
        setAccounts(accountsData.value)
      }

      if (inventoryData.status === "fulfilled" && inventoryData.value.length > 0) {
        setInventory(inventoryData.value)
      } else if (productsData.status === "fulfilled") {
        const fallbackInventory = productsData.value.map((p) => ({
          id: p.id,
          productId: p.id,
          productName: p.name,
          description: p.description,
          quantity: p.stockQty,
          unitPrice: p.unitPrice,
        }))
        setInventory(fallbackInventory)
      }

      if (salesData.status === "fulfilled") {
        setSales(salesData.value)
      }

      if (donationsData.status === "fulfilled") {
        setDonations(donationsData.value)
      }
    } catch (err) {
      setError(err.message || "Error al conectar con SUMA 21.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  return {
    products,
    accounts,
    inventory,
    sales,
    donations,
    loading,
    error,
    refresh: loadData,
  }
}
