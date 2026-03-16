"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Bike, Check, ArrowRight } from "lucide-react"

interface RoleSelectionModalProps {
  currentRole: string
  onSelect: (role: "user" | "rider") => void
  isOpen: boolean
}

export default function RoleSelectionModal({ currentRole, onSelect, isOpen }: RoleSelectionModalProps) {
  const [selected, setSelected] = useState<"user" | "rider" | null>(null)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-white border-8 border-black w-full max-w-2xl p-12 relative shadow-[24px_24px_0px_0px_rgba(250,204,21,1)]"
        >
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-6xl font-black uppercase tracking-tighter leading-none italic">Choose Your Path</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 italic">Select your primary protocol for this session</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* User Option */}
              <button 
                onClick={() => setSelected('user')}
                className={`p-10 border-4 border-black text-left transition-all ${selected === 'user' ? 'bg-black text-white' : 'bg-[#fffcf5] hover:bg-yellow-50'}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 border-2 border-black rotate-2 ${selected === 'user' ? 'bg-yellow-400 text-black' : 'bg-black text-white'}`}>
                    <User className="w-8 h-8" />
                  </div>
                  {selected === 'user' && <Check className="w-8 h-8 text-yellow-400" />}
                </div>
                <h3 className="text-3xl font-black uppercase">Customer</h3>
                <p className="text-[8px] font-bold uppercase opacity-60 mt-2">Browse & Purchase Heritage Sweets</p>
              </button>

              {/* Rider Option */}
              <button 
                onClick={() => setSelected('rider')}
                className={`p-10 border-4 border-black text-left transition-all ${selected === 'rider' ? 'bg-black text-white' : 'bg-[#fffcf5] hover:bg-yellow-50'}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 border-2 border-black -rotate-2 ${selected === 'rider' ? 'bg-yellow-400 text-black' : 'bg-black text-white'}`}>
                    <Bike className="w-8 h-8" />
                  </div>
                  {selected === 'rider' && <Check className="w-8 h-8 text-yellow-400" />}
                </div>
                <h3 className="text-3xl font-black uppercase">Bullet Rider</h3>
                <p className="text-[8px] font-bold uppercase opacity-60 mt-2">Command Logistics & Complete Deliveries</p>
              </button>
            </div>

            <button 
              disabled={!selected}
              onClick={() => selected && onSelect(selected)}
              className={`w-full py-8 border-4 border-black font-black uppercase text-xl transition-all flex items-center justify-center gap-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-2 ${!selected ? 'opacity-20 cursor-not-allowed' : 'bg-yellow-400 hover:bg-black hover:text-white'}`}
            >
              Initialize Identity <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
