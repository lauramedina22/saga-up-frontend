import { normalizeBoolean, normalizeId } from "./modelUtils.js"

export function toChildrenAssistanceModel(assistance = {}) {
  return {
    childrenAssistanceId: normalizeId(assistance.children_assistance_id),
    childId: normalizeId(assistance.child_id),
    professionalWorkshopId: normalizeId(assistance.professional_workshop_id),
    willAssist: normalizeBoolean(assistance.will_assist),
    asisted: normalizeBoolean(assistance.asisted),
    completeWorkshop: normalizeBoolean(assistance.complete_workshop),
    behavior: assistance.behavior ?? "",
  }
}

export function toChildrenAssistancePayload(assistance = {}) {
  return {
    child_id: normalizeId(assistance.childId),
    professional_workshop_id: normalizeId(
      assistance.professionalWorkshopId,
    ),
    will_assist: normalizeBoolean(assistance.willAssist),
    asisted: normalizeBoolean(assistance.asisted),
    complete_workshop: normalizeBoolean(assistance.completeWorkshop),
    behavior: assistance.behavior ?? "",
  }
}
