import { useEffect, useState } from "react"
import { guardianService } from "../services/guardianService"
import { childService } from "../services/childService"
import { childGuardianService } from "../services/childGuardianService"
import { enrollmentService } from "../services/enrollmentService"

export function useChildren() {
  const [children, setChildren] = useState([])
  const [guardians, setGuardians] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [payments, setPayments] = useState([])
  const [sponsors, setSponsors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const addGuardianRelationships = async (records, guardianRecords) =>
    Promise.all(
      records.map(async (child) => {
        const guardianIds =
          await childGuardianService.getGuardianIdsForChild(child.id)
        const primaryGuardianId = guardianIds[0] ?? null

        return {
          ...child,
          guardianId: primaryGuardianId,
          guardianIds: guardianIds,
          relatedGuardians: guardianRecords.filter((guardian) =>
            guardianIds.includes(guardian.id),
          ),
        }
      }),
    )

  const loadChildren = async () => {
    setLoading(true)
    setError("")

    try {
      const [data, guardianData] = await Promise.all([
        childService.getChildrenData(),
        guardianService.getGuardianData(),
      ])
      setChildren(
        await addGuardianRelationships(data.children, guardianData.guardians),
      )
      setGuardians(guardianData.guardians)
      setPayments(data.payments)
      setSponsors(data.sponsors)
      try {
        const enrollmentData = await enrollmentService.getEnrollmentData()
        setEnrollments(enrollmentData.enrollments)
      } catch (enrollmentError) {
        setEnrollments([])
        setError(
          enrollmentError.message ||
            "No fue posible cargar las matrículas relacionadas.",
        )
      }
    } catch (requestError) {
      setError(requestError.message || "No fue posible cargar los beneficiarios.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChildren()
  }, [])

  const createChild = async (childData) => {
    const child = await childService.createChild(childData)
    try {
      if (childData.guardianId) {
        await childGuardianService.linkChildToGuardian(
          child.id,
          childData.guardianId,
          { primary: true },
        )
      }
    } catch (error) {
      try {
        await childService.deleteChild(child.id)
      } catch (rollbackError) {
        throw new Error(
          `${error.message} No fue posible deshacer la creación del beneficiario: ${rollbackError.message}`,
        )
      }
      throw error
    }
    const data = await childService.getChildrenData()
    const guardianData = await guardianService.getGuardianData()
    const hydratedChildren = await addGuardianRelationships(
      data.children,
      guardianData.guardians,
    )
    setChildren(hydratedChildren)
    setGuardians(guardianData.guardians)
    return hydratedChildren.find((item) => item.id === child.id)
  }

  const createChildWithGuardian = async (childData, guardianData) => {
    const guardian = await guardianService.createGuardian(guardianData)
    let child
    try {
      child = await childService.createChild(childData)
      await childGuardianService.linkChildToGuardian(
        child.id,
        guardian.id,
        { primary: true },
      )
      const data = await childService.getChildrenData()
      const guardianDataResult = await guardianService.getGuardianData()
      const hydratedChildren = await addGuardianRelationships(
        data.children,
        guardianDataResult.guardians,
      )
      setChildren(hydratedChildren)
      setGuardians(guardianDataResult.guardians)
      return hydratedChildren.find((item) => item.id === child.id)
    } catch (error) {
      const rollbackErrors = []
      if (child) {
        try {
          await childGuardianService.unlinkChildFromGuardian(
            child.id,
            guardian.id,
          )
        } catch (rollbackError) {
          rollbackErrors.push(rollbackError.message)
        }
        try {
          await childService.deleteChild(child.id)
        } catch (rollbackError) {
          rollbackErrors.push(rollbackError.message)
        }
      }
      try {
        await guardianService.deleteGuardian(guardian.id)
      } catch (rollbackError) {
        rollbackErrors.push(rollbackError.message)
      }
      if (rollbackErrors.length > 0) {
        throw new Error(
          `${error.message} No se pudo completar la limpieza de los registros: ${rollbackErrors.join("; ")}`,
        )
      }
      throw error
    }
  }

  const updateChild = async (id, changes) => {
    try {
      const updated = await childService.updateChild(id, changes)
      setChildren((current) =>
        current.map((child) => (child.id === id ? updated : child)),
      )
      return { ok: true, message: "Beneficiario actualizado correctamente." }
    } catch (requestError) {
      return {
        ok: false,
        message: requestError.message || "No fue posible actualizar el registro.",
      }
    }
  }

  const deleteChild = async (id) => {
    try {
      await childService.deleteChild(id)
      setChildren((current) => current.filter((child) => child.id !== id))
      return { ok: true, message: "Beneficiario eliminado correctamente." }
    } catch (requestError) {
      return {
        ok: false,
        message: requestError.message || "No fue posible eliminar el registro.",
      }
    }
  }

  return {
    children,
    guardians,
    enrollments,
    payments,
    sponsors,
    loading,
    error,
    loadChildren,
    createChild,
    createChildWithGuardian,
    updateChild,
    deleteChild,
  }
}
