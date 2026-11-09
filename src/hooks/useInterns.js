import { useCallback, useEffect, useState } from "react"
import { staffService } from "../services/staffService"

export function useInterns() {
  const [interns, setInterns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const reload = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      setInterns(await staffService.getInterns())
    } catch (requestError) {
      setError(requestError?.message || "No fue posible cargar los practicantes.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const run = async (operation) => {
    setError("")
    try {
      const result = await operation()
      await reload()
      return result
    } catch (requestError) {
      setError(requestError?.message || "No fue posible completar la operación.")
      throw requestError
    }
  }

  return {
    interns,
    loading,
    error,
    reload,
    createIntern: (model) => run(() => staffService.createIntern(model)),
    updateIntern: (id, model) => run(() => staffService.updateIntern(id, model)),
    deleteIntern: (id) => run(() => staffService.deleteIntern(id)),
  }
}
