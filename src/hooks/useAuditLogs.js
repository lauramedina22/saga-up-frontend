import { useEffect, useState } from "react"
import { auditService } from "../services/auditService.js"

export function useAuditLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadLogs = async (params = {}) => {
    setLoading(true)
    setError("")
    try {
      const data = await auditService.getAuditLogs(params)
      setLogs(data)
    } catch (requestError) {
      setError(
        requestError.message || "No fue posible cargar la bitácora de auditoría.",
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [])

  return {
    logs,
    loading,
    error,
    loadLogs,
  }
}
