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

  return {
    guardians,
    children,
    relationships,
    loading,
    error,
    loadGuardians,
    createGuardian,
    deleteGuardian,
  }
}
