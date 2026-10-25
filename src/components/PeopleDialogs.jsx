import { useRef, useState } from "react"
import { Button, Field, Icon, TextArea } from "./ui"

const closePath = "M6 18L18 6M6 6l12 12"
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^\+?[\d\s()-]{7,20}$/

function DialogShell({
  title,
  description,
  children,
  onClose,
  size = "lg",
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4"
    >
      <section
        className={`flex max-h-[95dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-border bg-surface shadow-dialog sm:rounded-3xl ${
          size === "sm" ? "sm:max-w-md" : "sm:max-w-3xl"
        }`}
      >
        <header className="flex items-start gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <h2 id="dialog-title" className="text-2xl font-extrabold">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-muted">{description}</p>
            )}
          </div>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="flex size-11 shrink-0 items-center justify-center rounded-xl text-muted hover:bg-surface-muted hover:text-foreground"
          >
            <Icon path={closePath} />
          </button>
        </header>
        {children}
      </section>
    </div>
  )
}

function Section({
  title,
  description,
  children,
}) {
  return (
    <fieldset className="rounded-2xl border border-border p-4 sm:p-5">
      <legend className="px-2 font-heading text-lg font-extrabold">
        {title}
      </legend>
      {description && <p className="mb-4 text-sm text-muted">{description}</p>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  )
}

function SelectField({
  id,
  label,
  value,
  onChange,
  children,
  error,
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-[15px] font-bold text-foreground">
        {label}
      </span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className={`min-h-12 w-full rounded-xl border bg-surface px-4 text-base outline-none focus:border-primary focus:ring-3 focus:ring-primary/15 ${
          error ? "border-danger" : "border-border"
        }`}
      >
        {children}
      </select>
      {error && (
        <span className="mt-1.5 block text-sm font-semibold text-danger">
          {error}
        </span>
      )}
    </label>
  )
}

const emptyChild = {
  nombres: "",
  apellidos: "",
  tipoDocumento: "",
  numeroDocumento: "",
  fechaNacimiento: "",
  direccion: "",
  barrio: "",
  ciudad: "",
  guardianId: "",
  estadoMatricula: "pendiente",
  anioMatricula: String(new Date().getFullYear()),
  observaciones: "",
  eps: "",
  condicionesSalud: "",
  alergias: "",
  medicamentos: "",
  restriccionesAlimentarias: "",
  apoyos: "",
  contactoEmergencia: "",
  autorizadosRecoger: "",
}

const emptyGuardian = {
  nombres: "",
  apellidos: "",
  parentesco: "",
  telefono: "",
  whatsapp: "",
  correo: "",
}

export function CreateChildDialog({
  onClose,
  onCreated,
  guardians,
  onCreateChild,
  onCreateChildWithGuardian,
}) {
  const [form, setForm] = useState(emptyChild)
  const [guardian, setGuardian] = useState(emptyGuardian)
  const [newGuardian, setNewGuardian] = useState(false)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const savingRef = useRef(false)
  const [touched, setTouched] = useState(false)
  const dirty = touched

  const requestClose = () => {
    if (
      !dirty ||
      window.confirm("Hay cambios sin guardar. ¿Deseas cerrar el formulario?")
    ) {
      onClose()
    }
  }

  const update = (key, value) => {
    setTouched(true)
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: "" }))
  }

  const handlePhoto = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 300_000) {
      setErrors((current) => ({
        ...current,
        foto: "La foto debe pesar menos de 300 KB.",
      }))
      return
    }
    const reader = new FileReader()
    reader.onload = () => update("foto", String(reader.result))
    reader.readAsDataURL(file)
  }

  const submit = async (event) => {
    event.preventDefault()
    if (savingRef.current) return
    const nextErrors = {}
    if (!form.nombres.trim()) nextErrors.nombres = "Escribe los nombres."
    if (!form.apellidos.trim()) nextErrors.apellidos = "Escribe los apellidos."
    if (!form.fechaNacimiento)
      nextErrors.fechaNacimiento = "Selecciona la fecha de nacimiento."
    if (form.fechaNacimiento > new Date().toISOString().slice(0, 10)) {
      nextErrors.fechaNacimiento = "La fecha no puede estar en el futuro."
    }
    if (!form.direccion.trim()) nextErrors.direccion = "Escribe la dirección."
    if (!form.ciudad.trim()) nextErrors.ciudad = "Escribe la ciudad."
    if (newGuardian) {
      if (!guardian.nombres.trim())
        nextErrors.guardianNombres = "Escribe los nombres."
      if (!guardian.apellidos.trim())
        nextErrors.guardianApellidos = "Escribe los apellidos."
      if (!guardian.parentesco.trim())
        nextErrors.parentesco = "Indica el parentesco."
      if (!phonePattern.test(guardian.telefono))
        nextErrors.telefono = "Revisa el teléfono."
      if (!phonePattern.test(guardian.whatsapp))
        nextErrors.whatsapp = "Revisa el WhatsApp."
      if (!emailPattern.test(guardian.correo))
        nextErrors.correo = "Revisa el correo."
    } else if (!form.guardianId) {
      nextErrors.guardianId = "Selecciona un acudiente."
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    savingRef.current = true
    setSaving(true)
    try {
      const payload = {
        nombres: form.nombres,
        apellidos: form.apellidos,
        tipoDocumento: form.tipoDocumento || undefined,
        numeroDocumento: form.numeroDocumento || undefined,
        fechaNacimiento: form.fechaNacimiento,
        direccion: form.direccion,
        barrio: form.barrio || undefined,
        ciudad: form.ciudad,
        estadoMatricula: form.estadoMatricula,
        anioMatricula: Number(form.anioMatricula) || undefined,
        observaciones: form.observaciones || undefined,
        eps: form.eps || undefined,
        condicionesSalud: form.condicionesSalud || undefined,
        alergias: form.alergias || undefined,
        medicamentos: form.medicamentos || undefined,
        restriccionesAlimentarias: form.restriccionesAlimentarias || undefined,
        apoyos: form.apoyos || undefined,
        contactoEmergencia: form.contactoEmergencia || undefined,
        autorizadosRecoger: form.autorizadosRecoger || undefined,
        foto: form.foto,
      }
      const record = await (newGuardian
        ? onCreateChildWithGuardian(payload, {
            ...guardian,
            datosConfirmados: false,
            canalPreferido: "WhatsApp",
          })
        : onCreateChild({ ...payload, guardianId: form.guardianId }))
      onCreated(record)
    } catch (error) {
      if (error?.field) {
        setErrors((current) => ({ ...current, [error.field]: error.message }))
      } else {
        setErrors((current) => ({
          ...current,
          form:
            error.message ||
            "No fue posible guardar el registro. Intenta nuevamente.",
        }))
      }
      savingRef.current = false
      setSaving(false)
    }
  }

  return (
    <DialogShell
      title="Agregar beneficiario"
      description="Los datos de salud son opcionales y solo deben registrarse si están autorizados."
      onClose={requestClose}
    >
      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {errors.form && (
            <div
              role="alert"
              className="rounded-xl bg-danger-soft p-3 text-sm font-bold text-danger"
            >
              {errors.form}
            </div>
          )}
          <Section title="Datos personales">
            <Field
              label="Nombres *"
              value={form.nombres}
              onChange={(e) => update("nombres", e.target.value)}
              error={errors.nombres}
            />
            <Field
              label="Apellidos *"
              value={form.apellidos}
              onChange={(e) => update("apellidos", e.target.value)}
              error={errors.apellidos}
            />
            <SelectField
              id="child-document-type"
              label="Tipo de documento"
              value={form.tipoDocumento}
              onChange={(value) => update("tipoDocumento", value)}
            >
              <option value="">No aplica / sin registrar</option>
              <option>Registro civil</option>
              <option>Tarjeta de identidad</option>
              <option>Cédula de ciudadanía</option>
              <option>Permiso por protección temporal</option>
            </SelectField>
            <Field
              label="Número de documento"
              value={form.numeroDocumento}
              onChange={(e) => update("numeroDocumento", e.target.value)}
              error={errors.numeroDocumento}
            />
            <Field
              label="Fecha de nacimiento *"
              type="date"
              value={form.fechaNacimiento}
              onChange={(e) => update("fechaNacimiento", e.target.value)}
              error={errors.fechaNacimiento}
            />
            <Field
              label="Ciudad *"
              value={form.ciudad}
              onChange={(e) => update("ciudad", e.target.value)}
              error={errors.ciudad}
            />
            <Field
              label="Dirección *"
              value={form.direccion}
              onChange={(e) => update("direccion", e.target.value)}
              error={errors.direccion}
            />
            <Field
              label="Barrio"
              value={form.barrio}
              onChange={(e) => update("barrio", e.target.value)}
            />
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[15px] font-bold">
                Foto opcional autorizada
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="min-h-12 w-full rounded-xl border border-border bg-surface p-2 text-sm"
              />
              <span
                className={`mt-1 block text-sm ${
                  errors.foto ? "text-danger" : "text-muted"
                }`}
              >
                {errors.foto ??
                  "Máximo 300 KB. No se muestra en listados generales."}
              </span>
            </label>
          </Section>

          <Section
            title="Acudiente y contactos"
            description="Selecciona un acudiente existente o crea uno sin perder los datos de este formulario."
          >
            {!newGuardian && (
              <div className="sm:col-span-2">
                <SelectField
                  id="child-guardian"
                  label="Acudiente principal *"
                  value={form.guardianId}
                  onChange={(value) => update("guardianId", value)}
                  error={errors.guardianId}
                >
                  <option value="">Selecciona un acudiente</option>
                  {guardians.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nombre} · {item.parentesco}
                    </option>
                  ))}
                </SelectField>
              </div>
            )}
            <div className="sm:col-span-2">
              <Button
                type="button"
                variant="tertiary"
                onClick={() => {
                  setTouched(true)
                  setNewGuardian((value) => !value)
                }}
              >
                {newGuardian
                  ? "Vincular acudiente existente"
                  : "+ Crear acudiente nuevo"}
              </Button>
            </div>
            {newGuardian && (
              <>
                <Field
                  label="Nombres del acudiente *"
                  value={guardian.nombres}
                  onChange={(e) =>
                    setGuardian({ ...guardian, nombres: e.target.value })
                  }
                  error={errors.guardianNombres}
                />
                <Field
                  label="Apellidos del acudiente *"
                  value={guardian.apellidos}
                  onChange={(e) =>
                    setGuardian({ ...guardian, apellidos: e.target.value })
                  }
                  error={errors.guardianApellidos}
                />
                <Field
                  label="Parentesco *"
                  value={guardian.parentesco}
                  onChange={(e) =>
                    setGuardian({ ...guardian, parentesco: e.target.value })
                  }
                  error={errors.parentesco}
                />
                <Field
                  label="Teléfono *"
                  type="tel"
                  value={guardian.telefono}
                  onChange={(e) =>
                    setGuardian({ ...guardian, telefono: e.target.value })
                  }
                  error={errors.telefono}
                />
                <Field
                  label="WhatsApp *"
                  type="tel"
                  value={guardian.whatsapp}
                  onChange={(e) =>
                    setGuardian({ ...guardian, whatsapp: e.target.value })
                  }
                  error={errors.whatsapp}
                />
                <Field
                  label="Correo *"
                  type="email"
                  value={guardian.correo}
                  onChange={(e) =>
                    setGuardian({ ...guardian, correo: e.target.value })
                  }
                  error={errors.correo}
                />
              </>
            )}
            <Field
              label="Contacto alternativo de emergencia"
              value={form.contactoEmergencia}
              onChange={(e) => update("contactoEmergencia", e.target.value)}
            />
            <Field
              label="Personas autorizadas para recoger"
              value={form.autorizadosRecoger}
              onChange={(e) => update("autorizadosRecoger", e.target.value)}
            />
          </Section>

          <Section
            title="Salud y cuidado"
            description="Información sensible. Todos los campos de esta sección son opcionales."
          >
            <Field
              label="EPS"
              value={form.eps}
              onChange={(e) => update("eps", e.target.value)}
            />
            <Field
              label="Alergias"
              value={form.alergias}
              onChange={(e) => update("alergias", e.target.value)}
            />
            <Field
              label="Condiciones relevantes"
              value={form.condicionesSalud}
              onChange={(e) => update("condicionesSalud", e.target.value)}
            />
            <Field
              label="Medicamentos durante la jornada"
              value={form.medicamentos}
              onChange={(e) => update("medicamentos", e.target.value)}
            />
            <Field
              label="Restricciones alimentarias"
              value={form.restriccionesAlimentarias}
              onChange={(e) =>
                update("restriccionesAlimentarias", e.target.value)
              }
            />
            <Field
              label="Apoyos de comunicación o movilidad"
              value={form.apoyos}
              onChange={(e) => update("apoyos", e.target.value)}
            />
          </Section>

          <Section title="Información administrativa">
            <Field
              label="Año de matrícula"
              type="number"
              min="2000"
              max="2100"
              value={form.anioMatricula}
              onChange={(e) => update("anioMatricula", e.target.value)}
            />
            <SelectField
              id="child-enrollment-status"
              label="Estado inicial"
              value={form.estadoMatricula}
              onChange={(value) => update("estadoMatricula", value)}
            >
              <option value="pendiente">Pendiente</option>
              <option value="activa">Activa</option>
            </SelectField>
            <div className="sm:col-span-2">
              <TextArea
                label="Observaciones"
                rows={3}
                value={form.observaciones}
                onChange={(e) => update("observaciones", e.target.value)}
              />
            </div>
          </Section>
        </div>
        <footer className="flex gap-3 border-t border-border p-4 sm:justify-end sm:px-6">
          <Button
            type="button"
            variant="secondary"
            onClick={requestClose}
            className="flex-1 sm:flex-none"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={saving}
            className="flex-1 sm:flex-none"
          >
            Guardar beneficiario
          </Button>
        </footer>
      </form>
    </DialogShell>
  )
}

const emptyGuardianForm = {
  nombres: "",
  apellidos: "",
  tipoDocumento: "",
  numeroDocumento: "",
  parentesco: "",
  telefono: "",
  whatsapp: "",
  correo: "",
  direccion: "",
  barrio: "",
  canalPreferido: "WhatsApp",
  contactoEmergencia: false,
  datosConfirmados: false,
  childrenIds: [],
}

export function CreateGuardianDialog({
  onClose,
  onCreated,
  childrenRecords,
  onCreateGuardian,
}) {
  const [form, setForm] = useState(emptyGuardianForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const savingRef = useRef(false)
  const [touched, setTouched] = useState(false)
  const dirty = touched
  const update = (key, value) => {
    setTouched(true)
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: "" }))
  }
  const requestClose = () => {
    if (
      !dirty ||
      window.confirm("Hay cambios sin guardar. ¿Deseas cerrar el formulario?")
    ) {
      onClose()
    }
  }
  const toggleChild = (id) => {
    update(
      "childrenIds",
      form.childrenIds.includes(id)
        ? form.childrenIds.filter((item) => item !== id)
        : [...form.childrenIds, id],
    )
  }

  const submit = async (event) => {
    event.preventDefault()
    if (savingRef.current) return
    const nextErrors = {}
    if (!form.nombres.trim()) nextErrors.nombres = "Escribe los nombres."
    if (!form.apellidos.trim()) nextErrors.apellidos = "Escribe los apellidos."
    if (!form.parentesco.trim()) nextErrors.parentesco = "Indica el parentesco."
    if (!phonePattern.test(form.telefono))
      nextErrors.telefono = "Revisa el teléfono."
    if (!phonePattern.test(form.whatsapp))
      nextErrors.whatsapp = "Revisa el WhatsApp."
    if (!emailPattern.test(form.correo)) nextErrors.correo = "Revisa el correo."
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    savingRef.current = true
    setSaving(true)
    try {
      const record = await onCreateGuardian({
        ...form,
        tipoDocumento: form.tipoDocumento || undefined,
        numeroDocumento: form.numeroDocumento || undefined,
        direccion: form.direccion || undefined,
        barrio: form.barrio || undefined,
      })
      onCreated(record)
    } catch (error) {
      if (error?.field) {
        setErrors((current) => ({ ...current, [error.field]: error.message }))
      } else {
        setErrors((current) => ({
          ...current,
          form: error.message || "No fue posible guardar el registro.",
        }))
      }
      savingRef.current = false
      setSaving(false)
    }
  }

  return (
    <DialogShell
      title="Agregar acudiente"
      description="Puedes vincular beneficiarios ahora o hacerlo más adelante."
      onClose={requestClose}
    >
      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {errors.form && (
            <div
              role="alert"
              className="rounded-xl bg-danger-soft p-3 text-sm font-bold text-danger"
            >
              {errors.form}
            </div>
          )}
          <Section title="Información personal">
            <Field
              label="Nombres *"
              value={form.nombres}
              onChange={(e) => update("nombres", e.target.value)}
              error={errors.nombres}
            />
            <Field
              label="Apellidos *"
              value={form.apellidos}
              onChange={(e) => update("apellidos", e.target.value)}
              error={errors.apellidos}
            />
            <SelectField
              id="guardian-document-type"
              label="Tipo de documento"
              value={form.tipoDocumento}
              onChange={(value) => update("tipoDocumento", value)}
            >
              <option value="">Sin registrar</option>
              <option>Cédula de ciudadanía</option>
              <option>Cédula de extranjería</option>
              <option>Permiso por protección temporal</option>
              <option>Pasaporte</option>
            </SelectField>
            <Field
              label="Número de documento"
              value={form.numeroDocumento}
              onChange={(e) => update("numeroDocumento", e.target.value)}
              error={errors.numeroDocumento}
            />
            <Field
              label="Parentesco *"
              value={form.parentesco}
              onChange={(e) => update("parentesco", e.target.value)}
              error={errors.parentesco}
            />
          </Section>
          <Section title="Información de contacto">
            <Field
              label="Teléfono *"
              type="tel"
              value={form.telefono}
              onChange={(e) => update("telefono", e.target.value)}
              error={errors.telefono}
            />
            <Field
              label="WhatsApp *"
              type="tel"
              value={form.whatsapp}
              onChange={(e) => update("whatsapp", e.target.value)}
              error={errors.whatsapp}
            />
            <Field
              label="Correo electrónico *"
              type="email"
              value={form.correo}
              onChange={(e) => update("correo", e.target.value)}
              error={errors.correo}
            />
            <SelectField
              id="preferred-channel"
              label="Canal preferido"
              value={form.canalPreferido ?? "WhatsApp"}
              onChange={(value) =>
                update(
                  "canalPreferido",
                  value,
                )
              }
            >
              <option>WhatsApp</option>
              <option>Teléfono</option>
              <option>Correo</option>
            </SelectField>
            <Field
              label="Dirección"
              value={form.direccion}
              onChange={(e) => update("direccion", e.target.value)}
            />
            <Field
              label="Barrio"
              value={form.barrio}
              onChange={(e) => update("barrio", e.target.value)}
            />
          </Section>
          <Section
            title="Relación con los beneficiarios"
            description="La vinculación usa los identificadores internos y no cambia al acudiente principal actual."
          >
            <div className="space-y-2 sm:col-span-2">
              {childrenRecords.map((child) => (
                <label
                  key={child.id}
                  className="flex min-h-11 items-center gap-3 rounded-xl border border-border px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={form.childrenIds.includes(child.id)}
                    onChange={() => toggleChild(child.id)}
                    className="size-5 accent-primary"
                  />
                  <span className="font-semibold">{child.nombre}</span>
                </label>
              ))}
              {childrenRecords.length === 0 && (
                <p className="text-sm text-muted">
                  No hay beneficiarios registrados todavía.
                </p>
              )}
            </div>
            <label className="flex min-h-11 items-center gap-3">
              <input
                type="checkbox"
                checked={form.contactoEmergencia}
                onChange={(e) => update("contactoEmergencia", e.target.checked)}
                className="size-5 accent-primary"
              />
              <span className="text-sm font-semibold">
                Contacto de emergencia
              </span>
            </label>
            <label className="flex min-h-11 items-center gap-3">
              <input
                type="checkbox"
                checked={form.datosConfirmados}
                onChange={(e) => update("datosConfirmados", e.target.checked)}
                className="size-5 accent-primary"
              />
              <span className="text-sm font-semibold">Datos confirmados</span>
            </label>
          </Section>
        </div>
        <footer className="flex gap-3 border-t border-border p-4 sm:justify-end sm:px-6">
          <Button
            type="button"
            variant="secondary"
            onClick={requestClose}
            className="flex-1 sm:flex-none"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={saving}
            className="flex-1 sm:flex-none"
          >
            Guardar acudiente
          </Button>
        </footer>
      </form>
    </DialogShell>
  )
}

export function DeletePersonDialog({
  kind,
  name,
  onClose,
  onConfirm,
}) {
  const [error, setError] = useState("")
  const kindLabel = kind === "guardian" ? "acudiente" : kind
  const confirm = async () => {
    try {
      const result = await onConfirm()
      if (result && !result.ok) setError(result.message)
    } catch (requestError) {
      setError(requestError.message || "No fue posible eliminar el registro.")
    }
  }
  return (
    <DialogShell title={`Eliminar ${kindLabel}`} onClose={onClose} size="sm">
      <div className="p-5 sm:p-6">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-danger-soft text-danger">
          <Icon
            path="M12 9v3.75m9-1.5a9 9 0 11-18 0 9 9 0 0118 0zM12 16.5h.01"
            className="size-6"
          />
        </div>
        <p className="font-bold">¿Deseas eliminar el registro de {name}?</p>
        <p className="mt-2 text-sm text-muted">
          {kind === "beneficiario"
            ? "Esta acción puede afectar información relacionada. Se bloqueará si existen matrículas, pagos o padrinos."
            : "Se bloqueará si el acudiente continúa relacionado con uno o varios beneficiarios."}
        </p>
        {error && (
          <div
            role="alert"
            className="mt-4 rounded-xl bg-warning-soft p-3 text-sm font-bold text-warning"
          >
            {error}
          </div>
        )}
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
