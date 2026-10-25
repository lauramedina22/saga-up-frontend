import { normalizeId } from "./modelUtils.js"

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

export function toChildInternalDescriptionPayload(description = {}) {
  return {
    child_id: normalizeId(description.childId),
    communication_ways: description.communicationWays ?? "",
    daily_routine_help: description.dailyRoutineHelp ?? "",
    likings: description.likings ?? "",
    crisis_management: description.crisisManagement ?? "",
  }
}
