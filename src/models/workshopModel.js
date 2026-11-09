import {
  normalizeDate,
  normalizeId,
  normalizeNumber,
} from "./modelUtils.js"

export function toWorkshopModel(raw = {}) {
  return {
    workshopId: normalizeId(raw.workshop_id ?? raw.id),
    name: raw.name ?? "",
    durationMinutes: normalizeNumber(raw.duration_minutes ?? 60),
    description: raw.description ?? "",
    workshopSupplies: raw.workshop_supplies ?? "",
  }
}

export function toWorkshopPayload(model = {}) {
  return {
    name: model.name ?? "",
    duration_minutes: normalizeNumber(model.durationMinutes ?? 60),
    description: model.description ?? "",
    workshop_supplies: model.workshopSupplies ?? "",
  }
}

export function toProfessionalWorkshopModel(raw = {}) {
  return {
    professionalWorkshopId: normalizeId(
      raw.professional_workshop_id ?? raw.id,
    ),
    professionalId: normalizeId(raw.professional_id),
    workshopId: normalizeId(raw.workshop_id),
    dayWeek: raw.day_week ?? "",
    endsOn: normalizeDate(raw.ends_on),
    timeStarts: raw.time_starts ?? "",
    timeEnds: raw.time_ends ?? "",
    observations: raw.observations ?? "",
    // Campos incrustados en caso de joins
    workshop: raw.workshop ? toWorkshopModel(raw.workshop) : null,
    professionalName: raw.professional_name ?? "",
  }
}

export function toProfessionalWorkshopPayload(model = {}) {
  return {
    professional_id: normalizeId(model.professionalId),
    workshop_id: normalizeId(model.workshopId),
    day_week: model.dayWeek ?? "",
    ends_on: normalizeDate(model.endsOn),
    time_starts: model.timeStarts ?? "",
    time_ends: model.timeEnds ?? "",
    observations: model.observations ?? "",
  }
}
