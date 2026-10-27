import {
  normalizeDate,
  normalizeId,
  normalizeNumber,
  readRelationLabel,
  readValue,
  toForeignKey,
} from "./modelUtils.js"

// Campos según API.md (/tuition): payment_method_id y tuition_status_id son FK
export function toEnrollmentModel(rawEnrollment = {}) {
  const paymentMethodId = normalizeId(readValue(rawEnrollment, "payment_method_id"))
  const tuitionStatusId = normalizeId(readValue(rawEnrollment, "tuition_status_id"))

  return {
    id: normalizeId(rawEnrollment.tuition_fee_id),
    childId: normalizeId(rawEnrollment.child_id),
    amount: normalizeNumber(rawEnrollment.amount),
    paidDate: normalizeDate(rawEnrollment.paid_date),
    paymentMethodId,
    paymentMethod: readRelationLabel(
      rawEnrollment,
      ["payment_methods", "payment_method"],
      "payment_method_id",
    ) || paymentMethodId,
    tuitionStatusId,
    status:
      readRelationLabel(
        rawEnrollment,
        ["tuition_statuses", "tuition_status", "status"],
        "tuition_status_id",
      )
        ?.trim()
        ?.toLocaleLowerCase("es-CO") || "sin estado",
  }
}

export function toTuitionPayload(tuition = {}) {
  return {
    child_id: toForeignKey(tuition.child_id ?? tuition.childId, "Beneficiario"),
    amount: tuition.amount ? Number(tuition.amount) : null,
    paid_date: normalizeDate(tuition.paid_date ?? tuition.paidDate),
    payment_method_id: toForeignKey(
      tuition.payment_method_id ?? tuition.paymentMethodId,
      "Medio de pago",
    ),
    tuition_status_id: toForeignKey(
      tuition.tuition_status_id ?? tuition.tuitionStatusId,
      "Estado del pago",
    ),
  }
}
