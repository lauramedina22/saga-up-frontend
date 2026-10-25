import { useState } from "react"
import { Avatar, Button, Card, Field } from "../components/ui"
import {
  CreateGuardianDialog,
  DeletePersonDialog,
} from "../components/EntityDialogs"
import { useGuardians } from "../hooks/useGuardians"

function display(value) {
  return value === null || value === undefined || value === ""
    ? "Sin registrar"
    : value
}

function GuardianDetails({
  guardian,
  children,
  relationships,
  onBack,
  onDelete,
}) {
  const guardianRelationships = relationships.filter(
    (relationship) => relationship.guardianId === guardian.guardianId,
  )

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <Button variant="tertiary" onClick={onBack} className="mb-5 px-0">
        Volver a acudientes
      </Button>
      <Card className="mb-4 rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <Avatar name={guardian.fullName} size="lg" />
          <div>
            <h1 className="text-2xl font-extrabold">{guardian.fullName}</h1>
            <p className="text-sm text-muted">
              ID de registro: {display(guardian.guardianId)}
            </p>
          </div>
        </div>
      </Card>

      <Card className="rounded-3xl p-5">
        <h2 className="mb-4 text-xl font-extrabold">Datos de guardians</h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          {[
            ["Nombre completo", guardian.fullName],
            ["Tipo de documento", guardian.documentType],
            ["Número de documento", guardian.documentNumber],
            ["Teléfono", guardian.phone],
            ["Dirección", guardian.address],
            ["Situación jurídica", guardian.legalStatus],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-surface-muted p-3">
              <dt className="text-xs font-extrabold uppercase tracking-wide text-muted">
                {label}
              </dt>
              <dd className="mt-1 font-semibold">{display(value)}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card className="mt-4 rounded-3xl p-5">
        <h2 className="mb-4 text-xl font-extrabold">
          Relaciones childGuardian
        </h2>
        {guardianRelationships.length > 0 ? (
          <div className="space-y-3">
            {guardianRelationships.map((relationship) => {
              const child = children.find(
                (item) => item.childId === relationship.childId,
              )
              return (
                <article
                  key={relationship.childGuardianId}
                  className="rounded-xl bg-surface-muted p-4"
                >
                  <p className="font-bold">
                    Beneficiario:{" "}
                    {child
                      ? `${child.firstName} ${child.lastName}`
                      : "Sin registro"}
                  </p>
                  <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-muted">Tipo de vínculo</dt>
                      <dd className="font-semibold">
                        {display(relationship.guardianshipType)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted">Inicio</dt>
                      <dd className="font-semibold">
                        {display(relationship.startDate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted">Fin</dt>
                      <dd className="font-semibold">
                        {display(relationship.endDate)}
                      </dd>
                    </div>
                  </dl>
                </article>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted">
            Este acudiente no tiene beneficiarios vinculados.
          </p>
        )}
      </Card>
      <Button
        variant="danger"
        onClick={onDelete}
        className="mt-4"
        type="button"
      >
        Eliminar acudiente
      </Button>
    </div>
  )
}

export default function GuardiansScreen() {
  const {
    guardians,
    children,
    relationships,
    loading,
    error,
    createGuardian,
    deleteGuardian,
  } = useGuardians()
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [toast, setToast] = useState("")

  const selected = guardians.find(
    (guardian) => guardian.guardianId === selectedId,
  )
  const filteredGuardians = guardians.filter((guardian) =>
    `${guardian.fullName} ${guardian.documentNumber}`
      .toLocaleLowerCase("es-CO")
      .includes(search.trim().toLocaleLowerCase("es-CO")),
  )
  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 3000)
  }

  if (selected) {
    return (
      <>
        <GuardianDetails
          guardian={selected}
          children={children}
          relationships={relationships}
          onBack={() => setSelectedId(null)}
          onDelete={() => setDeleting(selected)}
        />
        {deleting && (
          <DeletePersonDialog
            kind="guardian"
            name={deleting.fullName}
            onClose={() => setDeleting(null)}
            onConfirm={async () => {
              const result = await deleteGuardian(deleting.guardianId)
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
        <CreateGuardianDialog
          onClose={() => setCreating(false)}
          onCreateGuardian={createGuardian}
          onCreated={(record) => {
            setCreating(false)
            setSelectedId(record.guardianId)
            showToast("Acudiente registrado correctamente.")
          }}
        />
      )}
      {deleting && (
        <DeletePersonDialog
          kind="guardian"
          name={deleting.fullName}
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            const result = await deleteGuardian(deleting.guardianId)
            if (result.ok) {
              setDeleting(null)
              showToast(result.message)
            }
            return result
          }}
        />
      )}

      <header className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold">Acudientes</h1>
          <p className="text-sm font-semibold text-muted">
            {guardians.length} registros
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setCreating(true)}
          className="w-full sm:w-auto"
        >
          + Agregar acudiente
        </Button>
      </header>
      <Field
        label="Buscar acudiente"
        placeholder="Buscar por nombre o documento..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="mb-4"
      />
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
      <div className="space-y-3">
        {filteredGuardians.map((guardian) => {
          const linkedCount = relationships.filter(
            (relationship) => relationship.guardianId === guardian.guardianId,
          ).length
          return (
            <article
              key={guardian.guardianId}
              className="flex items-center gap-3 rounded-3xl border border-border bg-surface p-3 shadow-sm"
            >
              <button
                type="button"
                onClick={() => setSelectedId(guardian.guardianId)}
                className="flex min-w-0 flex-1 items-center gap-4 rounded-2xl p-2 text-left hover:bg-background"
              >
                <Avatar name={guardian.fullName} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-extrabold">
                    {guardian.fullName}
                  </span>
                  <span className="block truncate text-sm text-muted">
                    {linkedCount
                      ? `${linkedCount} beneficiario(s) vinculado(s)`
                      : "Sin beneficiarios vinculados"}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-subtle">
                    {guardian.phone}
                  </span>
                </span>
              </button>
              <Button
                type="button"
                variant="danger"
                onClick={() => setDeleting(guardian)}
              >
                Eliminar
              </Button>
            </article>
          )
        })}
        {!loading && filteredGuardians.length === 0 && (
          <p className="rounded-3xl border border-border bg-surface p-8 text-center text-muted">
            No se encontraron acudientes.
          </p>
        )}
      </div>
    </div>
  )
}
