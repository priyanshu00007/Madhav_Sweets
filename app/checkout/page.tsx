"use client"

import type React from "react"
import { useState } from "react"
import { useCart } from "@/contexts/CartContext"
import { CreditCard, Truck, Shield, CheckCircle, ArrowLeft, Package, User, MapPin, Send } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function Checkout() {
  const { state, clearCart } = useCart()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "card",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: state.items,
          total: state.total * 1.05, // Including tax
          formData
        }),
      });

      if (response.ok) {
        setOrderPlaced(true)
        clearCart()
      } else {
        const error = await response.json();
        alert(error.message || "Order failed to save.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Network protocol failure. Order not logged.");
    } finally {
      setIsProcessing(false)
    }
  }

  if (state.items.length === 0 && !orderPlaced) {
    return (
      <div className="bg-white min-h-screen pt-32 pb-20 selection:bg-yellow-400">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-12">
          <div className="relative inline-block">
             <Package className="w-32 h-32 text-black mx-auto mb-6 opacity-10" />
             <div className="absolute inset-0 border-8 border-black -rotate-6 scale-110"></div>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">Nothing To <br /><span className="text-white bg-black px-2">Ship</span></h1>
          <p className="text-xl font-black uppercase opacity-60">Your cart is as empty as a dry rasgulla.</p>
          <Link href="/products" className="inline-flex items-center gap-4 px-12 py-6 bg-black text-white border-4 border-black font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all shadow-[12px_12px_0px_0px_rgba(250,204,21,1)]">
            Explore Sweets <ArrowLeft className="w-6 h-6" />
          </Link>
        </div>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="bg-white min-h-screen pt-32 pb-20 selection:bg-yellow-400">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto px-4 text-center space-y-12"
        >
          <div className="relative inline-block">
             <div className="w-32 h-32 bg-yellow-400 border-8 border-black flex items-center justify-center rotate-3 translate-x-4">
                <CheckCircle className="w-20 h-20 text-black" />
             </div>
             <div className="absolute inset-0 border-8 border-black -rotate-6 -z-10"></div>
          </div>
          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none">Order <br /><span className="bg-black text-white px-2">Locked</span></h1>
          <div className="bg-black text-white p-12 border-8 border-black shadow-[16px_16px_0px_0px_rgba(250,204,21,1)]">
            <h2 className="text-3xl font-black uppercase mb-6 text-yellow-400">SWEET JOURNEY STARTED!</h2>
            <p className="text-lg font-bold uppercase opacity-60 leading-relaxed mb-10">
              We've received your data. Our master halwais are now preparing your box of pure happiness.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left border-t-2 border-white/20 pt-10">
               <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase opacity-40">Status</p>
                  <p className="text-xl font-black uppercase">Preparing Batch</p>
               </div>
               <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase opacity-40">Delivery Estimate</p>
                  <p className="text-xl font-black uppercase text-yellow-400">2-3 Business Days</p>
               </div>
            </div>
          </div>
          <Link href="/products" className="inline-block px-12 py-6 bg-white text-black border-4 border-black font-black uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            Back To Gallery
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-[#fffcf5] text-black min-h-screen pt-24 pb-20 selection:bg-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-20 space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-12 h-2 bg-black"></div>
             <p className="text-xs font-black uppercase tracking-[0.4em]">Final Protocol</p>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">Grand <br /><span className="bg-black text-yellow-400 px-2">Checkout</span></h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Main Form Fields */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-12">
            
            {/* Identity */}
            <div className="space-y-10 group">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black border-4 border-black text-xl rotate-3">1</div>
                  <h2 className="text-4xl font-black uppercase flex items-center gap-4">Identity <User className="w-8 h-8" /></h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border-8 border-black p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest pl-1">First Name</label>
                     <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="w-full bg-white border-4 border-black p-5 text-black font-black uppercase focus:bg-yellow-400 focus:outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest pl-1">Last Name</label>
                     <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} className="w-full bg-white border-4 border-black p-5 text-black font-black uppercase focus:bg-yellow-400 focus:outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest pl-1">Email Connection</label>
                     <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full bg-white border-4 border-black p-5 text-black font-black uppercase focus:bg-yellow-400 focus:outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest pl-1">Phone Protocol</label>
                     <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full bg-white border-4 border-black p-5 text-black font-black uppercase focus:bg-yellow-400 focus:outline-none transition-all" />
                  </div>
               </div>
            </div>

            {/* Logistics */}
            <div className="space-y-10">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black border-4 border-black text-xl rotate-[-3deg]">2</div>
                  <h2 className="text-4xl font-black uppercase flex items-center gap-4">Logistics <MapPin className="w-8 h-8" /></h2>
               </div>
               <div className="bg-white border-8 border-black p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest pl-1">Full Delivery Address</label>
                     <textarea name="address" required rows={3} value={formData.address} onChange={handleInputChange} className="w-full bg-white border-4 border-black p-5 text-black font-black uppercase focus:bg-yellow-400 focus:outline-none transition-all" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest pl-1">City</label>
                       <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="w-full bg-white border-4 border-black p-5 text-black font-black uppercase focus:bg-yellow-400 focus:outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest pl-1">State</label>
                       <input type="text" name="state" required value={formData.state} onChange={handleInputChange} className="w-full bg-white border-4 border-black p-5 text-black font-black uppercase focus:bg-yellow-400 focus:outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest pl-1">PIN Code</label>
                       <input type="text" name="pincode" required value={formData.pincode} onChange={handleInputChange} className="w-full bg-white border-4 border-black p-5 text-black font-black uppercase focus:bg-yellow-400 focus:outline-none transition-all" />
                    </div>
                  </div>
               </div>
            </div>

            {/* Payment Strategy */}
            <div className="space-y-10">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black border-4 border-black text-xl rotate-1">3</div>
                  <h2 className="text-4xl font-black uppercase flex items-center gap-4">Payment <CreditCard className="w-8 h-8" /></h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-black p-10 shadow-[12px_12px_0px_0px_rgba(250,204,21,1)]">
                  <label className={`cursor-pointer p-8 border-4 transition-all flex flex-col items-center gap-4 ${formData.paymentMethod === 'card' ? 'bg-yellow-400 border-black' : 'bg-transparent border-white/20 text-white'}`}>
                    <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleInputChange} className="sr-only" />
                    <CreditCard className="w-10 h-10" />
                    <span className="font-black uppercase text-sm">Credit/Debit Card</span>
                  </label>
                  <label className={`cursor-pointer p-8 border-4 transition-all flex flex-col items-center gap-4 ${formData.paymentMethod === 'cod' ? 'bg-yellow-400 border-black' : 'bg-transparent border-white/20 text-white'}`}>
                    <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="sr-only" />
                    <Truck className="w-10 h-10" />
                    <span className="font-black uppercase text-sm">Cash On Delivery</span>
                  </label>
               </div>
            </div>

          </div>

          {/* Right Summary Block */}
          <div className="lg:col-span-12 xl:col-span-4">
             <div className="bg-white border-8 border-black p-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] sticky top-24 space-y-10">
                <h2 className="text-4xl font-black uppercase tracking-tighter border-b-8 border-black pb-4">Order Summary</h2>

                <div className="max-h-[300px] overflow-y-auto space-y-6 pr-4 custom-scrollbar">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start border-b-2 border-black/5 pb-4">
                      <div className="space-y-1">
                        <h4 className="font-black uppercase text-xs leading-none">{item.name}</h4>
                        <p className="text-[10px] font-bold uppercase opacity-40">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-black font-mono">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-4 border-t-4 border-black">
                  <div className="flex justify-between font-black uppercase text-[10px] text-black/40">
                    <span>Subtotal</span>
                    <span>₹{state.total.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between font-black uppercase text-[10px] text-green-600">
                    <span>Royal Delivery</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between font-black uppercase text-[10px] text-black/40">
                    <span>Service Tax (5%)</span>
                    <span>₹{(state.total * 0.05).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between pt-6 border-t-8 border-black text-4xl font-black">
                    <span className="uppercase tracking-tighter">Total</span>
                    <span className="font-mono">₹{(state.total * 1.05).toFixed(0)}</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full bg-yellow-400 hover:bg-black hover:text-white transition-all py-8 border-8 border-black font-black uppercase text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-2 flex items-center justify-center gap-4"
                >
                  {isProcessing ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                       <Package className="w-8 h-8" />
                    </motion.div>
                  ) : (
                    <>Confirm & Pay <Send className="w-6 h-6" /></>
                  )}
                </button>

                <div className="flex items-center justify-center gap-6 pt-6 opacity-40">
                   <Shield className="w-6 h-6" />
                   <p className="text-[8px] font-black uppercase tracking-widest text-center">Military Grade Encryption <br />SSL Secured Protocol</p>
                </div>
             </div>
          </div>

        </form>
      </div>
    </div>
  )
}
