import {
  normalizeBoolean,
  normalizeDate,
  normalizeId,
  normalizeNumber,
} from "./modelUtils.js"

export function toStaffModel(raw = {}) {
  return {
    staffId: normalizeId(raw.staff_id ?? raw.id),
    fullName: raw.full_name ?? raw.name ?? "",
    documentTypeId: normalizeNumber(raw.document_type_id),
    documentNumber: raw.document_number ?? "",
    roleId: normalizeNumber(raw.staff_role_id ?? raw.role_id),
    hireDate: normalizeDate(raw.hire_date),
    exitDate: normalizeDate(raw.exit_date),
    contractTypeId: normalizeNumber(raw.contract_type_id),
    statusId: normalizeNumber(raw.staff_status_id ?? raw.status_id ?? 1),
    phone: raw.phone ?? "",
    email: raw.email ?? "",
    securityUserId: raw.security_user_id ?? null,
    hoursWorked: normalizeNumber(raw.hours_worked ?? 0),
    hoursPayed: normalizeNumber(raw.hours_payed ?? 0),
    // Relaciones opcionales incrustadas
    professional: raw.professional ? toProfessionalModel(raw.professional) : null,
    intern: raw.intern ? toInternModel(raw.intern) : null,
  }
}

export function toStaffPayload(model = {}) {
  return {
    full_name: model.fullName ?? "",
    document_type_id: normalizeNumber(model.documentTypeId),
    document_number: model.documentNumber ?? "",
    staff_role_id: normalizeNumber(model.roleId),
    hire_date: normalizeDate(model.hireDate),
    contract_type_id: normalizeNumber(model.contractTypeId),
    staff_status_id: normalizeNumber(model.statusId),
    phone: model.phone ?? "",
    email: model.email ?? "",
  }
}

export function toProfessionalModel(raw = {}) {
  return {
    professionalId: normalizeId(raw.professional_id ?? raw.id),
    staffId: normalizeId(raw.staff_id),
    titles: raw.titles ?? "",
    institutions: raw.institutions ?? "",
    observations: raw.observations ?? "",
    timeDonor: normalizeBoolean(raw.time_donor),
  }

}

export function toProfessionalPayload(model = {}) {
  return {
    staff_id: normalizeId(model.staffId),
    titles: model.titles ?? "",
    institutions: model.institutions ?? "",
    observations: model.observations ?? "",
    time_donor: normalizeBoolean(model.timeDonor),
  }
}

export function toInternModel(raw = {}) {
  return {
    internId: normalizeId(raw.intern_id ?? raw.id),
    staffId: normalizeId(raw.staff_id),
    university: raw.university ?? "",
    career: raw.career ?? "",
    foundationRole: raw.foundation_role ?? "",
    durationMonths: normalizeNumber(raw.duration_months),
  }
}

export function toInternPayload(model = {}) {
  return {
    staff_id: normalizeId(model.staffId),
    university: model.university ?? "",
    career: model.career ?? "",
    foundation_role: model.foundationRole ?? "",
    duration_months: normalizeNumber(model.durationMonths),
  }
}

function timeToDecimalHours(value) {
  if (value === undefined || value === null || value === "") return null
  const match = String(value).match(/^(\d{1,2}):([0-5]\d)$/)
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23) return null
  return `${hours}.${String(minutes).padStart(2, "0")}`
}

function decimalHoursToTime(value) {
  if (value === undefined || value === null || value === "") return ""
  const text = String(value).trim()
  if (/^\d{1,2}:\d{2}$/.test(text)) return text
  const match = text.match(/^(\d{1,2})(?:[.,](\d{1,2}))?$/)
  if (!match) return text
  const hours = Number(match[1])
  const minutes = Number(match[2] || "0")
  if (hours > 23 || minutes > 59) return text
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

export function toStaffAssistanceModel(raw = {}) {
  return {
    staffAssistanceId: normalizeId(raw.staff_assistance_id ?? raw.staff_assistance ?? raw.id),
    staffId: normalizeId(raw.staff_id),
    dateWorking: normalizeDate(raw.date_working),
    timeIn: decimalHoursToTime(raw.time_in),
    timeOut: decimalHoursToTime(raw.time_out),
  }
}

export function toStaffAssistancePayload(model = {}) {
  return {
    staff_id: normalizeId(model.staffId),
    date_working: normalizeDate(model.dateWorking),
    time_in: timeToDecimalHours(model.timeIn),
    time_out: timeToDecimalHours(model.timeOut),
  }
}
