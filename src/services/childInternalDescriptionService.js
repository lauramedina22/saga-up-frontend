import apiClient from "../api/apiClient"
import {
  toChildInternalDescriptionModel,
  toChildInternalDescriptionPayload,
} from "../models/childInternalDescriptionModel.js"

const DESCRIPTION_PATH = (childId) =>
  `/children/${childId}/internal-descriptions`

function getDescriptionList(response) {
  const descriptions = Array.isArray(response)
    ? response
    : response?.child_internal_descriptions ?? response?.descriptions

  if (!Array.isArray(descriptions)) {
    throw new Error(
      "La respuesta del servidor no contiene una lista de child_internal_description.",
    )
  }

  return descriptions.map(toChildInternalDescriptionModel)
}

function getDescription(response, childId) {
  const description = toChildInternalDescriptionModel(
    response?.child_internal_description ?? response?.description ?? response,
  )
  if (!description.childInternalDescriptionId) {
    throw new Error(
      "La respuesta del servidor no contiene una descripción interna válida.",
    )
  }
  return { ...description, childId: String(childId) }
}

export const childInternalDescriptionService = {
  async getForChild(childId) {
    return getDescriptionList(
      await apiClient.get(DESCRIPTION_PATH(childId)),
    )
  },

  async create(childId, description) {
    return getDescription(
      await apiClient.post(
        DESCRIPTION_PATH(childId),
        toChildInternalDescriptionPayload({ ...description, childId }),
      ),
      childId,
    )
  },

  async update(childId, descriptionId, changes) {
    return getDescription(
      await apiClient.put(
        `${DESCRIPTION_PATH(childId)}/${descriptionId}`,
        toChildInternalDescriptionPayload({ ...changes, childId }),
      ),
      childId,
    )
  },

  async delete(childId, descriptionId) {
    return apiClient.delete(
      `${DESCRIPTION_PATH(childId)}/${descriptionId}`,
    )
  },
}
