import apiClient from "../api/apiClient"
import {
  toChildGuardianModel,
  toChildGuardianPayload,
} from "../models/childGuardianModel.js"

const CHILDREN_ENDPOINT = "/children"
const GUARDIANS_ENDPOINT = "/guardians"

function getRelationshipList(response) {
  const relationships = Array.isArray(response)
    ? response
    : response?.children_guardians ?? response?.relationships

  if (!Array.isArray(relationships)) {
    throw new Error(
      "La respuesta del servidor no contiene una lista de relaciones child-guardian.",
    )
  }

  return relationships.map(toChildGuardianModel)
}

export const childGuardianService = {
  async getRelationshipsForChild(childId) {
    const response = await apiClient.get(
      `${CHILDREN_ENDPOINT}/${childId}/guardians`,
    )
    return getRelationshipList(response)
  },

  async getRelationshipsForGuardian(guardianId) {
    const response = await apiClient.get(
      `${GUARDIANS_ENDPOINT}/${guardianId}/children`,
    )
    return getRelationshipList(response)
  },

  async createRelationship(relationship) {
    const response = await apiClient.post(
      `${CHILDREN_ENDPOINT}/${relationship.childId}/guardians`,
      toChildGuardianPayload(relationship),
    )
    const rawRelationship =
      response?.children_guardian ?? response?.relationship ?? response
    return toChildGuardianModel(rawRelationship)
  },

  async deleteRelationship(childId, guardianId) {
    return apiClient.delete(
      `${CHILDREN_ENDPOINT}/${childId}/guardians/${guardianId}`,
    )
  },
}
