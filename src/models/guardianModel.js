import { normalizeId } from "./modelUtils.js"

export function toGuardianModel(guardian = {}) {
  return {
    guardianId: normalizeId(guardian.guardian_id),
    fullName: guardian.full_name ?? "",
    documentType: guardian.document_type ?? "",
    documentNumber: guardian.document_number ?? "",
    phone: guardian.phone ?? "",
    address: guardian.address ?? "",
    legalStatus: guardian.legal_status ?? "",
  }
}

export function toGuardianPayload(guardian = {}) {
  return {
    full_name: guardian.fullName,
    document_type: guardian.documentType,
    document_number: guardian.documentNumber,
    phone: guardian.phone,
    address: guardian.address,
    legal_status: guardian.legalStatus,
  }
}
