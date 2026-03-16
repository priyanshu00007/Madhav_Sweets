"use client"

import Link from "next/link"
import Image from "next/image"
import { Star, Award, Truck, Shield, ArrowRight, ShoppingBag, Plus, MapPin } from "lucide-react"
import ProductCard from "@/components/ProductCard"
import { products } from "@/data/products"
import { motion } from "framer-motion"
import { getImageUrl } from "@/lib/image-utils"
import dynamic from "next/dynamic"

const StoreMap = dynamic(() => import("@/components/StoreMap"), {
  ssr: false,
  loading: () => <div className="animate-pulse h-[400px] bg-gray-100 border-4 border-black" />
})

export default function Home() {
  const featuredProducts = products.filter(p => p.is_featured);

  return (
    <div className="bg-white text-black selection:bg-yellow-400 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-24 border-b-8 border-black">
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-yellow-400/20 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-10"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-black border-2 border-black text-white text-[10px] font-black tracking-[0.3em] uppercase">
                <Star className="w-4 h-4 fill-yellow-400" />
                <span>Award-Winning Sweets</span>
              </div>
              
              <h1 className="font-playfair text-5xl sm:text-7xl md:text-9xl font-black leading-tight tracking-tighter text-black uppercase break-words">
                Supreme <br />
                <span className="bg-yellow-400 px-4 inline-block -rotate-2 border-4 border-black text-black">Flavors</span>
              </h1>
              
              <p className="text-xl text-black font-black leading-relaxed max-w-lg uppercase">
                Authentic Indian confections, handcrafted with pure desi ghee. No compromises.
              </p>
              
              <div className="flex flex-wrap gap-5 pt-4">
                <Link 
                  href="/products" 
                  className="group px-12 py-6 bg-yellow-400 border-4 border-black text-black font-black text-sm uppercase tracking-widest transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:translate-y-2"
                >
                  Shop Now
                </Link>
                
                <Link 
                  href="/about" 
                  className="px-12 py-6 bg-white border-4 border-black text-black font-black text-sm uppercase tracking-widest transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:translate-y-2"
                >
                  Our Heritage
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="relative aspect-square max-w-lg mx-auto border-8 border-black bg-black group overflow-hidden shadow-[20px_20px_0px_0px_rgba(250,204,21,1)] ">
                <Image 
                  src={getImageUrl(products[0]?.image_url)} 
                  alt="Luxury Indian Sweets" 
                  fill 
                  className="object-cover transition-transform duration-700 hover:scale-110"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-yellow-400 border-t-8 border-black translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                   <p className="text-black font-black text-4xl uppercase tracking-tighter">Pure Quality</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 border-b-8 border-black bg-black mt-10 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: Award, label: "Pure Ghee", desc: "No compromise on purity" },
              { icon: Truck, label: "Express", desc: "Delivered same day" },
              { icon: Shield, label: "Hygienic", desc: "Clean & safe packing" },
              { icon: Plus, label: "Heritage", desc: "Traditional recipes" }
            ].map((f, i) => (
              <div key={i} className="group p-8 bg-black border-4 border-yellow-400 text-yellow-400">
                <f.icon className="w-10 h-10 mb-6" />
                <h2 className="text-xl font-black mb-2 uppercase tracking-tighter">{f.label}</h2>
                <p className="text-sm font-bold uppercase opacity-60">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Collections */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
              <h2 className="text-sm font-black text-black uppercase tracking-[0.5em] border-l-4 border-yellow-400 pl-4">Signature Collection</h2>
              <h2 className="text-6xl md:text-8xl font-black text-black uppercase tracking-tighter leading-none">Best <br /><span className="text-yellow-400 bg-black px-2">Sellers</span></h2>
            </div>
            <Link href="/products" className="px-10 py-5 bg-black text-white font-black uppercase text-xs tracking-widest hover:bg-yellow-400 hover:text-black transition-all border-4 border-black">
              View All Products
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Product of the Day */}
      <section className="py-24 bg-white border-y-8 border-black overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12 pointer-events-none">
           <ShoppingBag className="w-96 h-96 text-black" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="relative aspect-square border-8 border-black bg-black shadow-[16px_16px_0px_0px_rgba(250,204,21,1)] overflow-hidden">
                <Image src={getImageUrl(products[0]?.image_url)} alt="Product of the Day" fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <div className="absolute -top-6 -left-6 bg-black text-yellow-400 px-8 py-4 border-4 border-black font-black uppercase italic text-xl rotate-3 shadow-[8px_8px_0px_0px_rgba(250,204,21,1)]">
                PROTOCOL OF THE DAY
              </div>
            </div>
            <div className="space-y-8">
               <div className="space-y-4">
                  <h3 className="text-sm font-black text-yellow-600 uppercase tracking-[0.4em]">Elite Highlight</h3>
                  <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">{products[0]?.name}</h2>
                  <p className="text-lg md:text-xl font-bold uppercase opacity-60 leading-relaxed italic">{products[0]?.description}</p>
               </div>
               <div className="flex items-center gap-10 border-l-8 border-yellow-400 pl-8">
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-40 mb-1">Standard Valuation</p>
                    <p className="text-5xl font-black font-mono">₹{products[0]?.price}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-40 mb-1">Audit Score</p>
                    <div className="flex gap-1 text-black"><Star className="w-6 h-6 fill-black" /><Star className="w-6 h-6 fill-black" /><Star className="w-6 h-6 fill-black" /><Star className="w-6 h-6 fill-black" /><Star className="w-6 h-6 fill-black" /></div>
                  </div>
               </div>
               <Link href={`/products/${products[0]?.id}`} className="inline-flex items-center gap-6 px-12 py-8 bg-black text-white font-black uppercase text-sm tracking-widest hover:bg-yellow-400 hover:text-black transition-all border-4 border-black shadow-[12px_12px_0px_0px_rgba(250,204,21,1)] active:translate-y-2 active:shadow-none">
                  Secure This Asset <ArrowRight className="w-6 h-6" />
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Testimonials */}
      <section className="py-32 bg-[#fffcf5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-20">
           <div className="space-y-4">
              <h2 className="text-sm font-black text-black uppercase tracking-[0.5em]">Vanguard Feedback</h2>
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">Certified <span className="bg-yellow-400 px-2 italic">Audits</span></h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
              {[
                { name: "Vikram S.", role: "Heritage Collector", text: "The Kaju Katli isn't just a sweet; it's a structural masterpiece. The silver foil application is flawless." },
                { name: "Priya M.", role: "Ghee connoisseur", text: "I've analyzed ghee specialities across the subcontinent. madhav's Mysore Pak is the new benchmark." },
                { name: "Arjun K.", role: "Logistics Agent", text: "Bullet delivery protocol is no joke. Ordered at 10 AM, received at noon. Elite precision." }
              ].map((t, i) => (
                <div key={i} className="bg-white border-8 border-black p-10 space-y-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all group">
                   <div className="flex gap-1 text-yellow-400">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-black" />)}</div>
                   <p className="text-xl font-black uppercase leading-tight italic">"{t.text}"</p>
                   <div className="pt-8 border-t-4 border-black/5">
                      <p className="text-sm font-black uppercase">{t.name}</p>
                      <p className="text-[10px] font-bold uppercase opacity-40 tracking-widest">{t.role}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>
      {/* Map Section */}
      <section className="py-24 bg-white border-t-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StoreMap />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-yellow-400 border-t-8 border-black relative overflow-hidden group">
        <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center space-y-10">
             <h2 className="text-6xl md:text-9xl font-black text-black group-hover:text-white uppercase tracking-tighter leading-none transition-colors duration-700">Gift <br />Premium</h2>
             <p className="text-2xl font-black text-black group-hover:text-white uppercase max-w-2xl transition-colors duration-700">Traditional taste meets modern luxury. The perfect gift for every occasion.</p>
             <Link href="/products" className="px-16 py-8 bg-black text-white font-black text-xl uppercase tracking-widest hover:bg-white hover:text-black border-8 border-black transition-all">
                Shop Now
             </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
