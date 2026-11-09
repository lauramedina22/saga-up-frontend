import { useState } from "react"
import { formatCOP } from "../data"
import { useSuma21 } from "../hooks/useSuma21"
import { Badge, Button, Card, EmptyState } from "../components/ui"
import bisuteriaImg from "../imports/bisuteria.jpg"

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

export default function SalesScreen() {
  const { products, accounts, inventory, sales, loading, error, refresh } = useSuma21()
  const [activeTab, setActiveTab] = useState("productos") // 'productos' | 'inventario' | 'ventas' | 'cuentas'
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [toastMessage, setToastMessage] = useState("")

  const showToast = (msg) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(""), 4000)
  }

  // Filtrado de productos
  const filteredProducts = products.filter((product) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      product.name.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q)
    )
  })

  // Filtrado de inventario
  const filteredInventory = inventory.filter((item) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      item.productName.toLowerCase().includes(q) ||
      String(item.id).includes(q) ||
      item.description.toLowerCase().includes(q)
    )
  })

  // Filtrado de ventas
  const filteredSales = sales.filter((s) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      String(s.id).toLowerCase().includes(q) ||
      s.paymentMethod.toLowerCase().includes(q) ||
      s.items.some((it) => String(it.name || it.title || "").toLowerCase().includes(q))
    )
  })

  // Filtrado de cuentas
  const filteredAccounts = accounts.filter((acc) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return acc.name.toLowerCase().includes(q) || String(acc.id).includes(q)
  })

  // Contadores
  const totalStock = products.reduce((acc, p) => acc + (p.stockQty || 0), 0)
  const totalSalesAmount = sales.reduce((acc, s) => acc + (s.amount || 0), 0)

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Toast Notificación */}
      {toastMessage && (
        <p
          role="status"
          className="fixed right-4 top-4 z-50 rounded-xl bg-success px-4 py-3 text-sm font-bold text-white shadow-dialog"
        >
          {toastMessage}
        </p>
      )}

      {/* Encabezado */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">
            Tienda Solidaria
          </h1>
          <p className="text-sm font-semibold text-muted">
            {products.length} producto(s) · {totalStock} unidades en inventario · {sales.length} ventas reportadas
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => refresh()}
          loading={loading}
        >
          Sincronizar
        </Button>
      </div>

      {/* Pestañas de Navegación */}
      <div className="mb-4 flex gap-2 overflow-x-auto border-b border-border pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("productos")}
          className={`shrink-0 border-b-2 px-4 py-2 text-sm font-extrabold transition-colors ${
            activeTab === "productos"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          Productos ({products.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("inventario")}
          className={`shrink-0 border-b-2 px-4 py-2 text-sm font-extrabold transition-colors ${
            activeTab === "inventario"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          Control de Inventario ({inventory.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("ventas")}
          className={`shrink-0 border-b-2 px-4 py-2 text-sm font-extrabold transition-colors ${
            activeTab === "ventas"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          Historial de Ventas ({sales.length})
        </button>
        {accounts.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab("cuentas")}
            className={`shrink-0 border-b-2 px-4 py-2 text-sm font-extrabold transition-colors ${
              activeTab === "cuentas"
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            Cuentas ({accounts.length})
          </button>
        )}
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <input
          type="search"
          placeholder={
            activeTab === "productos"
              ? "Buscar producto por nombre o descripción..."
              : activeTab === "inventario"
                ? "Buscar en el inventario por producto o código..."
                : activeTab === "ventas"
                  ? "Buscar venta por código o método de pago..."
                  : "Buscar cuenta por nombre o código..."
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 rounded-2xl border border-border bg-surface px-4 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15 shadow-sm"
        />
      </div>

      {loading && (
        <p className="mb-4 text-sm font-semibold text-muted" role="status">
          Cargando datos desde SUMA 21…
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

      {/* PESTAÑA 1: PRODUCTOS */}
      {activeTab === "productos" && (
        <>
          {filteredProducts.length === 0 && !loading ? (
            <EmptyState
              title="No hay productos disponibles"
              description="No se encontraron productos registrados en SUMA 21."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => {
                const imgSource = product.imageUrl || bisuteriaImg

                return (
                  <article
                    key={product.id}
                    className="flex flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-sm hover:border-primary/40 transition-colors"
                  >
                    <div className="relative aspect-4/3 w-full bg-surface-muted overflow-hidden">
                      <img
                        src={imgSource}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.target.src = bisuteriaImg
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <Badge tone={product.stockQty > 0 ? "success" : "danger"}>
                          {product.stockQty > 0
                            ? `${product.stockQty} en stock`
                            : "Agotado"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-extrabold text-foreground truncate text-base">
                        {product.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-muted">
                        {product.description || "Sin descripción registrada."}
                      </p>

                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-border">
                        <span className="text-lg font-extrabold text-primary">
                          {formatCOP(product.unitPrice)}
                        </span>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setSelectedProduct(product)}
                          className="min-h-9 px-3 text-xs"
                        >
                          Ver detalle
                        </Button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* PESTAÑA 2: CONTROL DE INVENTARIO */}
      {activeTab === "inventario" && (
        <Card className="p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-foreground">
                Estado del Inventario
              </h2>
              <p className="text-xs font-semibold text-muted">
                Control de existencias y disponibilidad en SUMA 21
              </p>
            </div>
            <div className="rounded-2xl bg-surface-muted px-3 py-1.5 text-xs font-bold text-foreground">
              Total referencias: {inventory.length}
            </div>
          </div>

          {filteredInventory.length === 0 && !loading ? (
            <EmptyState
              title="Sin registros de inventario"
              description="No hay insumos o productos en inventario con este filtro."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-xs uppercase text-muted font-bold">
                  <tr>
                    <th className="pb-3 pr-4 font-bold">Insumo / Ítem</th>
                    <th className="pb-3 px-4 font-bold">Código</th>
                    <th className="pb-3 px-4 font-bold">Descripción</th>
                    <th className="pb-3 px-4 font-bold">Stock</th>
                    <th className="pb-3 pl-4 font-bold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredInventory.map((item, index) => (
                    <tr
                      key={item.id || `inv-${index}`}
                      className="hover:bg-primary-soft/30 transition-colors"
                    >
                      <td className="py-3.5 pr-4 font-bold text-foreground whitespace-nowrap">
                        {item.productName}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-muted whitespace-nowrap">
                        #{item.id}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted max-w-xs truncate">
                        {item.description || "Sin descripción"}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-extrabold text-foreground whitespace-nowrap font-mono">
                        {item.quantity} unds
                      </td>
                      <td className="py-3.5 pl-4 whitespace-nowrap">
                        <Badge
                          tone={
                            item.quantity > 5
                              ? "success"
                              : item.quantity > 0
                                ? "warning"
                                : "danger"
                          }
                        >
                          {item.quantity > 5
                            ? "Disponible"
                            : item.quantity > 0
                              ? "Pocas unidades"
                              : "Agotado"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* PESTAÑA 3: HISTORIAL DE VENTAS */}
      {activeTab === "ventas" && (
        <Card className="p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-foreground">
                Ventas Aprobadas
              </h2>
              <p className="text-xs font-semibold text-muted">
                Reporte de ventas completadas en la tienda solidaria
              </p>
            </div>
            <div className="rounded-2xl bg-success-soft px-3.5 py-1.5 text-xs font-extrabold text-success border border-success/20">
              Total recaudado: {formatCOP(totalSalesAmount)}
            </div>
          </div>

          {filteredSales.length === 0 && !loading ? (
            <EmptyState
              title="Sin ventas registradas"
              description="Aún no se reportan transacciones de venta completadas en SUMA 21."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-xs uppercase text-muted font-bold">
                  <tr>
                    <th className="pb-3 pr-4 font-bold">Fecha y Hora</th>
                    <th className="pb-3 px-4 font-bold">Comprobante</th>
                    <th className="pb-3 px-4 font-bold">Método de Pago</th>
                    <th className="pb-3 px-4 font-bold">Productos</th>
                    <th className="pb-3 px-4 font-bold">Monto Total</th>
                    <th className="pb-3 pl-4 font-bold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSales.map((sale, idx) => (
                    <tr
                      key={sale.id || `sale-${idx}`}
                      className="hover:bg-primary-soft/30 transition-colors"
                    >
                      <td className="py-3.5 pr-4 text-xs font-mono text-muted whitespace-nowrap">
                        {formatFecha(sale.completedAt)}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono font-bold text-foreground whitespace-nowrap">
                        #{sale.id}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-foreground whitespace-nowrap">
                        {sale.paymentMethod}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted max-w-xs truncate">
                        {sale.items.length > 0
                          ? sale.items.map((i) => i.name || i.title || "Ítem").join(", ")
                          : "Venta directa"}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-extrabold text-foreground whitespace-nowrap font-mono">
                        {formatCOP(sale.amount)}
                      </td>
                      <td className="py-3.5 pl-4 whitespace-nowrap">
                        <Badge tone="success">{sale.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* PESTAÑA 4: CUENTAS */}
      {activeTab === "cuentas" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filteredAccounts.map((acc) => (
            <article
              key={acc.id}
              className="rounded-3xl border border-border bg-surface p-5 shadow-sm hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-primary tracking-wide">
                  Cuenta #{acc.id}
                </span>
                <Badge tone={acc.balance > 0 ? "success" : "neutral"}>
                  {acc.balance > 0 ? "Con saldo" : "Sin saldo"}
                </Badge>
              </div>
              <h3 className="mt-2 text-lg font-extrabold text-foreground truncate">
                {acc.name}
              </h3>
              <div className="mt-4 pt-3 border-t border-border flex items-baseline justify-between">
                <span className="text-xs font-semibold text-muted">
                  Saldo de apertura
                </span>
                <span className="text-xl font-black text-foreground">
                  {formatCOP(acc.balance)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal de Detalle */}
      {selectedProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-enter"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-surface p-6 shadow-2xl border border-border max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-lg font-extrabold text-foreground truncate">
                {selectedProduct.name}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="flex size-8 items-center justify-center rounded-full bg-surface-muted text-muted hover:text-foreground transition-colors font-bold"
              >
                ✕
              </button>
            </div>

            <div className="relative mt-4 w-full h-64 rounded-2xl overflow-hidden bg-surface-muted border border-border">
              <img
                src={selectedProduct.imageUrl || bisuteriaImg}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = bisuteriaImg
                }}
              />
              <div className="absolute top-3 right-3">
                <Badge tone={selectedProduct.stockQty > 0 ? "success" : "danger"}>
                  {selectedProduct.stockQty > 0
                    ? `${selectedProduct.stockQty} en inventario`
                    : "Agotado"}
                </Badge>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-baseline justify-between border-y border-border py-3">
                <div>
                  <span className="text-xs text-muted block font-semibold">
                    Precio unitario
                  </span>
                  <span className="text-2xl font-black text-primary">
                    {formatCOP(selectedProduct.unitPrice)}
                  </span>
                </div>
                <span className="text-xs text-muted font-mono">
                  ID: #{selectedProduct.id}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-1">
                  Descripción
                </h4>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {selectedProduct.description || "Sin descripción detallada registrada en SUMA 21."}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setSelectedProduct(null)}
              >
                Cerrar
              </Button>
              <Button
                type="button"
                onClick={() => {
                  showToast(`Solicitud registrada para: ${selectedProduct.name}`)
                  setSelectedProduct(null)
                }}
              >
                Registrar salida / venta
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
