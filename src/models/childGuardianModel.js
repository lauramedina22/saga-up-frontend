import {
  normalizeDate,
  normalizeId,
  readRelationLabel,
  readValue,
  toForeignKey,
} from "./modelUtils.js"

// Campos según API.md (/children-guardians)
export function toChildGuardianModel(relationship = {}) {
  const guardianshipTypeId = normalizeId(
    readValue(relationship, "guardianship_type_id"),
  )

  return {
    childGuardianId: normalizeId(relationship.child_guardian_id),
    childId: normalizeId(relationship.child_id),
    guardianId: normalizeId(relationship.guardian_id),
    guardianshipTypeId,
    guardianshipType:
      readRelationLabel(
        relationship,
        ["guardianship_types", "guardianship_type"],
        "guardianship_type_id",
      ) || guardianshipTypeId,
    startDate: normalizeDate(relationship.start_date),
    endDate: normalizeDate(relationship.end_date),
  }
}

export function toChildGuardianPayload(relationship = {}) {
  return {
    child_id: toForeignKey(relationship.childId, "Beneficiario"),
    guardian_id: toForeignKey(relationship.guardianId, "Acudiente"),
    guardianship_type_id: toForeignKey(
      relationship.guardianshipTypeId ?? relationship.guardianshipType,
      "Tipo de vínculo",
    ),
    start_date: normalizeDate(relationship.startDate),
    end_date: normalizeDate(relationship.endDate),
  }
}
