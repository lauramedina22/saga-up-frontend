import {
  normalizeBoolean,
  normalizeId,
  normalizeText,
  toForeignKey,
} from "./modelUtils.js"

// Campos según API.md (/children-assistance). El backend usa "attended";
// en el frontend se conserva la propiedad "asisted" que usan vista y formulario.
export function toChildrenAssistanceModel(assistance = {}) {
  return {
    childrenAssistanceId: normalizeId(assistance.children_assistance_id),
    childId: normalizeId(assistance.child_id),
    professionalWorkshopId: normalizeId(assistance.professional_workshop_id),
    willAssist: normalizeBoolean(assistance.will_assist),
    asisted: normalizeBoolean(assistance.attended),
    completeWorkshop: normalizeBoolean(assistance.complete_workshop),
    behavior: assistance.behavior ?? "",
  }
}

export function toChildrenAssistancePayload(assistance = {}) {
  return {
    child_id: toForeignKey(assistance.childId, "Beneficiario"),
    professional_workshop_id: toForeignKey(
      assistance.professionalWorkshopId,
      "ID de sesión de taller",
    ),
    will_assist: normalizeBoolean(assistance.willAssist),
    attended: normalizeBoolean(assistance.asisted),
    complete_workshop: normalizeBoolean(assistance.completeWorkshop),
    behavior: normalizeText(assistance.behavior),
  }
}
