import { useState, useMemo } from "react"
import { useAuditLogs } from "../hooks/useAuditLogs.js"
import { Badge, Button, Card, EmptyState } from "../components/ui.jsx"

const MODULE_LABELS = {
  children: "Beneficiarios",
  guardians: "Acudientes",
  workshops: "Talleres",
  enrollments: "Matrículas",
  tuition: "Matrículas",
  staff: "Personal",
  staff_attendance: "Asistencia Personal",
  workshop_shifts: "Turnos de Taller",
  workshop_sessions: "Sesiones de Taller",
  children_assistance: "Asistencia Beneficiarios",
}

function formatModule(tableName) {
  if (!tableName) return "General"
  return MODULE_LABELS[tableName.toLowerCase()] || tableName
}

function formatFechaCompleta(isoString) {
  if (!isoString) return "-"
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return isoString
  return date.toLocaleString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getActionTone(action) {
  const act = String(action || "").toUpperCase()
  if (act === "INSERT" || act.includes("CREATE")) return "success"
  if (act === "UPDATE" || act.includes("EDIT")) return "info"
  if (act === "DELETE" || act.includes("REMOVE")) return "danger"
  return "neutral"
}

function getActionLabel(action) {
  const act = String(action || "").toUpperCase()
  if (act === "INSERT" || act.includes("CREATE")) return "Creación"
  if (act === "UPDATE" || act.includes("EDIT")) return "Modificación"
  if (act === "DELETE" || act.includes("REMOVE")) return "Eliminación"
  return act
}

export default function AuditLogs() {
  const { logs, loading, error, loadLogs } = useAuditLogs()
  const [filter, setFilter] = useState("TODOS")
  const [search, setSearch] = useState("")

  const insertCount = logs.filter((l) => l.action === "INSERT").length
  const updateCount = logs.filter((l) => l.action === "UPDATE").length
  const deleteCount = logs.filter((l) => l.action === "DELETE").length

  const filters = [
    { id: "TODOS", label: "Todas" },
    { id: "INSERT", label: `Creaciones (${insertCount})` },
    { id: "UPDATE", label: `Modificaciones (${updateCount})` },
    { id: "DELETE", label: `Eliminaciones (${deleteCount})` },
  ]

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Filtro por pestaña
      if (filter !== "TODOS" && log.action !== filter) {
        return false
      }

      // Filtro de búsqueda
      if (!search.trim()) return true
      const term = search.toLowerCase()
      const moduleName = formatModule(log.tableName).toLowerCase()
      const performedBy = String(log.performedBy || "").toLowerCase()
      const recordId = String(log.recordId || "").toLowerCase()
      const actionLabel = getActionLabel(log.action).toLowerCase()

      return (
        moduleName.includes(term) ||
        performedBy.includes(term) ||
        recordId.includes(term) ||
        actionLabel.includes(term)
      )
    })
  }, [logs, filter, search])

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Encabezado */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">
            Auditoría
          </h1>
          <p className="text-sm font-semibold text-muted">
            {logs.length} movimiento(s) registrado(s) en el sistema
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => loadLogs()}
          loading={loading}
        >
          Actualizar
        </Button>
      </div>

      {loading && (
        <p className="mb-4 text-sm font-semibold text-muted" role="status">
          Cargando bitácora de auditoría…
        </p>
      )}

      {error && (
        <p
          className="mb-4 rounded-xl bg-danger-soft p-3 text-sm font-semibold text-danger"
          role="alert"
        >
          {error}
        </p>
      )}

      {/* Tarjetas resumen con métricas */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm">
          <p className="text-2xl font-extrabold text-success">{insertCount}</p>
          <p className="text-xs font-semibold text-muted">Creaciones</p>
        </div>
        <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm">
          <p className="text-2xl font-extrabold text-info">{updateCount}</p>
          <p className="text-xs font-semibold text-muted">Modificaciones</p>
        </div>
        <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm">
          <p className="text-2xl font-extrabold text-danger">{deleteCount}</p>
          <p className="text-xs font-semibold text-muted">Eliminaciones</p>
        </div>
      </div>

      {/* Filtros tipo píldoras redondeadas */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            aria-pressed={filter === item.id}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all ${
              filter === item.id
                ? "bg-primary text-white shadow-xs"
                : "border border-border bg-surface text-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <input
          type="search"
          placeholder="Buscar por módulo, registro o persona..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 rounded-2xl border border-border bg-surface px-4 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15 shadow-sm"
        />
      </div>

      {/* Tabla idéntica a Control de Inventario, Ventas y Donaciones */}
      <Card className="p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-foreground">
              Registro de Operaciones
            </h2>
            <p className="text-xs font-semibold text-muted">
              Trazabilidad de cambios en las tablas del sistema
            </p>
          </div>
          <div className="rounded-2xl bg-surface-muted px-3.5 py-1.5 text-xs font-bold text-foreground">
            {filteredLogs.length} registro(s)
          </div>
        </div>

        {filteredLogs.length === 0 && !loading ? (
          <EmptyState
            title="Sin registros de auditoría"
            description="No se encontraron operaciones registradas con los filtros seleccionados."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase text-muted font-bold">
                <tr>
                  <th className="pb-3 pr-4 font-bold">Fecha y Hora</th>
                  <th className="pb-3 px-4 font-bold">Acción</th>
                  <th className="pb-3 px-4 font-bold">Módulo / Tabla</th>
                  <th className="pb-3 px-4 font-bold">ID Registro</th>
                  <th className="pb-3 pl-4 font-bold">Realizado por</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.map((log) => {
                  const actionTone = getActionTone(log.action)
                  const actionLabel = getActionLabel(log.action)
                  const moduleLabel = formatModule(log.tableName)

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-primary-soft/30 transition-colors"
                    >
                      <td className="py-3.5 pr-4 text-xs font-mono text-muted whitespace-nowrap">
                        {formatFechaCompleta(log.timestamp)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge tone={actionTone}>{actionLabel}</Badge>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-lg bg-surface-muted text-xs text-muted font-bold">
                          {moduleLabel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-muted whitespace-nowrap font-bold">
                        #{log.recordId || "-"}
                      </td>
                      <td className="py-3.5 pl-4 text-xs font-semibold text-foreground whitespace-nowrap">
                        {log.performedBy}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
