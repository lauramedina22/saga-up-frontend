import apiClient from "../api/apiClient"
import { readList, readRecord } from "../models/modelUtils.js"
import {
  toChildGuardianModel,
  toChildGuardianPayload,
} from "../models/childGuardianModel.js"

// API.md: los vínculos se manejan en /children-guardians (sin filtros por query)
const CHILDREN_GUARDIANS_ENDPOINT = "/children-guardians"

function getRelationshipList(response) {
  const relationships = readList(
    response,
    "children_guardians",
    "relationships",
  )

  if (!Array.isArray(relationships)) {
    throw new Error(
      "La respuesta del servidor no contiene una lista de relaciones child-guardian.",
    )
  }

  return relationships.map(toChildGuardianModel)
}

export const childGuardianService = {
  // GET /children-guardians
  async getRelationships() {
    return getRelationshipList(
      await apiClient.get(CHILDREN_GUARDIANS_ENDPOINT),
    )
  },

  // POST /children-guardians
  async createRelationship(relationship) {
    const response = await apiClient.post(
      CHILDREN_GUARDIANS_ENDPOINT,
      toChildGuardianPayload(relationship),
    )
    return toChildGuardianModel(
      readRecord(response, "children_guardian", "relationship"),
    )
  },

  // DELETE /children-guardians/:id
  async deleteRelationship(childGuardianId) {
    return apiClient.delete(
      `${CHILDREN_GUARDIANS_ENDPOINT}/${childGuardianId}`,
    )
  },
}
