import {
  normalizeBoolean,
  normalizeDate,
  readValue,
} from "./modelUtils.js"

export function toGuardianModel(rawGuardian = {}) {
  const fullName =
    readValue(rawGuardian, "full_name", "fullName", "nombre") ?? ""
  const nameParts = fullName.trim().split(/\s+/)
  const document = rawGuardian.document ?? {}
  const address = rawGuardian.address ?? {}

  return {
    id: readValue(rawGuardian, "guardian_id", "id"),
    fullName,
    firstName:
      readValue(rawGuardian, "first_name", "firstName", "nombres") ??
      nameParts[0] ??
      "",
    lastName:
      readValue(rawGuardian, "last_name", "lastName", "apellidos") ??
      nameParts.slice(1).join(" "),
    document: {
      type:
        readValue(document, "type") ??
        readValue(rawGuardian, "document_type", "documentType", "tipoDocumento") ??
        null,
      number:
        readValue(document, "number") ??
        readValue(
          rawGuardian,
          "document_number",
          "documentNumber",
          "numeroDocumento",
        ) ??
        null,
    },
    phone: readValue(rawGuardian, "phone", "telefono") ?? "",
    whatsapp: readValue(rawGuardian, "whatsapp") ?? "",
    email: readValue(rawGuardian, "email", "correo") ?? "",
    address: {
      street:
        readValue(address, "street", "address") ??
        readValue(rawGuardian, "address", "direccion") ??
        "",
      neighborhood:
        readValue(address, "neighborhood", "barrio") ??
        readValue(rawGuardian, "neighborhood", "barrio") ??
        "",
    },
    legalStatus:
      readValue(rawGuardian, "legal_status", "legalStatus", "parentesco") ?? "",
    relationship:
      readValue(rawGuardian, "relationship", "parentesco", "legal_status") ?? "",
    preferredChannel:
      readValue(rawGuardian, "preferred_channel", "canalPreferido") ?? "",
    emergencyContact: normalizeBoolean(
      readValue(rawGuardian, "emergency_contact", "contactoEmergencia"),
    ),
    dataConfirmed: normalizeBoolean(
      readValue(rawGuardian, "data_confirmed", "datosConfirmados"),
    ),
    lastConfirmation: normalizeDate(
      readValue(rawGuardian, "last_confirmation", "ultimaConfirmacion"),
    ),
    childrenIds:
      readValue(rawGuardian, "children_ids", "childrenIds") ?? [],
  }
}

export function toGuardianPayload(guardian = {}) {
  const document = guardian.document ?? {}
  const address = guardian.address ?? {}
  const fullName =
    readValue(guardian, "fullName") ||
    [
      readValue(guardian, "firstName", "nombres"),
      readValue(guardian, "lastName", "apellidos"),
    ]
      .filter(Boolean)
      .join(" ")

  return {
    full_name: fullName,
    document_type:
      readValue(document, "type") ??
      readValue(guardian, "tipoDocumento"),
    document_number:
      readValue(document, "number") ??
      readValue(guardian, "numeroDocumento"),
    phone: readValue(guardian, "phone", "telefono"),
    address: {
      street:
        readValue(address, "street") ?? readValue(guardian, "direccion"),
      neighborhood:
        readValue(address, "neighborhood") ?? readValue(guardian, "barrio"),
    },
    legal_status:
      readValue(guardian, "legalStatus", "parentesco"),
    whatsapp: readValue(guardian, "whatsapp"),
    email: readValue(guardian, "email", "correo"),
    preferred_channel:
      readValue(guardian, "preferredChannel", "canalPreferido"),
    emergency_contact: readValue(
      guardian,
      "emergencyContact",
      "contactoEmergencia",
    ),
    data_confirmed: readValue(
      guardian,
      "dataConfirmed",
      "datosConfirmados",
    ),
  }
}
