import { normalizeDate, normalizeId } from "./modelUtils.js"

export function toChildGuardianModel(relationship = {}) {
  return {
    childGuardianId: normalizeId(relationship.child_guardian_id),
    childId: normalizeId(relationship.child_id),
    guardianId: normalizeId(relationship.guardian_id),
    guardianshipType: relationship.guardianship_type ?? "",
    startDate: normalizeDate(relationship.start_date),
    endDate: normalizeDate(relationship.end_date),
  }
}

export function toChildGuardianPayload(relationship = {}) {
  return {
    child_id: normalizeId(relationship.childId),
    guardian_id: normalizeId(relationship.guardianId),
    guardianship_type: relationship.guardianshipType,
    start_date: normalizeDate(relationship.startDate),
    end_date: normalizeDate(relationship.endDate),
  }
}
