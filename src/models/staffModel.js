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
    roleId: normalizeNumber(raw.role_id),
    hireDate: normalizeDate(raw.hire_date),
    exitDate: normalizeDate(raw.exit_date),
    contractTypeId: normalizeNumber(raw.contract_type_id),
    statusId: normalizeNumber(raw.status_id ?? 1),
    phone: raw.phone ?? "",
    email: raw.email ?? "",
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
    role_id: normalizeNumber(model.roleId),
    hire_date: normalizeDate(model.hireDate),
    exit_date: normalizeDate(model.exitDate),
    contract_type_id: normalizeNumber(model.contractTypeId),
    status_id: normalizeNumber(model.statusId ?? 1),
    phone: model.phone ?? "",
    email: model.email ?? "",
    hours_worked: normalizeNumber(model.hoursWorked ?? 0),
    hours_payed: normalizeNumber(model.hoursPayed ?? 0),
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

export function toStaffAssistanceModel(raw = {}) {
  return {
    staffAssistanceId: normalizeId(raw.staff_assistance_id ?? raw.staff_assistance ?? raw.id),
    staffId: normalizeId(raw.staff_id),
    dateWorking: normalizeDate(raw.date_working),
    timeIn: raw.time_in ?? "",
    timeOut: raw.time_out ?? "",
  }
}

export function toStaffAssistancePayload(model = {}) {
  return {
    staff_id: normalizeId(model.staffId),
    date_working: normalizeDate(model.dateWorking),
    time_in: model.timeIn ?? "",
    time_out: model.timeOut ?? "",
  }
}
