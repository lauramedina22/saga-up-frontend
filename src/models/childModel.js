import { normalizeDate, normalizeId, normalizeNumber } from "./modelUtils.js"

export function toChildModel(child = {}) {
  return {
    childId: normalizeId(child.child_id),
    firstName: child.first_name ?? "",
    lastName: child.last_name ?? "",
    birthDate: normalizeDate(child.birth_date),
    sex: normalizeNumber(child.sex),
    documentType: normalizeNumber(child.document_type),
    documentNumber: child.document_number ?? "",
    admissionDate: normalizeDate(child.admission_date),
    exitDate: normalizeDate(child.exit_date),
    statusId: normalizeNumber(child.status_id),
    notes: child.notes ?? "",
  }
}

export function toChildPayload(child = {}) {
  return {
    first_name: child.firstName,
    last_name: child.lastName,
    birth_date: normalizeDate(child.birthDate),
    sex: normalizeNumber(child.sex),
    document_type: normalizeNumber(child.documentType),
    document_number: child.documentNumber,
    admission_date: normalizeDate(child.admissionDate),
    exit_date: normalizeDate(child.exitDate),
    status_id: normalizeNumber(child.statusId),
    notes: child.notes,
  }
}
