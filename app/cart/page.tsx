"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { motion, AnimatePresence } from "framer-motion"

export default function Cart() {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart()

  if (state.items.length === 0) {
    return (
      <div className="bg-white min-h-screen pt-32 pb-20 selection:bg-yellow-400">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-12">
          <div className="relative inline-block">
             <ShoppingBag className="w-32 h-32 text-black mx-auto mb-6" />
             <div className="absolute inset-0 border-8 border-black -rotate-6 -z-10 group-hover:rotate-0 transition-transform"></div>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter">Cart <br /><span className="text-yellow-400 bg-black px-2">Empty</span></h1>
          <p className="text-xl font-black uppercase opacity-60">Your sweet journey hasn't started yet.</p>
          <Link href="/products" className="inline-flex items-center gap-4 px-12 py-6 bg-black text-white border-4 border-black font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all shadow-[12px_12px_0px_0px_rgba(250,204,21,1)]">
            Go To Gallery <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#fffcf5] text-black min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">Your <br /><span className="bg-yellow-400 border-x-4 border-y-8 border-black px-2">Stash</span></h1>
          <button 
           onClick={clearCart} 
           className="px-6 py-2 border-4 border-black font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none translate-y-0 active:translate-y-1"
          >
            Clear Stash
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence>
              {state.items.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white border-8 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center gap-8 relative"
                >
                  <div className="relative w-32 h-32 border-4 border-black aspect-square overflow-hidden bg-black flex-shrink-0">
                    <Image
                      src={item.image_url || item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2 text-center md:text-left w-full">
                    <p className="text-[10px] font-black uppercase text-yellow-600 tracking-widest">{item.category}</p>
                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">{item.name}</h3>
                    <p className="text-xl font-black font-mono">₹{item.price}</p>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-10 w-full md:w-auto">
                    <div className="flex items-center border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(250,204,21,1)]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-4 hover:bg-black hover:text-white transition-colors"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="w-12 text-center text-xl font-black font-mono">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-4 hover:bg-black hover:text-white transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="text-right flex flex-col items-center md:items-end">
                      <p className="text-[10px] font-black uppercase opacity-20 mb-1">Subtotal</p>
                      <p className="text-3xl font-black font-mono">₹{(item.price * item.quantity).toFixed(0)}</p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-4 border-4 border-black hover:bg-red-600 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Checkout Block */}
          <div className="lg:col-span-4">
            <div className="bg-yellow-400 border-8 border-black p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] sticky top-24 space-y-8">
              <h2 className="text-4xl font-black uppercase tracking-tighter border-b-4 border-black pb-4">Invoice</h2>

              <div className="space-y-4 font-black uppercase text-xs">
                <div className="flex justify-between">
                  <span>Raw Goods ({state.itemCount} Units)</span>
                  <span>₹{state.total.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-black/40">
                  <span>Delivery Tax</span>
                  <span className="line-through">₹250</span>
                </div>
                <div className="flex justify-between pt-4 border-t-4 border-black text-2xl">
                  <span>Total Bill</span>
                  <span className="font-mono">₹{state.total.toFixed(0)}</span>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <Link 
                  href="/checkout" 
                  className="w-full py-6 bg-black text-white border-4 border-black font-black uppercase tracking-widest text-center block hover:bg-white hover:text-black transition-all shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]"
                >
                  Confirm Purchase
                </Link>

                <Link 
                  href="/products" 
                  className="w-full py-4 border-4 border-black font-black uppercase tracking-widest text-center block hover:bg-black hover:text-white transition-all text-[10px]"
                >
                  <ArrowLeft className="inline w-3 h-3 mr-2" /> Back To Gallery
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
