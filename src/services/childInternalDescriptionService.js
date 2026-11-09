import apiClient from "../api/apiClient"
import { readList, readRecord } from "../models/modelUtils.js"
import {
  toChildInternalDescriptionModel,
  toChildInternalDescriptionPayload,
} from "../models/childInternalDescriptionModel.js"

const DESCRIPTIONS_ENDPOINT = "/child-internal-descriptions"

function getDescriptionList(response) {
  const descriptions = readList(
    response,
    "child_internal_descriptions",
    "descriptions",
  )

  if (!Array.isArray(descriptions)) {
    throw new Error(
      "La respuesta del servidor no contiene una lista de child_internal_description.",
    )
  }

  return descriptions.map(toChildInternalDescriptionModel)
}

function getDescription(response, childId) {
  const description = toChildInternalDescriptionModel(
    readRecord(response, "child_internal_description", "description"),
  )
  if (!description.childInternalDescriptionId) {
    throw new Error(
      "La respuesta del servidor no contiene una descripción interna válida.",
    )
  }
  return { ...description, childId: String(childId) }
}

export const childInternalDescriptionService = {
  // GET /child-internal-descriptions
  async getAll() {
    return getDescriptionList(await apiClient.get(DESCRIPTIONS_ENDPOINT))
  },

  // GET /child-internal-descriptions?child_id=
  async getForChild(childId) {
    const query = new URLSearchParams({ child_id: String(childId) })
    return getDescriptionList(
      await apiClient.get(`${DESCRIPTIONS_ENDPOINT}?${query}`),
    )
  },

  // POST /child-internal-descriptions
  async create(childId, description) {
    return getDescription(
      await apiClient.post(
        DESCRIPTIONS_ENDPOINT,
        toChildInternalDescriptionPayload(
          { ...description, childId },
          { includeChildId: true },
        ),
      ),
      childId,
    )
  },

  // PUT /child-internal-descriptions/:id (child_id no es editable)
  async update(childId, descriptionId, changes) {
    return getDescription(
      await apiClient.put(
        `${DESCRIPTIONS_ENDPOINT}/${descriptionId}`,
        toChildInternalDescriptionPayload(changes),
      ),
      childId,
    )
  },

  // API.md: /child-internal-descriptions NO tiene DELETE
  async delete() {
    throw new Error(
      "El backend no permite eliminar descripciones internas: el historial debe conservarse.",
    )
  },
}
