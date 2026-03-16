"use client"

import { motion } from "framer-motion"
import { Package, Clock, UserCheck, Bike, MapPin, CheckCircle2, AlertCircle, Navigation } from "lucide-react"

interface LogisticsTrackerProps {
  statusId: number
  statusName: string
  riderName?: string
}

export default function LogisticsTracker({ statusId, statusName, riderName }: LogisticsTrackerProps) {
  const steps = [
    { id: 1, label: "Reviewing", icon: Clock, desc: "Protocol verification" },
    { id: 2, label: "Preparing", icon: Package, desc: "Heritage craft in progress" },
    { id: 3, label: "Awaiting Rider", icon: MapPin, desc: "Broadcasting mission" },
    { id: 4, label: "Rider Bound", icon: UserCheck, desc: riderName ? `Agent ${riderName} assigned` : "Agent found" },
    { id: 5, label: "In Transit", icon: Bike, desc: "High-speed delivery" },
    { id: 7, label: "Reached", icon: Navigation, desc: "Awaiting terminal verification" },
    { id: 8, label: "Completed", icon: CheckCircle2, desc: "Asset deployed" },
  ]

  const getCurrentStepIndex = () => {
    if (statusId === 9) return -1 // Cancelled
    const index = steps.findIndex(s => s.id === statusId)
    if (index === -1 && statusId > 2) return 1 // Fallback
    return index
  }

  const currentIndex = getCurrentStepIndex()

  if (statusId === 9) {
    return (
      <div className="bg-red-50 border-4 border-red-600 p-8 flex items-center gap-6">
        <AlertCircle className="w-10 h-10 text-red-600" />
        <div>
          <p className="font-black uppercase text-red-600 italic">Mission Aborted</p>
          <p className="text-[10px] font-bold opacity-60">This transaction has been terminated by the system.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 space-y-12">
      <div className="relative flex justify-between items-start max-w-4xl mx-auto px-4">
        {/* Progress Line */}
        <div className="absolute top-7 left-[10%] right-[10%] h-1 bg-gray-200 -z-10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
            className="h-full bg-yellow-400"
          />
        </div>

        {steps.map((step, i) => {
          const isCompleted = i < currentIndex
          const isActive = i === currentIndex
          const Icon = step.icon

          return (
            <div key={step.id} className="flex flex-col items-center gap-4 text-center w-1/7">
              <div 
                className={`w-14 h-14 rounded-none border-4 flex items-center justify-center transition-all duration-500 scale-90 ${
                  isCompleted ? "bg-black border-black text-yellow-400" :
                  isActive ? "bg-yellow-400 border-black text-black scale-110 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" :
                  "bg-white border-gray-200 text-gray-300"
                }`}
              >
                <Icon className="w-6 h-6" />
                {isCompleted && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 bg-yellow-400 border-2 border-black rounded-full p-0.5">
                    <CheckCircle2 className="w-3 h-3 text-black" />
                  </motion.div>
                )}
              </div>
              <div className="space-y-1 hidden md:block">
                <p className={`text-[8px] font-black uppercase tracking-tighter ${isActive ? "text-black" : "text-gray-400"}`}>{step.label}</p>
                {isActive && (
                   <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[6px] font-bold italic text-yellow-600 leading-tight">
                     {step.desc}
                   </motion.p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {currentIndex === 5 && (
        <div className="bg-black text-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(250,204,21,1)] flex items-center justify-between">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-yellow-400 text-black border-2 border-black flex items-center justify-center font-black text-2xl uppercase italic animate-bounce">
                {riderName ? riderName[0] : "R"}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400">Agent On Route</p>
                <h4 className="text-xl font-black uppercase italic">{riderName || "Bullet Rider"} is closing in...</h4>
              </div>
           </div>
           <div className="text-right">
              <p className="text-[8px] font-black uppercase opacity-40">Est. Signal</p>
              <p className="text-xl font-black font-mono">2.4 MIN</p>
           </div>
        </div>
      )}
    </div>
  )
}

