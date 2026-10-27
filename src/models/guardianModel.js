import {
  normalizeId,
  normalizeText,
  readRelationLabel,
  toForeignKey,
} from "./modelUtils.js"

// Campos según API.md (/guardians): document_type_id y legal_status_id son FK
export function toGuardianModel(guardian = {}) {
  return {
    guardianId: normalizeId(guardian.guardian_id),
    fullName: guardian.full_name ?? "",
    documentType: readRelationLabel(
      guardian,
      ["document_types", "document_type"],
      "document_type_id",
    ),
    documentNumber: guardian.document_number ?? "",
    phone: guardian.phone ?? "",
    address: guardian.address ?? "",
    legalStatus: readRelationLabel(
      guardian,
      ["legal_statuses", "legal_status"],
      "legal_status_id",
    ),
  }
}

export function toGuardianPayload(guardian = {}) {
  return {
    full_name: guardian.fullName,
    document_type_id: toForeignKey(guardian.documentType, "Tipo de documento"),
    document_number: normalizeText(guardian.documentNumber),
    phone: normalizeText(guardian.phone),
    address: normalizeText(guardian.address),
    legal_status_id: toForeignKey(
      guardian.legalStatus,
      "Situación jurídica frente al niño",
    ),
  }
}
