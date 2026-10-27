import {
  normalizeDate,
  normalizeId,
  normalizeNumber,
  normalizeText,
  readRelationLabel,
  readValue,
  toForeignKey,
} from "./modelUtils.js"

// Campos según API.md (/children): sex_id, document_type_id, child_status_id son FKs
export function toChildModel(child = {}) {
  const sexId = normalizeId(readValue(child, "sex_id"))
  const documentTypeId = normalizeId(readValue(child, "document_type_id"))
  const statusId = normalizeId(readValue(child, "child_status_id"))

  return {
    childId: normalizeId(child.child_id),
    firstName: child.first_name ?? "",
    lastName: child.last_name ?? "",
    birthDate: normalizeDate(child.birth_date),
    sexId,
    sex: readRelationLabel(child, ["sexes", "sex"], "sex_id") || sexId,
    documentTypeId,
    documentType:
      readRelationLabel(child, ["document_types", "document_type"], "document_type_id") ||
      documentTypeId,
    documentNumber: child.document_number ?? "",
    admissionDate: normalizeDate(child.admission_date),
    exitDate: normalizeDate(child.exit_date),
    statusId: normalizeNumber(statusId),
    status:
      readRelationLabel(
        child,
        ["child_statuses", "child_status", "status"],
        "child_status_id",
      ) || statusId,
    notes: child.notes ?? "",
  }
}

// exit_date solo se acepta en PUT/PATCH (includeExitDate)
export function toChildPayload(child = {}, { includeExitDate = false } = {}) {
  const payload = {
    first_name: child.firstName,
    last_name: child.lastName,
    birth_date: normalizeDate(child.birthDate),
    sex_id: toForeignKey(child.sexId ?? child.sex, "Sexo"),
    document_type_id: toForeignKey(
      child.documentTypeId ?? child.documentType,
      "Tipo de documento",
    ),
    document_number: normalizeText(child.documentNumber),
    admission_date: normalizeDate(child.admissionDate),
    child_status_id: toForeignKey(
      child.statusId ?? child.childStatusId,
      "Estado del beneficiario",
    ),
    notes: normalizeText(child.notes),
  }
  if (includeExitDate) payload.exit_date = normalizeDate(child.exitDate)
  return payload
}
