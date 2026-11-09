import { useCallback, useEffect, useState } from "react"
import { staffService } from "../services/staffService"

export function useStaff() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const reload = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      setStaff(await staffService.getStaff())
    } catch (requestError) {
      setError(requestError?.message || "No fue posible cargar el personal.")
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
    staff,
    loading,
    error,
    reload,
    searchByDocument: (number) => staffService.getStaffByDocument(number),
    createStaff: (model) => run(() => staffService.createStaff(model)),
    updateStaff: (id, model) => run(() => staffService.updateStaff(id, model)),
    deleteStaff: (id) => run(() => staffService.deleteStaff(id)),
    linkAccount: (id, securityUserId) =>
      run(() => staffService.linkAccount(id, securityUserId)),
    unlinkAccount: (id) => run(() => staffService.unlinkAccount(id)),
  }
}
