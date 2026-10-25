import { useState } from "react"
import { formatCOP, formatFecha } from "../data"
import {
  Avatar,
  Badge,
  Button,
  Card,
  Field,
  Icon,
  TextArea,
} from "../components/ui"
import {
  CreateChildDialog,
  DeletePersonDialog,
} from "../components/PeopleDialogs" 

import { useChildren } from "../hooks/useChildren"

const searchPath = "M21 21l-5.2-5.2m0 0A7.5 7.5 0 105.2 15.8a7.5 7.5 0 0010.6 0z"
const backPath = "M15.75 19.5L8.25 12l7.5-7.5"
const uploadPath = "M12 16.5V3.75m0 0L7.5 8.25M12 3.75l4.5 4.5M3.75 15v3.75A2.25 2.25 0 006 21h12a2.25 2.25 0 002.25-2.25V15"
const downloadPath = "M12 3v12m0 0l4.5-4.5M12 15l-4.5-4.5M4.5 21h15"

const pagoTone = {
  al_dia: "success",
  pendiente: "warning",
  vencido: "danger",
}

const pagoLabel = {
  al_dia: "Al día",
  pendiente: "Pendiente",
  vencido: "Vencido",
}

const matriculaLabel = {
  activa: "Matrícula activa",
  pendiente: "Matrícula pendiente",
  retirada: "Retirado/a",
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl bg-surface-muted p-3">
      <p className="text-xs font-extrabold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-1 font-semibold text-foreground">
        {value?.trim() || "Sin registrar"}
      </p>
    </div>
  )
}

function SectionCard({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-border p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="text-lg font-extrabold">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-muted">{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}

function EditableTab({ child, kind, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ ...child })
  
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }))
  
  const save = () => {
    onSave(draft)
    setEditing(false)
  }

  if (kind === "salud") {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            variant={editing ? "secondary" : "tertiary"}
            onClick={() => setEditing(!editing)}
          >
            {editing ? "Cancelar edición" : "Editar información"}
          </Button>
        </div>
        <SectionCard title="Afiliación y diagnóstico">
          {editing ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="EPS"
                value={draft.eps ?? ""}
                onChange={(e) => update("eps", e.target.value)}
              />
              <Field
                label="Estado de afiliación"
                value={draft.estadoAfiliacion ?? ""}
                onChange={(e) => update("estadoAfiliacion", e.target.value)}
              />
              <div className="sm:col-span-2">
                <TextArea
                  label="Condición médica / Diagnóstico"
                  rows={3}
                  value={draft.condicionesSalud ?? ""}
                  onChange={(e) => update("condicionesSalud", e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="EPS" value={child.eps} />
              <Info label="Estado de afiliación" value={child.estadoAfiliacion} />
              <div className="sm:col-span-2">
                <Info
                  label="Condición médica / Diagnóstico"
                  value={child.condicionesSalud}
                />
              </div>
            </div>
          )}
        </SectionCard>
        <SectionCard title="Cuidados durante la jornada">
          {editing ? (
            <div className="grid gap-4">
              <TextArea
                label="Alergias registradas"
                rows={2}
                value={draft.alergias ?? ""}
                onChange={(e) => update("alergias", e.target.value)}
              />
              <TextArea
                label="Medicamentos: nombre, dosis, horario e indicaciones"
                rows={3}
                value={draft.medicamentos ?? ""}
                onChange={(e) => update("medicamentos", e.target.value)}
              />
              <TextArea
                label="Restricciones de alimentación"
                rows={2}
                value={draft.restriccionesAlimentarias ?? ""}
                onChange={(e) => update("restriccionesAlimentarias", e.target.value)}
              />
              <TextArea
                label="Cuidados / Condiciones especiales"
                rows={3}
                value={draft.cuidadosEspeciales ?? ""}
                onChange={(e) => update("cuidadosEspeciales", e.target.value)}
              />
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Alergias registradas" value={child.alergias} />
              <Info label="Restricciones de alimentación" value={child.restriccionesAlimentarias} />
              <div className="sm:col-span-2">
                <Info label="Medicamentos e indicaciones" value={child.medicamentos} />
              </div>
              <div className="sm:col-span-2">
                <Info label="Cuidados / Condiciones especiales" value={child.cuidadosEspeciales} />
              </div>
            </div>
          )}
        </SectionCard>
        {editing && (
          <div className="flex justify-end">
            <Button onClick={save}>Guardar cambios</Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant={editing ? "secondary" : "tertiary"}
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Cancelar edición" : "Editar información"}
        </Button>
      </div>
      <SectionCard title="Comunicación y Apoyos">
        {editing ? (
          <div className="grid gap-4">
            <Field
              label="Formas de comunicación"
              value={draft.formasComunicacion ?? ""}
              onChange={(e) => update("formasComunicacion", e.target.value)}
            />
            <TextArea
              label="Apoyos requeridos en la rutina diaria"
              rows={2}
              value={draft.apoyosRutina ?? ""}
              onChange={(e) => update("apoyosRutina", e.target.value)}
            />
            <Field
              label="Qué le gusta"
              value={draft.leGusta ?? ""}
              onChange={(e) => update("leGusta", e.target.value)}
            />
            <TextArea
              label="Qué lo calma / Manejo de crisis"
              rows={3}
              value={draft.manejoCrisis ?? ""}
              onChange={(e) => update("manejoCrisis", e.target.value)}
            />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <Info label="Formas de comunicación" value={child.formasComunicacion || child.apoyos} />
            <Info label="Apoyos en la rutina diaria" value={child.apoyosRutina} />
            <Info label="Qué le gusta" value={child.leGusta || child.observaciones} />
            <Info label="Qué lo calma / Manejo de crisis" value={child.manejoCrisis} />
          </div>
        )}
      </SectionCard>
      <SectionCard title="Educación y Terapias">
        {editing ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Colegio / Institución"
              value={draft.institucionEducativa ?? ""}
              onChange={(e) => update("institucionEducativa", e.target.value)}
            />
            <Field
              label="Grado"
              value={draft.grado ?? ""}
              onChange={(e) => update("grado", e.target.value)}
            />
            <Field
              label="Jornada"
              value={draft.jornada ?? ""}
              onChange={(e) => update("jornada", e.target.value)}
            />
            <Field
              label="Terapias externas: tipo, centro, días y horarios"
              value={draft.terapiasExternas ?? ""}
              onChange={(e) => update("terapiasExternas", e.target.value)}
            />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <Info label="Colegio / Institución" value={child.institucionEducativa} />
            <Info label="Grado y jornada" value={[child.grado, child.jornada].filter(Boolean).join(" · ")} />
            <div className="sm:col-span-2">
              <Info label="Terapias externas" value={child.terapiasExternas} />
            </div>
          </div>
        )}
      </SectionCard>
      {editing && (
        <div className="flex justify-end">
          <Button onClick={save}>Guardar cambios</Button>
        </div>
      )}
    </div>
  )
}

const beneficiaryDocs = [
  { tipo: "identidad", label: "Copia del Documento de Identidad del beneficiario" },
  { tipo: "eps", label: "Certificado de EPS (vigente)" },
  { tipo: "discapacidad", label: "Certificado de Discapacidad (si aplica)" },
]

function DocumentsTab({ child, onSave }) {
  const upload = (tipo, event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 700_000) {
      window.alert("El archivo debe pesar menos de 700 KB.")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const document = {
        id: `doc-${Date.now()}`,
        tipo,
        nombre: file.name,
        fechaCarga: new Date().toISOString().slice(0, 10),
        contenido: String(reader.result),
      }
      onSave([
        ...(child.documentos ?? []).filter((item) => item.tipo !== tipo),
        document,
      ])
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-3">
      <div className="mb-5">
        <h3 className="text-xl font-extrabold">Expediente Digital</h3>
        <p className="mt-1 text-sm text-muted">
          Adjunta archivos PDF o imágenes de máximo 700 KB.
        </p>
      </div>
      {beneficiaryDocs.map((item) => {
        const document = child.documentos?.find((doc) => doc.tipo === item.tipo)
        return (
          <section key={item.tipo} className="flex flex-col gap-4 rounded-2xl border border-border p-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Badge tone={document ? "success" : "warning"}>
                  {document ? "Cargado" : "Pendiente"}
                </Badge>
              </div>
              <p className="mt-2 font-extrabold">{item.label}</p>
              {document && (
                <p className="mt-1 truncate text-sm text-muted">
                  {document.nombre} · {formatFecha(document.fechaCarga)}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {document?.contenido && (
                <Button variant="secondary" onClick={() => window.open(document.contenido, "_blank")}>
                  <Icon path={downloadPath} className="size-4" /> Descargar
                </Button>
              )}
              <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-extrabold text-foreground hover:bg-primary-hover hover:text-white">
                <Icon path={uploadPath} className="size-4" />
                {document ? "Reemplazar" : "Adjuntar"}
                <input
                  className="sr-only"
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(event) => upload(item.tipo, event)}
                />
              </label>
            </div>
          </section>
        )
      })}
    </div>
  )
}

function ChildDetail({
  child,
  guardians,
  enrollments,
  payments,
  sponsors,
  onUpdateChild,
  onBack,
  onDelete,
}) {
  const [tab, setTab] = useState("datos")
  
  const relatedGuardians = guardians.filter(
    (item) =>
      item.id === child.guardianId ||
      (child.guardianIds ?? []).includes(item.id) ||
      item.childrenIds?.includes(child.id),
  )
  
  const childEnrollments = enrollments
    .filter((item) => item.childId === child.id)
    .sort((a, b) => b.anio - a.anio)
    
  const childPayments = payments.filter((item) => item.childId === child.id)
  
  const childSponsors = sponsors.filter(
    (item) => item.asignaciones.some((assignment) => assignment.destinoId === child.id) || item.childId === child.id
  )

  const tabs = [
    { id: "datos", label: "Datos Personales" },
    { id: "acudientes", label: "Acudientes y Contactos" },
    { id: "salud", label: "Salud y Cuidado" },
    { id: "apoyos", label: "Apoyos y Educación" },
    { id: "matricula", label: "Matrícula y Pagos" },
    { id: "padrino", label: "Padrino" },
    { id: "documentos", label: "Documentos" },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <Button variant="tertiary" onClick={onBack} className="mb-5 px-0">
        <Icon path={backPath} /> Volver a beneficiarios
      </Button>
      <Card className="mb-4 flex items-center gap-5 rounded-3xl p-6">
        {child.foto ? (
          <img src={child.foto} alt="" className="size-16 shrink-0 rounded-full object-cover" />
        ) : (
          <Avatar name={child.nombre} size="lg" />
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-extrabold">{child.nombre}</h1>
          <p className="mt-0.5 text-sm text-muted">
            {child.edad} años · {child.ciudad}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone={pagoTone[child.nivelPago]}>{pagoLabel[child.nivelPago]}</Badge>
            <Badge tone={child.estadoMatricula === "activa" ? "success" : "warning"}>
              {matriculaLabel[child.estadoMatricula]}
            </Badge>
          </div>
        </div>
      </Card>
      
      <div className="mb-4 flex gap-1 overflow-x-auto rounded-2xl bg-surface-muted p-1">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`min-h-11 shrink-0 rounded-xl px-3 text-xs font-extrabold transition ${
              tab === item.id ? "bg-surface text-primary-hover shadow-sm" : "text-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <Card className="rounded-3xl p-5">
        {tab === "datos" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Info label="Nombre completo" value={child.nombre} />
            <Info label="Fecha de nacimiento" value={formatFecha(child.fechaNacimiento)} />
            <Info label="Edad" value={`${child.edad} años`} />
            <Info label="Ciudad" value={child.ciudad} />
            <Info label="Dirección" value={child.direccion} />
            <Info label="Barrio" value={child.barrio} />
            <div className="sm:col-span-2">
              <Info label="Observaciones" value={child.observaciones} />
            </div>
          </div>
        )}
        {tab === "acudientes" && (
          <div className="space-y-3">
            {relatedGuardians.map((item) => (
              <SectionCard key={item.id} title={item.nombre}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Info label="Parentesco" value={item.parentesco} />
                  <Info label="Teléfono" value={item.telefono} />
                  <Info label="WhatsApp" value={item.whatsapp} />
                  <Info label="Correo" value={item.correo} />
                </div>
              </SectionCard>
            ))}
          </div>
        )}
        {tab === "salud" && (
          <EditableTab child={child} kind="salud" onSave={(changes) => onUpdateChild(child.id, changes)} />
        )}
        {tab === "apoyos" && (
          <EditableTab child={child} kind="apoyos" onSave={(changes) => onUpdateChild(child.id, changes)} />
        )}
        {tab === "matricula" && (
          <div className="space-y-5">
            <SectionCard title="Matrículas">
              <div className="space-y-2">
                {childEnrollments.map((item) => (
                  <div key={item.id} className="flex justify-between rounded-xl bg-surface-muted p-3">
                    <span className="font-bold">Año {item.anio}</span>
                    <span className="text-sm text-muted">
                      {formatCOP(item.valor)} · {formatFecha(item.fechaInicio)}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Pagos">
              <div className="space-y-2">
                {childPayments.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-border py-2 last:border-0">
                    <span className="font-semibold">{item.mes}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted">{formatCOP(item.valor)}</span>
                      <Badge tone={item.estado === "pagado" ? "success" : item.estado === "vencido" ? "danger" : "warning"}>
                        {item.estado}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}
        {tab === "padrino" && (
          <div className="space-y-3">
            {childSponsors.length ? (
              childSponsors.map((item) => (
                <SectionCard key={item.id} title={item.nombre}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Info label="Contacto" value={item.contacto} />
                    <Info label="Correo" value={item.correo} />
                    {item.asignaciones
                      .filter((assignment) => assignment.destinoId === child.id)
                      .map((assignment) => (
                        <div key={assignment.id} className="sm:col-span-2">
                          <Info label="Apadrinamiento" value={`${formatCOP(assignment.monto)} · ${assignment.periodicidad} · ${assignment.estado}`} />
                        </div>
                      ))}
                  </div>
                </SectionCard>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-muted">
                Este beneficiario aún no tiene padrinos vinculados.
              </p>
            )}
          </div>
        )}
        {tab === "documentos" && (
          <DocumentsTab child={child} onSave={(documents) => onUpdateChild(child.id, { documentos: documents })} />
        )}
      </Card>
      <Button variant="danger" onClick={onDelete} className="mt-4">
        Eliminar registro
      </Button>
    </div>
  )
}

export default function ChildrenScreen() {
  const {
    children,
    guardians,
    enrollments,
    payments,
    sponsors,
    loading,
    error,
    createChild,
    createChildWithGuardian,
    updateChild,
    deleteChild,
  } = useChildren()
  const [filtro, setFiltro] = useState("todos")
  const [busqueda, setBusqueda] = useState("")
  const [selectedId, setSelectedId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [toast, setToast] = useState("")
  
  const selected = children.find((item) => item.id === selectedId)
  const filtered = children.filter(
    (item) =>
      (filtro === "todos" || item.nivelPago === filtro) &&
      item.nombre.toLocaleLowerCase("es-CO").includes(busqueda.toLocaleLowerCase("es-CO").trim())
  )

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 3000)
  }

  if (selected) {
    return (
      <>
        {toast && (
          <div role="status" className="fixed right-4 top-4 z-50 rounded-xl bg-success px-4 py-3 text-sm font-bold text-white shadow-dialog">
            {toast}
          </div>
        )}
        <ChildDetail
          child={selected}
          guardians={guardians}
          enrollments={enrollments}
          payments={payments}
          sponsors={sponsors}
          onUpdateChild={updateChild}
          onBack={() => setSelectedId(null)}
          onDelete={() => setDeleting(selected)}
        />
        {deleting && (
          <DeletePersonDialog
            kind="beneficiario"
            name={deleting.nombre}
            onClose={() => setDeleting(null)}
            onConfirm={async () => {
              const result = await deleteChild(deleting.id)
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
        <div role="status" className="fixed right-4 top-4 z-50 rounded-xl bg-success px-4 py-3 text-sm font-bold text-white shadow-dialog">
          {toast}
        </div>
      )}
      {creating && (
        <CreateChildDialog
          guardians={guardians}
          onCreateChild={createChild}
          onCreateChildWithGuardian={createChildWithGuardian}
          onClose={() => setCreating(false)}
          onCreated={(record) => {
            setCreating(false)
            setSelectedId(record.id)
            showToast("Beneficiario registrado correctamente")
          }}
        />
      )}
      {deleting && (
        <DeletePersonDialog
          kind="beneficiario"
          name={deleting.nombre}
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            const result = await deleteChild(deleting.id)
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
          <h1 className="text-3xl font-extrabold">Beneficiarios</h1>
          <span className="text-sm text-muted font-semibold">
            {children.length} registros
          </span>
        </div>
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
        <Button onClick={() => setCreating(true)} className="w-full sm:w-auto">
          + Agregar beneficiario
        </Button>
      </div>
      
      <label className="relative mb-4 block">
        <span className="sr-only">Buscar beneficiarios</span>
        <Icon path={searchPath} className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-subtle" />
        <input
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Buscar por nombre..."
          className="min-h-12 w-full rounded-2xl border border-border bg-surface pl-12 pr-4 shadow-sm outline-none focus:border-primary focus:ring-3 focus:ring-primary/15"
        />
      </label>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {["todos", "al_dia", "pendiente", "vencido"].map((item) => (
          <Button
            key={item}
            variant={filtro === item ? "primary" : "secondary"}
            onClick={() => setFiltro(item)}
            className="shrink-0 rounded-full"
          >
            {item === "todos" ? "Todos" : pagoLabel[item]}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((item) => {
          const guardian = guardians.find((person) => person.id === item.guardianId)
          return (
            <Card key={item.id} className="flex items-center gap-2 rounded-3xl p-2">
              <button
                type="button"
                onClick={() => setSelectedId(item.id)}
                className="flex min-w-0 flex-1 items-center gap-4 rounded-2xl p-2 text-left hover:bg-surface-muted"
              >
                <Avatar name={item.nombre} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-extrabold">{item.nombre}</p>
                  <p className="truncate text-sm text-muted">
                    {item.edad} años · {guardian?.nombre}
                  </p>
                </div>
                <Badge tone={pagoTone[item.nivelPago]} className="hidden sm:inline-flex">
                  {pagoLabel[item.nivelPago]}
                </Badge>
              </button>
              <Button
                variant="tertiary"
                onClick={() => setDeleting(item)}
                className="text-danger hover:bg-danger-soft"
              >
                Eliminar
              </Button>
            </Card>
          )
        })}
        {filtered.length === 0 && (
          <Card className="rounded-3xl p-8 text-center text-muted">
            No se encontraron beneficiarios con ese filtro.
          </Card>
        )}
      </div>
    </div>
  )
}