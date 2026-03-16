"use client"

import { useState, useEffect } from "react"
import ProductCard from "@/components/ProductCard"
import type { Product } from "@/contexts/CartContext"
import { motion } from "framer-motion"
import { SlidersHorizontal, ChevronDown } from "lucide-react"

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("name")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        if (response.ok) {
          const data = await response.json()
          if (data.length > 0) {
            setProducts(data)
          } else {
            const { products: defaultProducts } = await import("@/data/products")
            setProducts(defaultProducts)
          }
        }
      } catch (error) {
        const { products: defaultProducts } = await import("@/data/products")
        setProducts(defaultProducts)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))]

  const filteredProducts = products.filter(
    (product) => selectedCategory === "All" || product.category === selectedCategory,
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price
      case "price-high": return b.price - a.price
      case "rating": return b.rating - a.rating
      default: return (a.name || '').localeCompare(b.name || '')
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20 space-y-6">
            <div className="w-48 h-4 bg-gray-200 animate-pulse"></div>
            <div className="w-3/4 h-32 bg-gray-200 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-gray-50 border-4 border-black/5 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white text-black min-h-screen pt-24 pb-20 selection:bg-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Gallery Header */}
        <div className="mb-20 space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-12 h-2 bg-yellow-400 border-2 border-black"></div>
             <p className="text-xs font-black uppercase tracking-[0.4em]">The Grand Catalogue</p>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">Sweet <br /><span className="bg-black text-white px-2">Gallery</span></h1>
          <p className="text-xl font-black uppercase max-w-2xl opacity-60">Elite Indian confectionery. High purity, zero compromise. Handcrafted since 1978.</p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-16 gap-8 bg-[#fffcf5] border-x-4 border-y-8 border-black p-8">
          <div className="flex items-center gap-4 flex-wrap">
            <SlidersHorizontal className="w-6 h-6 mr-2" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 border-4 border-black font-black uppercase tracking-widest text-[10px] transition-all relative ${
                  selectedCategory === category
                    ? "bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]"
                    : "bg-white hover:bg-black hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative group w-full xl:w-64">
             <select
               value={sortBy}
               onChange={(e) => setSortBy(e.target.value)}
               className="w-full appearance-none px-6 py-4 border-4 border-black font-black uppercase tracking-widest text-[10px] bg-white focus:outline-none focus:bg-yellow-400 transition-colors cursor-pointer"
             >
               <option value="name">Sort: Alphabetical</option>
               <option value="price-low">Sort: Price Low-High</option>
               <option value="price-high">Sort: Price High-Low</option>
               <option value="rating">Sort: Highest Rated</option>
             </select>
             <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5" />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-32 border-8 border-dashed border-black mt-12 bg-gray-50">
             <h2 className="text-4xl font-black uppercase opacity-20">No Sweets Found</h2>
             <button 
              onClick={() => setSelectedCategory('All')} 
              className="mt-6 px-10 py-5 bg-black text-white font-black uppercase tracking-widest text-xs border-4 border-black hover:bg-yellow-400 hover:text-black transition-all"
             >
                Reset Filters
             </button>
          </div>
        )}

      </div>
    </div>
  )
}
