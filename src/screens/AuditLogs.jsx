import { useState, useMemo } from "react"
import { useAuditLogs } from "../hooks/useAuditLogs.js"
import {
  Badge,
  Card,
  EmptyState,
  PageHeader,
  Button,
} from "../components/ui.jsx"

const MODULE_LABELS = {
  children: "Beneficiarios",
  guardians: "Acudientes",
  workshops: "Talleres",
  enrollments: "Matrículas",
  staff: "Personal",
  staff_attendance: "Asistencia Personal",
  workshop_shifts: "Turnos de Taller",
  workshop_sessions: "Sesiones de Taller",
}

function formatModule(tableName) {
  if (!tableName) return "General"
  return MODULE_LABELS[tableName] || tableName
}

function formatTimestamp(isoString) {
  if (!isoString) return "-"
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return isoString
  return date.toLocaleString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getActionBadge(action) {
  const act = String(action || "").toUpperCase()
  if (act === "INSERT" || act.includes("CREATE")) {
    return <Badge tone="success">Creación</Badge>
  }
  if (act === "UPDATE" || act.includes("EDIT")) {
    return <Badge tone="info">Modificación</Badge>
  }
  if (act === "DELETE" || act.includes("REMOVE")) {
    return <Badge tone="danger">Eliminación</Badge>
  }
  return <Badge tone="neutral">{act}</Badge>
}

export default function AuditLogs() {
  const { logs, loading, error, loadLogs } = useAuditLogs()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAction, setSelectedAction] = useState("ALL")

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Filtro por acción
      if (selectedAction !== "ALL" && log.action !== selectedAction) {
        return false
      }

      // Filtro de búsqueda por texto
      if (!searchTerm.trim()) return true
      const term = searchTerm.toLowerCase()
      const moduleName = formatModule(log.tableName).toLowerCase()
      const performedBy = String(log.performedBy || "").toLowerCase()
      const recordId = String(log.recordId || "").toLowerCase()
      const actionName = String(log.action || "").toLowerCase()

      return (
        moduleName.includes(term) ||
        performedBy.includes(term) ||
        recordId.includes(term) ||
        actionName.includes(term)
      )
    })
  }, [logs, selectedAction, searchTerm])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bitácora de Auditoría"
        description="Historial y registro de operaciones y cambios realizados en el sistema."
        action={
          <Button
            variant="secondary"
            onClick={() => loadLogs()}
            loading={loading}
          >
            Actualizar
          </Button>
        }
      />

      {error ? (
        <div className="p-4 rounded-xl bg-danger-soft text-danger text-sm font-semibold">
          {error}
        </div>
      ) : null}

      <Card className="p-6">
        {/* Barra superior de filtros */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between pb-4 border-b border-border">
          {/* Pestañas de Tipo de Acción */}
          <div className="flex items-center gap-1 bg-surface-muted p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedAction("ALL")}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-colors ${
                selectedAction === "ALL"
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => setSelectedAction("INSERT")}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-colors ${
                selectedAction === "INSERT"
                  ? "bg-surface text-success shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Creaciones
            </button>
            <button
              type="button"
              onClick={() => setSelectedAction("UPDATE")}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-colors ${
                selectedAction === "UPDATE"
                  ? "bg-surface text-info shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Modificaciones
            </button>
            <button
              type="button"
              onClick={() => setSelectedAction("DELETE")}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-colors ${
                selectedAction === "DELETE"
                  ? "bg-surface text-danger shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Eliminaciones
            </button>
          </div>

          {/* Buscador */}
          <div className="w-full sm:w-72">
            <input
              type="search"
              placeholder="Buscar módulo, registro o usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 rounded-xl border border-border bg-surface px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
            />
          </div>
        </div>

        {/* Tabla de registros */}
        {loading ? (
          <div className="py-12 flex justify-center items-center text-muted">
            <span className="size-6 animate-spin rounded-full border-2 border-primary border-r-transparent" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="pt-6">
            <EmptyState
              title="Sin registros de auditoría"
              description="No se encontraron operaciones registradas con los filtros seleccionados."
            />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase text-muted font-bold">
                <tr>
                  <th className="pb-3 pr-4 font-bold">Fecha y Hora</th>
                  <th className="pb-3 px-4 font-bold">Acción</th>
                  <th className="pb-3 px-4 font-bold">Módulo / Recurso</th>
                  <th className="pb-3 px-4 font-bold">ID Registro</th>
                  <th className="pb-3 pl-4 font-bold">Realizado por</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-primary-soft/30 transition-colors">
                    <td className="py-3.5 pr-4 text-xs text-muted font-mono whitespace-nowrap">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-foreground whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-lg bg-surface-muted text-xs text-muted">
                        {formatModule(log.tableName)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted font-mono whitespace-nowrap">
                      #{log.recordId || "-"}
                    </td>
                    <td className="py-3.5 pl-4 text-xs font-semibold text-foreground whitespace-nowrap">
                      {log.performedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
