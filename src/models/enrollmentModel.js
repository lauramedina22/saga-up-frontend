import {
  normalizeDate,
  normalizeId,
  normalizeNumber,
  readRelationLabel,
} from "./modelUtils.js"

// Campos según API.md (/tuition): payment_method_id y tuition_status_id son FK
export function toEnrollmentModel(rawEnrollment = {}) {
  return {
    id: normalizeId(rawEnrollment.tuition_fee_id),
    childId: normalizeId(rawEnrollment.child_id),
    amount: normalizeNumber(rawEnrollment.amount),
    paidDate: normalizeDate(rawEnrollment.paid_date),
    paymentMethod: readRelationLabel(
      rawEnrollment,
      ["payment_methods", "payment_method"],
      "payment_method_id",
    ),
    // En minúsculas para coincidir con los filtros de la vista (pagado, pendiente, vencido)
    status: readRelationLabel(
      rawEnrollment,
      ["tuition_statuses", "tuition_status", "status"],
      "tuition_status_id",
    )
      .trim()
      .toLocaleLowerCase("es-CO"),
  }
}
