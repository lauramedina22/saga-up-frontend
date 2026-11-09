import { useMemo, useState } from "react"
import { useCatalogs } from "../hooks/useCatalogs"
import { useStaff } from "../hooks/useStaff"
import { useProfessionals } from "../hooks/useProfessionals"
import { Button, Card, Field } from "../components/ui"

const emptyForm = {
  fullName: "",
  documentTypeId: "",
  documentNumber: "",
  roleId: "",
  hireDate: "",
  contractTypeId: "",
  statusId: "",
  phone: "",
  email: "",
}

export default function StaffScreen() {
  const { staff, loading, error, createStaff, updateStaff, deleteStaff, searchByDocument, linkAccount, unlinkAccount } = useStaff()
  const { professionals, createProfessional, updateProfessional, deleteProfessional } = useProfessionals()
  const { catalogs, loading: catalogsLoading } = useCatalogs([
    "document_types",
    "staff_roles",
    "contract_types",
    "staff_statuses",
  ])
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [documentSearch, setDocumentSearch] = useState("")
  const [result, setResult] = useState(null)
  const [accountId, setAccountId] = useState("")
  const [message, setMessage] = useState("")
  const [professionalForm, setProfessionalForm] = useState({ staffId: "", titles: "", institutions: "", observations: "", timeDonor: false })
  const [editingProfessional, setEditingProfessional] = useState(null)

  const options = useMemo(
    () => Object.fromEntries(Object.entries(catalogs).map(([key, value]) => [key, value || []])),
    [catalogs],
  )
  const visibleStaff = result ? [result] : staff

  const submit = async (event) => {
    event.preventDefault()
    setMessage("")
    const operation = editing ? updateStaff(editing, form) : createStaff(form)
    await operation
    setForm(emptyForm)
    setEditing(null)
    setMessage("Personal guardado correctamente.")
  }

  const edit = (person) => {
    setEditing(person.staffId)
    setForm(person)
  }

  const findByDocument = async (event) => {
    event.preventDefault()
    setMessage("")
    if (!documentSearch.trim()) {
      setResult(null)
      return
    }

    try {
      setResult(await searchByDocument(documentSearch.trim()))
    } catch (requestError) {
      setResult(null)
      setMessage(requestError?.message || "No se encontró personal con esa cédula.")
    }
  }

  const submitProfessional = async (event) => {
    event.preventDefault()
    if (editingProfessional) await updateProfessional(editingProfessional, professionalForm)
    else await createProfessional(professionalForm)
    setProfessionalForm({ staffId: "", titles: "", institutions: "", observations: "", timeDonor: false })
    setEditingProfessional(null)
    setMessage("Profesional guardado correctamente.")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground">Personal</h1>
        <p className="mt-1 text-muted">Administra el personal y sus cuentas vinculadas.</p>
      </div>
      {(error || message) && <p className={`mb-4 rounded-xl p-3 ${error ? "bg-danger-soft text-danger" : "bg-success-soft text-success"}`}>{error || message}</p>}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <Card className="p-5">
          <h2 className="mb-4 text-xl font-bold">{editing ? "Editar personal" : "Nuevo personal"}</h2>
          <form className="space-y-3" onSubmit={submit}>
            <Field label="Nombre completo" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Select label="Tipo de documento" value={form.documentTypeId} options={options.document_types} onChange={(value) => setForm({ ...form, documentTypeId: value })} />
              <Field label="Número de documento" required value={form.documentNumber} onChange={(e) => setForm({ ...form, documentNumber: e.target.value })} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Select label="Rol" value={form.roleId} options={options.staff_roles} onChange={(value) => setForm({ ...form, roleId: value })} />
              <Select label="Tipo de contrato" value={form.contractTypeId} options={options.contract_types} onChange={(value) => setForm({ ...form, contractTypeId: value })} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Fecha de ingreso" type="date" value={form.hireDate || ""} onChange={(e) => setForm({ ...form, hireDate: e.target.value })} />
              <Select label="Estado" value={form.statusId} options={options.staff_statuses} onChange={(value) => setForm({ ...form, statusId: value })} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Field label="Correo" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={catalogsLoading || loading}>{editing ? "Actualizar" : "Crear"}</Button>
              {editing && <Button type="button" variant="secondary" onClick={() => { setEditing(null); setForm(emptyForm) }}>Cancelar</Button>}
            </div>
          </form>
        </Card>
        <Card className="p-5">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Listado</h2>
              <p className="text-sm text-muted">{staff.length} registros</p>
            </div>
            <form className="flex gap-2" onSubmit={findByDocument}>
              <Field label="Buscar por cédula" value={documentSearch} onChange={(e) => setDocumentSearch(e.target.value)} />
              <Button type="submit" variant="secondary">Buscar</Button>
            </form>
          </div>
          <div className="space-y-3">
            {visibleStaff.map((person) => (
              <div key={person.staffId} className="rounded-xl border border-border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><p className="font-bold">{person.fullName}</p><p className="text-sm text-muted">{person.documentNumber} · {person.email || "Sin correo"}</p></div>
                  <div className="flex gap-2"><Button className="text-xs" onClick={() => edit(person)}>Editar</Button><Button className="text-xs" variant="danger" onClick={() => deleteStaff(person.staffId)}>Retirar</Button></div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {person.securityUserId ? <Button variant="secondary" className="text-xs" onClick={() => unlinkAccount(person.staffId)}>Desvincular cuenta</Button> : <><Field label="UUID de cuenta" value={accountId} onChange={(e) => setAccountId(e.target.value)} /><Button className="text-xs" onClick={() => linkAccount(person.staffId, accountId)}>Vincular cuenta</Button></>}
                </div>
              </div>
            ))}
            {!loading && visibleStaff.length === 0 && <p className="py-8 text-center text-muted">No hay personal registrado.</p>}
          </div>
        </Card>
      </div>
      <Card className="mt-6 p-5">
        <h2 className="mb-4 text-xl font-bold">Profesionales y talleristas</h2>
        <form className="mb-5 grid gap-3 md:grid-cols-5" onSubmit={submitProfessional}>
          <label className="block"><span className="mb-1.5 block text-sm font-bold">Personal</span><select required className="min-h-12 w-full rounded-xl border border-border bg-surface px-3" value={professionalForm.staffId} onChange={(e) => setProfessionalForm({ ...professionalForm, staffId: e.target.value })}><option value="">Selecciona</option>{staff.map((person) => <option key={person.staffId} value={person.staffId}>{person.fullName}</option>)}</select></label>
          <Field label="Títulos" value={professionalForm.titles} onChange={(e) => setProfessionalForm({ ...professionalForm, titles: e.target.value })} />
          <Field label="Instituciones" value={professionalForm.institutions} onChange={(e) => setProfessionalForm({ ...professionalForm, institutions: e.target.value })} />
          <Field label="Observaciones" value={professionalForm.observations} onChange={(e) => setProfessionalForm({ ...professionalForm, observations: e.target.value })} />
          <Button type="submit">{editingProfessional ? "Actualizar" : "Agregar"}</Button>
        </form>
        <div className="space-y-2">{professionals.map((professional) => <div key={professional.professionalId} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3"><span><strong>{staff.find((person) => String(person.staffId) === String(professional.staffId))?.fullName || `Personal #${professional.staffId}`}</strong><span className="ml-2 text-sm text-muted">{professional.titles || "Sin títulos"}</span></span><span className="flex gap-2"><Button className="text-xs" variant="secondary" onClick={() => { setEditingProfessional(professional.professionalId); setProfessionalForm(professional) }}>Editar</Button><Button className="text-xs" variant="danger" onClick={() => deleteProfessional(professional.professionalId)}>Eliminar</Button></span></div>)}</div>
      </Card>
    </div>
  )
}

function Select({ label, value, options = [], onChange }) {
  return <label className="block"><span className="mb-1.5 block text-[15px] font-bold text-foreground">{label}</span><select className="min-h-12 w-full rounded-xl border border-border bg-surface px-4 text-foreground" value={value || ""} onChange={(e) => onChange(e.target.value)}><option value="">Selecciona</option>{options.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}</select></label>
}
