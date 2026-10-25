import {
  normalizeDate,
  normalizeNumber,
  readValue,
} from "./modelUtils.js"

export function toChildModel(rawChild = {}) {
  const firstName = readValue(rawChild, "first_name", "firstName", "nombres") ?? ""
  const lastName = readValue(rawChild, "last_name", "lastName", "apellidos") ?? ""
  const documentType = readValue(
    rawChild,
    "document_type",
    "documentType",
    "tipoDocumento",
  )
  const documentNumber = readValue(
    rawChild,
    "document_number",
    "documentNumber",
    "numeroDocumento",
  )
  const birthDate = normalizeDate(
    readValue(rawChild, "birth_date", "birthDate", "fechaNacimiento"),
  )
  const address = readValue(rawChild, "address", "direccion") ?? {}
  const enrollment = rawChild.enrollment ?? {}
  const health = rawChild.health ?? {}
  const support = rawChild.support ?? {}

  return {
    id: readValue(rawChild, "child_id", "id"),
    firstName,
    lastName,
    fullName:
      readValue(rawChild, "full_name", "fullName", "nombre") ||
      [firstName, lastName].filter(Boolean).join(" "),
    birthDate,
    age:
      normalizeNumber(readValue(rawChild, "age", "edad")) ??
      (birthDate
        ? Math.max(
            0,
            Math.floor(
              (Date.now() - new Date(`${birthDate}T00:00:00`).getTime()) /
                31_557_600_000,
            ),
          )
        : null),
    sex: normalizeNumber(readValue(rawChild, "sex")),
    document: {
      type: documentType ?? null,
      number: documentNumber ?? null,
    },
    admissionDate: normalizeDate(
      readValue(rawChild, "admission_date", "admissionDate"),
    ),
    exitDate: normalizeDate(readValue(rawChild, "exit_date", "exitDate")),
    statusId: normalizeNumber(readValue(rawChild, "status_id", "statusId")),
    notes: readValue(rawChild, "notes", "observaciones") ?? "",
    address: {
      street:
        readValue(address, "street", "address") ??
        readValue(rawChild, "street", "direccion") ??
        "",
      neighborhood:
        readValue(address, "neighborhood", "barrio") ??
        readValue(rawChild, "neighborhood", "barrio") ??
        "",
      city:
        readValue(address, "city", "ciudad") ??
        readValue(rawChild, "city", "ciudad") ??
        "",
    },
    enrollment: {
      status:
        readValue(enrollment, "status") ??
        readValue(rawChild, "enrollment_status", "estadoMatricula") ??
        "",
      year: normalizeNumber(
        readValue(enrollment, "year") ??
          readValue(rawChild, "enrollment_year", "anioMatricula"),
      ),
      paymentLevel:
        readValue(enrollment, "paymentLevel") ??
        readValue(rawChild, "payment_level", "nivelPago") ??
        "",
    },
    health: {
      eps: readValue(health, "eps") ?? readValue(rawChild, "eps") ?? "",
      affiliationState:
        readValue(health, "affiliationState") ??
        readValue(rawChild, "affiliation_state", "estadoAfiliacion") ??
        "",
      state: readValue(health, "state") ?? readValue(rawChild, "state") ?? "",
      ips:
        readValue(health, "ips", "assignedIps") ??
        readValue(rawChild, "ips_assigned", "ips") ??
        "",
      allergies:
        readValue(health, "allergies") ??
        readValue(rawChild, "allergies", "alergias") ??
        "",
      mealRestrictions:
        readValue(health, "mealRestrictions") ??
        readValue(rawChild, "meal_restrictions", "restriccionesAlimentarias") ??
        "",
      medicines:
        readValue(health, "medicines") ??
        readValue(rawChild, "medicines", "medicamentos") ??
        "",
      specialConditions:
        readValue(health, "specialConditions") ??
        readValue(
          rawChild,
          "special_conditions",
          "condicionesSalud",
          "cuidadosEspeciales",
        ) ??
        "",
      careNotes:
        readValue(health, "careNotes") ??
        readValue(rawChild, "care_notes", "cuidadosEspeciales") ??
        "",
    },
    support: {
      required:
        readValue(support, "required") ??
        readValue(rawChild, "support", "apoyos") ??
        "",
      formsOfCommunication:
        readValue(support, "formsOfCommunication") ??
        readValue(rawChild, "forms_of_communication", "formsOfCommunication") ??
        "",
      dailyRoutine:
        readValue(support, "dailyRoutine") ??
        readValue(rawChild, "routine_support", "apoyosRutina") ??
        "",
      likes:
        readValue(support, "likes") ??
        readValue(rawChild, "likes", "leGusta") ??
        "",
      crisisManagement:
        readValue(support, "crisisManagement") ??
        readValue(rawChild, "crisis_management", "manejoCrisis") ??
        "",
      school:
        readValue(support, "school") ??
        readValue(rawChild, "school", "institucionEducativa") ??
        "",
      grade:
        readValue(support, "grade") ?? readValue(rawChild, "grade", "grado") ?? "",
      schedule:
        readValue(support, "schedule") ??
        readValue(rawChild, "schedule", "jornada") ??
        "",
      externalTherapies:
        readValue(support, "externalTherapies") ??
        readValue(rawChild, "external_therapies", "terapiasExternas") ??
        "",
    },
    emergencyContact: readValue(
      rawChild,
      "emergency_contact",
      "contactoEmergencia",
    ) ?? "",
    authorizedPickup: readValue(
      rawChild,
      "authorized_pickup",
      "autorizadosRecoger",
    ) ?? "",
    photo: readValue(rawChild, "photo", "foto") ?? "",
    documents: readValue(rawChild, "documents", "documentos") ?? [],
    guardianId: readValue(rawChild, "guardian_id", "guardianId") ?? null,
    guardianIds: readValue(rawChild, "guardian_ids", "guardianIds") ?? [],
  }
}

export function toChildPayload(child = {}) {
  const address = child.address ?? {}
  const document = child.document ?? {}
  const health = child.health ?? {}
  const enrollment = child.enrollment ?? {}
  const support = child.support ?? {}

  return {
    first_name: readValue(child, "firstName", "nombres"),
    last_name: readValue(child, "lastName", "apellidos"),
    birth_date: normalizeDate(readValue(child, "birthDate", "fechaNacimiento")),
    sex: readValue(child, "sex"),
    document_type: readValue(document, "type") ??
      readValue(child, "tipoDocumento"),
    document_number: readValue(document, "number") ??
      readValue(child, "numeroDocumento"),
    admission_date: normalizeDate(readValue(child, "admissionDate")),
    exit_date: normalizeDate(readValue(child, "exitDate")),
    status_id: readValue(child, "statusId"),
    notes: readValue(child, "notes", "observaciones"),
    address: {
      street: readValue(address, "street") ?? readValue(child, "direccion"),
      neighborhood:
        readValue(address, "neighborhood") ?? readValue(child, "barrio"),
      city: readValue(address, "city") ?? readValue(child, "ciudad"),
    },
    enrollment_status:
      readValue(enrollment, "status") ??
      readValue(child, "estadoMatricula"),
    enrollment_year:
      readValue(enrollment, "year") ?? readValue(child, "anioMatricula"),
    health: {
      eps: readValue(health, "eps") ?? readValue(child, "eps"),
      affiliation_state:
        readValue(health, "affiliationState") ??
        readValue(child, "estadoAfiliacion"),
      state: readValue(health, "state"),
      ips: readValue(health, "ips"),
      allergies:
        readValue(health, "allergies") ?? readValue(child, "alergias"),
      meal_restrictions:
        readValue(health, "mealRestrictions") ??
        readValue(child, "restriccionesAlimentarias"),
      medicines:
        readValue(health, "medicines") ?? readValue(child, "medicamentos"),
      special_conditions:
        readValue(health, "specialConditions") ??
        readValue(child, "condicionesSalud", "cuidadosEspeciales"),
      care_notes: readValue(health, "careNotes"),
    },
    support: readValue(support, "required") ?? readValue(child, "apoyos"),
    forms_of_communication: readValue(support, "formsOfCommunication"),
    routine_support: readValue(support, "dailyRoutine"),
    likes: readValue(support, "likes"),
    crisis_management: readValue(support, "crisisManagement"),
    school: readValue(support, "school"),
    grade: readValue(support, "grade"),
    schedule: readValue(support, "schedule"),
    external_therapies: readValue(support, "externalTherapies"),
    emergency_contact:
      readValue(child, "emergencyContact", "contactoEmergencia"),
    authorized_pickup:
      readValue(child, "authorizedPickup", "autorizadosRecoger"),
    photo: readValue(child, "photo", "foto"),
    documents: readValue(child, "documents", "documentos"),
  }
}
