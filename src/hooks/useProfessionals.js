import { useCallback, useEffect, useState } from "react"
import { staffService } from "../services/staffService"

export function useProfessionals() {
  const [professionals, setProfessionals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      setProfessionals(await staffService.getProfessionals())
      setError("")
    } catch (requestError) {
      setError(requestError?.message || "No fue posible cargar los profesionales.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const run = async (operation) => {
    const result = await operation()
    await reload()
    return result
  }

  return {
    professionals,
    loading,
    error,
    reload,
    createProfessional: (model) => run(() => staffService.createProfessional(model)),
    updateProfessional: (id, model) => run(() => staffService.updateProfessional(id, model)),
    deleteProfessional: (id) => run(() => staffService.deleteProfessional(id)),
  }
}
