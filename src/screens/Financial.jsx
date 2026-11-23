import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { formatCOP } from "../data"
import { useSuma21 } from "../hooks/useSuma21"
import { useCatalogs } from "../hooks/useCatalogs"
import { findCatalogLabel } from "../models/catalogModel"
import { Badge, Button, Card, EmptyState, Icon } from "../components/ui"

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

export default function FinancialScreen() {
  const navigate = useNavigate()
  const {
    products,
    sales,
    donations,
    enrollments,
    loading,
    error,
    refresh,
  } = useSuma21("financiero")
  const { catalogs } = useCatalogs(["payment_methods", "tuition_statuses"])

  const [sourceFilter, setSourceFilter] = useState("TODOS") // 'TODOS' | 'DONACION' | 'VENTA' | 'MATRICULA'
  const [searchQuery, setSearchQuery] = useState("")

  // 1. Cálculos Financieros Consolidados
  const metrics = useMemo(() => {
    const totalDonations = donations.reduce(
      (sum, d) => sum + (Number(d.amount) || 0),
      0,
    )
    const totalSales = sales.reduce(
      (sum, s) => sum + (Number(s.amount) || 0),
      0,
    )

    const isPaidTuition = (e) => {
      const statusLabel = (
        findCatalogLabel(catalogs.tuition_statuses, e.tuitionStatusId) ||
        e.status ||
        ""
      ).toLowerCase()
      return (
        statusLabel.includes("pago") ||
        statusLabel.includes("paga") ||
        statusLabel.includes("completado")
      )
    }

    const paidEnrollmentsList = enrollments.filter(isPaidTuition)
    const pendingEnrollmentsList = enrollments.filter((e) => !isPaidTuition(e))

    const totalPaidTuition = paidEnrollmentsList.reduce(
      (sum, e) => sum + (Number(e.amount) || 0),
      0,
    )
    const totalPendingTuition = pendingEnrollmentsList.reduce(
      (sum, e) => sum + (Number(e.amount) || 0),
      0,
    )

    const totalInventoryValue = products.reduce(
      (sum, p) => sum + (Number(p.unitPrice) || 0) * (Number(p.stockQty) || 0),
      0,
    )
    const totalStockUnits = products.reduce(
      (sum, p) => sum + (Number(p.stockQty) || 0),
      0,
    )

    const grandTotalIncome = totalDonations + totalSales + totalPaidTuition

    const avgDonation =
      donations.length > 0 ? totalDonations / donations.length : 0
    const avgSale = sales.length > 0 ? totalSales / sales.length : 0

    // Porcentajes para gráfica de dona
    const pctDonations =
      grandTotalIncome > 0
        ? Math.round((totalDonations / grandTotalIncome) * 100)
        : 0
    const pctSales =
      grandTotalIncome > 0
        ? Math.round((totalSales / grandTotalIncome) * 100)
        : 0
    const pctTuition =
      grandTotalIncome > 0
        ? Math.max(0, 100 - pctDonations - pctSales)
        : 0

    return {
      totalDonations,
      totalSales,
      totalPaidTuition,
      totalPendingTuition,
      totalInventoryValue,
      totalStockUnits,
      grandTotalIncome,
      avgDonation,
      avgSale,
      pctDonations,
      pctSales,
      pctTuition,
      paidCount: paidEnrollmentsList.length,
      pendingCount: pendingEnrollmentsList.length,
    }
  }, [donations, sales, enrollments, products, catalogs.tuition_statuses])

  // 2. Agrupación por Método de Pago (Donaciones + Ventas)
  const paymentMethodStats = useMemo(() => {
    const map = new Map()

    const addRecord = (rawMethod, amount) => {
      const method = String(rawMethod || "Otro / Wompi").trim().toUpperCase()
      const current = map.get(method) || { method, total: 0, count: 0 }
      current.total += Number(amount) || 0
      current.count += 1
      map.set(method, current)
    }

    donations.forEach((d) => addRecord(d.paymentMethod, d.amount))
    sales.forEach((s) => addRecord(s.paymentMethod, s.amount))

    const list = Array.from(map.values()).sort((a, b) => b.total - a.total)
    const maxTotal = list.reduce((max, item) => Math.max(max, item.total), 0)

    return list.map((item) => ({
      ...item,
      widthPct: maxTotal > 0 ? Math.max(8, Math.round((item.total / maxTotal) * 100)) : 8,
    }))
  }, [donations, sales])

  // 3. Valorización de Inventario por Producto (Gráfica de Barras)
  const productValuation = useMemo(() => {
    const list = products
      .map((p) => ({
        id: p.id,
        name: p.name,
        stockQty: Number(p.stockQty) || 0,
        unitPrice: Number(p.unitPrice) || 0,
        totalValue: (Number(p.unitPrice) || 0) * (Number(p.stockQty) || 0),
      }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5)

    const maxVal = list.reduce((max, item) => Math.max(max, item.totalValue), 0)
    return list.map((item) => ({
      ...item,
      widthPct: maxVal > 0 ? Math.max(10, Math.round((item.totalValue / maxVal) * 100)) : 10,
    }))
  }, [products])

  // 4. Tabla Consolidada de Transacciones (Donaciones + Ventas + Matrículas)
  const unifiedTransactions = useMemo(() => {
    const donRows = donations.map((d, idx) => ({
      uid: `don-${d.id || idx}`,
      code: `#${d.donationId || d.id}`,
      type: "DONACION",
      typeLabel: "Donación SUMA 21",
      tone: "success",
      date: d.completedAt,
      method: d.paymentMethod || "Wompi",
      concept: "Aporte solidario a la fundación",
      amount: Number(d.amount) || 0,
      status: d.status || "APPROVED",
    }))

    const saleRows = sales.map((s, idx) => ({
      uid: `sale-${s.id || idx}`,
      code: `#${s.id}`,
      type: "VENTA",
      typeLabel: "Tienda Solidaria",
      tone: "primary",
      date: s.completedAt,
      method: s.paymentMethod || "Wompi",
      concept:
        s.items && s.items.length > 0
          ? s.items.map((i) => i.name || i.title || "Producto").join(", ")
          : "Compra en Tienda Solidaria",
      amount: Number(s.amount) || 0,
      status: s.status || "APPROVED",
    }))

    const tuitionRows = enrollments.map((e, idx) => {
      const statusLabel =
        findCatalogLabel(catalogs.tuition_statuses, e.tuitionStatusId) ||
        e.status ||
        "registrado"
      const methodLabel =
        findCatalogLabel(catalogs.payment_methods, e.paymentMethodId) ||
        e.paymentMethod ||
        "Institucional"
      const isPaid =
        statusLabel.toLowerCase().includes("pago") ||
        statusLabel.toLowerCase().includes("paga") ||
        statusLabel.toLowerCase().includes("completado")

      return {
        uid: `tui-${e.id || idx}`,
        code: `#M-${e.id}`,
        type: "MATRICULA",
        typeLabel: "Matrícula / Pensión",
        tone: isPaid ? "info" : "warning",
        date: e.paidDate,
        method: methodLabel,
        concept: `Matrícula Beneficiario #${e.childId || "-"}`,
        amount: Number(e.amount) || 0,
        status: statusLabel.toUpperCase(),
      }
    })

    const all = [...donRows, ...saleRows, ...tuitionRows].sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0
      const db = b.date ? new Date(b.date).getTime() : 0
      return db - da
    })

    return all.filter((row) => {
      if (sourceFilter !== "TODOS" && row.type !== sourceFilter) return false
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        row.code.toLowerCase().includes(q) ||
        row.typeLabel.toLowerCase().includes(q) ||
        row.method.toLowerCase().includes(q) ||
        row.concept.toLowerCase().includes(q)
      )
    })
  }, [
    donations,
    sales,
    enrollments,
    sourceFilter,
    searchQuery,
    catalogs.tuition_statuses,
    catalogs.payment_methods,
  ])

  // Geometría SVG para Gráfica de Dona (r = 15.9155 => circunferencia = 100)
  const segDonations = metrics.pctDonations
  const segSales = metrics.pctSales
  const segTuition = metrics.pctTuition

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* 1. ENCABEZADO EJECUTIVO */}
      <header className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Inteligencia Financiera • SAGA UP & SUMA 21
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-foreground sm:text-4xl">
            Dashboard Financiero
          </h1>
          <p className="mt-1 text-sm font-medium text-muted">
            Consolidado en tiempo real de donaciones, ventas de la tienda solidaria y recaudo institucional.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            onClick={refresh}
            loading={loading}
            className="w-full sm:w-auto"
          >
            <Icon
              path="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              className="size-4"
            />
            <span>Sincronizar Datos</span>
          </Button>
        </div>
      </header>

      {loading && (
        <div
          role="status"
          className="mb-6 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary-soft/40 px-4 py-3 text-sm font-bold text-foreground"
        >
          <span className="size-2.5 animate-ping rounded-full bg-primary" />
          <span>Actualizando métricas e historial financiero desde SUMA 21 y SAGA UP…</span>
        </div>
      )}

      {error && (
        <p
          className="mb-6 rounded-2xl bg-danger-soft p-4 text-sm font-semibold text-danger"
          role="alert"
        >
          {error}
        </p>
      )}

      {/* 2. TARJETAS KPI FINANCIERAS */}
      <section
        aria-label="Indicadores Financieros Principales"
        className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {/* Ingresos Totales */}
        <div className="rounded-3xl border border-primary/30 bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Ingresos Consolidados
            </span>
            <span className="flex size-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <Icon
                path="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                className="size-5"
              />
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-foreground sm:text-3xl">
            {formatCOP(metrics.grandTotalIncome)}
          </p>
          <p className="mt-2 text-xs font-semibold text-muted">
            {donations.length + sales.length + metrics.paidCount} transacciones efectivas
          </p>
        </div>

        {/* Donaciones SUMA 21 */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => navigate("/donations")}
          onKeyDown={(e) => e.key === "Enter" && navigate("/donations")}
          className="group cursor-pointer rounded-3xl border border-border bg-surface p-5 shadow-card transition hover:border-success/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Donaciones SUMA 21
            </span>
            <span className="flex size-10 items-center justify-center rounded-2xl bg-success-soft text-success">
              <Icon
                path="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                className="size-5"
              />
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-success sm:text-3xl">
            {formatCOP(metrics.totalDonations)}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs font-semibold text-muted">
            <span>{donations.length} aportes • Prom: {formatCOP(metrics.avgDonation)}</span>
            <span className="text-success group-hover:underline">Ver →</span>
          </div>
        </div>

        {/* Ventas Tienda Solidaria */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => navigate("/sales")}
          onKeyDown={(e) => e.key === "Enter" && navigate("/sales")}
          className="group cursor-pointer rounded-3xl border border-border bg-surface p-5 shadow-card transition hover:border-primary/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Ventas Tienda Solidaria
            </span>
            <span className="flex size-10 items-center justify-center rounded-2xl bg-warning-soft text-warning">
              <Icon
                path="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.188-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"
                className="size-5"
              />
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-foreground sm:text-3xl">
            {formatCOP(metrics.totalSales)}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs font-semibold text-muted">
            <span>
              {sales.length} ventas • Stock: {formatCOP(metrics.totalInventoryValue)}
            </span>
            <span className="text-primary group-hover:underline">Tienda →</span>
          </div>
        </div>

        {/* Matrículas y Pensiones */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => navigate("/enrollments")}
          onKeyDown={(e) => e.key === "Enter" && navigate("/enrollments")}
          className="group cursor-pointer rounded-3xl border border-border bg-surface p-5 shadow-card transition hover:border-info/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Matrículas y Pensiones
            </span>
            <span className="flex size-10 items-center justify-center rounded-2xl bg-info-soft text-info">
              <Icon
                path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                className="size-5"
              />
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-info sm:text-3xl">
            {formatCOP(metrics.totalPaidTuition)}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs font-semibold text-muted">
            <span>
              {metrics.paidCount} pagadas • {metrics.pendingCount} por cobrar
            </span>
            <span className="text-info group-hover:underline">Ver →</span>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN DE GRÁFICAS VISUALES */}
      <section
        aria-label="Gráficas Financieras"
        className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-12"
      >
        {/* GRÁFICA 1: DONA DE COMPOSICIÓN DE INGRESOS (5 cols) */}
        <Card className="flex flex-col justify-between p-6 lg:col-span-5">
          <div>
            <h2 className="text-lg font-extrabold text-foreground">
              Composición de Ingresos por Fuente
            </h2>
            <p className="text-xs font-medium text-muted">
              Proporción porcentual del recaudo total de la fundación
            </p>
          </div>

          <div className="my-6 flex flex-col items-center justify-center gap-6 sm:flex-row">
            {/* SVG Donut Chart */}
            <div className="relative flex size-44 shrink-0 items-center justify-center">
              <svg viewBox="0 0 42 42" className="size-full -rotate-90">
                {/* Fondo del anillo */}
                <circle
                  cx="21"
                  cy="21"
                  r="15.9155"
                  fill="transparent"
                  stroke="currentColor"
                  className="text-surface-muted"
                  strokeWidth="5"
                />
                {/* Segmento 1: Donaciones (Verde) */}
                {segDonations > 0 && (
                  <circle
                    cx="21"
                    cy="21"
                    r="15.9155"
                    fill="transparent"
                    stroke="#16a34a"
                    strokeWidth="5"
                    strokeDasharray={`${segDonations} ${100 - segDonations}`}
                    strokeDashoffset="0"
                  />
                )}
                {/* Segmento 2: Ventas Tienda Solidaria (Ámbar/Primario) */}
                {segSales > 0 && (
                  <circle
                    cx="21"
                    cy="21"
                    r="15.9155"
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="5"
                    strokeDasharray={`${segSales} ${100 - segSales}`}
                    strokeDashoffset={`${-segDonations}`}
                  />
                )}
                {/* Segmento 3: Matrículas (Azul) */}
                {segTuition > 0 && (
                  <circle
                    cx="21"
                    cy="21"
                    r="15.9155"
                    fill="transparent"
                    stroke="#0284c7"
                    strokeWidth="5"
                    strokeDasharray={`${segTuition} ${100 - segTuition}`}
                    strokeDashoffset={`${-(segDonations + segSales)}`}
                  />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  Total
                </span>
                <span className="text-sm font-black text-foreground">
                  {formatCOP(metrics.grandTotalIncome)}
                </span>
              </div>
            </div>

            {/* Leyenda de la Dona */}
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-border bg-surface-muted/40 px-3.5 py-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="size-3 rounded-full bg-success" />
                  <div>
                    <p className="text-xs font-extrabold text-foreground">
                      Donaciones
                    </p>
                    <p className="text-[11px] text-muted">
                      {formatCOP(metrics.totalDonations)}
                    </p>
                  </div>
                </div>
                <Badge tone="success">{metrics.pctDonations}%</Badge>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-border bg-surface-muted/40 px-3.5 py-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="size-3 rounded-full bg-warning" />
                  <div>
                    <p className="text-xs font-extrabold text-foreground">
                      Tienda Solidaria
                    </p>
                    <p className="text-[11px] text-muted">
                      {formatCOP(metrics.totalSales)}
                    </p>
                  </div>
                </div>
                <Badge tone="warning">{metrics.pctSales}%</Badge>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-border bg-surface-muted/40 px-3.5 py-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="size-3 rounded-full bg-info" />
                  <div>
                    <p className="text-xs font-extrabold text-foreground">
                      Matrículas
                    </p>
                    <p className="text-[11px] text-muted">
                      {formatCOP(metrics.totalPaidTuition)}
                    </p>
                  </div>
                </div>
                <Badge tone="info">{metrics.pctTuition}%</Badge>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-3 text-xs text-muted flex items-center justify-between">
            <span>Cartera pendiente por matrículas:</span>
            <span className="font-extrabold text-warning">
              {formatCOP(metrics.totalPendingTuition)}
            </span>
          </div>
        </Card>

        {/* GRÁFICA 2: BARRAS COMPARATIVAS POR FUENTE Y MEDIOS DE PAGO (7 cols) */}
        <Card className="flex flex-col justify-between p-6 lg:col-span-7">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-extrabold text-foreground">
                  Distribución por Canal y Método de Pago
                </h2>
                <p className="text-xs font-medium text-muted">
                  Volumen transaccional procesado en pasarela SUMA 21 (Wompi / PSE / Tarjetas)
                </p>
              </div>
              <Badge tone="primary">
                {paymentMethodStats.length} medio(s) activos
              </Badge>
            </div>

            {/* Gráfica de barras horizontales por método de pago */}
            <div className="mt-5 space-y-4">
              {paymentMethodStats.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted">
                  No hay transacciones de pago registradas aún.
                </p>
              ) : (
                paymentMethodStats.map((item) => (
                  <div key={item.method} className="space-y-1.5">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-extrabold text-foreground">
                        {item.method}
                      </span>
                      <span className="font-mono font-bold text-muted">
                        {item.count} transacción(es) •{" "}
                        <strong className="text-foreground">
                          {formatCOP(item.total)}
                        </strong>
                      </span>
                    </div>
                    <div className="h-3.5 w-full overflow-hidden rounded-full bg-surface-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${item.widthPct}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sub-gráfica: Valorización de Stock en Tienda Solidaria */}
          <div className="mt-6 border-t border-border pt-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-foreground">
                  Valorización de Inventario en Tienda Solidaria
                </h3>
                <p className="text-xs text-muted">
                  Capital representado en productos disponibles ({metrics.totalStockUnits} unidades)
                </p>
              </div>
              <span className="text-sm font-black text-primary">
                {formatCOP(metrics.totalInventoryValue)}
              </span>
            </div>

            <div className="space-y-2.5">
              {productValuation.map((prod) => (
                <div key={prod.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-foreground capitalize">
                      {prod.name}{" "}
                      <span className="text-muted font-normal">
                        ({prod.stockQty} unds × {formatCOP(prod.unitPrice)})
                      </span>
                    </span>
                    <span className="font-mono font-extrabold text-foreground">
                      {formatCOP(prod.totalValue)}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className="h-full rounded-full bg-success transition-all duration-500"
                      style={{ width: `${prod.widthPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* 4. TABLA CONSOLIDADA DE MOVIMIENTOS FINANCIEROS */}
      <Card className="p-4 sm:p-6">
        <div className="mb-5 flex flex-col justify-between gap-4 border-b border-border pb-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-lg font-extrabold text-foreground">
              Movimientos Financieros ({unifiedTransactions.length})
            </h2>
            <p className="text-xs font-semibold text-muted">
              Historial unificado de Donaciones, Ventas de Tienda Solidaria y Matrículas
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Botones de filtro por origen */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: "TODOS", label: "Todos" },
                { id: "DONACION", label: `Donaciones (${donations.length})` },
                { id: "VENTA", label: `Ventas (${sales.length})` },
                { id: "MATRICULA", label: `Matrículas (${enrollments.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSourceFilter(tab.id)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-extrabold transition-colors ${sourceFilter === tab.id
                    ? "bg-primary text-foreground shadow-xs"
                    : "border border-border bg-surface text-muted hover:text-foreground"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Buscador */}
            <input
              type="search"
              placeholder="Buscar comprobante, método o concepto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-2xl border border-border bg-surface px-3.5 text-xs font-medium text-foreground outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15 sm:w-64"
            />
          </div>
        </div>

        {unifiedTransactions.length === 0 && !loading ? (
          <EmptyState
            title="Sin movimientos financieros para este filtro"
            description="No se encontraron transacciones registradas con los criterios seleccionados."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs font-bold uppercase text-muted">
                <tr>
                  <th className="pb-3 pr-4">Fecha</th>
                  <th className="px-4 pb-3">Comprobante</th>
                  <th className="px-4 pb-3">Fuente</th>
                  <th className="px-4 pb-3">Concepto / Detalle</th>
                  <th className="px-4 pb-3">Método de Pago</th>
                  <th className="px-4 pb-3">Monto</th>
                  <th className="pb-3 pl-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {unifiedTransactions.map((tx) => (
                  <tr
                    key={tx.uid}
                    className="transition-colors hover:bg-primary-soft/25"
                  >
                    <td className="whitespace-nowrap py-3.5 pr-4 font-mono text-xs text-muted">
                      {formatFecha(tx.date)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-bold text-foreground">
                      {tx.code}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <Badge tone={tx.tone}>{tx.typeLabel}</Badge>
                    </td>
                    <td className="max-w-xs truncate px-4 py-3.5 text-xs text-muted">
                      {tx.concept}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-xs font-semibold text-foreground">
                      {tx.method}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-sm font-black text-foreground">
                      {formatCOP(tx.amount)}
                    </td>
                    <td className="whitespace-nowrap py-3.5 pl-4">
                      <Badge
                        tone={
                          tx.status === "APPROVED" ||
                            tx.status.includes("PAGO") ||
                            tx.status.includes("PAGA") ||
                            tx.status === "COMPLETADO"
                            ? "success"
                            : "warning"
                        }
                      >
                        {tx.status}
                      </Badge>
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
