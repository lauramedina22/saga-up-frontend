import { useState } from "react"
import { Button, Field, SelectField, TextArea } from "./ui"

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
  onCreated,
}) {
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
    if (relationship.guardianId && !relationship.guardianshipType.trim()) {
      setError("Indica el tipo de vínculo con el acudiente seleccionado.")
      return
    }

    setSaving(true)
    try {
      const record = await onCreateChild({
        child: {
          ...form,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          sex: form.sex === "" ? null : Number(form.sex),
          documentType:
            form.documentType === "" ? null : Number(form.documentType),
          statusId: form.statusId === "" ? null : Number(form.statusId),
        },
        relationship: relationship.guardianId
          ? {
              ...relationship,
              guardianId: relationship.guardianId,
              guardianshipType: relationship.guardianshipType.trim(),
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
            <Field
              label="Sexo (código)"
              type="number"
              value={form.sex}
              onChange={(event) => update("sex", event.target.value)}
            />
            <Field
              label="Tipo de documento (código)"
              type="number"
              value={form.documentType}
              onChange={(event) => update("documentType", event.target.value)}
            />
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
            <Field
              label="Estado (código)"
              type="number"
              value={form.statusId}
              onChange={(event) => update("statusId", event.target.value)}
            />
            <SelectField
              label="Acudiente (opcional)"
              value={relationship.guardianId}
              onChange={(event) =>
                setRelationship((current) => ({
                  ...current,
                  guardianId: event.target.value,
                }))
              }
            >
              <option value="">Sin acudiente vinculado</option>
              {guardians.map((guardian) => (
                <option
                  key={guardian.guardianId}
                  value={guardian.guardianId}
                >
                  {guardian.fullName}
                </option>
              ))}
            </SelectField>
            {relationship.guardianId && (
              <>
                <Field
                  label="Tipo de vínculo"
                  value={relationship.guardianshipType}
                  onChange={(event) =>
                    setRelationship((current) => ({
                      ...current,
                      guardianshipType: event.target.value,
                    }))
                  }
                  required
                />
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
  )
}

export function CreateGuardianDialog({ onClose, onCreateGuardian, onCreated }) {
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
            <Field
              label="Tipo de documento"
              value={form.documentType}
              onChange={(event) => update("documentType", event.target.value)}
            />
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
            <Field
              label="Situación jurídica frente al niño"
              value={form.legalStatus}
              onChange={(event) => update("legalStatus", event.target.value)}
            />
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
