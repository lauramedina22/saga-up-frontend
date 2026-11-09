import { useEffect, useState } from "react"
import { catalogService } from "../services/catalogService"

function emptyCatalogs(catalogKeys) {
  return Object.fromEntries(catalogKeys.map((key) => [key, []]))
}

export function useCatalogs(catalogKeys = []) {
  const keysSignature = catalogKeys.join(",")
  const [catalogs, setCatalogs] = useState(() => emptyCatalogs(catalogKeys))
  const [loading, setLoading] = useState(catalogKeys.length > 0)
  const [error, setError] = useState("")

  useEffect(() => {
    const keys = keysSignature ? keysSignature.split(",") : []
    let isMounted = true

    if (keys.length === 0) {
      setLoading(false)
      return undefined
    }

    setLoading(true)
    setError("")

    catalogService
      .getCatalogs(keys)
      .then((loaded) => {
        if (isMounted) setCatalogs((current) => ({ ...current, ...loaded }))
      })
      .catch((loadError) => {
        console.error("Error cargando catálogos:", loadError)
        if (isMounted) {
          setError(
            loadError?.message || "No fue posible cargar los catálogos.",
          )
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [keysSignature])

  return { catalogs, loading, error }
}
