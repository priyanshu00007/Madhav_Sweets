"use client"

import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useCart, type Product } from "@/contexts/CartContext"
import { products as localProducts } from "@/data/products"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Star, ShoppingCart, ArrowLeft, Plus, Minus, 
  Truck, ShieldCheck, RefreshCcw, Tag, Info, Loader2
} from "lucide-react"
import { getImageUrl } from "@/lib/image-utils"

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedWeight, setSelectedWeight] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [currentPrice, setCurrentPrice] = useState(0)

  // Helper to calculate price based on weight
  const calculatePrice = (basePrice: number, weightStr: string) => {
    if (!weightStr) return basePrice;
    const weight = weightStr.toLowerCase()
    if (weight.includes('kg')) {
      const val = parseFloat(weight.replace('kg', '')) || 1
      return Math.round(basePrice * val)
    } else if (weight.includes('g')) {
      const val = parseFloat(weight.replace('g', '')) || 0
      return Math.round((basePrice / 1000) * val)
    } else if (weight.includes('pc')) {
      const val = parseInt(weight.replace('pc', '')) || 1
      // For pieces, we assume base price / 12 for price per piece if not specified
      return Math.round((basePrice / 12) * val)
    }
    return basePrice
  }

  useEffect(() => {
    const loadProduct = async () => {
      // Step 1: Immediate local lookup (Sub-millisecond)
      const localFound = localProducts.find(p => p.id === Number(id));
      if (localFound) {
        setProduct(localFound);
        const firstOpt = Array.isArray(localFound.weight_options) ? localFound.weight_options[0] : '';
        setSelectedWeight(firstOpt);
        setLoading(false);
      }

      // Step 2: Background refresh from API for real-time stock/price data
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const allProducts = await response.json();
          const found = allProducts.find((p: any) => p.id === Number(id));
          if (found) {
            setProduct(found);
            if (!selectedWeight) { // Only set if not already selected to avoid UI flicker
                const firstOpt = Array.isArray(found.weight_options) ? found.weight_options[0] : '';
                setSelectedWeight(firstOpt);
            }
          } else if (!localFound) {
            router.push("/products");
          }
        }
      } catch (error) {
        console.error("Sync failed:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id, router])

  useEffect(() => {
    if (product && selectedWeight) {
      setCurrentPrice(calculatePrice(product.price, selectedWeight))
    }
  }, [selectedWeight, product])

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center space-y-6">
        <Loader2 className="w-16 h-16 animate-spin text-yellow-400" />
        <p className="text-xs font-black uppercase tracking-[0.4em]">Deciphering Heritage Specs...</p>
      </div>
    )
  }

  if (!product) return null

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart({ 
        ...product, 
        price: currentPrice,
        selectedWeight // Pass weight for checkout preservation
    })
    setTimeout(() => setIsAdding(false), 1000)
  }

  const discount = product.discount_price 
    ? Math.round(((product.discount_price - product.price) / product.discount_price) * 100)
    : 0

  const weightOptions = Array.isArray(product.weight_options) 
    ? product.weight_options 
    : (typeof product.weight_options === 'string' ? product.weight_options.split(',') : [])

  const tags = Array.isArray(product.tags) 
    ? product.tags 
    : (typeof product.tags === 'string' ? product.tags.split(',').filter(Boolean) : [])

  return (
    <div className="bg-white text-black min-h-screen pt-24 pb-20 selection:bg-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs / Back */}
        <Link href="/products" className="inline-flex items-center gap-2 font-black uppercase text-xs mb-10 hover:bg-yellow-400 px-4 py-2 border-2 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">
          <ArrowLeft className="w-4 h-4" /> Back To Gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Images Section */}
          <div className="lg:col-span-12 xl:col-span-6 space-y-8">
            <div className="relative aspect-square border-8 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] bg-black overflow-hidden group">
              <Image 
                src={getImageUrl(product.image_url)} 
                alt={product.name} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {discount > 0 && (
                <div className="absolute top-0 right-0 bg-yellow-400 border-l-8 border-b-8 border-black px-8 py-4 font-black text-3xl uppercase italic z-10">
                  -{discount}% OFF
                </div>
              )}
            </div>
            
            {/* Gallery removed as per directive */}
          </div>

          {/* Details Section */}
          <div className="lg:col-span-12 xl:col-span-6 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <span className="bg-black text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] italic">{product.category}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border-2 ${product.stock_quantity > 0 || product.stock > 0 ? "border-green-600 text-green-600 bg-green-50" : "border-red-600 text-red-600 bg-red-50"}`}>
                   {(product.stock_quantity > 0 || product.stock > 0) ? `Inventory: ${product.stock_quantity || product.stock} Units` : "Sold Out"}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">{product.name}</h1>
              
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-1.5 text-black">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} className={`w-6 h-6 ${i < Math.floor(product.rating || 4.5) ? "fill-black" : "opacity-10"}`} />
                   ))}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] underline underline-offset-8 decoration-4 decoration-yellow-400 cursor-default">{product.review_count || product.reviews || 120} Certified Audits</span>
              </div>
            </div>

            <div className="border-8 border-black py-10 px-10 flex flex-wrap items-end gap-8 bg-[#fffcf5] shadow-[12px_12px_0px_0px_rgba(250,204,21,1)]">
               <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Elite Price</p>
                  <span className="text-7xl font-black font-mono tracking-tighter">₹{currentPrice * quantity}</span>
               </div>
               {(product.discount_price || 0) > product.price && (
                 <div className="space-y-2 pb-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">M.R.P Valuation</p>
                    <span className="text-3xl font-black font-mono line-through opacity-20">₹{calculatePrice(product.discount_price, selectedWeight) * quantity}</span>
                 </div>
               )}
            </div>

            {/* Weight Options */}
            {weightOptions.length > 0 && (
              <div className="space-y-8">
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                   Configure Mass <Info className="w-5 h-5 text-yellow-400" />
                </h2>
                <div className="flex flex-wrap gap-4">
                  {weightOptions.map((opt: string) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedWeight(opt)}
                      className={`px-10 py-5 border-4 border-black font-black uppercase tracking-[0.2em] text-xs transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none hover:bg-yellow-400 ${
                        selectedWeight === opt ? 'bg-yellow-400 translate-x-1.5 translate-y-1.5 shadow-none' : 'bg-white'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row gap-8 pt-8">
               <div className="flex items-center border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-8 hover:bg-black hover:text-white transition-colors"
                  >
                    <Minus className="w-6 h-6" />
                  </button>
                  <span className="w-24 text-center text-4xl font-black font-mono">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-8 hover:bg-black hover:text-white transition-colors"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
               </div>

               <button 
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 bg-black text-white p-8 border-4 border-black font-black uppercase tracking-[0.3em] text-sm hover:bg-yellow-400 hover:text-black transition-all shadow-[12px_12px_0px_0px_rgba(250,204,21,1)] relative overflow-hidden active:translate-y-4 active:shadow-none"
               >
                 <AnimatePresence mode="wait">
                   {isAdding ? (
                     <motion.span 
                       key="adding"
                       initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: -30 }}
                       className="flex items-center justify-center gap-4"
                     >
                       <ShoppingCart className="w-6 h-6" /> Target Locked!
                     </motion.span>
                   ) : (
                     <motion.span 
                       key="add"
                       initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: -30 }}
                       className="flex items-center justify-center gap-6"
                     >
                       <ShoppingCart className="w-6 h-6" /> Secure Collection
                     </motion.span>
                   )}
                 </AnimatePresence>
               </button>
            </div>

            <div className="p-10 border-8 border-black bg-white space-y-6 shadow-[16px_16px_0px_0px_rgba(0,0,0,0.05)]">
               <h2 className="text-xl font-black uppercase border-b-4 border-yellow-400 inline-block">Heritage Brief</h2>
               <p className="text-sm font-bold uppercase leading-loose text-black/70 italic">
                 {product.description}
               </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-16 border-t-4 border-black/10">
               {[
                 { icon: Truck, label: "Bullet Logistics", sub: "Priority Dispatch" },
                 { icon: ShieldCheck, label: "Vault Secured", sub: "Payment Protocol" },
                 { icon: RefreshCcw, label: "24H Recalibration", sub: "Quality Guarantee" }
               ].map((b, i) => (
                 <div key={i} className="flex items-center gap-6 group">
                    <div className="p-4 bg-black text-yellow-400 border-4 border-black group-hover:bg-yellow-400 group-hover:text-black transition-all rotate-3">
                       <b.icon className="w-8 h-8" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase leading-tight mb-1">{b.label}</p>
                       <p className="text-[10px] font-black uppercase opacity-20 tracking-widest">{b.sub}</p>
                    </div>
                 </div>
               ))}
            </div>

          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-40 space-y-16">
           <div className="flex justify-between items-end">
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-[0.5em] text-yellow-600 italic">Heritage Echoes</p>
                 <h2 className="text-5xl font-black uppercase tracking-tighter">You May Also Enlist</h2>
              </div>
              <Link href="/products" className="text-xs font-black uppercase underline underline-offset-8 decoration-4 decoration-black hover:text-yellow-600 transition-all">View All Manifests</Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {localProducts.filter(p => p.id !== Number(id)).slice(0, 4).map((rp) => (
                <Link href={`/products/${rp.id}`} key={rp.id} className="group bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                   <div className="aspect-square bg-black border-4 border-black relative overflow-hidden mb-4">
                      <Image src={getImageUrl(rp.image_url)} alt={rp.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 25vw" />
                   </div>
                   <p className="text-[8px] font-black uppercase opacity-40 mb-1">{rp.category}</p>
                   <h4 className="font-black uppercase text-xs truncate mb-2">{rp.name}</h4>
                   <p className="font-black font-mono text-sm">₹{rp.price}</p>
                </Link>
              ))}
           </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-32 flex flex-wrap items-center gap-6 pt-16 border-t-8 border-black">
             <span className="text-xs font-black uppercase tracking-[0.5em] mr-6">
                <Tag className="w-5 h-5 inline-block mr-2" /> Classifiers:
             </span>
             {tags.map((tag: string) => (
               <span key={tag} className="px-6 py-3 bg-black text-white border-4 border-black text-[10px] font-black uppercase hover:bg-yellow-400 hover:text-black transition-all cursor-default shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">#{tag.trim()}</span>
             ))}
          </div>
        )}

      </div>
    </div>
  )
}
