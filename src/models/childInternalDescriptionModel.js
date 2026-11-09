import { normalizeId, normalizeText, toForeignKey } from "./modelUtils.js"

// Campos según API.md (/child-internal-descriptions)
export function toChildInternalDescriptionModel(description = {}) {
  return {
    childInternalDescriptionId: normalizeId(
      description.child_internal_description_id,
    ),
    childId: normalizeId(description.child_id),
    communicationWays: description.communication_ways ?? "",
    dailyRoutineHelp: description.daily_routine_help ?? "",
    likings: description.likings ?? "",
    crisisManagement: description.crisis_management ?? "",
  }
}

// child_id solo se envía al crear: no es editable en PUT/PATCH
export function toChildInternalDescriptionPayload(
  description = {},
  { includeChildId = false } = {},
) {
  const payload = {
    communication_ways: normalizeText(description.communicationWays),
    daily_routine_help: normalizeText(description.dailyRoutineHelp),
    likings: normalizeText(description.likings),
    crisis_management: normalizeText(description.crisisManagement),
  }
  if (includeChildId) {
    payload.child_id = toForeignKey(description.childId, "Beneficiario")
  }
  return payload
}
