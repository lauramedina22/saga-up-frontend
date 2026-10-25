import { normalizeId } from "./modelUtils.js"

export function toChildRecordModel(record = {}) {
  return {
    recordId: normalizeId(record.record_id),
    childId: normalizeId(record.child_id),
    eps: record.eps ?? "",
    state: record.state ?? "",
    ipsAssigned: record.ips_assigned ?? "",
    allergies: record.allergies ?? "",
    mealRestrictions: record.meal_restrictions ?? "",
    medicines: record.medicines ?? "",
    specialConditions: record.special_conditions ?? "",
  }
}

export function toChildRecordPayload(record = {}) {
  return {
    child_id: normalizeId(record.childId),
    eps: record.eps ?? "",
    state: record.state ?? "",
    ips_assigned: record.ipsAssigned ?? "",
    allergies: record.allergies ?? "",
    meal_restrictions: record.mealRestrictions ?? "",
    medicines: record.medicines ?? "",
    special_conditions: record.specialConditions ?? "",
  }
}
