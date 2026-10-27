import { normalizeId, normalizeText, toForeignKey } from "./modelUtils.js"

// Campos según API.md (/child-records)
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

// child_id solo se envía al crear: no es editable en PUT/PATCH
export function toChildRecordPayload(record = {}, { includeChildId = false } = {}) {
  const payload = {
    eps: normalizeText(record.eps),
    state: normalizeText(record.state),
    ips_assigned: normalizeText(record.ipsAssigned),
    allergies: normalizeText(record.allergies),
    meal_restrictions: normalizeText(record.mealRestrictions),
    medicines: normalizeText(record.medicines),
    special_conditions: normalizeText(record.specialConditions),
  }
  if (includeChildId) {
    payload.child_id = toForeignKey(record.childId, "Beneficiario")
  }
  return payload
}
