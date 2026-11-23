import { useState, useEffect, useCallback } from "react"
import { suma21Service } from "../services/suma21Service.js"
import { enrollmentService } from "../services/enrollmentService.js"

export function useSuma21(resource = "productos") {
  const [products, setProducts] = useState([])
  const [accounts, setAccounts] = useState([])
  const [inventory, setInventory] = useState([])
  const [sales, setSales] = useState([])
  const [donations, setDonations] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = useCallback(
    async ({ force = false, target = resource } = {}) => {
      setLoading(true)
      setError("")
      if (force) {
        suma21Service.clearCache()
      }

      try {
        if (target === "financiero" || target === "financial") {
          // Carga secuencial hacia SUMA 21 para respetar el rate-limit + matrículas de SAGA UP
          const enrollmentPromise = enrollmentService
            .getEnrollmentData()
            .then((res) => res.enrollments || [])
            .catch(() => [])

          const productsData = await suma21Service.getProducts({ force }).catch(() => [])
          const salesData = await suma21Service.getSaleTransactions({ force }).catch(() => [])
          const donationsData = await suma21Service
            .getDonationTransactions({ force })
            .catch(() => [])
          const enrollmentsData = await enrollmentPromise

          setProducts(productsData)
          setSales(salesData)
          setDonations(donationsData)
          setEnrollments(enrollmentsData)
          return
        }

        if (target === "donaciones" || target === "donations") {
          const donationsData = await suma21Service.getDonationTransactions({ force })
          setDonations(donationsData)
          return
        }

        if (target === "inventario") {
          const inventoryData = await suma21Service.getInventory({ force })
          setInventory(inventoryData)
          return
        }

        if (target === "ventas") {
          const salesData = await suma21Service.getSaleTransactions({ force })
          setSales(salesData)
          return
        }

        // Por defecto ("productos"): 1 sola petición al catálogo para evitar HTTP 429
        const productsData = await suma21Service.getProducts({ force })
        setProducts(productsData)
        setInventory((prev) =>
          prev.length > 0
            ? prev
            : productsData.map((p) => ({
                id: p.id,
                productId: p.id,
                productName: p.name,
                description: p.description,
                quantity: p.stockQty,
                unitPrice: p.unitPrice,
              })),
        )
      } catch (err) {
        setError(err.message || "Error al conectar con SUMA 21.")
      } finally {
        setLoading(false)
      }
    },
    [resource],
  )

  useEffect(() => {
    loadData({ target: resource })
  }, [loadData, resource])

  const refresh = useCallback(
    () => loadData({ force: true, target: resource }),
    [loadData, resource],
  )

  return {
    products,
    accounts,
    inventory,
    sales,
    donations,
    enrollments,
    loading,
    error,
    refresh,
  }
}
