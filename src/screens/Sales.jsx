import { useState } from "react"
import bisuteriaImg from "../imports/bisuteria.jpg"
import collarImg from "../imports/collar.jpg"
import pulserasImg from "../imports/pulseras.jpg"
import ropaImg from "../imports/ropa.jpg"
import camisetaImg from "../imports/camiseta.jpg"
import gargantillaImg from "../imports/gargantilla.jpg"
import packcamisetasImg from "../imports/packcamisetas.jpg"
import hoodieImg from "../imports/hoodie.jpg"
import { formatCOP } from "../data"

const PRODUCTS = [
  {
    id: 1,
    title: "Collar de Mostacilla Artesanal",
    category: "Bisutería",
    price: 25000,
    image: collarImg,
    shortDescription:
      "Hecho a mano en el taller de artesanías. Colores vivos e hilo resistente.",
    fullDescription:
      "Hermoso collar elaborado minuciosamente por los jóvenes de la fundación en el taller de bisutería y arte manual. Emplea mostacilla checa de primera calidad con terminaciones seguras y resistentes. Cada pieza es única y refleja el talento y dedicación de nuestros beneficiarios.",
    workshop: "Taller de Bisutería y Manualidades",
    availability: "Disponible en sede",
  },
  {
    id: 2,
    title: "Camiseta Estampada ASISCO UP",
    category: "Ropa",
    price: 45000,
    image: camisetaImg,
    shortDescription:
      "100% Algodón con diseño exclusivo del programa de jóvenes.",
    fullDescription:
      "Prenda clásica y cómoda confeccionada en 100% algodón suave de alta calidad. Estampada artesanalmente por los participantes del taller formativo con tintas duraderas a base de agua. Disponible en tallas juveniles y de adulto (S, M, L, XL).",
    workshop: "Taller de Confección y Diseño",
    availability: "Tallas S, M, L y XL",
  },
  {
    id: 3,
    title: "Juego de Pulseras",
    category: "Bisutería",
    price: 18000,
    image: pulserasImg,
    shortDescription:
      "Set de accesorios tejidos en mostacilla con patrones geométricos",
    fullDescription:
      "Conjunto juvenil que incluye aretes colgantes ligeros y pulseras de cierre deslizable ajustable. Elaborado con materiales hipoalergénicos e hilos de alta tenacidad que garantizan su perdurabilidad.",
    workshop: "Taller de Bisutería y Manualidades",
    availability: "Colores variados",
  },
  {
    id: 4,
    title: "Hoodie Saco Solidario ASISCO UP",
    category: "Ropa",
    price: 70000,
    image: hoodieImg,
    shortDescription:
      "Buzo con capota en algodón perchado abrigador de alta calidad.",
    fullDescription:
      "Saco tipo hoodie confeccionado en algodón perchado grueso, ideal para bajas temperaturas. Cuenta con capota forrada, bolsillo frontal tipo canguro y rib elástico en puños y cintura.",
    workshop: "Taller de Confección y Diseño",
    availability: "Varios colores y tallas",
  },
  {
    id: 5,
    title: "Gargantilla",
    category: "Bisutería",
    price: 30000,
    image: gargantillaImg,
    shortDescription:
      "Diseño exclusivo y vibrante con acabados finos hecho por los jóvenes.",
    fullDescription:
      "Gargantilla con técnica de tejido apretado que combina tonos cálidos y contrastes alegres. Una pieza decorativa especial para regalar y a su vez apoyar directamente los proyectos educativos de la fundación.",
    workshop: "Taller de Bisutería y Manualidades",
    availability: "Piezas limitadas",
  },
  {
    id: 6,
    title: "4 Camisetas Básicas",
    category: "Ropa",
    price: 38000,
    image: packcamisetasImg,
    shortDescription:
      "Camisetas frescas de uso diario",
    fullDescription:
      "Camiseta de tacto suave, cuello redondo reforzado y excelente transpirabilidad.",
    workshop: "Taller de Confección y Diseño",
    availability: "Colores negro, blanco y gris",
  },
]

const CATEGORIES = [
  { id: "todos", label: "Todos" },
  { id: "Ropa", label: "Ropa" },
  { id: "Bisutería", label: "Bisutería" },
]

export default function SalesScreen() {
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [toastMessage, setToastMessage] = useState("")

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategory === "todos" || product.category === selectedCategory

    const query = searchQuery.trim().toLowerCase()
    const matchesQuery =
      !query ||
      product.title.toLowerCase().includes(query) ||
      product.shortDescription.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)

    return matchesCategory && matchesQuery
  })

  const handleShowInterest = (product) => {
    setToastMessage(`Información de compra solicitada para: ${product.title}`)
    setTimeout(() => setToastMessage(""), 4000)
    setSelectedProduct(null)
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] p-4 sm:p-8 font-sans text-[#2D3748]">
      {/* Notificación Toast */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#1A202C] px-5 py-3.5 text-sm font-semibold text-white shadow-2xl animate-enter border border-white/10"
        >
          <span className="text-lg">🛍️</span>
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage("")}
            className="ml-2 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        {/* HEADER DEL MÓDULO */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A202C] font-heading">
                Tienda Solidaria
              </h1>
            </div>
            <p className="mt-1 text-sm text-[#718096]">
              Catálogo visual de productos elaborados para beneficio de la fundación.
            </p>
          </div>

          {/* BARRA DE BÚSQUEDA */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar producto..."
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E08709]/50 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-sm"
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* BANNER INFORMATIVO SOLIDARIO */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#FFF4E3] via-[#FFF8EE] to-[#FFF4E3] p-4 sm:p-5 border border-[#FCE3B4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-extrabold text-[#1A202C]">
                100% con Propósito Social
              </p>
              <p className="text-xs text-[#718096]">
                Los recursos obtenidos financian refrigerios, materiales artísticos y acompañamiento formativo a los beneficiarios.
              </p>
            </div>
          </div>
          <div className="text-xs font-bold text-[#E08709] bg-white px-3 py-1.5 rounded-lg border border-[#FCE3B4] shrink-0 self-start sm:self-center shadow-xs">
            {PRODUCTS.length} productos en catálogo
          </div>
        </div>

        {/* FILTROS POR CATEGORÍA (CHIPS) */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id
            const count =
              cat.id === "todos"
                ? PRODUCTS.length
                : PRODUCTS.filter((p) => p.category === cat.id).length

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm transition-all cursor-pointer select-none ${isActive
                  ? "font-semibold bg-[#FCE3B4] text-[#E08709] shadow-sm border border-[#FCE3B4]"
                  : "font-medium bg-white text-[#718096] hover:bg-gray-100 border border-gray-200 shadow-sm"
                  }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${isActive
                    ? "bg-[#E08709] text-white"
                    : "bg-gray-100 text-gray-500"
                    }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* GRID DE PRODUCTOS */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <span className="mx-auto block text-4xl mb-3">🔍</span>
            <h3 className="text-lg font-bold text-[#1A202C]">
              No se encontraron productos
            </h3>
            <p className="mt-1 text-sm text-[#718096]">
              Intenta con otro término de búsqueda o selecciona otra categoría.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("todos")
              }}
              className="mt-4 rounded-xl bg-[#E08709] px-4 py-2 text-xs font-bold text-white hover:bg-[#c97807] transition-all"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl p-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col justify-between hover:shadow-lg hover:border-[#E08709]/30 transition-all duration-200"
              >
                <div>
                  {/* Imagen con badge sobrepuesto */}
                  <div
                    onClick={() => setSelectedProduct(product)}
                    className="relative w-full h-56 bg-gray-100 rounded-xl overflow-hidden mb-4 cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#E08709] text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm border border-black/5 flex items-center gap-1">
                      <span>{product.categoryIcon}</span>
                      <span>{product.category}</span>
                    </span>
                    <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      Clic para ampliar
                    </span>
                  </div>

                  {/* Información */}
                  <h3
                    onClick={() => setSelectedProduct(product)}
                    className="font-bold text-base text-[#1A202C] mb-1 font-heading cursor-pointer hover:text-[#E08709] transition-colors"
                  >
                    {product.title}
                  </h3>
                  <p className="text-xs text-[#718096] mb-4 line-clamp-2 leading-relaxed">
                    {product.shortDescription}
                  </p>
                </div>

                {/* Precio y Botón */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-[11px] font-medium text-gray-400 block uppercase tracking-wider">
                      Aporte sugerido
                    </span>
                    <span className="text-lg font-bold text-[#E08709]">
                      {formatCOP(product.price)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                    className="bg-[#E08709] hover:bg-[#c97807] text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    Ver detalle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DIÁLOGO / MODAL DE DETALLE DEL PRODUCTO */}
      {selectedProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-enter"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">{selectedProduct.categoryIcon}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#E08709]">
                  {selectedProduct.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Imagen destacada en alta resolución */}
            <div className="relative mt-4 w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs text-white font-medium">
                {selectedProduct.workshop}
              </div>
            </div>

            {/* Contenido descriptivo */}
            <div className="mt-4">
              <h2 className="text-xl font-extrabold text-[#1A202C] font-heading">
                {selectedProduct.title}
              </h2>

              <div className="mt-2 flex items-baseline justify-between border-y border-gray-100 py-3">
                <div>
                  <span className="text-xs text-gray-400 block font-medium">
                    Aporte o donación sugerida
                  </span>
                  <span className="text-2xl font-black text-[#E08709]">
                    {formatCOP(selectedProduct.price)}
                  </span>
                </div>
                <span className="rounded-lg bg-green-50 px-3 py-1 text-xs font-bold text-green-700 border border-green-200">
                  {selectedProduct.availability}
                </span>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Descripción del producto
                </h4>
                <p className="text-sm text-[#718096] leading-relaxed">
                  {selectedProduct.fullDescription}
                </p>
              </div>

              {/* Caja de impacto social */}
              <div className="mt-4 rounded-xl bg-[#FFF8EE] border border-[#FCE3B4] p-3.5 text-xs text-[#718096]">
                <strong className="block text-[#E08709] font-bold mb-0.5">
                  ¿Cómo ayuda tu compra?
                </strong>
                El 100% del dinero recaudado es reinvertido directamente en compra de materiales, refrigerios nutritivos y talleres de formación para los niños y jóvenes del programa.
              </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => handleShowInterest(selectedProduct)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#E08709] hover:bg-[#c97807] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Adquirir en sede</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
