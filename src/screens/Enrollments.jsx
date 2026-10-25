import { useState } from "react"
import { formatCOP, formatFecha } from "../data"
import { Avatar } from "../components/ui"
import { useEnrollments } from "../hooks/useEnrollments"

const STATUS = {
  activa: { label: "Activa", className: "bg-success-soft text-success" },
  pendiente: { label: "Pendiente", className: "bg-warning-soft text-warning" },
  retirada: { label: "Retirada", className: "bg-danger-soft text-danger" },
}

const FILTERS = [
  { id: "todos", label: "Todas" },
  { id: "activa", label: "Activas" },
  { id: "pendiente", label: "Pendientes" },
  { id: "retirada", label: "Retiradas" },
]

export default function EnrollmentsScreen() {
  const { enrollments, children, loading, error } = useEnrollments()
  const [filter, setFilter] = useState("todos")

  const filteredEnrollments = enrollments.filter(
    (enrollment) => filter === "todos" || enrollment.status === filter,
  )
  const activeEnrollments = enrollments.filter(
    (enrollment) => enrollment.status === "activa",
  )
  const activeTotal = activeEnrollments.reduce(
    (total, enrollment) => total + (Number(enrollment.amount) || 0),
    0,
  )

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-foreground">Matrículas</h1>
        <span className="text-sm font-semibold text-muted">
          {enrollments.length} registros
        </span>
      </div>

      {loading && (
        <p className="mb-4 text-sm font-semibold text-muted" role="status">
          Cargando matrículas…
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

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm">
          <p className="text-2xl font-extrabold text-foreground">
            {activeEnrollments.length}
          </p>
          <p className="text-sm font-medium text-muted">Matrículas activas</p>
        </div>
        <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm">
          <p className="text-2xl font-extrabold text-foreground">
            {formatCOP(activeTotal)}
          </p>
          <p className="text-sm font-medium text-muted">
            Valor de matrículas activas
          </p>
        </div>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            aria-pressed={filter === item.id}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all ${
              filter === item.id
                ? "bg-primary text-white"
                : "border border-border bg-surface text-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filteredEnrollments.map((enrollment) => {
          const child = children.find(
            (record) => record.id === enrollment.childId,
          )
          if (!child) return null

          const status = STATUS[enrollment.status] ?? {
            label: enrollment.status || "Sin estado",
            className: "bg-surface-muted text-muted",
          }

          return (
            <article
              key={enrollment.id}
              className="flex items-center gap-4 rounded-3xl border border-border bg-surface p-4 shadow-sm"
            >
              <Avatar name={child.fullName} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-foreground">{child.fullName}</p>
                <p className="text-sm text-muted">
                  Año {enrollment.year} · Inicio:{" "}
                  {formatFecha(enrollment.startDate)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${status.className}`}
                >
                  {status.label}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {formatCOP(Number(enrollment.amount) || 0)}
                </span>
              </div>
            </article>
          )
        })}
        {!loading && !error && filteredEnrollments.length === 0 && (
          <p className="rounded-3xl border border-border bg-surface p-8 text-center text-muted">
            No hay matrículas para mostrar con este filtro.
          </p>
        )}
      </div>
    </div>
  )
}
