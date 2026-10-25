import { useState } from "react"
import { formatFecha, plantillas } from "../data"
import { Avatar, Button } from "../components/ui"
import {
  CreateGuardianDialog,
  DeletePersonDialog,
} from "../components/PeopleDialogs"
import { useGuardians } from "../hooks/useGuardians"

const Icon = ({ path, className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
)

function GuardianWhatsAppModal({ guardian, onClose }) {
  const plantilla = plantillas.find((p) => p.tipo === "confirmacion_datos")
  const [mensaje, setMensaje] = useState(
    (plantilla?.contenido || "")
      .replace("{{acudiente}}", guardian.fullName)
      .replace("{{telefono}}", guardian.phone)
      .replace("{{correo}}", guardian.email)
      .replace("{{direccion}}", "la registrada en nuestro sistema"),
  )

  const enviar = () => {
    const url = `https://wa.me/${(guardian.whatsapp || guardian.phone).replace(/\D/g, "")}?text=${encodeURIComponent(mensaje)}`
    window.open(url, "_blank")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40">
      <div className="bg-surface rounded-3xl w-full max-w-md shadow-2xl">
        <div className="p-5 border-b border-border flex items-center gap-3">
          <div className="w-9 h-9 bg-info-soft rounded-2xl flex items-center justify-center">
            <Icon
              path="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
              className="w-5 h-5 text-info"
            />
          </div>
          <div>
            <p className="font-bold text-foreground">
              Pedir confirmación de datos
            </p>
            <p className="text-xs text-muted">{guardian.fullName}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-subtle hover:text-muted"
          >
            <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">
          <p className="text-xs font-bold text-muted uppercase tracking-wide mb-2">
            Mensaje (puedes editarlo)
          </p>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            rows={8}
            className="w-full border border-border rounded-2xl p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-info/30 resize-none"
          />
          <p className="text-xs text-muted mt-1">
            Se enviará al: {guardian.whatsapp || guardian.phone}
          </p>
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-border text-muted font-bold hover:bg-surface-muted transition"
          >
            Cancelar
          </button>
          <button
            onClick={enviar}
            className="flex-1 py-3 rounded-2xl bg-info text-white font-bold hover:bg-info-hover transition"
          >
            Abrir WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}

function GuardianDetail({
  guardian,
  childrenRecords,
  onBack,
  onDelete,
}) {
  const [showModal, setShowModal] = useState(false)
  const linkedChildren = childrenRecords.filter((child) =>
    (guardian.childrenIds ?? []).includes(child.id),
  )

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      {showModal && (
        <GuardianWhatsAppModal
          guardian={guardian}
          onClose={() => setShowModal(false)}
        />
      )}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-primary-hover font-semibold mb-5 hover:opacity-80 transition"
      >
        <Icon path="M15.75 19.5L8.25 12l7.5-7.5" className="w-5 h-5" />
        Volver a la lista
      </button>

      <div className="bg-surface rounded-3xl p-6 mb-4 shadow-sm border border-border">
        <div className="flex items-center gap-4 mb-5">
          <Avatar name={guardian.fullName} />
          <div>
            <h1 className="text-xl font-extrabold text-foreground">
              {guardian.fullName}
            </h1>
            <p className="text-muted text-sm">{guardian.relationship}</p>
          </div>
          <span
            className={`ml-auto text-xs font-bold px-3 py-1.5 rounded-full ${
              guardian.dataConfirmed
                ? "bg-success-soft text-success"
                : "bg-warning-soft text-warning"
            }`}
          >
            {guardian.dataConfirmed
              ? "✓ Datos confirmados"
              : "⚠ Por confirmar"}
          </span>
        </div>

        <div className="space-y-4">
          <Campo label="Teléfono" valor={guardian.phone} />
          <Campo label="WhatsApp" valor={guardian.whatsapp || guardian.phone} />
          <Campo label="Correo" valor={guardian.email} />
          {guardian.address.street && (
            <Campo label="Dirección" valor={guardian.address.street} />
          )}
          {guardian.address.neighborhood && (
            <Campo label="Barrio" valor={guardian.address.neighborhood} />
          )}
          {guardian.preferredChannel && (
            <Campo label="Canal preferido" valor={guardian.preferredChannel} />
          )}
          {guardian.document.number && (
            <Campo
              label={guardian.document.type || "Documento"}
              valor={`•••• ${guardian.document.number.slice(-4)}`}
            />
          )}
          {guardian.lastConfirmation && (
            <Campo
              label="Última confirmación"
              valor={formatFecha(guardian.lastConfirmation)}
            />
          )}
        </div>
      </div>

      <div className="bg-surface rounded-3xl p-5 mb-4 shadow-sm border border-border">
        <p className="text-xs font-bold text-muted uppercase tracking-wide mb-3">
          Beneficiarios a cargo
        </p>
        {linkedChildren.map((child) => (
          <div
            key={child.id}
            className="flex items-center gap-3 py-2 border-b border-border last:border-0"
          >
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-semibold text-foreground text-sm">
              {child.fullName}
            </span>
            <span className="text-xs text-muted ml-auto">{child.age} años</span>
          </div>
        ))}
        {linkedChildren.length === 0 && (
          <p className="py-3 text-sm text-muted">
            Sin beneficiarios vinculados.
          </p>
        )}
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-info text-white font-bold text-base py-4 rounded-2xl hover:bg-info-hover transition flex items-center justify-center gap-2"
      >
        <Icon
          path="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          className="w-5 h-5"
        />
        Pedir confirmación de datos
      </button>
      <Button
        type="button"
        variant="danger"
        onClick={onDelete}
        className="mt-3 w-full sm:w-auto"
      >
        Eliminar registro
      </Button>
    </div>
  )
}

function Campo({ label, valor }) {
  return (
    <div>
      <p className="text-xs font-bold text-muted uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-foreground font-semibold">{valor}</p>
    </div>
  )
}

export default function GuardiansScreen() {
  const {
    guardians,
    children,
    loading,
    error,
    createGuardian,
    deleteGuardian,
  } = useGuardians()
  const [selectedId, setSelectedId] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [toast, setToast] = useState("")
  const [filtro, setFiltro] = useState("todos")

  const selected = guardians.find((guardian) => guardian.id === selectedId)
  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 3000)
  }
  if (selected)
    return (
      <>
        {toast && (
          <div
            role="status"
            className="fixed right-4 top-4 z-50 rounded-xl bg-success px-4 py-3 text-sm font-bold text-white shadow-dialog"
          >
            {toast}
          </div>
        )}
        <GuardianDetail
          guardian={selected}
          childrenRecords={children}
          onBack={() => setSelectedId(null)}
          onDelete={() => setDeleting(selected)}
        />
        {deleting && (
          <DeletePersonDialog
            kind="guardian"
            name={deleting.fullName}
            onClose={() => setDeleting(null)}
            onConfirm={async () => {
              const result = await deleteGuardian(deleting.id)
              if (result.ok) {
                setDeleting(null)
                setSelectedId(null)
                showToast(result.message)
              }
              return result
            }}
          />
        )}
      </>
    )

  const filteredGuardians = guardians.filter((guardian) => {
    const term = busqueda.trim().toLowerCase()
    const matchBusqueda =
      guardian.fullName.toLowerCase().includes(term) ||
      (guardian.document.number ?? "").toLowerCase().includes(term)
    const matchFiltro =
      filtro === "todos" ||
      (filtro === "confirmados" && guardian.dataConfirmed) ||
      (filtro === "pendientes" && !guardian.dataConfirmed)
    return matchBusqueda && matchFiltro
  })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      {toast && (
        <div
          role="status"
          className="fixed right-4 top-4 z-50 rounded-xl bg-success px-4 py-3 text-sm font-bold text-white shadow-dialog"
        >
          {toast}
        </div>
      )}
      {creating && (
        <CreateGuardianDialog
          onClose={() => setCreating(false)}
          childrenRecords={children}
          onCreateGuardian={createGuardian}
          onCreated={(record) => {
            setCreating(false)
            setSelectedId(record.id)
            showToast("Acudiente registrado correctamente")
          }}
        />
      )}
      {deleting && (
        <DeletePersonDialog
          kind="guardian"
          name={deleting.fullName}
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            const result = await deleteGuardian(deleting.id)
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
          <h1 className="text-3xl font-extrabold text-foreground">
            Acudientes
          </h1>
          <span className="text-sm text-muted font-semibold">
            {guardians.length} registros
          </span>
        </div>
        <Button
          type="button"
          onClick={() => setCreating(true)}
          className="w-full sm:w-auto"
        >
          + Agregar acudiente
        </Button>
      </div>

      {loading && (
        <p className="mb-4 text-sm font-semibold text-muted" role="status">
          Cargando acudientes…
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
      <div className="relative mb-4">
        <Icon
          path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"
          className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-subtle"
        />
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o documento..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-surface border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
        />
      </div>

      <div className="flex gap-2 mb-5">
        {[
          { id: "todos", label: "Todos" },
          { id: "confirmados", label: "Confirmados" },
          { id: "pendientes", label: "Por confirmar" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFiltro(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filtro === f.id
                ? "bg-primary text-white"
                : "bg-surface text-muted border border-border hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filteredGuardians.map((guardian) => {
          const linkedChildren = children.filter((child) =>
            (guardian.childrenIds ?? []).includes(child.id),
          )
          return (
            <article
              key={guardian.id}
              className="flex items-center gap-2 rounded-3xl border border-border bg-surface p-2 shadow-sm"
            >
              <button
                type="button"
                onClick={() => setSelectedId(guardian.id)}
                className="flex min-w-0 flex-1 items-center gap-4 rounded-2xl p-2 text-left hover:bg-background"
              >
                <Avatar name={guardian.fullName} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-extrabold text-foreground">
                    {guardian.fullName}
                  </p>
                  <p className="truncate text-sm text-muted">
                    {guardian.relationship}
                    {linkedChildren.length > 0
                      ? ` · ${linkedChildren.map((child) => child.firstName).join(", ")}`
                      : " · Sin beneficiarios vinculados"}
                  </p>
                  <p className="mt-0.5 text-xs text-subtle">{guardian.phone}</p>
                </div>
                <span
                  className={`hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-bold sm:inline-flex ${
                    guardian.dataConfirmed
                      ? "bg-success-soft text-success"
                      : "bg-warning-soft text-warning"
                  }`}
                >
                  {guardian.dataConfirmed ? "Datos confirmados" : "Por confirmar"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setDeleting(guardian)}
                aria-label={`Eliminar a ${guardian.fullName}`}
                className="min-h-11 shrink-0 rounded-xl px-3 text-sm font-bold text-danger hover:bg-danger-soft"
              >
                Eliminar
              </button>
            </article>
          )
        })}
        {filteredGuardians.length === 0 && (
          <div className="rounded-3xl border border-border bg-surface p-8 text-center text-muted">
            No se encontraron acudientes con esa búsqueda o filtro.
          </div>
        )}
      </div>
    </div>
  )
}
