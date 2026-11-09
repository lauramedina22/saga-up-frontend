import { useState, useMemo } from "react"
import { formatCOP } from "../data"
import { useSuma21 } from "../hooks/useSuma21"
import { Badge, Button, Card, EmptyState } from "../components/ui"

function formatFecha(isoString) {
  if (!isoString) return "-"
  const d = new Date(isoString)
  if (Number.isNaN(d.getTime())) return isoString
  return d.toLocaleString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function DonationsScreen() {
  const { donations, loading, error, refresh } = useSuma21()
  const [filterMethod, setFilterMethod] = useState("TODOS")
  const [search, setSearch] = useState("")

  const totalDonations = donations.reduce((acc, d) => acc + (d.amount || 0), 0)
  const averageDonation =
    donations.length > 0 ? totalDonations / donations.length : 0

  // Métodos de pago disponibles
  const paymentMethods = useMemo(() => {
    const set = new Set(donations.map((d) => d.paymentMethod).filter(Boolean))
    return ["TODOS", ...Array.from(set)]
  }, [donations])

  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      if (filterMethod !== "TODOS" && d.paymentMethod !== filterMethod) {
        return false
      }
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        String(d.id).toLowerCase().includes(q) ||
        String(d.donationId).toLowerCase().includes(q) ||
        d.paymentMethod.toLowerCase().includes(q)
      )
    })
  }, [donations, filterMethod, search])

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Encabezado */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">
            Donaciones
          </h1>
          <p className="text-sm font-semibold text-muted">
            Reporte de donaciones monetarias solidarias aprobadas en SUMA 21
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => refresh()}
          loading={loading}
        >
          Actualizar
        </Button>
      </div>

      {loading && (
        <p className="mb-4 text-sm font-semibold text-muted" role="status">
          Cargando donaciones desde SUMA 21…
        </p>
      )}

      {error && (
        <p
          className="mb-4 rounded-xl bg-danger-soft p-3 text-sm font-semibold text-danger"
          role="alert"
        >
          {error}
        </p>
      )}

      {/* Tarjetas resumen de métricas */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">
            Total recaudado
          </p>
          <p className="mt-2 text-2xl font-black text-success">
            {formatCOP(totalDonations)}
          </p>
          <p className="mt-1 text-xs text-muted">Aportes solidarios</p>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">
            Donaciones registradas
          </p>
          <p className="mt-2 text-2xl font-black text-foreground">
            {donations.length}
          </p>
          <p className="mt-1 text-xs text-muted">Transacciones aprobadas</p>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">
            Donación promedio
          </p>
          <p className="mt-2 text-2xl font-black text-primary">
            {formatCOP(averageDonation)}
          </p>
          <p className="mt-1 text-xs text-muted">Por aportante</p>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {paymentMethods.map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setFilterMethod(method)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                filterMethod === method
                  ? "bg-primary text-white shadow-xs"
                  : "border border-border bg-surface text-muted hover:text-foreground"
              }`}
            >
              {method === "TODOS" ? "Todos los medios" : method}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <input
            type="search"
            placeholder="Buscar por código o medio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 rounded-2xl border border-border bg-surface px-4 text-xs font-medium text-foreground outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
          />
        </div>
      </div>

      {/* Tabla de Donaciones */}
      <Card className="p-4 sm:p-6">
        {filteredDonations.length === 0 && !loading ? (
          <EmptyState
            title="Sin donaciones registradas"
            description="No se encontraron donaciones monetarias registradas en este período."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase text-muted font-bold">
                <tr>
                  <th className="pb-3 pr-4 font-bold">Fecha y Hora</th>
                  <th className="pb-3 px-4 font-bold">Comprobante</th>
                  <th className="pb-3 px-4 font-bold">Método de Pago</th>
                  <th className="pb-3 px-4 font-bold">Monto Donado</th>
                  <th className="pb-3 pl-4 font-bold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredDonations.map((don, idx) => (
                  <tr
                    key={don.id || `don-${idx}`}
                    className="hover:bg-primary-soft/30 transition-colors"
                  >
                    <td className="py-3.5 pr-4 text-xs font-mono text-muted whitespace-nowrap">
                      {formatFecha(don.completedAt)}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono font-bold text-foreground whitespace-nowrap">
                      #{don.donationId || don.id}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-foreground whitespace-nowrap">
                      {don.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-extrabold text-success whitespace-nowrap font-mono text-base">
                      {formatCOP(don.amount)}
                    </td>
                    <td className="py-3.5 pl-4 whitespace-nowrap">
                      <Badge tone="success">{don.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
