import { useState, useMemo } from "react"
import { useAuditLogs } from "../hooks/useAuditLogs.js"
import { Avatar, Badge, Button, Card, Icon } from "../components/ui.jsx"

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
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      {/* Encabezado idéntico a Children y Enrollments */}
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

      {/* Tarjetas resumen con métricas (igual que en Enrollments) */}
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
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all ${filter === item.id
              ? "bg-primary text-white"
              : "border border-border bg-surface text-muted hover:text-foreground"
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Buscador de estilo SAGA-UP */}
      <div className="mb-4">
        <input
          type="search"
          placeholder="Buscar por módulo, registro o persona..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 rounded-2xl border border-border bg-surface px-4 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15 shadow-sm"
        />
      </div>

      {/* Lista de operaciones en artículos redondeados (idéntico a Enrollments y Children) */}
      <div className="flex flex-col gap-3">
        {filteredLogs.map((log) => {
          const actionTone = getActionTone(log.action)
          const actionLabel = getActionLabel(log.action)
          const moduleLabel = formatModule(log.tableName)

          return (
            <article
              key={log.id}
              className="flex items-center gap-4 rounded-3xl border border-border bg-surface p-4 shadow-sm hover:border-primary/30 transition-colors"
            >
              {/* Avatar / Iniciales del responsable */}
              <Avatar name={log.performedBy || "Admin"} size="sm" />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-extrabold text-foreground truncate">
                    {actionLabel} en {moduleLabel}
                  </p>
                  <span className="shrink-0 text-xs font-mono font-bold text-muted bg-surface-muted px-2 py-0.5 rounded-lg">
                    #{log.recordId || "-"}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted truncate">
                  {formatFechaCompleta(log.timestamp)} · Por:{" "}
                  <span className="font-semibold text-foreground/80">
                    {log.performedBy}
                  </span>
                </p>
              </div>

              {/* Distintivo de la acción */}
              <div className="shrink-0">
                <Badge tone={actionTone}>{actionLabel}</Badge>
              </div>
            </article>
          )
        })}

        {!loading && !error && filteredLogs.length === 0 && (
          <p className="rounded-3xl border border-border bg-surface p-8 text-center text-muted">
            No se encontraron registros de auditoría para este filtro.
          </p>
        )}
      </div>
    </div>
  )
}
