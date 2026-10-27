import {
  normalizeDate,
  normalizeId,
  normalizeNumber,
  normalizeText,
  readValue,
  toForeignKey,
} from "./modelUtils.js"

// Campos según API.md (/children): sex_id, document_type_id, child_status_id
export function toChildModel(child = {}) {
  return {
    childId: normalizeId(child.child_id),
    firstName: child.first_name ?? "",
    lastName: child.last_name ?? "",
    birthDate: normalizeDate(child.birth_date),
    sex: normalizeNumber(readValue(child, "sex_id")),
    documentType: normalizeNumber(readValue(child, "document_type_id")),
    documentNumber: child.document_number ?? "",
    admissionDate: normalizeDate(child.admission_date),
    exitDate: normalizeDate(child.exit_date),
    statusId: normalizeNumber(readValue(child, "child_status_id")),
    notes: child.notes ?? "",
  }
}

// exit_date solo se acepta en PUT/PATCH (includeExitDate)
export function toChildPayload(child = {}, { includeExitDate = false } = {}) {
  const payload = {
    first_name: child.firstName,
    last_name: child.lastName,
    birth_date: normalizeDate(child.birthDate),
    sex_id: toForeignKey(child.sex, "Sexo (código)"),
    document_type_id: toForeignKey(
      child.documentType,
      "Tipo de documento (código)",
    ),
    document_number: normalizeText(child.documentNumber),
    admission_date: normalizeDate(child.admissionDate),
    child_status_id: toForeignKey(child.statusId, "Estado (código)"),
    notes: normalizeText(child.notes),
  }
  if (includeExitDate) payload.exit_date = normalizeDate(child.exitDate)
  return payload
}
