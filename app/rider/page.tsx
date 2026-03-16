"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { 
  Package, MapPin, CheckCircle2, Navigation, 
  Clock, ShieldCheck, ArrowRight, Loader2, AlertCircle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function RiderDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("available")
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [otpInput, setOtpInput] = useState("")
  const [verifyingId, setVerifyingId] = useState<number | null>(null)

  useEffect(() => {
    if (!isAuthLoading && (!user || user.role !== 'rider')) {
      router.push('/profile')
    }
  }, [user, isAuthLoading, router])

  useEffect(() => {
    fetchOrders()
  }, [activeTab])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const type = activeTab === "available" ? "available" : "assigned"
      const res = await fetch(`/api/delivery?type=${type}`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = async (orderId: number, action: string, otp?: string) => {
    try {
      const res = await fetch('/api/delivery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action, otp })
      })
      if (res.ok) {
        if (action === 'verify') setVerifyingId(null)
        fetchOrders()
      } else {
        const data = await res.json()
        if (data.error) alert(data.error)
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (isAuthLoading || !user) return null

  return (
    <div className="min-h-screen bg-[#fffcf5] pt-24 pb-20 selection:bg-yellow-400">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Rider Header */}
        <div className="bg-black text-white border-8 border-black p-10 mb-12 shadow-[16px_16px_0px_0px_rgba(250,204,21,1)]">
           <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-2">
                 <p className="text-[10px] font-black uppercase tracking-[0.5em] text-yellow-400">Logistics Agent Dashboard</p>
                 <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">{user.name}</h1>
              </div>
              <div className="flex gap-4">
                 <div className="bg-white/10 p-4 border-2 border-white/20 text-center min-w-[120px]">
                    <p className="text-[8px] font-black uppercase opacity-60">Success Rate</p>
                    <p className="text-2xl font-black">98%</p>
                 </div>
                 <div className="bg-white/10 p-4 border-2 border-white/20 text-center min-w-[120px]">
                    <p className="text-[8px] font-black uppercase opacity-60">Status</p>
                    <p className="text-2xl font-black text-green-400 uppercase">Active</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-4">
           {[
             { id: 'available', label: 'Protocol Pipeline', sub: 'Available Orders' },
             { id: 'assigned', label: 'Active Missions', sub: 'Your Deliveries' }
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex-1 min-w-[250px] p-8 border-4 border-black text-left transition-all ${
                 activeTab === tab.id 
                  ? 'bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] translate-x-1 translate-y-1' 
                  : 'bg-white hover:bg-black hover:text-white group'
               }`}
             >
                <p className={`text-[8px] font-black uppercase mb-1 ${activeTab === tab.id ? 'text-black/60' : 'text-black/40 group-hover:text-white/40'}`}>{tab.sub}</p>
                <p className="text-xl font-black uppercase tracking-tight">{tab.label}</p>
             </button>
           ))}
        </div>

        {/* Orders List */}
        <div className="space-y-8">
           {isLoading ? (
             <div className="py-24 flex flex-col items-center gap-6">
                <Loader2 className="w-16 h-16 animate-spin text-black" />
                <p className="font-black uppercase tracking-widest text-xs">Syncing Satellite Data...</p>
             </div>
           ) : orders.length > 0 ? (
             orders.map((order) => (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 key={order.id} 
                 className="bg-white border-8 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)]"
               >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                     <div className="lg:col-span-3 space-y-2">
                        <div className="flex items-center gap-3">
                           <span className="bg-black text-white px-3 py-1 text-[8px] font-black uppercase italic">Log ID</span>
                           <p className="font-mono font-black">#{order.id.toString().padStart(6, '0')}</p>
                        </div>
                        <h3 className="text-3xl font-black uppercase tracking-tighter leading-tight">{order.customerName}</h3>
                        <div className="flex items-center gap-2 opacity-40">
                           <MapPin className="w-4 h-4" />
                           <p className="text-[10px] font-black uppercase">Mumbai, Central Hub</p>
                        </div>
                     </div>

                     <div className="lg:col-span-3">
                        <p className="text-[8px] font-black uppercase opacity-20 mb-2 tracking-[0.4em]">Inventory Load</p>
                        <div className="flex items-center gap-4">
                           <div className="p-3 border-2 border-black bg-[#fffcf5]">
                              <Package className="w-6 h-6" />
                           </div>
                           <p className="text-xs font-black uppercase">Classic Assortment</p>
                        </div>
                     </div>

                     <div className="lg:col-span-3">
                        <p className="text-[8px] font-black uppercase opacity-20 mb-2 tracking-[0.4em]">Current Protocol</p>
                        <span className="inline-block border-2 border-black px-4 py-2 text-[10px] font-black uppercase bg-yellow-400 italic">
                           {order.status_name}
                        </span>
                     </div>

                     <div className="lg:col-span-3 flex flex-col gap-3">
                        {activeTab === 'available' ? (
                          <button 
                            onClick={() => handleAction(order.id, 'accept')}
                            className="w-full bg-black text-white py-6 border-4 border-black font-black uppercase text-xs tracking-widest hover:bg-yellow-400 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(250,204,21,1)]"
                          >
                            Accept Mission
                          </button>
                        ) : (
                          <>
                            {order.status_id === 4 && (
                              <button 
                                onClick={() => handleAction(order.id, 'pickup')}
                                className="w-full bg-black text-white py-4 border-4 border-black font-black uppercase text-xs hover:bg-yellow-400 hover:text-black transition-all"
                              >
                                Pick Up Order
                              </button>
                            )}
                            {order.status_id === 5 && (
                              <button 
                                onClick={() => handleAction(order.id, 'reached')}
                                className="w-full bg-blue-600 text-white py-4 border-4 border-black font-black uppercase text-xs hover:bg-blue-700 transition-all"
                              >
                                Mark Reached
                              </button>
                            )}
                            {(order.status_id === 7 || verifyingId === order.id) && (
                              <div className="space-y-4">
                                <input 
                                  type="text" 
                                  placeholder="ENTER OTP" 
                                  value={otpInput}
                                  onChange={(e) => setOtpInput(e.target.value)}
                                  className="w-full border-4 border-black p-4 font-black font-mono text-center tracking-[0.5em] text-xl focus:bg-yellow-400 outline-none"
                                />
                                <button 
                                  onClick={() => handleAction(order.id, 'verify', otpInput)}
                                  className="w-full bg-green-600 text-white py-4 border-4 border-black font-black uppercase text-xs hover:bg-green-700 transition-all"
                                >
                                  Verify & Close
                                </button>
                              </div>
                            )}
                            {order.status_id === 8 && (
                              <div className="bg-green-100 border-4 border-green-600 p-4 text-green-700 flex items-center justify-center gap-3">
                                 <CheckCircle2 className="w-5 h-5" />
                                 <span className="text-[10px] font-black uppercase italic">Mission Accomplished</span>
                              </div>
                            )}
                          </>
                        )}
                     </div>
                  </div>
               </motion.div>
             ))
           ) : (
             <div className="bg-white border-8 border-dashed border-black/10 py-32 text-center space-y-8">
                <ShieldCheck className="w-24 h-24 text-black/10 mx-auto" />
                <div className="space-y-2">
                   <h3 className="text-4xl font-black uppercase opacity-20">No Missions Logged</h3>
                   <p className="text-xs font-black uppercase opacity-10 tracking-[0.5em]">Command center awaiting traffic</p>
                </div>
             </div>
           )}
        </div>

      </div>
    </div>
  )
}
