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
  const { staff, loading, error, createStaff } = useStaff()
  const { professionals, createProfessional, updateProfessional, deleteProfessional } = useProfessionals()
  const { catalogs, loading: catalogsLoading } = useCatalogs([
    "document_types",
    "staff_roles",
    "contract_types",
    "staff_statuses",
  ])
  const [form, setForm] = useState(emptyForm)
  const [message, setMessage] = useState("")
  const [professionalForm, setProfessionalForm] = useState({ staffId: "", titles: "", institutions: "", observations: "", timeDonor: false })
  const [editingProfessional, setEditingProfessional] = useState(null)

  const options = useMemo(
    () => Object.fromEntries(Object.entries(catalogs).map(([key, value]) => [key, value || []])),
    [catalogs],
  )

  const submit = async (event) => {
    event.preventDefault()
    setMessage("")
    await createStaff(form)
    setForm(emptyForm)
    setMessage("Personal guardado correctamente.")
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
      <Card className="p-5">
        <h2 className="mb-4 text-xl font-bold">Nuevo personal</h2>
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
          <Button type="submit" disabled={catalogsLoading || loading}>Crear</Button>
        </form>
      </Card>
      <Card className="mt-6 p-5">
        <h2 className="mb-4 text-xl font-bold">Profesionales y talleristas</h2>
        <form className="mb-5 grid gap-3 md:grid-cols-5" onSubmit={submitProfessional}>
          <label className="block"><span className="mb-1.5 block text-sm font-bold">Personal</span><select required className="min-h-12 w-full rounded-xl border border-border bg-surface px-3" value={professionalForm.staffId} onChange={(e) => setProfessionalForm({ ...professionalForm, staffId: e.target.value })}><option value="">Selecciona</option>{staff.map((person) => <option key={person.staffId} value={person.staffId}>{person.fullName}</option>)}</select></label>
          <Field label="Títulos" value={professionalForm.titles} onChange={(e) => setProfessionalForm({ ...professionalForm, titles: e.target.value })} />
          <Field label="Instituciones" value={professionalForm.institutions} onChange={(e) => setProfessionalForm({ ...professionalForm, institutions: e.target.value })} />
          <Field label="Observaciones" value={professionalForm.observations} onChange={(e) => setProfessionalForm({ ...professionalForm, observations: e.target.value })} />
          <div className="flex items-end">
            <Button type="submit" className="min-h-9 px-3 py-1.5 text-xs">
              {editingProfessional ? "Actualizar" : "Agregar"}
            </Button>
          </div>
        </form>
        <div className="space-y-2">{professionals.map((professional) => <div key={professional.professionalId} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3"><span><strong>{staff.find((person) => String(person.staffId) === String(professional.staffId))?.fullName || `Personal #${professional.staffId}`}</strong><span className="ml-2 text-sm text-muted">{professional.titles || "Sin títulos"}</span></span><span className="flex gap-2"><Button className="text-xs" variant="secondary" onClick={() => { setEditingProfessional(professional.professionalId); setProfessionalForm(professional) }}>Editar</Button><Button className="text-xs" variant="danger" onClick={() => deleteProfessional(professional.professionalId)}>Eliminar</Button></span></div>)}</div>
      </Card>
    </div>
  )
}

function Select({ label, value, options = [], onChange }) {
  return <label className="block"><span className="mb-1.5 block text-[15px] font-bold text-foreground">{label}</span><select className="min-h-12 w-full rounded-xl border border-border bg-surface px-4 text-foreground" value={value || ""} onChange={(e) => onChange(e.target.value)}><option value="">Selecciona</option>{options.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}</select></label>
}
