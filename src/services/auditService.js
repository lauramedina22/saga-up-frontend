import apiClient from "../api/apiClient.js"
import { toAuditLogModel } from "../models/auditModel.js"

export const auditService = {
  async getAuditLogs(params = {}) {
    const query = new URLSearchParams()
    if (params.limit) query.append("limit", params.limit)
    if (params.offset) query.append("offset", params.offset)
    if (params.action) query.append("action", params.action)
    if (params.tableName) query.append("table_name", params.tableName)

    const queryString = query.toString() ? `?${query.toString()}` : ""
    const response = await apiClient.get(`/audit-logs${queryString}`)

    // El backend devuelve { total, limit, offset, items: [...] } o un array directo
    const items = Array.isArray(response)
      ? response
      : Array.isArray(response?.items)
        ? response.items
        : Array.isArray(response?.data)
          ? response.data
          : []

    return items.map(toAuditLogModel)
  },
}
