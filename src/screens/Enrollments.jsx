import { useState } from "react"
import { formatCOP, formatFecha } from "../data"
import { Avatar, Badge, Button } from "../components/ui"
import {
  CreateTuitionDialog,
  DeletePersonDialog,
  EditTuitionDialog,
} from "../components/EntityDialogs"
import { useEnrollments } from "../hooks/useEnrollments"
import { useCatalogs } from "../hooks/useCatalogs"
import { findCatalogLabel } from "../models/catalogModel"

export default function EnrollmentsScreen() {
  const {
    enrollments,
    children,
    loading,
    error,
    createTuition,
    updateTuition,
    deleteTuition,
  } = useEnrollments()
  const { catalogs } = useCatalogs(["payment_methods", "tuition_statuses"])
  const [filter, setFilter] = useState("todos")
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [toast, setToast] = useState("")

  const filters = [
    { id: "todos", label: "Todas" },
    ...(catalogs.tuition_statuses || []).map((item) => ({
      id: String(item.id),
      label: item.name,
    })),
  ]

  const filteredEnrollments = enrollments.filter((enrollment) => {
    if (filter === "todos") return true
    return (
      String(enrollment.tuitionStatusId) === String(filter) ||
      enrollment.status === filter
    )
  })
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

      {editing && (
        <EditTuitionDialog
          tuition={editing}
          children={children}
          onClose={() => setEditing(null)}
          onUpdateTuition={updateTuition}
          onUpdated={() => {
            setEditing(null)
            showToast("Pago de matrícula actualizado correctamente.")
          }}
        />
      )}

      {deleting && (
        <DeletePersonDialog
          kind="tuition"
          name={`pago de ${deleting.childName || "beneficiario"} por ${formatCOP(Number(deleting.amount) || 0)}`}
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            const result = await deleteTuition(deleting.id)
            if (result.ok) {
              setDeleting(null)
              showToast(result.message)
            }
            return result
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
        {filters.map((item) => (
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
            (record) => String(record.childId) === String(enrollment.childId),
          )
          const childName = child
            ? `${child.firstName} ${child.lastName}`
            : `Beneficiario #${enrollment.childId || ""}`

          const statusName =
            findCatalogLabel(catalogs.tuition_statuses, enrollment.tuitionStatusId) ||
            enrollment.status ||
            "Sin estado"

          const paymentMethodName =
            findCatalogLabel(catalogs.payment_methods, enrollment.paymentMethodId) ||
            enrollment.paymentMethod ||
            "Sin registrar"

          return (
            <article
              key={enrollment.id}
              className="flex items-center gap-4 rounded-3xl border border-border bg-surface p-4 shadow-sm"
            >
              <Avatar
                name={childName}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-foreground">
                  {childName}
                </p>
                <p className="text-sm text-muted">
                  Fecha de pago: {formatFecha(enrollment.paidDate)} · Medio:{" "}
                  {paymentMethodName}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <div className="flex flex-col items-end gap-1.5">
                  <Badge
                    tone={
                      statusName.toLowerCase().includes("pago") ||
                      statusName.toLowerCase().includes("paga")
                        ? "success"
                        : statusName.toLowerCase().includes("pend")
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {statusName}
                  </Badge>
                  <span className="text-sm font-bold text-foreground">
                    {formatCOP(Number(enrollment.amount) || 0)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setEditing(enrollment)}
                    className="min-h-9 px-3 py-1 text-xs font-bold"
                  >
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() =>
                      setDeleting({
                        ...enrollment,
                        childName,
                      })
                    }
                    className="min-h-9 px-3 py-1 text-xs font-bold"
                  >
                    Eliminar
                  </Button>
                </div>
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
