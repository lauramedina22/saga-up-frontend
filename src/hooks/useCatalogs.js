import { useEffect, useState } from "react"
import { CATALOG_DICTIONARY, catalogService } from "../services/catalogService"

export function useCatalogs(catalogKeys = []) {
  // Inicializamos con el diccionario oficial para renderizar inmediatamente sin parpadeos
  const [catalogs, setCatalogs] = useState(() => {
    const initial = {}
    for (const key of catalogKeys) {
      initial[key] = CATALOG_DICTIONARY[key] ?? []
    }
    return initial
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        const loaded = await catalogService.getCatalogs(catalogKeys)
        if (isMounted) {
          setCatalogs((current) => ({ ...current, ...loaded }))
        }
      } catch {
        // En caso de error, el estado ya contiene los catálogos del diccionario
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (catalogKeys.length > 0) {
      load()
    } else {
      setLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [catalogKeys.join(",")])

  return { catalogs, loading }
}
