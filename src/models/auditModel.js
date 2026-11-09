import { normalizeDate, normalizeId, readValue } from "./modelUtils.js"

export function toAuditLogModel(raw = {}) {
  const rawAction = String(
    readValue(raw, "action", "event", "operation", "type") || "ACCION",
  ).toUpperCase()

  const rawTable = String(
    readValue(raw, "table_name", "entity", "resource", "table") || "general",
  ).toLowerCase()

  const rawTimestamp = readValue(
    raw,
    "logged_at",
    "created_at",
    "timestamp",
    "date",
  )

  // Extraer el nombre del miembro del personal si viene el objeto anidado del backend
  const staffObj = raw.staff_audit_logs_staff_idTostaff
  const staffName = staffObj?.full_name?.trim() || null
  const staffFallback = raw.staff_id ? `Personal #${raw.staff_id}` : null

  return {
    id: normalizeId(readValue(raw, "log_id", "audit_log_id", "id")),
    action: rawAction,
    tableName: rawTable,
    recordId: normalizeId(readValue(raw, "record_id", "entity_id", "target_id")),
    performedBy: staffName || staffFallback || "Administración",
    timestamp: rawTimestamp ? new Date(rawTimestamp).toISOString() : new Date().toISOString(),
    description: String(
      readValue(raw, "description", "details", "summary", "message") || "",
    ),
  }
}
