"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Protocol: Avoid redundant booting sequences in the same terminal session
    const hasBooted = sessionStorage.getItem('heritage_booted');
    if (hasBooted) {
      setLoading(false);
      return;
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          sessionStorage.setItem('heritage_booted', 'true');
          setTimeout(() => setLoading(false), 200)
          return 100
        }
        return prev + 25 // Bullet Speed: 4 steps to 100%
      })
    }, 80) // Total sequence approx 320ms

    return () => clearInterval(progressInterval)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div 
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white flex items-center justify-center z-[100] selection:bg-yellow-400"
        >
          <div className="text-center space-y-12">
            
            {/* Animated Logo Container */}
            <div className="relative inline-block">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-black text-white p-12 border-8 border-black shadow-[16px_16px_0px_0px_rgba(250,204,21,1)] relative z-10"
               >
                 <h1 className="font-playfair text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-2">
                   AMBROSIA <br /> <span className="text-yellow-400">SUPREME</span>
                 </h1>
               </motion.div>
               {/* Background Border Decoration */}
               <div className="absolute inset-0 border-8 border-black -rotate-3 -z-10 translate-x-4 translate-y-4"></div>
            </div>

            {/* Progress Label */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                 <div className="w-12 h-2 bg-black"></div>
                 <p className="text-xs font-black uppercase tracking-[0.5em] text-black italic">Booting Heritage Protocol</p>
                 <div className="w-12 h-2 bg-black"></div>
              </div>
              
              {/* Brutalist Progress Bar */}
              <div className="max-w-md mx-auto h-12 border-4 border-black bg-white p-2 relative overflow-hidden">
                 <motion.div 
                   className="h-full bg-yellow-400 border-2 border-black"
                   style={{ width: `${progress}%` }}
                   transition={{ type: "spring", stiffness: 50 }}
                 />
                 <div className="absolute inset-0 flex items-center justify-center mix-blend-difference">
                    <span className="text-xl font-black text-white font-mono">{Math.round(progress)}%</span>
                 </div>
              </div>
            </div>

            <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Established 1978. Handcrafted Quality. Zero Adulteration.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
