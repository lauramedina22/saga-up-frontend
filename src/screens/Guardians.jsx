import { useState } from "react"
import { Avatar, Button, Card, Field } from "../components/ui"
import {
  CreateGuardianDialog,
  DeletePersonDialog,
  EditGuardianDialog,
  GuardianChildDialog,
} from "../components/EntityDialogs"
import { useGuardians } from "../hooks/useGuardians"
import { catalogService } from "../services/catalogService"

function display(value) {
  return value === null || value === undefined || value === ""
    ? "Sin registrar"
    : value
}

function GuardianDetails({
  guardian,
  children,
  relationships,
  onCreateRelationship,
  onDeleteRelationship,
  onCreateChild,
  onUpdateGuardian,
  onBack,
  onDelete,
}) {
  const [relationshipDialog, setRelationshipDialog] = useState(false)
  const [deletingRelationship, setDeletingRelationship] = useState(null)
  const [editingGuardian, setEditingGuardian] = useState(false)
  const guardianRelationships = relationships.filter(
    (relationship) => String(relationship.guardianId) === String(guardian.guardianId),
  )

  const documentTypeLabel =
    catalogService.findLabel(
      "document_types",
      guardian.documentTypeId ?? guardian.documentType,
    ) || guardian.documentType
  const legalStatusLabel =
    catalogService.findLabel(
      "legal_statuses",
      guardian.legalStatusId ?? guardian.legalStatus,
    ) || guardian.legalStatus

  return (
    <>
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
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold">Datos de guardians</h2>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setEditingGuardian(true)}
          >
            Editar acudiente
          </Button>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2">
          {[
            ["Nombre completo", guardian.fullName],
            ["Tipo de documento", documentTypeLabel],
            ["Número de documento", guardian.documentNumber],
            ["Teléfono", guardian.phone],
            ["Dirección", guardian.address],
            ["Situación jurídica", legalStatusLabel],
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
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold">
              Relaciones childGuardian
            </h2>
            <p className="text-sm text-muted">
              Beneficiarios a cargo (un acudiente puede tener múltiples beneficiarios a su cargo).
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setRelationshipDialog(true)}
          >
            + Vincular beneficiario
          </Button>
        </div>
        {guardianRelationships.length > 0 ? (
          <div className="space-y-3">
            {guardianRelationships.map((relationship) => {
              const child = children.find(
                (item) => String(item.childId) === String(relationship.childId),
              )
              const guardianshipTypeLabel =
                catalogService.findLabel(
                  "guardianship_types",
                  relationship.guardianshipTypeId ?? relationship.guardianshipType,
                ) || relationship.guardianshipType

              return (
                <article
                  key={relationship.childGuardianId}
                  className="rounded-xl bg-surface-muted p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-bold">
                        Beneficiario:{" "}
                        {child
                          ? `${child.firstName} ${child.lastName}`
                          : "Sin registro"}
                      </p>
                      {child?.documentNumber && (
                        <p className="text-xs text-muted">
                          Documento: {child.documentNumber}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => setDeletingRelationship(relationship)}
                    >
                      Desvincular
                    </Button>
                  </div>
                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="text-muted">Tipo de vínculo</dt>
                      <dd className="font-semibold">
                        {display(guardianshipTypeLabel)}
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
            Este acudiente no tiene beneficiarios vinculados actualmente. Puedes vincular uno con el botón superior.
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
    {relationshipDialog && (
      <GuardianChildDialog
        guardian={guardian}
        children={children}
        onClose={() => setRelationshipDialog(false)}
        onSave={async (data) => {
          await onCreateRelationship(data)
          setRelationshipDialog(false)
        }}
        onCreateChild={onCreateChild}
      />
    )}
    {deletingRelationship && (
      <DeletePersonDialog
        kind="relationship"
        name={`vínculo con ${
          children.find(
            (item) =>
              String(item.childId) ===
              String(deletingRelationship.childId),
          )
            ? `${
                children.find(
                  (item) =>
                    String(item.childId) ===
                    String(deletingRelationship.childId),
                ).firstName
              } ${
                children.find(
                  (item) =>
                    String(item.childId) ===
                    String(deletingRelationship.childId),
                ).lastName
              }`
            : "el beneficiario"
        }`}
        onClose={() => setDeletingRelationship(null)}
        onConfirm={async () => {
          const result = await onDeleteRelationship(
            deletingRelationship.childGuardianId,
          )
          if (result && !result.ok) return result
          setDeletingRelationship(null)
          return { ok: true }
        }}
      />
    )}
    {editingGuardian && (
      <EditGuardianDialog
        guardian={guardian}
        onClose={() => setEditingGuardian(false)}
        onSave={(changes) => onUpdateGuardian(guardian.guardianId, changes)}
      />
    )}
    </>
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
    updateGuardian,
    deleteGuardian,
    createRelationship,
    deleteRelationship,
    createChild,
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
          onCreateRelationship={createRelationship}
          onDeleteRelationship={deleteRelationship}
          onCreateChild={createChild}
          onUpdateGuardian={updateGuardian}
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
