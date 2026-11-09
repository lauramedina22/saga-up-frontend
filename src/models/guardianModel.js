import {
  normalizeId,
  normalizeText,
  readRelationLabel,
  readValue,
  toForeignKey,
} from "./modelUtils.js"

// Campos según API.md (/guardians): document_type_id y legal_status_id son FK
export function toGuardianModel(guardian = {}) {
  const documentTypeId = normalizeId(readValue(guardian, "document_type_id"))
  const legalStatusId = normalizeId(readValue(guardian, "legal_status_id"))

  return {
    guardianId: normalizeId(guardian.guardian_id),
    fullName: guardian.full_name ?? "",
    documentTypeId,
    documentType:
      readRelationLabel(
        guardian,
        ["document_types", "document_type"],
        "document_type_id",
      ) || documentTypeId,
    documentNumber: guardian.document_number ?? "",
    phone: guardian.phone ?? "",
    address: guardian.address ?? "",
    legalStatusId,
    legalStatus:
      readRelationLabel(
        guardian,
        ["legal_statuses", "legal_status"],
        "legal_status_id",
      ) || legalStatusId,
  }
}

export function toGuardianPayload(guardian = {}) {
  return {
    full_name: guardian.fullName,
    document_type_id: toForeignKey(
      guardian.documentTypeId ?? guardian.documentType,
      "Tipo de documento",
    ),
    document_number: normalizeText(guardian.documentNumber),
    phone: normalizeText(guardian.phone),
    address: normalizeText(guardian.address),
    legal_status_id: toForeignKey(
      guardian.legalStatusId ?? guardian.legalStatus,
      "Situación jurídica frente al niño",
    ),
  }
}
