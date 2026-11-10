import { useState } from "react"
import { useInterns } from "../hooks/useInterns"
import { useStaff } from "../hooks/useStaff"
import { Button, Card, Field } from "../components/ui"

const initialForm = { staffId: "", university: "", career: "", foundationRole: "", durationMonths: "" }

export default function InternsScreen() {
  const { interns, loading, error, createIntern, updateIntern, deleteIntern } = useInterns()
  const { staff } = useStaff()
  const [form, setForm] = useState(initialForm)
  const [editing, setEditing] = useState(null)
  const [message, setMessage] = useState("")

  const submit = async (event) => {
    event.preventDefault()
    setMessage("")
    if (editing) await updateIntern(editing, form)
    else await createIntern({ ...form, durationMonths: form.durationMonths ? Number(form.durationMonths) : null })
    setForm(initialForm)
    setEditing(null)
    setMessage("Practicante guardado correctamente.")
  }

  return <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
    <div className="mb-8"><h1 className="text-3xl font-extrabold text-foreground">Practicantes</h1><p className="mt-1 text-muted">Relaciona la información académica con un registro de personal.</p></div>
    {(error || message) && <p className={`mb-4 rounded-xl p-3 ${error ? "bg-danger-soft text-danger" : "bg-success-soft text-success"}`}>{error || message}</p>}
    <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
      <Card className="p-5"><h2 className="mb-4 text-xl font-bold">{editing ? "Editar practicante" : "Nuevo practicante"}</h2><form className="space-y-3" onSubmit={submit}>
        <label className="block"><span className="mb-1.5 block text-[15px] font-bold">Personal vinculado</span><select required className="min-h-12 w-full rounded-xl border border-border bg-surface px-4" value={form.staffId || ""} onChange={(e) => setForm({ ...form, staffId: e.target.value })}><option value="">Selecciona</option>{staff.map((person) => <option key={person.staffId} value={person.staffId}>{person.fullName} · {person.documentNumber}</option>)}</select></label>
        <Field label="Universidad" value={form.university || ""} onChange={(e) => setForm({ ...form, university: e.target.value })} />
        <Field label="Carrera" value={form.career || ""} onChange={(e) => setForm({ ...form, career: e.target.value })} />
        <Field label="Rol en la fundación" value={form.foundationRole || ""} onChange={(e) => setForm({ ...form, foundationRole: e.target.value })} />
        <Field label="Duración (meses)" type="number" min="0" value={form.durationMonths || ""} onChange={(e) => setForm({ ...form, durationMonths: e.target.value })} />
        <div className="flex gap-2"><Button type="submit">{editing ? "Actualizar" : "Crear"}</Button>{editing && <Button type="button" variant="secondary" onClick={() => { setEditing(null); setForm(initialForm) }}>Cancelar</Button>}</div>
      </form></Card>
      <Card className="p-5"><h2 className="mb-4 text-xl font-bold">Listado</h2><div className="space-y-3">{interns.map((intern) => { const person = staff.find((item) => String(item.staffId) === String(intern.staffId)); return <div key={intern.internId} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4"><div><p className="font-bold">{person?.fullName || `Personal #${intern.staffId}`}</p><p className="text-sm text-muted">{intern.university || "Sin universidad"} · {intern.career || "Sin carrera"}</p></div><div className="flex gap-2"><Button className="text-xs" onClick={() => { setEditing(intern.internId); setForm(intern) }}>Editar</Button><Button variant="danger" className="text-xs" onClick={() => deleteIntern(intern.internId)}>Eliminar</Button></div></div> })}{!loading && interns.length === 0 && <p className="py-8 text-center text-muted">No hay practicantes registrados.</p>}</div></Card>
    </div>
  </div>
}
