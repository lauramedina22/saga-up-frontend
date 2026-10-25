import {
  normalizeDate,
  normalizeId,
  normalizeNumber,
} from "./modelUtils.js"

export function toEnrollmentModel(rawEnrollment = {}) {
  return {
    id: normalizeId(rawEnrollment.tuition_fee_id),
    childId: normalizeId(rawEnrollment.child_id),
    amount: normalizeNumber(rawEnrollment.amount),
    paidDate: normalizeDate(rawEnrollment.paid_date),
    paymentMethod: rawEnrollment.payment_method ?? "",
    status: rawEnrollment.status ?? "",
  }
}
