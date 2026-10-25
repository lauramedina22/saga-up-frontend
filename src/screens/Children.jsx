import { useState } from "react"
import { formatCOP, formatFecha } from "../data"
import { Avatar, Button, Card, Field } from "../components/ui"
import {
  ChildInternalDescriptionDialog,
  ChildRecordDialog,
  ChildrenAssistanceDialog,
  CreateChildDialog,
  DeletePersonDialog,
} from "../components/EntityDialogs"
import { useChildren } from "../hooks/useChildren"

function display(value) {
  return value === null || value === undefined || value === ""
    ? "Sin registrar"
    : value
}

function ChildDetails({
  child,
  guardians,
  relationships,
  childRecords,
  internalDescriptions,
  assistanceRecords,
  enrollments,
  childRecordsError,
  internalDescriptionsError,
  assistanceError,
  enrollmentError,
  onCreateChildRecord,
  onUpdateChildRecord,
  onDeleteChildRecord,
  onCreateInternalDescription,
  onUpdateInternalDescription,
  onDeleteInternalDescription,
  onCreateAssistance,
  onUpdateAssistance,
  onDeleteAssistance,
  onBack,
  onDelete,
}) {
  const [recordDialog, setRecordDialog] = useState(null)
  const [deletingRecord, setDeletingRecord] = useState(null)
  const [descriptionDialog, setDescriptionDialog] = useState(null)
  const [deletingDescription, setDeletingDescription] = useState(null)
  const [assistanceDialog, setAssistanceDialog] = useState(null)
  const [deletingAssistance, setDeletingAssistance] = useState(null)
  const childRelationships = relationships.filter(
    (relationship) => relationship.childId === child.childId,
  )
  const recordsForChild = childRecords.filter(
    (record) => record.childId === child.childId,
  )
  const descriptionsForChild = internalDescriptions.filter(
    (description) => description.childId === child.childId,
  )
  const assistanceForChild = assistanceRecords.filter(
    (assistance) => assistance.childId === child.childId,
  )
  const enrollmentsForChild = enrollments.filter(
    (enrollment) => enrollment.childId === child.childId,
  )

  return (
    <>
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <Button variant="tertiary" onClick={onBack} className="mb-5 px-0">
        Volver a beneficiarios
      </Button>
      <Card className="mb-4 rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <Avatar name={`${child.firstName} ${child.lastName}`} size="lg" />
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-extrabold">
              {child.firstName} {child.lastName}
            </h1>
            <p className="text-sm text-muted">
              ID de registro: {display(child.childId)}
            </p>
          </div>
        </div>
      </Card>

      <Card className="rounded-3xl p-5">
        <h2 className="mb-4 text-xl font-extrabold">Datos de children</h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          {[
            ["Nombres", child.firstName],
            ["Apellidos", child.lastName],
            ["Fecha de nacimiento", child.birthDate],
            ["Sexo (código)", child.sex],
            ["Tipo de documento (código)", child.documentType],
            ["Número de documento", child.documentNumber],
            ["Fecha de ingreso", child.admissionDate],
            ["Fecha de retiro", child.exitDate],
            ["Estado (código)", child.statusId],
            ["Observaciones", child.notes],
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
        {childRelationships.length > 0 ? (
          <div className="space-y-3">
            {childRelationships.map((relationship) => {
              const guardian = guardians.find(
                (item) => item.guardianId === relationship.guardianId,
              )
              return (
                <article
                  key={relationship.childGuardianId}
                  className="rounded-xl bg-surface-muted p-4"
                >
                  <p className="font-bold">
                    Acudiente: {guardian?.fullName || "Sin registro"}
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
            Este beneficiario no tiene acudientes vinculados.
          </p>
        )}
      </Card>
      <Card className="mt-4 rounded-3xl p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold">Descripción interna</h2>
            <p className="text-sm text-muted">
              Comunicación, rutina, gustos e indicaciones de manejo de crisis.
            </p>
          </div>
          <Button type="button" onClick={() => setDescriptionDialog({})}>
            Agregar descripción
          </Button>
        </div>
        {internalDescriptionsError && (
          <p
            role="alert"
            className="mb-4 rounded-xl bg-danger-soft p-3 text-sm font-semibold text-danger"
          >
            {internalDescriptionsError}
          </p>
        )}
        {descriptionsForChild.length ? (
          <div className="space-y-3">
            {descriptionsForChild.map((description) => (
              <article
                key={description.childInternalDescriptionId}
                className="rounded-xl bg-surface-muted p-4"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-bold text-muted">
                    Descripción #{description.childInternalDescriptionId}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setDescriptionDialog(description)}
                    >
                      Editar
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => setDeletingDescription(description)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
                <dl className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Formas de comunicación", description.communicationWays],
                    ["Apoyos para la rutina diaria", description.dailyRoutineHelp],
                    ["Gustos e intereses", description.likings],
                    ["Manejo de crisis", description.crisisManagement],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-surface p-3">
                      <dt className="text-xs font-extrabold uppercase tracking-wide text-muted">
                        {label}
                      </dt>
                      <dd className="mt-1 whitespace-pre-wrap font-semibold">
                        {display(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">
            No hay descripciones internas registradas.
          </p>
        )}
      </Card>
      <Card className="mt-4 rounded-3xl p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold">Asistencia a talleres</h2>
            <p className="text-sm text-muted">
              Registros de la tabla children_assistance.
            </p>
          </div>
          <Button type="button" onClick={() => setAssistanceDialog({})}>
            Agregar asistencia
          </Button>
        </div>
        {assistanceError && (
          <p
            role="alert"
            className="mb-4 rounded-xl bg-danger-soft p-3 text-sm font-semibold text-danger"
          >
            {assistanceError}
          </p>
        )}
        {assistanceForChild.length ? (
          <div className="space-y-3">
            {assistanceForChild.map((assistance) => (
              <article
                key={assistance.childrenAssistanceId}
                className="rounded-xl bg-surface-muted p-4"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold">
                      Sesión de taller #{assistance.professionalWorkshopId}
                    </p>
                    <p className="text-xs text-muted">
                      Registro #{assistance.childrenAssistanceId}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setAssistanceDialog(assistance)}
                    >
                      Editar
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => setDeletingAssistance(assistance)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
                <dl className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["Confirmó asistencia", assistance.willAssist],
                    ["Asistió", assistance.asisted],
                    ["Completó el taller", assistance.completeWorkshop],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-surface p-3">
                      <dt className="text-xs font-extrabold uppercase tracking-wide text-muted">
                        {label}
                      </dt>
                      <dd className="mt-1 font-semibold">
                        {value ? "Sí" : "No"}
                      </dd>
                    </div>
                  ))}
                  <div className="rounded-lg bg-surface p-3 sm:col-span-3">
                    <dt className="text-xs font-extrabold uppercase tracking-wide text-muted">
                      Comportamiento
                    </dt>
                    <dd className="mt-1 whitespace-pre-wrap font-semibold">
                      {display(assistance.behavior)}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">
            No hay registros de asistencia para este beneficiario.
          </p>
        )}
      </Card>
      <Card className="mt-4 rounded-3xl p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold">Ficha de salud</h2>
            <p className="text-sm text-muted">
              Datos de la tabla child_records
            </p>
          </div>
          <Button type="button" onClick={() => setRecordDialog({})}>
            Agregar ficha
          </Button>
        </div>
        {childRecordsError && (
          <p
            role="alert"
            className="mb-4 rounded-xl bg-danger-soft p-3 text-sm font-semibold text-danger"
          >
            {childRecordsError}
          </p>
        )}
        {recordsForChild.length ? (
          <div className="space-y-3">
            {recordsForChild.map((record) => (
              <article
                key={record.recordId}
                className="rounded-xl bg-surface-muted p-4"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-bold text-muted">
                    Ficha #{record.recordId}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setRecordDialog(record)}
                    >
                      Editar
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => setDeletingRecord(record)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
                <dl className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["EPS", record.eps],
                    ["Estado de afiliación", record.state],
                    ["IPS asignada", record.ipsAssigned],
                    ["Alergias", record.allergies],
                    ["Restricciones alimentarias", record.mealRestrictions],
                    ["Medicamentos", record.medicines],
                    ["Condiciones especiales", record.specialConditions],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-surface p-3">
                      <dt className="text-xs font-extrabold uppercase tracking-wide text-muted">
                        {label}
                      </dt>
                      <dd className="mt-1 font-semibold">{display(value)}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">
            No hay fichas de salud registradas para este beneficiario.
          </p>
        )}
      </Card>
      <Card className="mt-4 rounded-3xl p-5">
        <h2 className="mb-4 text-xl font-extrabold">
          Pagos asociados (tuition)
        </h2>
        {enrollmentError && (
          <p
            role="alert"
            className="mb-4 rounded-xl bg-danger-soft p-3 text-sm font-semibold text-danger"
          >
            {enrollmentError}
          </p>
        )}
        {enrollmentsForChild.length ? (
          <div className="space-y-2">
            {enrollmentsForChild.map((enrollment) => (
              <article
                key={enrollment.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface-muted p-3"
              >
                <div>
                  <p className="font-bold">
                    {enrollment.status || "Sin estado"}
                  </p>
                  <p className="text-sm text-muted">
                    {enrollment.paymentMethod || "Medio sin registrar"} ·{" "}
                    {formatFecha(enrollment.paidDate)}
                  </p>
                </div>
                <p className="font-extrabold">
                  {formatCOP(Number(enrollment.amount) || 0)}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">
            No hay pagos registrados para este beneficiario.
          </p>
        )}
      </Card>
      <Button
        variant="danger"
        onClick={onDelete}
        className="mt-4"
        type="button"
      >
        Eliminar beneficiario
      </Button>
    </div>
    {recordDialog && (
      <ChildRecordDialog
        record={recordDialog.recordId ? recordDialog : null}
        onClose={() => setRecordDialog(null)}
        onSave={(changes) =>
          recordDialog.recordId
            ? onUpdateChildRecord(child.childId, recordDialog.recordId, changes)
            : onCreateChildRecord(child.childId, changes)
        }
      />
    )}
    {deletingRecord && (
      <DeletePersonDialog
        kind="record"
        name={`#${deletingRecord.recordId}`}
        onClose={() => setDeletingRecord(null)}
        onConfirm={async () => {
          await onDeleteChildRecord(child.childId, deletingRecord.recordId)
          setDeletingRecord(null)
          return { ok: true }
        }}
      />
    )}
    {descriptionDialog && (
      <ChildInternalDescriptionDialog
        description={
          descriptionDialog.childInternalDescriptionId
            ? descriptionDialog
            : null
        }
        onClose={() => setDescriptionDialog(null)}
        onSave={(changes) =>
          descriptionDialog.childInternalDescriptionId
            ? onUpdateInternalDescription(
                child.childId,
                descriptionDialog.childInternalDescriptionId,
                changes,
              )
            : onCreateInternalDescription(child.childId, changes)
        }
      />
    )}
    {deletingDescription && (
      <DeletePersonDialog
        kind="description"
        name={`#${deletingDescription.childInternalDescriptionId}`}
        onClose={() => setDeletingDescription(null)}
        onConfirm={async () => {
          await onDeleteInternalDescription(
            child.childId,
            deletingDescription.childInternalDescriptionId,
          )
          setDeletingDescription(null)
          return { ok: true }
        }}
      />
    )}
    {assistanceDialog && (
      <ChildrenAssistanceDialog
        assistance={
          assistanceDialog.childrenAssistanceId ? assistanceDialog : null
        }
        onClose={() => setAssistanceDialog(null)}
        onSave={(changes) =>
          assistanceDialog.childrenAssistanceId
            ? onUpdateAssistance(
                child.childId,
                assistanceDialog.childrenAssistanceId,
                changes,
              )
            : onCreateAssistance(child.childId, changes)
        }
      />
    )}
    {deletingAssistance && (
      <DeletePersonDialog
        kind="assistance"
        name={`#${deletingAssistance.childrenAssistanceId}`}
        onClose={() => setDeletingAssistance(null)}
        onConfirm={async () => {
          await onDeleteAssistance(
            child.childId,
            deletingAssistance.childrenAssistanceId,
          )
          setDeletingAssistance(null)
          return { ok: true }
        }}
      />
    )}
    </>
  )
}

export default function ChildrenScreen() {
  const {
    children,
    guardians,
    relationships,
    childRecords,
    internalDescriptions,
    assistanceRecords,
    enrollments,
    loading,
    error,
    childRecordsError,
    internalDescriptionsError,
    assistanceError,
    enrollmentError,
    createChild,
    createChildRecord,
    updateChildRecord,
    deleteChildRecord,
    createInternalDescription,
    updateInternalDescription,
    deleteInternalDescription,
    createAssistance,
    updateAssistance,
    deleteAssistance,
    deleteChild,
  } = useChildren()
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [toast, setToast] = useState("")

  const selected = children.find((child) => child.childId === selectedId)
  const filteredChildren = children.filter((child) =>
    `${child.firstName} ${child.lastName} ${child.documentNumber}`
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
        <ChildDetails
          child={selected}
          guardians={guardians}
          relationships={relationships}
          childRecords={childRecords}
          internalDescriptions={internalDescriptions}
          assistanceRecords={assistanceRecords}
          enrollments={enrollments}
          childRecordsError={childRecordsError}
          internalDescriptionsError={internalDescriptionsError}
          assistanceError={assistanceError}
          enrollmentError={enrollmentError}
          onCreateChildRecord={createChildRecord}
          onUpdateChildRecord={updateChildRecord}
          onDeleteChildRecord={deleteChildRecord}
          onCreateInternalDescription={createInternalDescription}
          onUpdateInternalDescription={updateInternalDescription}
          onDeleteInternalDescription={deleteInternalDescription}
          onCreateAssistance={createAssistance}
          onUpdateAssistance={updateAssistance}
          onDeleteAssistance={deleteAssistance}
          onBack={() => setSelectedId(null)}
          onDelete={() => setDeleting(selected)}
        />
        {deleting && (
          <DeletePersonDialog
            kind="child"
            name={`${deleting.firstName} ${deleting.lastName}`}
            onClose={() => setDeleting(null)}
            onConfirm={async () => {
              const result = await deleteChild(deleting.childId)
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
        <CreateChildDialog
          guardians={guardians}
          onCreateChild={createChild}
          onClose={() => setCreating(false)}
          onCreated={(record) => {
            setCreating(false)
            setSelectedId(record.childId)
            showToast("Beneficiario registrado correctamente.")
          }}
        />
      )}
      {deleting && (
        <DeletePersonDialog
          kind="child"
          name={`${deleting.firstName} ${deleting.lastName}`}
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            const result = await deleteChild(deleting.childId)
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
          <h1 className="text-3xl font-extrabold">Beneficiarios</h1>
          <p className="text-sm font-semibold text-muted">
            {children.length} registros
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setCreating(true)}
          className="w-full sm:w-auto"
        >
          + Agregar beneficiario
        </Button>
      </header>
      <Field
        label="Buscar beneficiario"
        placeholder="Buscar por nombre o documento..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="mb-4"
      />
      {loading && (
        <p className="mb-4 text-sm font-semibold text-muted" role="status">
          Cargando beneficiarios…
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
        {filteredChildren.map((child) => (
          <article
            key={child.childId}
            className="flex items-center gap-3 rounded-3xl border border-border bg-surface p-3 shadow-sm"
          >
            <button
              type="button"
              onClick={() => setSelectedId(child.childId)}
              className="flex min-w-0 flex-1 items-center gap-4 rounded-2xl p-2 text-left hover:bg-background"
            >
              <Avatar name={`${child.firstName} ${child.lastName}`} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-extrabold">
                  {child.firstName} {child.lastName}
                </span>
                <span className="block truncate text-sm text-muted">
                  Documento: {display(child.documentNumber)}
                </span>
              </span>
            </button>
            <Button
              type="button"
              variant="danger"
              onClick={() => setDeleting(child)}
            >
              Eliminar
            </Button>
          </article>
        ))}
        {!loading && filteredChildren.length === 0 && (
          <p className="rounded-3xl border border-border bg-surface p-8 text-center text-muted">
            No se encontraron beneficiarios.
          </p>
        )}
      </div>
    </div>
  )
}
