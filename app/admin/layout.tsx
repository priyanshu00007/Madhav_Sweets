"use client"

import type React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { AdminProvider } from "@/contexts/AdminContext"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAdmin, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/login?error=Access Denied")
    }
  }, [isAdmin, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-8 border-black border-t-yellow-400 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#fffcf5] text-black">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar Space (Potentially for future specific navigation) */}
        <main className="flex-1 p-4 md:p-12 overflow-x-hidden">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-7xl mx-auto"
            >
              <div className="mb-12 border-b-8 border-black pb-8">
                 <h2 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 mb-2 italic">Security Protocol: Active</h2>
                 <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">Command <span className="text-yellow-400 bg-black px-2">Center</span></h1>
              </div>
              <AdminProvider>
                {children}
              </AdminProvider>
            </motion.div>
        </main>
      </div>
    </div>
  )
}
