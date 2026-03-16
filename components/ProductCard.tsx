"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart, Plus, Eye } from "lucide-react"
import { type Product, useCart } from "@/contexts/CartContext"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

import { getImageUrl } from "@/lib/image-utils"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 800)
  }

  const productImage = getImageUrl(product.image_url || product.image || "")

  return (
    <div className="group relative bg-white border-4 border-black rounded-none overflow-hidden transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
      <Link href={`/products/${product.id}`} prefetch={true} className="block overflow-hidden relative aspect-square border-b-4 border-black group/img">
        <Image
          src={productImage}
          alt={product.name}
          fill
          className="object-cover group-hover/img:scale-110 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-yellow-400 text-black border-4 border-black px-6 py-2 font-black text-xs uppercase flex items-center gap-2 -rotate-3 group-hover/img:rotate-0 transition-transform">
               <Eye className="w-4 h-4" /> View Details
            </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-0 left-0 px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest">
          {product.category}
        </div>
      </Link>

      <div className="p-6 space-y-4 bg-white">
        <div className="flex justify-between items-start gap-2 h-14">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-playfair text-xl font-black text-black uppercase line-clamp-2 hover:underline decoration-yellow-400 decoration-4">
              {product.name}
            </h3>
          </Link>
          <div className="flex flex-col items-end">
            <span className="text-xl font-black text-black font-mono">₹{product.price}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center text-black">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating || 0) ? "fill-current" : "opacity-20"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-black uppercase font-black tracking-widest">({product.review_count || product.reviews || 0})</span>
        </div>

        <p className="text-black font-bold text-xs line-clamp-2 leading-relaxed h-8 uppercase opacity-60">
          {product.description}
        </p>

        <div className="relative">
          <button 
            onClick={handleAddToCart} 
            className="w-full flex items-center justify-center gap-2 py-4 bg-yellow-400 hover:bg-black hover:text-white border-4 border-black text-black transition-all font-black text-xs uppercase tracking-widest active:translate-y-0.5"
          >
            <ShoppingCart className="w-4 h-4" />
            Add To Cart
          </button>

          {/* Animation Overlay */}
          <AnimatePresence>
            {isAnimating && (
              <motion.div 
                initial={{ opacity: 1, scale: 0.5, y: 0 }}
                animate={{ opacity: 0, scale: 1.5, y: -50 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
              >
                <div className="bg-black text-white rounded-full p-2 h-10 w-10 flex items-center justify-center shadow-2xl">
                  <Plus className="w-6 h-6" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
