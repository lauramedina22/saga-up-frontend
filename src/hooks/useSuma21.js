import { useState, useEffect, useCallback } from "react"
import { suma21Service } from "../services/suma21Service.js"

export function useSuma21() {
  const [products, setProducts] = useState([])
  const [accounts, setAccounts] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const [productsData, accountsData, inventoryData] = await Promise.allSettled([
        suma21Service.getProducts(),
        suma21Service.getAccounts(),
        suma21Service.getInventory(),
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
        // Si el endpoint de inventario viene vacío o no responde,
        // generamos la vista de inventario a partir del stock real de cada producto
        const fallbackInventory = productsData.value.map((p) => ({
          id: p.id,
          productId: p.id,
          productName: p.name,
          quantity: p.stockQty,
          unitPrice: p.unitPrice,
          imageUrl: p.imageUrl,
        }))
        setInventory(fallbackInventory)
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
    loading,
    error,
    refresh: loadData,
  }
}

