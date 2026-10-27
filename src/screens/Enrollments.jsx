import { useState } from "react"
import { formatCOP, formatFecha } from "../data"
import { Avatar, Button } from "../components/ui"
import { CreateTuitionDialog } from "../components/EntityDialogs"
import { useEnrollments } from "../hooks/useEnrollments"

const STATUS = {
  pagado: { label: "Pagado", className: "bg-success-soft text-success" },
  pendiente: { label: "Pendiente", className: "bg-warning-soft text-warning" },
  vencido: { label: "Vencido", className: "bg-danger-soft text-danger" },
}

const FILTERS = [
  { id: "todos", label: "Todas" },
  { id: "pagado", label: "Pagadas" },
  { id: "pendiente", label: "Pendientes" },
  { id: "vencido", label: "Vencidas" },
]

export default function EnrollmentsScreen() {
  const { enrollments, children, loading, error, createTuition } =
    useEnrollments()
  const [filter, setFilter] = useState("todos")
  const [creating, setCreating] = useState(false)
  const [toast, setToast] = useState("")

  const filteredEnrollments = enrollments.filter(
    (enrollment) => filter === "todos" || enrollment.status === filter,
  )
  const totalAmount = enrollments.reduce(
    (total, enrollment) => total + (Number(enrollment.amount) || 0),
    0,
  )

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 3000)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      {toast && (
        <p
          role="status"
          className="fixed right-4 top-4 z-50 rounded-xl bg-success px-4 py-3 text-sm font-bold text-white shadow-dialog"
        >
          {toast}
        </p>
      )}

      {creating && (
        <CreateTuitionDialog
          children={children}
          onClose={() => setCreating(false)}
          onCreateTuition={createTuition}
          onCreated={() => {
            setCreating(false)
            showToast("Pago de matrícula registrado correctamente.")
          }}
        />
      )}

      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Matrículas</h1>
          <p className="text-sm font-semibold text-muted">
            {enrollments.length} registros
          </p>
        </div>
        <Button type="button" onClick={() => setCreating(true)}>
          + Registrar pago
        </Button>
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
            {enrollments.length}
          </p>
          <p className="text-sm font-medium text-muted">Pagos registrados</p>
        </div>
        <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm">
          <p className="text-2xl font-extrabold text-foreground">
            {formatCOP(totalAmount)}
          </p>
          <p className="text-sm font-medium text-muted">
            Valor total registrado
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
            (record) => record.childId === enrollment.childId,
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
              <Avatar
                name={`${child.firstName} ${child.lastName}`}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-foreground">
                  {child.firstName} {child.lastName}
                </p>
                <p className="text-sm text-muted">
                  Fecha de pago: {formatFecha(enrollment.paidDate)} · Medio:{" "}
                  {enrollment.paymentMethod || "Sin registrar"}
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
