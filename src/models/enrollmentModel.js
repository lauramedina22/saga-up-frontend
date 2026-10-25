import {
  normalizeDate,
  normalizeNumber,
  readValue,
} from "./modelUtils.js"

export function toEnrollmentModel(rawEnrollment = {}) {
  return {
    id: readValue(rawEnrollment, "enrollment_id", "id"),
    childId: readValue(rawEnrollment, "child_id", "childId", "ninoId"),
    year: normalizeNumber(
      readValue(rawEnrollment, "year", "anio", "enrollment_year"),
    ),
    startDate: normalizeDate(
      readValue(rawEnrollment, "start_date", "startDate", "fechaInicio"),
    ),
    status: readValue(rawEnrollment, "status", "estado") ?? "",
    amount: normalizeNumber(
      readValue(rawEnrollment, "amount", "valor"),
    ),
  }
}
