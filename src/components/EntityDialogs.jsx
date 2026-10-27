import { useState } from "react"
import { Button, Field, SelectField, TextArea } from "./ui"
import { useCatalogs } from "../hooks/useCatalogs"

function DialogShell({ title, description, children, onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="entity-dialog-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4"
    >
      <section className="flex max-h-[95dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-border bg-surface shadow-dialog sm:max-w-2xl sm:rounded-3xl">
        <header className="flex items-start gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <h2 id="entity-dialog-title" className="text-2xl font-extrabold">
              {title}
            </h2>
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="flex size-11 shrink-0 items-center justify-center rounded-xl text-muted hover:bg-surface-muted hover:text-foreground"
          >
            ×
          </button>
        </header>
        {children}
      </section>
    </div>
  )
}

function DialogError({ children }) {
  return (
    <p
      role="alert"
      className="rounded-xl bg-danger-soft p-3 text-sm font-semibold text-danger"
    >
      {children}
    </p>
  )
}

export function CreateChildDialog({
  guardians,
  onClose,
  onCreateChild,
  onCreateGuardian,
  onCreated,
}) {
  const { catalogs } = useCatalogs([
    "sexes",
    "document_types",
    "child_statuses",
    "guardianship_types",
  ])
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    sex: "",
    documentType: "",
    documentNumber: "",
    admissionDate: "",
    exitDate: "",
    statusId: "",
    notes: "",
  })
  const [relationship, setRelationship] = useState({
    guardianId: "",
    guardianshipType: "",
    startDate: "",
    endDate: "",
  })
  const [showCreateGuardian, setShowCreateGuardian] = useState(false)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event) => {
    event.preventDefault()
    setError("")
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("Nombres y apellidos son obligatorios.")
      return
    }
    if (relationship.guardianId && !relationship.guardianshipType) {
      setError("Selecciona el tipo de vínculo con el acudiente seleccionado.")
      return
    }

    setSaving(true)
    try {
      const record = await onCreateChild({
        child: {
          ...form,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          sex: form.sex === "" ? null : String(form.sex),
          documentType:
            form.documentType === "" ? null : String(form.documentType),
          statusId: form.statusId === "" ? null : String(form.statusId),
        },
        relationship: relationship.guardianId
          ? {
              ...relationship,
              guardianId: relationship.guardianId,
              guardianshipType: relationship.guardianshipType,
              startDate: relationship.startDate || null,
              endDate: relationship.endDate || null,
            }
          : null,
      })
      onCreated(record)
    } catch (requestError) {
      setError(requestError.message || "No fue posible crear el beneficiario.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <DialogShell
      title="Agregar beneficiario"
      description="Los campos corresponden al registro de children y a su relación opcional con un acudiente."
      onClose={onClose}
    >
      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {error && <DialogError>{error}</DialogError>}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Nombres *"
              value={form.firstName}
              onChange={(event) => update("firstName", event.target.value)}
              required
            />
            <Field
              label="Apellidos *"
              value={form.lastName}
              onChange={(event) => update("lastName", event.target.value)}
              required
            />
            <Field
              label="Fecha de nacimiento"
              type="date"
              value={form.birthDate}
              onChange={(event) => update("birthDate", event.target.value)}
            />
            <SelectField
              label="Sexo"
              value={form.sex}
              onChange={(event) => update("sex", event.target.value)}
            >
              <option value="">Selecciona el sexo</option>
              {catalogs.sexes?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="Tipo de documento"
              value={form.documentType}
              onChange={(event) => update("documentType", event.target.value)}
            >
              <option value="">Selecciona el tipo de documento</option>
              {catalogs.document_types?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </SelectField>
            <Field
              label="Número de documento"
              value={form.documentNumber}
              onChange={(event) => update("documentNumber", event.target.value)}
            />
            <Field
              label="Fecha de ingreso"
              type="date"
              value={form.admissionDate}
              onChange={(event) => update("admissionDate", event.target.value)}
            />
            <Field
              label="Fecha de retiro"
              type="date"
              value={form.exitDate}
              onChange={(event) => update("exitDate", event.target.value)}
            />
            <SelectField
              label="Estado del beneficiario"
              value={form.statusId}
              onChange={(event) => update("statusId", event.target.value)}
            >
              <option value="">Selecciona el estado</option>
              {catalogs.child_statuses?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </SelectField>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="field-child-guardian"
                  className="text-[15px] font-bold text-foreground"
                >
                  Acudiente (opcional)
                </label>
                {onCreateGuardian && (
                  <button
                    type="button"
                    onClick={() => setShowCreateGuardian(true)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    + Registrar nuevo acudiente
                  </button>
                )}
              </div>
              <div className="relative block">
                <select
                  id="field-child-guardian"
                  value={relationship.guardianId}
                  onChange={(event) =>
                    setRelationship((current) => ({
                      ...current,
                      guardianId: event.target.value,
                    }))
                  }
                  className="min-h-12 w-full appearance-none rounded-xl border border-border bg-surface px-4 pr-10 text-base text-foreground outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
                >
                  <option value="">Sin acudiente vinculado</option>
                  {guardians.map((guardian) => (
                    <option
                      key={guardian.guardianId}
                      value={guardian.guardianId}
                    >
                      {guardian.fullName}{" "}
                      {guardian.documentNumber
                        ? `(${guardian.documentNumber})`
                        : ""}
                    </option>
                  ))}
                </select>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 9l6 6 6-6"
                  />
                </svg>
              </div>
            </div>
            {relationship.guardianId && (
              <>
                <SelectField
                  label="Tipo de vínculo *"
                  value={relationship.guardianshipType}
                  onChange={(event) =>
                    setRelationship((current) => ({
                      ...current,
                      guardianshipType: event.target.value,
                    }))
                  }
                  required
                >
                  <option value="">Selecciona el tipo de vínculo</option>
                  {catalogs.guardianship_types?.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </SelectField>
                <Field
                  label="Inicio del vínculo"
                  type="date"
                  value={relationship.startDate}
                  onChange={(event) =>
                    setRelationship((current) => ({
                      ...current,
                      startDate: event.target.value,
                    }))
                  }
                />
                <Field
                  label="Fin del vínculo"
                  type="date"
                  value={relationship.endDate}
                  onChange={(event) =>
                    setRelationship((current) => ({
                      ...current,
                      endDate: event.target.value,
                    }))
                  }
                />
              </>
            )}
            <div className="sm:col-span-2">
              <TextArea
                label="Observaciones"
                rows={3}
                value={form.notes}
                onChange={(event) => update("notes", event.target.value)}
              />
            </div>
          </div>
        </div>
        <footer className="flex justify-end gap-3 border-t border-border p-4 sm:px-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            Guardar beneficiario
          </Button>
        </footer>
      </form>
    </DialogShell>
    {showCreateGuardian && (
      <CreateGuardianDialog
        onClose={() => setShowCreateGuardian(false)}
        onCreateGuardian={onCreateGuardian}
        onCreated={(newGuardian) => {
          setShowCreateGuardian(false)
          if (newGuardian?.guardianId) {
            setRelationship((current) => ({
              ...current,
              guardianId: String(newGuardian.guardianId),
            }))
          }
        }}
      />
    )}
    </>
  )
}

export function EditChildDialog({ child, onClose, onSave }) {
  const { catalogs } = useCatalogs([
    "sexes",
    "document_types",
    "child_statuses",
  ])
  const [form, setForm] = useState({
    firstName: child.firstName ?? "",
    lastName: child.lastName ?? "",
    birthDate: child.birthDate ?? "",
    sex: child.sexId ?? "",
    documentType: child.documentTypeId ?? "",
    documentNumber: child.documentNumber ?? "",
    admissionDate: child.admissionDate ?? "",
    exitDate: child.exitDate ?? "",
    statusId: child.statusId ?? "",
    notes: child.notes ?? "",
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const update = (key, value) => setForm((c) => ({ ...c, [key]: value }))

  const submit = async (event) => {
    event.preventDefault()
    setError("")
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("Nombres y apellidos son obligatorios.")
      return
    }

    setSaving(true)
    try {
      const result = await onSave({
        ...form,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        sex: form.sex === "" ? null : String(form.sex),
        documentType:
          form.documentType === "" ? null : String(form.documentType),
        statusId: form.statusId === "" ? null : String(form.statusId),
        exitDate: form.exitDate || null,
      })
      if (result && !result.ok) {
        setError(result.message)
      } else {
        onClose()
      }
    } catch (requestError) {
      setError(
        requestError.message || "No fue posible actualizar el beneficiario.",
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <DialogShell
      title="Editar beneficiario"
      description={`Actualizar los datos registrados de ${child.firstName} ${child.lastName}.`}
      onClose={onClose}
    >
      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {error && <DialogError>{error}</DialogError>}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Nombres *"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              required
            />
            <Field
              label="Apellidos *"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              required
            />
            <Field
              label="Fecha de nacimiento"
              type="date"
              value={form.birthDate}
              onChange={(e) => update("birthDate", e.target.value)}
            />
            <SelectField
              label="Sexo"
              value={form.sex}
              onChange={(e) => update("sex", e.target.value)}
            >
              <option value="">Selecciona el sexo</option>
              {catalogs.sexes?.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="Tipo de documento"
              value={form.documentType}
              onChange={(e) => update("documentType", e.target.value)}
            >
              <option value="">Selecciona el tipo de documento</option>
              {catalogs.document_types?.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </SelectField>
            <Field
              label="Número de documento"
              value={form.documentNumber}
              onChange={(e) => update("documentNumber", e.target.value)}
            />
            <Field
              label="Fecha de ingreso"
              type="date"
              value={form.admissionDate}
              onChange={(e) => update("admissionDate", e.target.value)}
            />
            <Field
              label="Fecha de retiro"
              type="date"
              value={form.exitDate}
              onChange={(e) => update("exitDate", e.target.value)}
            />
            <SelectField
              label="Estado del beneficiario"
              value={form.statusId}
              onChange={(e) => update("statusId", e.target.value)}
            >
              <option value="">Selecciona el estado</option>
              {catalogs.child_statuses?.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </SelectField>
            <div className="sm:col-span-2">
              <TextArea
                label="Observaciones"
                rows={3}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
              />
            </div>
          </div>
        </div>
        <footer className="flex justify-end gap-3 border-t border-border p-4 sm:px-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            Guardar cambios
          </Button>
        </footer>
      </form>
    </DialogShell>
  )
}

export function ChildGuardianDialog({
  child,
  guardians = [],
  onClose,
  onSave,
  onCreateGuardian,
}) {
  const { catalogs } = useCatalogs(["guardianship_types"])
  const [form, setForm] = useState({
    guardianId: "",
    guardianshipTypeId: "",
    startDate: "",
    endDate: "",
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [showCreateGuardian, setShowCreateGuardian] = useState(false)

  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event) => {
    event.preventDefault()
    setError("")
    if (!form.guardianId) {
      setError("Debes seleccionar un acudiente.")
      return
    }
    if (!form.guardianshipTypeId) {
      setError("Debes seleccionar el tipo de vínculo.")
      return
    }
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      setError("La fecha de fin no puede ser anterior a la fecha de inicio.")
      return
    }

    setSaving(true)
    try {
      await onSave({
        childId: child.childId,
        guardianId: form.guardianId,
        guardianshipTypeId: form.guardianshipTypeId,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      })
      onClose()
    } catch (requestError) {
      setError(requestError.message || "No fue posible crear el vínculo.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <DialogShell
        title="Vincular acudiente"
        description={`Asignar un acudiente responsable para ${child.firstName} ${child.lastName}.`}
        onClose={onClose}
      >
        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
            {error && <DialogError>{error}</DialogError>}

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="field-rel-guardian"
                  className="text-[15px] font-bold text-foreground"
                >
                  Acudiente *
                </label>
                {onCreateGuardian && (
                  <button
                    type="button"
                    onClick={() => setShowCreateGuardian(true)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    + Registrar nuevo acudiente
                  </button>
                )}
              </div>
              <div className="relative block">
                <select
                  id="field-rel-guardian"
                  value={form.guardianId}
                  onChange={(event) => update("guardianId", event.target.value)}
                  required
                  className="min-h-12 w-full appearance-none rounded-xl border border-border bg-surface px-4 pr-10 text-base text-foreground outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
                >
                  <option value="">Selecciona el acudiente</option>
                  {guardians.map((guardian) => (
                    <option
                      key={guardian.guardianId}
                      value={guardian.guardianId}
                    >
                      {guardian.fullName}{" "}
                      {guardian.documentNumber
                        ? `(${guardian.documentNumber})`
                        : ""}
                    </option>
                  ))}
                </select>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 9l6 6 6-6"
                  />
                </svg>
              </div>
            </div>

            <SelectField
              label="Tipo de vínculo *"
              value={form.guardianshipTypeId}
              onChange={(event) =>
                update("guardianshipTypeId", event.target.value)
              }
              required
            >
              <option value="">Selecciona el tipo de vínculo</option>
              {catalogs.guardianship_types?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </SelectField>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Inicio del vínculo"
                type="date"
                value={form.startDate}
                onChange={(event) => update("startDate", event.target.value)}
              />
              <Field
                label="Fin del vínculo"
                type="date"
                value={form.endDate}
                onChange={(event) => update("endDate", event.target.value)}
              />
            </div>
          </div>

          <footer className="flex justify-end gap-3 border-t border-border p-4 sm:px-6">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              Vincular acudiente
            </Button>
          </footer>
        </form>
      </DialogShell>

      {showCreateGuardian && (
        <CreateGuardianDialog
          onClose={() => setShowCreateGuardian(false)}
          onCreateGuardian={onCreateGuardian}
          onCreated={(newGuardian) => {
            setShowCreateGuardian(false)
            if (newGuardian?.guardianId) {
              update("guardianId", String(newGuardian.guardianId))
            }
          }}
        />
      )}
    </>
  )
}

export function GuardianChildDialog({
  guardian,
  children = [],
  onClose,
  onSave,
  onCreateChild,
}) {
  const { catalogs } = useCatalogs(["guardianship_types"])
  const [form, setForm] = useState({
    childId: "",
    guardianshipTypeId: "",
    startDate: "",
    endDate: "",
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [showCreateChild, setShowCreateChild] = useState(false)

  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event) => {
    event.preventDefault()
    setError("")
    if (!form.childId) {
      setError("Debes seleccionar un beneficiario.")
      return
    }
    if (!form.guardianshipTypeId) {
      setError("Debes seleccionar el tipo de vínculo.")
      return
    }
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      setError("La fecha de fin no puede ser anterior a la fecha de inicio.")
      return
    }

    setSaving(true)
    try {
      await onSave({
        childId: form.childId,
        guardianId: guardian.guardianId,
        guardianshipTypeId: form.guardianshipTypeId,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      })
      onClose()
    } catch (requestError) {
      setError(requestError.message || "No fue posible crear el vínculo.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <DialogShell
        title="Vincular beneficiario"
        description={`Asignar un beneficiario a cargo de ${guardian.fullName}.`}
        onClose={onClose}
      >
        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
            {error && <DialogError>{error}</DialogError>}

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="field-rel-child"
                  className="text-[15px] font-bold text-foreground"
                >
                  Beneficiario *
                </label>
                {onCreateChild && (
                  <button
                    type="button"
                    onClick={() => setShowCreateChild(true)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    + Registrar nuevo beneficiario
                  </button>
                )}
              </div>
              <div className="relative block">
                <select
                  id="field-rel-child"
                  value={form.childId}
                  onChange={(event) => update("childId", event.target.value)}
                  required
                  className="min-h-12 w-full appearance-none rounded-xl border border-border bg-surface px-4 pr-10 text-base text-foreground outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
                >
                  <option value="">Selecciona el beneficiario</option>
                  {children.map((child) => (
                    <option key={child.childId} value={child.childId}>
                      {child.firstName} {child.lastName}{" "}
                      {child.documentNumber ? `(${child.documentNumber})` : ""}
                    </option>
                  ))}
                </select>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 9l6 6 6-6"
                  />
                </svg>
              </div>
            </div>

            <SelectField
              label="Tipo de vínculo *"
              value={form.guardianshipTypeId}
              onChange={(event) =>
                update("guardianshipTypeId", event.target.value)
              }
              required
            >
              <option value="">Selecciona el tipo de vínculo</option>
              {catalogs.guardianship_types?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </SelectField>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Inicio del vínculo"
                type="date"
                value={form.startDate}
                onChange={(event) => update("startDate", event.target.value)}
              />
              <Field
                label="Fin del vínculo"
                type="date"
                value={form.endDate}
                onChange={(event) => update("endDate", event.target.value)}
              />
            </div>
          </div>

          <footer className="flex justify-end gap-3 border-t border-border p-4 sm:px-6">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              Vincular beneficiario
            </Button>
          </footer>
        </form>
      </DialogShell>

      {showCreateChild && (
        <CreateChildDialog
          guardians={[]}
          onClose={() => setShowCreateChild(false)}
          onCreateChild={onCreateChild}
          onCreated={(newChild) => {
            setShowCreateChild(false)
            if (newChild?.childId) {
              update("childId", String(newChild.childId))
            }
          }}
        />
      )}
    </>
  )
}

export function CreateGuardianDialog({ onClose, onCreateGuardian, onCreated }) {
  const { catalogs } = useCatalogs(["document_types", "legal_statuses"])
  const [form, setForm] = useState({
    fullName: "",
    documentType: "",
    documentNumber: "",
    phone: "",
    address: "",
    legalStatus: "",
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event) => {
    event.preventDefault()
    setError("")
    if (!form.fullName.trim()) {
      setError("El nombre completo es obligatorio.")
      return
    }
    setSaving(true)
    try {
      onCreated(
        await onCreateGuardian({
          ...form,
          fullName: form.fullName.trim(),
          documentType: form.documentType || null,
          legalStatus: form.legalStatus || null,
        }),
      )
    } catch (requestError) {
      setError(requestError.message || "No fue posible crear el acudiente.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <DialogShell
      title="Agregar acudiente"
      description="Los campos corresponden a la tabla guardians."
      onClose={onClose}
    >
      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {error && <DialogError>{error}</DialogError>}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Nombre completo *"
              value={form.fullName}
              onChange={(event) => update("fullName", event.target.value)}
              required
            />
            <SelectField
              label="Tipo de documento"
              value={form.documentType}
              onChange={(event) => update("documentType", event.target.value)}
            >
              <option value="">Selecciona el tipo de documento</option>
              {catalogs.document_types?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </SelectField>
            <Field
              label="Número de documento"
              value={form.documentNumber}
              onChange={(event) =>
                update("documentNumber", event.target.value)
              }
            />
            <Field
              label="Teléfono"
              type="tel"
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
            />
            <Field
              label="Dirección"
              value={form.address}
              onChange={(event) => update("address", event.target.value)}
            />
            <SelectField
              label="Situación jurídica frente al niño"
              value={form.legalStatus}
              onChange={(event) => update("legalStatus", event.target.value)}
            >
              <option value="">Selecciona la situación jurídica</option>
              {catalogs.legal_statuses?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </SelectField>
          </div>
        </div>
        <footer className="flex justify-end gap-3 border-t border-border p-4 sm:px-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            Guardar acudiente
          </Button>
        </footer>
      </form>
    </DialogShell>
  )
}

export function EditGuardianDialog({ guardian, onClose, onSave }) {
  const { catalogs } = useCatalogs(["document_types", "legal_statuses"])
  const [form, setForm] = useState({
    fullName: guardian.fullName ?? "",
    documentType: guardian.documentTypeId ?? "",
    documentNumber: guardian.documentNumber ?? "",
    phone: guardian.phone ?? "",
    address: guardian.address ?? "",
    legalStatus: guardian.legalStatusId ?? "",
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const update = (key, value) => setForm((c) => ({ ...c, [key]: value }))

  const submit = async (event) => {
    event.preventDefault()
    setError("")
    if (!form.fullName.trim()) {
      setError("El nombre completo es obligatorio.")
      return
    }

    setSaving(true)
    try {
      const result = await onSave({
        ...form,
        fullName: form.fullName.trim(),
        documentType: form.documentType || null,
        legalStatus: form.legalStatus || null,
      })
      if (result && !result.ok) {
        setError(result.message)
      } else {
        onClose()
      }
    } catch (requestError) {
      setError(
        requestError.message || "No fue posible actualizar el acudiente.",
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <DialogShell
      title="Editar acudiente"
      description={`Actualizar los datos registrados de ${guardian.fullName}.`}
      onClose={onClose}
    >
      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {error && <DialogError>{error}</DialogError>}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Nombre completo *"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              required
            />
            <SelectField
              label="Tipo de documento"
              value={form.documentType}
              onChange={(e) => update("documentType", e.target.value)}
            >
              <option value="">Selecciona el tipo de documento</option>
              {catalogs.document_types?.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </SelectField>
            <Field
              label="Número de documento"
              value={form.documentNumber}
              onChange={(e) => update("documentNumber", e.target.value)}
            />
            <Field
              label="Teléfono"
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
            <Field
              label="Dirección"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
            <SelectField
              label="Situación jurídica frente al niño"
              value={form.legalStatus}
              onChange={(e) => update("legalStatus", e.target.value)}
            >
              <option value="">Selecciona la situación jurídica</option>
              {catalogs.legal_statuses?.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </SelectField>
          </div>
        </div>
        <footer className="flex justify-end gap-3 border-t border-border p-4 sm:px-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            Guardar cambios
          </Button>
        </footer>
      </form>
    </DialogShell>
  )
}

export function CreateTuitionDialog({ children = [], onClose, onCreateTuition, onCreated }) {
  const { catalogs } = useCatalogs(["payment_methods", "tuition_statuses"])
  const [form, setForm] = useState({
    childId: "",
    amount: "",
    paidDate: new Date().toISOString().slice(0, 10),
    paymentMethodId: "",
    tuitionStatusId: "",
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event) => {
    event.preventDefault()
    setError("")
    if (!form.childId) {
      setError("Debes seleccionar un beneficiario.")
      return
    }
    setSaving(true)
    try {
      const record = await onCreateTuition({
        child_id: form.childId,
        amount: form.amount ? Number(form.amount) : null,
        paid_date: form.paidDate || null,
        payment_method_id: form.paymentMethodId || null,
        tuition_status_id: form.tuitionStatusId || null,
      })
      onCreated(record)
    } catch (requestError) {
      setError(requestError.message || "No fue posible registrar la matrícula.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <DialogShell
      title="Registrar pago de matrícula"
      description="Los campos corresponden a la tabla tuition."
      onClose={onClose}
    >
      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {error && <DialogError>{error}</DialogError>}
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Beneficiario *"
              value={form.childId}
              onChange={(event) => update("childId", event.target.value)}
              required
            >
              <option value="">Selecciona el beneficiario</option>
              {children.map((child) => (
                <option key={child.childId} value={child.childId}>
                  {child.firstName} {child.lastName}
                </option>
              ))}
            </SelectField>
            <Field
              label="Monto en COP"
              type="number"
              value={form.amount}
              onChange={(event) => update("amount", event.target.value)}
              placeholder="Ej. 150000"
            />
            <Field
              label="Fecha de pago"
              type="date"
              value={form.paidDate}
              onChange={(event) => update("paidDate", event.target.value)}
            />
            <SelectField
              label="Medio de pago"
              value={form.paymentMethodId}
              onChange={(event) => update("paymentMethodId", event.target.value)}
            >
              <option value="">Selecciona el medio de pago</option>
              {catalogs.payment_methods?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="Estado del pago"
              value={form.tuitionStatusId}
              onChange={(event) => update("tuitionStatusId", event.target.value)}
            >
              <option value="">Selecciona el estado</option>
              {catalogs.tuition_statuses?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </SelectField>
          </div>
        </div>
        <footer className="flex justify-end gap-3 border-t border-border p-4 sm:px-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            Guardar pago
          </Button>
        </footer>
      </form>
    </DialogShell>
  )
}

export function CreateStaffDialog({ onClose, onCreateStaff, onCreated }) {
  const { catalogs } = useCatalogs([
    "document_types",
    "staff_roles",
    "contract_types",
    "staff_statuses",
  ])
  const [form, setForm] = useState({
    fullName: "",
    documentTypeId: "",
    documentNumber: "",
    staffRoleId: "",
    hireDate: "",
    contractTypeId: "",
    staffStatusId: "",
    phone: "",
    email: "",
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event) => {
    event.preventDefault()
    setError("")
    if (!form.fullName.trim()) {
      setError("El nombre completo es obligatorio.")
      return
    }
    setSaving(true)
    try {
      const record = await onCreateStaff({
        full_name: form.fullName.trim(),
        document_type_id: form.documentTypeId || null,
        document_number: form.documentNumber.trim() || null,
        staff_role_id: form.staffRoleId || null,
        hire_date: form.hireDate || null,
        contract_type_id: form.contractTypeId || null,
        staff_status_id: form.staffStatusId || null,
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
      })
      onCreated(record)
    } catch (requestError) {
      setError(requestError.message || "No fue posible crear el colaborador.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <DialogShell
      title="Agregar colaborador"
      description="Los campos corresponden a la tabla staff."
      onClose={onClose}
    >
      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {error && <DialogError>{error}</DialogError>}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Nombre completo *"
              value={form.fullName}
              onChange={(event) => update("fullName", event.target.value)}
              required
            />
            <SelectField
              label="Tipo de documento"
              value={form.documentTypeId}
              onChange={(event) => update("documentTypeId", event.target.value)}
            >
              <option value="">Selecciona el tipo de documento</option>
              {catalogs.document_types?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </SelectField>
            <Field
              label="Número de documento"
              value={form.documentNumber}
              onChange={(event) => update("documentNumber", event.target.value)}
            />
            <SelectField
              label="Cargo / Rol"
              value={form.staffRoleId}
              onChange={(event) => update("staffRoleId", event.target.value)}
            >
              <option value="">Selecciona el cargo o rol</option>
              {catalogs.staff_roles?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </SelectField>
            <Field
              label="Fecha de vinculación"
              type="date"
              value={form.hireDate}
              onChange={(event) => update("hireDate", event.target.value)}
            />
            <SelectField
              label="Tipo de contrato"
              value={form.contractTypeId}
              onChange={(event) => update("contractTypeId", event.target.value)}
            >
              <option value="">Selecciona el tipo de contrato</option>
              {catalogs.contract_types?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="Estado laboral"
              value={form.staffStatusId}
              onChange={(event) => update("staffStatusId", event.target.value)}
            >
              <option value="">Selecciona el estado laboral</option>
              {catalogs.staff_statuses?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </SelectField>
            <Field
              label="Teléfono"
              type="tel"
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
            />
            <div className="sm:col-span-2">
              <Field
                label="Correo electrónico"
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
              />
            </div>
          </div>
        </div>
        <footer className="flex justify-end gap-3 border-t border-border p-4 sm:px-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            Guardar colaborador
          </Button>
        </footer>
      </form>
    </DialogShell>
  )
}

export function ChildRecordDialog({
  record,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({
    eps: record?.eps ?? "",
    state: record?.state ?? "",
    ipsAssigned: record?.ipsAssigned ?? "",
    allergies: record?.allergies ?? "",
    mealRestrictions: record?.mealRestrictions ?? "",
    medicines: record?.medicines ?? "",
    specialConditions: record?.specialConditions ?? "",
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event) => {
    event.preventDefault()
    setError("")
    setSaving(true)
    try {
      await onSave(form)
      onClose()
    } catch (requestError) {
      setError(
        requestError.message || "No fue posible guardar la ficha de salud.",
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <DialogShell
      title={record ? "Editar ficha de salud" : "Agregar ficha de salud"}
      description="Completa los campos definidos para child_records."
      onClose={onClose}
    >
      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {error && <DialogError>{error}</DialogError>}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="EPS"
              value={form.eps}
              onChange={(event) => update("eps", event.target.value)}
            />
            <Field
              label="Estado de afiliación"
              value={form.state}
              onChange={(event) => update("state", event.target.value)}
            />
            <Field
              label="IPS asignada"
              value={form.ipsAssigned}
              onChange={(event) => update("ipsAssigned", event.target.value)}
            />
            <div className="sm:col-span-2">
              <TextArea
                label="Alergias"
                rows={2}
                value={form.allergies}
                onChange={(event) => update("allergies", event.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <TextArea
                label="Restricciones alimentarias"
                rows={2}
                value={form.mealRestrictions}
                onChange={(event) =>
                  update("mealRestrictions", event.target.value)
                }
              />
            </div>
            <div className="sm:col-span-2">
              <TextArea
                label="Medicamentos"
                rows={3}
                value={form.medicines}
                onChange={(event) => update("medicines", event.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <TextArea
                label="Condiciones especiales de salud"
                rows={3}
                value={form.specialConditions}
                onChange={(event) =>
                  update("specialConditions", event.target.value)
                }
              />
            </div>
          </div>
        </div>
        <footer className="flex justify-end gap-3 border-t border-border p-4 sm:px-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            Guardar ficha
          </Button>
        </footer>
      </form>
    </DialogShell>
  )
}

export function ChildInternalDescriptionDialog({
  description,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({
    communicationWays: description?.communicationWays ?? "",
    dailyRoutineHelp: description?.dailyRoutineHelp ?? "",
    likings: description?.likings ?? "",
    crisisManagement: description?.crisisManagement ?? "",
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event) => {
    event.preventDefault()
    setError("")
    setSaving(true)
    try {
      await onSave(form)
      onClose()
    } catch (requestError) {
      setError(
        requestError.message ||
          "No fue posible guardar la descripción interna.",
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <DialogShell
      title={description ? "Editar descripción interna" : "Agregar descripción interna"}
      description="Campos de child_internal_description."
      onClose={onClose}
    >
      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {error && <DialogError>{error}</DialogError>}
          <TextArea
            label="Formas de comunicación"
            rows={3}
            value={form.communicationWays}
            onChange={(event) =>
              update("communicationWays", event.target.value)
            }
          />
          <TextArea
            label="Apoyos para la rutina diaria"
            rows={3}
            value={form.dailyRoutineHelp}
            onChange={(event) => update("dailyRoutineHelp", event.target.value)}
          />
          <TextArea
            label="Gustos e intereses"
            rows={3}
            value={form.likings}
            onChange={(event) => update("likings", event.target.value)}
          />
          <TextArea
            label="Manejo de crisis"
            rows={3}
            value={form.crisisManagement}
            onChange={(event) => update("crisisManagement", event.target.value)}
          />
        </div>
        <footer className="flex justify-end gap-3 border-t border-border p-4 sm:px-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            Guardar descripción
          </Button>
        </footer>
      </form>
    </DialogShell>
  )
}

export function ChildrenAssistanceDialog({ assistance, onClose, onSave }) {
  const [form, setForm] = useState({
    professionalWorkshopId: assistance?.professionalWorkshopId ?? "",
    willAssist: assistance?.willAssist ?? false,
    asisted: assistance?.asisted ?? false,
    completeWorkshop: assistance?.completeWorkshop ?? false,
    behavior: assistance?.behavior ?? "",
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event) => {
    event.preventDefault()
    setError("")
    if (!form.professionalWorkshopId.trim()) {
      setError("El identificador de la sesión del taller es obligatorio.")
      return
    }
    setSaving(true)
    try {
      await onSave(form)
      onClose()
    } catch (requestError) {
      setError(
        requestError.message || "No fue posible guardar la asistencia.",
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <DialogShell
      title={assistance ? "Editar asistencia" : "Agregar asistencia"}
      description="Campos de children_assistance. Ingresa el ID de la sesión de taller (professional_workshop_id)."
      onClose={onClose}
    >
      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {error && <DialogError>{error}</DialogError>}
          <Field
            label="ID de sesión de taller *"
            inputMode="numeric"
            value={form.professionalWorkshopId}
            onChange={(event) =>
              update("professionalWorkshopId", event.target.value)
            }
            required
          />
          {[
            ["willAssist", "Confirmó que asistirá"],
            ["asisted", "Asistió"],
            ["completeWorkshop", "Completó el taller"],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-3 font-semibold">
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(event) => update(key, event.target.checked)}
                className="size-5 accent-primary"
              />
              {label}
            </label>
          ))}
          <TextArea
            label="Comportamiento durante la sesión"
            rows={4}
            value={form.behavior}
            onChange={(event) => update("behavior", event.target.value)}
          />
        </div>
        <footer className="flex justify-end gap-3 border-t border-border p-4 sm:px-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            Guardar asistencia
          </Button>
        </footer>
      </form>
    </DialogShell>
  )
}

export function DeletePersonDialog({ kind, name, onClose, onConfirm }) {
  const [error, setError] = useState("")
  const label =
    kind === "guardian"
      ? "acudiente"
      : kind === "record"
        ? "ficha de salud"
        : kind === "assistance"
          ? "asistencia"
          : kind === "description"
            ? "descripción interna"
          : kind === "relationship"
            ? "vínculo"
        : "beneficiario"

  const confirm = async () => {
    setError("")
    try {
      const result = await onConfirm()
      if (result && !result.ok) setError(result.message)
    } catch (requestError) {
      setError(requestError.message || "No fue posible eliminar el registro.")
    }
  }

  return (
    <DialogShell
      title={`Eliminar ${label}`}
      onClose={onClose}
    >
      <div className="p-5 sm:p-6">
        <p className="font-bold">¿Deseas eliminar el registro de {name}?</p>
        {error && <div className="mt-4"><DialogError>{error}</DialogError></div>}
      </div>
      <footer className="flex gap-3 border-t border-border p-4 sm:px-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={confirm}
          className="flex-1"
        >
          Confirmar eliminación
        </Button>
      </footer>
    </DialogShell>
  )
}
