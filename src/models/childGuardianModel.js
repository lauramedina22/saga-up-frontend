import {
  normalizeBoolean,
  normalizeDate,
  readValue,
} from "./modelUtils.js"

export function toChildGuardianModel(rawRelationship = {}) {
  return {
    id: readValue(rawRelationship, "child_guardian_id", "id"),
    childId: readValue(rawRelationship, "child_id", "childId"),
    guardianId: readValue(rawRelationship, "guardian_id", "guardianId"),
    guardianshipType:
      readValue(
        rawRelationship,
        "guardianship_type",
        "guardianshipType",
      ) ?? "",
    startDate: normalizeDate(
      readValue(rawRelationship, "start_date", "startDate"),
    ),
    endDate: normalizeDate(readValue(rawRelationship, "end_date", "endDate")),
    isPrimary: normalizeBoolean(
      readValue(rawRelationship, "is_primary", "isPrimary"),
    ),
  }
}
