import apiClient from "../api/apiClient"
import {
  toStaffModel,
  toStaffPayload,
  toProfessionalModel,
  toInternModel,
  toStaffAssistanceModel,
  toStaffAssistancePayload,
} from "../models/staffModel.js"
import {
  toWorkshopModel,
  toWorkshopPayload,
  toProfessionalWorkshopModel,
  toProfessionalWorkshopPayload,
} from "../models/workshopModel.js"

// Datos iniciales de demostración basados en las entidades del backend
const MOCK_STAFF = [
  {
    staff_id: "1",
    full_name: "Dra. Carolina Méndez",
    document_type_id: 1,
    document_number: "1032489123",
    role_id: 1,
    hire_date: "2024-02-01",
    exit_date: null,
    contract_type_id: 1,
    status_id: 1,
    phone: "3104567890",
    email: "carolina.mendez@fundacionsagaup.org",
    hours_worked: 120,
    hours_payed: 110,
    professional: {
      professional_id: "1",
      staff_id: "1",
      titles: "Lic. en Educación Especial, Msc. en Neuropsicología",
      institutions: "Universidad Pedagógica Nacional",
      observations: "Especialista en estimulación temprana y lenguaje",
      time_donor: false,
    },
  },
  {
    staff_id: "2",
    full_name: "Prof. Andrés Felipe Morales",
    document_type_id: 1,
    document_number: "1019234871",
    role_id: 2,
    hire_date: "2024-03-15",
    exit_date: null,
    contract_type_id: 2,
    status_id: 1,
    phone: "3209876543",
    email: "andres.morales@fundacionsagaup.org",
    hours_worked: 85,
    hours_payed: 85,
    professional: {
      professional_id: "2",
      staff_id: "2",
      titles: "Maestro en Artes Plásticas y Terapia Ocupacional",
      institutions: "Universidad Distrital",
      observations: "Tallerista de artes plásticas, motricidad y expresión",
      time_donor: true,
    },
  },
  {
    staff_id: "3",
    full_name: "Valentina Gómez Ríos",
    document_type_id: 1,
    document_number: "1028394012",
    role_id: 3,
    hire_date: "2025-01-10",
    exit_date: null,
    contract_type_id: 3,
    status_id: 1,
    phone: "3158765432",
    email: "valentina.gomez@estudiante.edu.co",
    hours_worked: 60,
    hours_payed: 0,
    intern: {
      intern_id: "1",
      staff_id: "3",
      university: "Universidad de La Sabana",
      career: "Psicología Infantil",
      foundation_role: "Apoyo en talleres de habilidades socioemocionales",
      duration_months: 6,
    },
  },
]

const MOCK_WORKSHOPS = [
  {
    workshop_id: "1",
    name: "Arte Terapéutico y Expresión Emocional",
    duration_minutes: 90,
    description:
      "Taller vivencial enfocado en el desarrollo de la motricidad fina, expresión libre a través de la pintura y regulación emocional.",
    workshop_supplies:
      "Pinturas acrílicas no tóxicas, pinceles redondos y planos, pliegos de cartulina, delantales, plastilina moldeable.",
  },
  {
    workshop_id: "2",
    name: "Habilidades Comunicativas y Lenguaje",
    duration_minutes: 60,
    description:
      "Espacio de estimulación verbal y no verbal con dinámicas de narración, juegos fonológicos y uso de pictogramas.",
    workshop_supplies:
      "Tarjetas de pictogramas, títeres de tela, espejos pequeños individuales, cuentos ilustrados.",
  },
  {
    workshop_id: "3",
    name: "Música, Ritmo y Coordinación Sensorial",
    duration_minutes: 75,
    description:
      "Integración sensorial a través de instrumentos de percusión menor, rondas musicales y patrones de movimiento corporal.",
    workshop_supplies:
      "Maracas, tamborines, xilófonos infantiles, pañoletas de colores, reproductor de sonido.",
  },
]

const MOCK_SCHEDULES = [
  {
    professional_workshop_id: "1",
    professional_id: "2",
    workshop_id: "1",
    day_week: "Martes",
    ends_on: "2026-12-15",
    time_starts: "14:00",
    time_ends: "15:30",
    observations: "Grupo de 8 niños. Traer ropa cómoda para pintura.",
    professional_name: "Prof. Andrés Felipe Morales",
    workshop: MOCK_WORKSHOPS[0],
  },
  {
    professional_workshop_id: "2",
    professional_id: "1",
    workshop_id: "2",
    day_week: "Jueves",
    ends_on: "2026-12-15",
    time_starts: "10:00",
    time_ends: "11:00",
    observations: "Enfoque en niños con comunicación aumentativa.",
    professional_name: "Dra. Carolina Méndez",
    workshop: MOCK_WORKSHOPS[1],
  },
]

const MOCK_SHIFTS = [
  {
    staff_assistance_id: "1",
    staff_id: "1",
    date_working: "2026-10-24",
    time_in: "08:00",
    time_out: "13:00",
  },
  {
    staff_assistance_id: "2",
    staff_id: "2",
    date_working: "2026-10-24",
    time_in: "13:30",
    time_out: "17:00",
  },
]

let inMemoryStaff = [...MOCK_STAFF]
let inMemoryWorkshops = [...MOCK_WORKSHOPS]
let inMemorySchedules = [...MOCK_SCHEDULES]
let inMemoryShifts = [...MOCK_SHIFTS]

export const staffWorkshopService = {
  // Staff y Profesionales / Interns
  async getStaff() {
    try {
      const response = await apiClient.get("/staff")
      const list = Array.isArray(response)
        ? response
        : response?.staff ?? response?.data
      if (Array.isArray(list) && list.length > 0) {
        return list.map(toStaffModel)
      }
    } catch {
      // Usar mock si la API no tiene este endpoint
    }
    return inMemoryStaff.map(toStaffModel)
  },

  async createStaff(staffData, extraData = {}) {
    const newId = String(Date.now())
    const newStaffItem = {
      staff_id: newId,
      ...toStaffPayload(staffData),
      professional: extraData.professional
        ? {
            professional_id: `prof-${newId}`,
            staff_id: newId,
            ...extraData.professional,
          }
        : null,
      intern: extraData.intern
        ? {
            intern_id: `intern-${newId}`,
            staff_id: newId,
            ...extraData.intern,
          }
        : null,
    }
    try {
      await apiClient.post("/staff", newStaffItem)
    } catch {
      // fallback in-memory
    }
    inMemoryStaff = [newStaffItem, ...inMemoryStaff]
    return toStaffModel(newStaffItem)
  },

  // Talleres (workshops)
  async getWorkshops() {
    try {
      const response = await apiClient.get("/workshops")
      const list = Array.isArray(response)
        ? response
        : response?.workshops ?? response?.data
      if (Array.isArray(list) && list.length > 0) {
        return list.map(toWorkshopModel)
      }
    } catch {
      // Usar mock
    }
    return inMemoryWorkshops.map(toWorkshopModel)
  },

  async createWorkshop(workshopData) {
    const newId = String(Date.now())
    const newWorkshop = {
      workshop_id: newId,
      ...toWorkshopPayload(workshopData),
    }
    try {
      const response = await apiClient.post("/workshops", toWorkshopPayload(workshopData))
      if (response?.workshop_id || response?.id) {
        return toWorkshopModel(response)
      }
    } catch {
      // fallback
    }
    inMemoryWorkshops = [newWorkshop, ...inMemoryWorkshops]
    return toWorkshopModel(newWorkshop)
  },

  // Programación de talleres (professionals_workshops)
  async getSchedules() {
    try {
      const response = await apiClient.get("/professionals-workshops")
      const list = Array.isArray(response)
        ? response
        : response?.professionals_workshops ?? response?.data
      if (Array.isArray(list) && list.length > 0) {
        return list.map(toProfessionalWorkshopModel)
      }
    } catch {
      // Usar mock
    }
    return inMemorySchedules.map(toProfessionalWorkshopModel)
  },

  async createSchedule(scheduleData) {
    const newId = String(Date.now())
    const professionalStaff = inMemoryStaff.find(
      (s) => s.professional?.professional_id === scheduleData.professionalId || s.staff_id === scheduleData.professionalId
    )
    const workshop = inMemoryWorkshops.find(
      (w) => w.workshop_id === scheduleData.workshopId
    )

    const newSchedule = {
      professional_workshop_id: newId,
      ...toProfessionalWorkshopPayload(scheduleData),
      professional_name: professionalStaff?.full_name || "Tallerista asignado",
      workshop: workshop,
    }

    try {
      await apiClient.post("/professionals-workshops", toProfessionalWorkshopPayload(scheduleData))
    } catch {
      // fallback
    }

    inMemorySchedules = [newSchedule, ...inMemorySchedules]
    return toProfessionalWorkshopModel(newSchedule)
  },

  // Turnos de personal (staff_assistance)
  async getStaffAssistance() {
    try {
      const response = await apiClient.get("/staff-assistance")
      const list = Array.isArray(response)
        ? response
        : response?.staff_assistance ?? response?.data
      if (Array.isArray(list) && list.length > 0) {
        return list.map(toStaffAssistanceModel)
      }
    } catch {
      // fallback
    }
    return inMemoryShifts.map(toStaffAssistanceModel)
  },

  async recordStaffShift(shiftData) {
    const newId = String(Date.now())
    const newShift = {
      staff_assistance_id: newId,
      ...toStaffAssistancePayload(shiftData),
    }

    try {
      await apiClient.post("/staff-assistance", toStaffAssistancePayload(shiftData))
    } catch {
      // fallback
    }

    inMemoryShifts = [newShift, ...inMemoryShifts]
    return toStaffAssistanceModel(newShift)
  },
}
