import { useEffect, useState } from "react"
import { childGuardianService } from "../services/childGuardianService"
import { childService } from "../services/childService"
import { guardianService } from "../services/guardianService"

export function useGuardians() {
  const [guardians, setGuardians] = useState([])
  const [children, setChildren] = useState([])
  const [relationships, setRelationships] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadGuardians = async () => {
    setLoading(true)
    setError("")

    try {
      const [
        { guardians: guardianRecords },
        { children: childRecords },
        relationshipList,
      ] = await Promise.all([
        guardianService.getGuardianData(),
        childService.getChildrenData(),
        childGuardianService.getRelationships(),
      ])
      setGuardians(guardianRecords)
      setChildren(childRecords)
      setRelationships(relationshipList)
    } catch (requestError) {
      setError(
        requestError.message || "No fue posible cargar los acudientes.",
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGuardians()
  }, [])

  const createGuardian = async (guardianData) => {
    const guardian = await guardianService.createGuardian(guardianData)
    setGuardians((current) => [...current, guardian])
    return guardian
  }

  const deleteGuardian = async (guardianId) => {
    try {
      await guardianService.deleteGuardian(guardianId)
      setGuardians((current) =>
        current.filter((guardian) => guardian.guardianId !== guardianId),
      )
      setRelationships((current) =>
        current.filter(
          (relationship) => relationship.guardianId !== guardianId,
        ),
      )
      return { ok: true, message: "Acudiente eliminado correctamente." }
    } catch (requestError) {
      return {
        ok: false,
        message:
          requestError.message || "No fue posible eliminar el acudiente.",
      }
    }
  }

  const updateGuardian = async (guardianId, changes) => {
    try {
      const updated = await guardianService.updateGuardian(guardianId, changes)
      setGuardians((current) =>
        current.map((guardian) =>
          guardian.guardianId === guardianId ? updated : guardian,
        ),
      )
      return {
        ok: true,
        message: "Acudiente actualizado correctamente.",
        guardian: updated,
      }
    } catch (requestError) {
      return {
        ok: false,
        message:
          requestError.message || "No fue posible actualizar el acudiente.",
      }
    }
  }

  const createRelationship = async (relationship) => {
    const created = await childGuardianService.createRelationship(relationship)
    setRelationships((current) => [...current, created])
    return created
  }

  const deleteRelationship = async (childGuardianId) => {
    try {
      await childGuardianService.deleteRelationship(childGuardianId)
      setRelationships((current) =>
        current.filter(
          (relationship) =>
            String(relationship.childGuardianId) !== String(childGuardianId),
        ),
      )
      return { ok: true, message: "Vínculo eliminado correctamente." }
    } catch (requestError) {
      return {
        ok: false,
        message:
          requestError.message || "No fue posible eliminar el vínculo.",
      }
    }
  }

  const createChild = async ({ child, relationship }) => {
    const createdChild = await childService.createChild(child)
    let createdRelationship
    if (relationship?.guardianId) {
      createdRelationship = await childGuardianService.createRelationship({
        ...relationship,
        childId: createdChild.childId,
      })
    }
    setChildren((current) => [...current, createdChild])
    if (createdRelationship) {
      setRelationships((current) => [...current, createdRelationship])
    }
    return createdChild
  }

  return {
    guardians,
    children,
    relationships,
    loading,
    error,
    loadGuardians,
    createGuardian,
    updateGuardian,
    deleteGuardian,
    createRelationship,
    deleteRelationship,
    createChild,
  }
}
