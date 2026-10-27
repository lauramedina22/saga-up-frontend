import { useState } from "react"
import { useWorkshops } from "../hooks/useWorkshops"
import { useChildren } from "../hooks/useChildren"
import { Avatar, Badge, Button, Card, Field, Icon, SelectField, TextArea } from "../components/ui"
import { formatFecha } from "../data"

const TABS = [
  { id: "staff", label: "Talleristas y Personal", icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" },
  { id: "workshops", label: "Catálogo de Talleres", icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" },
  { id: "schedules", label: "Agenda y Programación", icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" },
  { id: "shifts", label: "Turnos y Asistencia", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
]

const DAYS_OF_WEEK = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
]

export default function WorkshopsScreen() {
  const {
    staffList,
    workshops,
    schedules,
    shifts,
    loading,
    error,
    createWorkshop,
    createSchedule,
    recordShift,
    createStaff,
  } = useWorkshops()
  const { children } = useChildren()

  const [activeTab, setActiveTab] = useState("staff")
  const [staffFilter, setStaffFilter] = useState("todos")
  const [searchTerm, setSearchTerm] = useState("")

  // Modales
  const [isWorkshopModalOpen, setIsWorkshopModalOpen] = useState(false)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false)
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false)
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)

  // Form states
  const [workshopForm, setWorkshopForm] = useState({
    name: "",
    durationMinutes: 60,
    description: "",
    workshopSupplies: "",
  })

  const [scheduleForm, setScheduleForm] = useState({
    workshopId: "",
    professionalId: "",
    dayWeek: "Lunes",
    timeStarts: "09:00",
    timeEnds: "10:30",
    endsOn: "",
    observations: "",
  })

  const [shiftForm, setShiftForm] = useState({
    staffId: "",
    dateWorking: new Date().toISOString().slice(0, 10),
    timeIn: "08:00",
    timeOut: "12:00",
  })

  const [staffForm, setStaffForm] = useState({
    fullName: "",
    documentNumber: "",
    phone: "",
    email: "",
    staffType: "professional", // 'professional' | 'intern'
    titles: "",
    institutions: "",
    timeDonor: false,
    university: "",
    career: "",
    foundationRole: "",
    durationMonths: 6,
  })

  // Estado temporal de asistencia para el modal de pase de lista
  const [attendanceRecords, setAttendanceRecords] = useState({})

  // Filtro de staff
  const filteredStaff = staffList.filter((person) => {
    const matchesSearch =
      person.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.phone.includes(searchTerm)

    if (!matchesSearch) return false

    if (staffFilter === "professionals") return Boolean(person.professional)
    if (staffFilter === "interns") return Boolean(person.intern)
    if (staffFilter === "donors") return Boolean(person.professional?.timeDonor)
    return true
  })

  // Handlers para submit
  const handleCreateWorkshop = async (e) => {
    e.preventDefault()
    if (!workshopForm.name.trim()) return
    await createWorkshop(workshopForm)
    setWorkshopForm({
      name: "",
      durationMinutes: 60,
      description: "",
      workshopSupplies: "",
    })
    setIsWorkshopModalOpen(false)
  }

  const handleCreateSchedule = async (e) => {
    e.preventDefault()
    if (!scheduleForm.workshopId || !scheduleForm.professionalId) return
    await createSchedule(scheduleForm)
    setIsScheduleModalOpen(false)
  }

  const handleRecordShift = async (e) => {
    e.preventDefault()
    if (!shiftForm.staffId || !shiftForm.dateWorking) return
    await recordShift(shiftForm)
    setIsShiftModalOpen(false)
  }

  const handleCreateStaff = async (e) => {
    e.preventDefault()
    if (!staffForm.fullName.trim()) return

    const staffData = {
      fullName: staffForm.fullName,
      documentNumber: staffForm.documentNumber,
      documentTypeId: 1,
      roleId: staffForm.staffType === "professional" ? 2 : 3,
      contractTypeId: staffForm.staffType === "professional" ? 1 : 3,
      statusId: 1,
      phone: staffForm.phone,
      email: staffForm.email,
      hoursWorked: 0,
      hoursPayed: 0,
    }

    const extraData = {}
    if (staffForm.staffType === "professional") {
      extraData.professional = {
        titles: staffForm.titles,
        institutions: staffForm.institutions,
        time_donor: staffForm.timeDonor,
      }
    } else {
      extraData.intern = {
        university: staffForm.university,
        career: staffForm.career,
        foundation_role: staffForm.foundationRole,
        duration_months: Number(staffForm.durationMonths) || 6,
      }
    }

    await createStaff(staffData, extraData)
    setIsStaffModalOpen(false)
    setStaffForm({
      fullName: "",
      documentNumber: "",
      phone: "",
      email: "",
      staffType: "professional",
      titles: "",
      institutions: "",
      timeDonor: false,
      university: "",
      career: "",
      foundationRole: "",
      durationMonths: 6,
    })
  }

  const openAttendanceModal = (schedule) => {
    setSelectedSchedule(schedule)
    // Inicializar estado de asistencia para todos los niños
    const initial = {}
    children.forEach((c) => {
      initial[c.childId] = {
        willAssist: true,
        asisted: false,
        completeWorkshop: false,
        behavior: "Participativo y atento",
      }
    })
    setAttendanceRecords(initial)
    setIsAttendanceModalOpen(true)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Encabezado */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Talleristas y Talleres
          </h1>
          <p className="mt-1.5 text-base text-muted">
            Gestión integral de personal, catálogo de talleres, programación semanal y control de asistencias.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {activeTab === "staff" && (
            <Button
              onClick={() => setIsStaffModalOpen(true)}
              className="bg-primary text-foreground hover:bg-primary-hover hover:text-white"
            >
              <Icon path="M12 4.5v15m7.5-7.5h-15" className="size-5" />
              Nuevo Colaborador
            </Button>
          )}
          {activeTab === "workshops" && (
            <Button
              onClick={() => setIsWorkshopModalOpen(true)}
              className="bg-primary text-foreground hover:bg-primary-hover hover:text-white"
            >
              <Icon path="M12 4.5v15m7.5-7.5h-15" className="size-5" />
              Nuevo Taller
            </Button>
          )}
          {activeTab === "schedules" && (
            <Button
              onClick={() => setIsScheduleModalOpen(true)}
              className="bg-primary text-foreground hover:bg-primary-hover hover:text-white"
            >
              <Icon path="M12 4.5v15m7.5-7.5h-15" className="size-5" />
              Programar Sesión
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => setIsShiftModalOpen(true)}
          >
            <Icon path="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" className="size-5" />
            Registrar Turno
          </Button>
        </div>
      </div>

      {/* Tarjetas Resumen de KPIs */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm transition hover:shadow-md">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">Talleristas & Staff</span>
          <p className="mt-2 text-3xl font-black text-foreground">{staffList.length}</p>
          <p className="mt-1 text-xs text-primary font-bold">
            {staffList.filter((s) => s.professional?.timeDonor).length} Donantes de tiempo
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm transition hover:shadow-md">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">Talleres Activos</span>
          <p className="mt-2 text-3xl font-black text-foreground">{workshops.length}</p>
          <p className="mt-1 text-xs text-muted">Catálogo institucional</p>
        </div>
        <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm transition hover:shadow-md">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">Sesiones en Agenda</span>
          <p className="mt-2 text-3xl font-black text-foreground">{schedules.length}</p>
          <p className="mt-1 text-xs text-muted">Programación vigente</p>
        </div>
        <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm transition hover:shadow-md">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">Turnos Registrados</span>
          <p className="mt-2 text-3xl font-black text-foreground">{shifts.length}</p>
          <p className="mt-1 text-xs text-success font-bold">Bitácora de asistencia</p>
        </div>
      </div>

      {/* Pestañas de Navegación */}
      <div className="mb-6 border-b border-border">
        <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto pb-1" aria-label="Tabs">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2.5 border-b-2 py-3 px-2 text-sm font-extrabold transition-colors ${
                  isActive
                    ? "border-primary text-primary-hover"
                    : "border-transparent text-muted hover:border-border hover:text-foreground"
                }`}
              >
                <Icon path={tab.icon} className="size-5 shrink-0" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {loading && (
        <p className="my-6 text-sm font-semibold text-muted" role="status">
          Cargando información de talleristas y talleres…
        </p>
      )}

      {error && (
        <div className="mb-6 rounded-2xl bg-danger-soft p-4 text-sm font-semibold text-danger">
          {error}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 1: Talleristas y Personal                                   */}
      {/* ============================================================== */}
      {activeTab === "staff" && (
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "todos", label: "Todos" },
                { id: "professionals", label: "Profesionales" },
                { id: "interns", label: "Practicantes (Interns)" },
                { id: "donors", label: "Voluntarios / Tiempo" },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setStaffFilter(btn.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                    staffFilter === btn.id
                      ? "bg-primary text-foreground shadow-sm"
                      : "border border-border bg-surface text-muted hover:text-foreground"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Buscar por nombre o teléfono…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredStaff.map((person) => {
              const isProfessional = Boolean(person.professional)
              const isIntern = Boolean(person.intern)
              const isDonor = person.professional?.timeDonor

              return (
                <Card key={person.staffId} className="flex flex-col justify-between p-5 transition hover:shadow-md">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={person.fullName} size="md" />
                        <div>
                          <h3 className="font-extrabold text-foreground text-lg leading-snug">
                            {person.fullName}
                          </h3>
                          <p className="text-xs text-muted">Doc: {person.documentNumber || "S/D"}</p>
                        </div>
                      </div>
                      {isDonor ? (
                        <Badge tone="success">Voluntario</Badge>
                      ) : isProfessional ? (
                        <Badge tone="primary">Profesional</Badge>
                      ) : isIntern ? (
                        <Badge tone="warning">Practicante</Badge>
                      ) : (
                        <Badge tone="neutral">Staff</Badge>
                      )}
                    </div>

                    <div className="mt-4 space-y-2 border-t border-border pt-4 text-xs text-muted">
                      {isProfessional && (
                        <>
                          <p>
                            <strong className="text-foreground">Títulos:</strong>{" "}
                            {person.professional.titles || "No especificado"}
                          </p>
                          <p>
                            <strong className="text-foreground">Institución:</strong>{" "}
                            {person.professional.institutions || "No especificada"}
                          </p>
                        </>
                      )}

                      {isIntern && (
                        <>
                          <p>
                            <strong className="text-foreground">Universidad:</strong>{" "}
                            {person.intern.university}
                          </p>
                          <p>
                            <strong className="text-foreground">Carrera:</strong>{" "}
                            {person.intern.career}
                          </p>
                          <p>
                            <strong className="text-foreground">Rol:</strong>{" "}
                            {person.intern.foundationRole} ({person.intern.durationMonths} meses)
                          </p>
                        </>
                      )}

                      <div className="flex items-center gap-2 pt-1 text-foreground">
                        <Icon path="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" className="size-4 text-primary" />
                        <span>{person.phone || "Sin teléfono"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-foreground">
                        <Icon path="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" className="size-4 text-primary" />
                        <span className="truncate">{person.email || "Sin correo"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-border pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-muted">Horas trabajadas</span>
                      <p className="text-sm font-extrabold text-foreground">{person.hoursWorked} hrs</p>
                    </div>
                    <Button
                      variant="secondary"
                      className="text-xs py-1.5 px-3 min-h-8"
                      onClick={() => {
                        setShiftForm((prev) => ({ ...prev, staffId: person.staffId }))
                        setIsShiftModalOpen(true)
                      }}
                    >
                      + Turno
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>

          {filteredStaff.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted">
              No se encontraron colaboradores con los criterios seleccionados.
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: Catálogo de Talleres                                     */}
      {/* ============================================================== */}
      {activeTab === "workshops" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workshops.map((workshop) => (
              <Card key={workshop.workshopId} className="flex flex-col justify-between p-6 transition hover:shadow-md">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-extrabold text-foreground">{workshop.name}</h3>
                    <span className="shrink-0 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary-hover">
                      {workshop.durationMinutes} min
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-muted leading-relaxed">
                    {workshop.description || "Sin descripción registrada."}
                  </p>

                  <div className="mt-4 rounded-2xl bg-surface-muted/60 p-3.5">
                    <p className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-1">
                      <Icon path="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" className="size-4 text-primary" />
                      Materiales e Insumos:
                    </p>
                    <p className="text-xs text-muted leading-relaxed">
                      {workshop.workshopSupplies || "Materiales estándar de aula."}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-border pt-4">
                  <Button
                    variant="primary"
                    className="w-full text-xs"
                    onClick={() => {
                      setScheduleForm((prev) => ({ ...prev, workshopId: workshop.workshopId }))
                      setIsScheduleModalOpen(true)
                    }}
                  >
                    <Icon path="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" className="size-4" />
                    Programar Horario
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {workshops.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted">
              No hay talleres registrados aún. Haz clic en "Nuevo Taller" para comenzar.
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: Agenda y Programación (professionals_workshops)           */}
      {/* ============================================================== */}
      {activeTab === "schedules" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {schedules.map((schedule) => {
              const assignedWorkshop =
                schedule.workshop ||
                workshops.find((w) => w.workshopId === schedule.workshopId)

              return (
                <Card key={schedule.professionalWorkshopId} className="p-6 transition hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="rounded-full bg-primary px-3 py-1 text-xs font-black text-foreground uppercase tracking-wide">
                        {schedule.dayWeek}
                      </span>
                      <h3 className="mt-2 text-xl font-extrabold text-foreground">
                        {assignedWorkshop?.name || "Taller asignado"}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-primary-hover flex items-center gap-1.5">
                        <Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" className="size-4" />
                        Tallerista: {schedule.professionalName || "Profesional asignado"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-surface-muted p-3 text-right">
                      <span className="block text-xs font-bold text-muted">Horario</span>
                      <span className="text-sm font-extrabold text-foreground">
                        {schedule.timeStarts} - {schedule.timeEnds}
                      </span>
                    </div>
                  </div>

                  {schedule.observations && (
                    <p className="mt-4 text-xs text-muted border-l-2 border-primary/50 pl-3 italic">
                      "{schedule.observations}"
                    </p>
                  )}

                  <div className="mt-5 border-t border-border pt-4 flex items-center justify-between">
                    <span className="text-xs text-muted">
                      Válido hasta: {formatFecha(schedule.endsOn)}
                    </span>
                    <Button
                      variant="primary"
                      className="text-xs py-1.5 px-3.5 min-h-9"
                      onClick={() => openAttendanceModal(schedule)}
                    >
                      <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="size-4" />
                      Tomar Asistencia
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>

          {schedules.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted">
              No hay sesiones programadas en este momento.
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: Turnos y Asistencia de Personal (staff_assistance)        */}
      {/* ============================================================== */}
      {activeTab === "shifts" && (
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="border-b border-border bg-surface-muted/50 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-foreground">Bitácora de Turnos del Personal</h3>
                <p className="text-xs text-muted">Registro de horas de entrada y salida para cómputo de horas trabajadas</p>
              </div>
              <Button
                variant="secondary"
                className="text-xs py-1.5 px-3 min-h-8"
                onClick={() => setIsShiftModalOpen(true)}
              >
                + Nuevo Turno
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-surface-muted/30 text-xs font-bold uppercase text-muted">
                  <tr>
                    <th className="px-6 py-3.5">Colaborador</th>
                    <th className="px-6 py-3.5">Fecha</th>
                    <th className="px-6 py-3.5">Hora Entrada</th>
                    <th className="px-6 py-3.5">Hora Salida</th>
                    <th className="px-6 py-3.5">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {shifts.map((shift) => {
                    const person = staffList.find((s) => s.staffId === shift.staffId)
                    return (
                      <tr key={shift.staffAssistanceId} className="hover:bg-surface-muted/20">
                        <td className="px-6 py-4 font-bold text-foreground">
                          {person ? person.fullName : `Colaborador #${shift.staffId}`}
                        </td>
                        <td className="px-6 py-4 text-muted">{formatFecha(shift.dateWorking)}</td>
                        <td className="px-6 py-4 font-semibold text-foreground">{shift.timeIn || "--:--"}</td>
                        <td className="px-6 py-4 font-semibold text-foreground">{shift.timeOut || "--:--"}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-success-soft px-2.5 py-1 text-xs font-bold text-success">
                            Completado
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                  {shifts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted">
                        No hay turnos registrados en la bitácora.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: Nuevo Colaborador / Tallerista (staff + prof / intern)  */}
      {/* ============================================================== */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-xl font-extrabold text-foreground">Registrar Nuevo Colaborador</h2>
              <button
                type="button"
                onClick={() => setIsStaffModalOpen(false)}
                className="rounded-lg p-1 text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <Field
                label="Nombre completo"
                required
                value={staffForm.fullName}
                onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })}
                placeholder="Ej. Dr. Mario Silva"
              />

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Documento"
                  value={staffForm.documentNumber}
                  onChange={(e) => setStaffForm({ ...staffForm, documentNumber: e.target.value })}
                  placeholder="Número de cédula"
                />
                <Field
                  label="Teléfono"
                  value={staffForm.phone}
                  onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                  placeholder="300 123 4567"
                />
              </div>

              <Field
                label="Correo electrónico"
                type="email"
                value={staffForm.email}
                onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                placeholder="correo@ejemplo.com"
              />

              <SelectField
                label="Tipo de Vinculación"
                value={staffForm.staffType}
                onChange={(e) => setStaffForm({ ...staffForm, staffType: e.target.value })}
              >
                <option value="professional">Profesional (Tallerista / Terapeuta)</option>
                <option value="intern">Practicante Universitario (Intern)</option>
              </SelectField>

              {staffForm.staffType === "professional" ? (
                <div className="space-y-3 rounded-2xl bg-surface-muted/40 p-4 border border-border">
                  <Field
                    label="Títulos Académicos"
                    value={staffForm.titles}
                    onChange={(e) => setStaffForm({ ...staffForm, titles: e.target.value })}
                    placeholder="Ej. Lic. en Artes, Psicólogo"
                  />
                  <Field
                    label="Instituciones de Formación"
                    value={staffForm.institutions}
                    onChange={(e) => setStaffForm({ ...staffForm, institutions: e.target.value })}
                    placeholder="Universidad de procedencia"
                  />
                  <label className="flex items-center gap-2 pt-1 text-sm font-bold text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={staffForm.timeDonor}
                      onChange={(e) => setStaffForm({ ...staffForm, timeDonor: e.target.checked })}
                      className="size-4 rounded text-primary focus:ring-primary"
                    />
                    ¿Es Donante de Tiempo? (Voluntario)
                  </label>
                </div>
              ) : (
                <div className="space-y-3 rounded-2xl bg-surface-muted/40 p-4 border border-border">
                  <Field
                    label="Universidad de Origen"
                    value={staffForm.university}
                    onChange={(e) => setStaffForm({ ...staffForm, university: e.target.value })}
                    placeholder="Universidad"
                  />
                  <Field
                    label="Carrera"
                    value={staffForm.career}
                    onChange={(e) => setStaffForm({ ...staffForm, career: e.target.value })}
                    placeholder="Carrera o programa"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      label="Rol en Fundación"
                      value={staffForm.foundationRole}
                      onChange={(e) => setStaffForm({ ...staffForm, foundationRole: e.target.value })}
                      placeholder="Ej. Apoyo en talleres"
                    />
                    <Field
                      label="Duración (Meses)"
                      type="number"
                      value={staffForm.durationMonths}
                      onChange={(e) => setStaffForm({ ...staffForm, durationMonths: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="secondary" type="button" onClick={() => setIsStaffModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit">
                  Guardar Colaborador
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: Nuevo Taller (workshops)                                 */}
      {/* ============================================================== */}
      {isWorkshopModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-xl font-extrabold text-foreground">Crear Nuevo Taller</h2>
              <button
                type="button"
                onClick={() => setIsWorkshopModalOpen(false)}
                className="rounded-lg p-1 text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWorkshop} className="space-y-4">
              <Field
                label="Nombre del taller"
                required
                value={workshopForm.name}
                onChange={(e) => setWorkshopForm({ ...workshopForm, name: e.target.value })}
                placeholder="Ej. Taller de Lectura y Comprensión"
              />

              <Field
                label="Duración en minutos"
                type="number"
                min="15"
                max="300"
                required
                value={workshopForm.durationMinutes}
                onChange={(e) =>
                  setWorkshopForm({ ...workshopForm, durationMinutes: Number(e.target.value) })
                }
              />

              <TextArea
                label="Descripción del taller"
                rows={3}
                value={workshopForm.description}
                onChange={(e) => setWorkshopForm({ ...workshopForm, description: e.target.value })}
                placeholder="Objetivos pedagógicos, dinámicas y metodología..."
              />

              <TextArea
                label="Materiales e Insumos necesarios (workshop_supplies)"
                rows={2}
                value={workshopForm.workshopSupplies}
                onChange={(e) =>
                  setWorkshopForm({ ...workshopForm, workshopSupplies: e.target.value })
                }
                placeholder="Materiales requeridos para desarrollar la actividad..."
              />

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="secondary" type="button" onClick={() => setIsWorkshopModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit">
                  Crear Taller
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: Programar Taller (professionals_workshops)              */}
      {/* ============================================================== */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-xl font-extrabold text-foreground">Programar Sesión de Taller</h2>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="rounded-lg p-1 text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-4">
              <SelectField
                label="Taller a dictar"
                required
                value={scheduleForm.workshopId}
                onChange={(e) => setScheduleForm({ ...scheduleForm, workshopId: e.target.value })}
              >
                <option value="">Selecciona un taller…</option>
                {workshops.map((w) => (
                  <option key={w.workshopId} value={w.workshopId}>
                    {w.name} ({w.durationMinutes} min)
                  </option>
                ))}
              </SelectField>

              <SelectField
                label="Tallerista / Profesional a cargo"
                required
                value={scheduleForm.professionalId}
                onChange={(e) =>
                  setScheduleForm({ ...scheduleForm, professionalId: e.target.value })
                }
              >
                <option value="">Selecciona un profesional…</option>
                {staffList.map((s) => (
                  <option
                    key={s.staffId}
                    value={s.professional?.professionalId || s.staffId}
                  >
                    {s.fullName} {s.professional?.timeDonor ? "· (Voluntario)" : ""}
                  </option>
                ))}
              </SelectField>

              <div className="grid grid-cols-2 gap-3">
                <SelectField
                  label="Día de la semana"
                  value={scheduleForm.dayWeek}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, dayWeek: e.target.value })}
                >
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </SelectField>

                <Field
                  label="Vigente hasta"
                  type="date"
                  value={scheduleForm.endsOn}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, endsOn: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Hora de Inicio"
                  type="time"
                  required
                  value={scheduleForm.timeStarts}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, timeStarts: e.target.value })}
                />
                <Field
                  label="Hora de Finalización"
                  type="time"
                  required
                  value={scheduleForm.timeEnds}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, timeEnds: e.target.value })}
                />
              </div>

              <TextArea
                label="Observaciones"
                rows={2}
                value={scheduleForm.observations}
                onChange={(e) =>
                  setScheduleForm({ ...scheduleForm, observations: e.target.value })
                }
                placeholder="Indicaciones para los niños, cupo o materiales especiales..."
              />

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="secondary" type="button" onClick={() => setIsScheduleModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit">
                  Guardar Programación
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: Registrar Turno (staff_assistance)                       */}
      {/* ============================================================== */}
      {isShiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-xl font-extrabold text-foreground">Registrar Turno de Trabajo</h2>
              <button
                type="button"
                onClick={() => setIsShiftModalOpen(false)}
                className="rounded-lg p-1 text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordShift} className="space-y-4">
              <SelectField
                label="Colaborador / Tallerista"
                required
                value={shiftForm.staffId}
                onChange={(e) => setShiftForm({ ...shiftForm, staffId: e.target.value })}
              >
                <option value="">Seleccionar colaborador…</option>
                {staffList.map((s) => (
                  <option key={s.staffId} value={s.staffId}>
                    {s.fullName}
                  </option>
                ))}
              </SelectField>

              <Field
                label="Fecha de turno"
                type="date"
                required
                value={shiftForm.dateWorking}
                onChange={(e) => setShiftForm({ ...shiftForm, dateWorking: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Hora de Entrada"
                  type="time"
                  required
                  value={shiftForm.timeIn}
                  onChange={(e) => setShiftForm({ ...shiftForm, timeIn: e.target.value })}
                />
                <Field
                  label="Hora de Salida"
                  type="time"
                  required
                  value={shiftForm.timeOut}
                  onChange={(e) => setShiftForm({ ...shiftForm, timeOut: e.target.value })}
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="secondary" type="button" onClick={() => setIsShiftModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit">
                  Registrar Turno
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: Pase de Asistencia a Taller (children_assistance)        */}
      {/* ============================================================== */}
      {isAttendanceModalOpen && selectedSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-border bg-surface p-6 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <div>
                <h2 className="text-xl font-extrabold text-foreground">
                  Asistencia: {selectedSchedule.workshop?.name || "Taller"}
                </h2>
                <p className="text-xs text-muted">
                  {selectedSchedule.dayWeek} · {selectedSchedule.timeStarts} a {selectedSchedule.timeEnds} · Tallerista: {selectedSchedule.professionalName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAttendanceModalOpen(false)}
                className="rounded-lg p-1 text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {children.map((child) => {
                const rec = attendanceRecords[child.childId] || {
                  willAssist: true,
                  asisted: false,
                  completeWorkshop: false,
                  behavior: "Normal",
                }

                return (
                  <div
                    key={child.childId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border bg-surface-muted/30 p-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={`${child.firstName} ${child.lastName}`} size="sm" />
                      <div>
                        <p className="font-extrabold text-foreground text-sm">
                          {child.firstName} {child.lastName}
                        </p>
                        <p className="text-xs text-muted">Doc: {child.documentNumber || "S/D"}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-foreground">
                        <input
                          type="checkbox"
                          checked={rec.asisted}
                          onChange={(e) =>
                            setAttendanceRecords((prev) => ({
                              ...prev,
                              [child.childId]: { ...rec, asisted: e.target.checked },
                            }))
                          }
                          className="size-4 rounded text-primary focus:ring-primary"
                        />
                        Asistió
                      </label>

                      <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-foreground">
                        <input
                          type="checkbox"
                          checked={rec.completeWorkshop}
                          onChange={(e) =>
                            setAttendanceRecords((prev) => ({
                              ...prev,
                              [child.childId]: { ...rec, completeWorkshop: e.target.checked },
                            }))
                          }
                          className="size-4 rounded text-primary focus:ring-primary"
                        />
                        Completó
                      </label>

                      <input
                        type="text"
                        placeholder="Comportamiento…"
                        value={rec.behavior}
                        onChange={(e) =>
                          setAttendanceRecords((prev) => ({
                            ...prev,
                            [child.childId]: { ...rec, behavior: e.target.value },
                          }))
                        }
                        className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs outline-none focus:border-primary w-36"
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-5 border-t border-border pt-4 flex justify-between items-center">
              <span className="text-xs text-muted">
                {Object.values(attendanceRecords).filter((r) => r.asisted).length} de {children.length} niños presentes
              </span>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setIsAttendanceModalOpen(false)}>
                  Cerrar
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    alert("Asistencia de la sesión guardada con éxito en la bitácora.")
                    setIsAttendanceModalOpen(false)
                  }}
                >
                  Guardar Asistencia
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
