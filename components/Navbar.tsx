"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ShoppingCart, Menu, X, User, LogOut, Shield, ChevronDown } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { state } = useCart()
  const { user, logout, isAdmin } = useAuth()

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-[padding,background-color,border-color] duration-500 will-change-[padding,background-color] ${
      scrolled ? "bg-white/95 backdrop-blur-md border-b-4 border-black py-2" : "bg-transparent py-6"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="font-playfair text-3xl font-black tracking-tighter text-black uppercase">
              AMBROSIA
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {['Home', 'Products', 'About', 'Contact'].map((item) => (
              <Link 
                key={item} 
                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className="text-xs font-black uppercase tracking-[0.2em] text-black hover:bg-yellow-400 px-2 py-1 transition-all"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 border-2 border-transparent hover:border-black transition-all" aria-label="View Shopping Cart">
              <ShoppingCart className="w-6 h-6 text-black" />
              <AnimatePresence>
                {state.itemCount > 0 && (
                  <motion.span 
                    key={state.itemCount}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-yellow-400 border-2 border-black text-black text-[10px] font-black rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    {state.itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-1 pl-3 bg-white border-2 border-black rounded-lg hover:bg-yellow-400 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                >
                  <span className="text-xs font-black text-black hidden lg:block uppercase tracking-widest">{user.name}</span>
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <ChevronDown className={`w-3 h-3 text-black transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-4 w-64 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] py-2"
                    >
                      <div className="px-5 py-4 border-b-2 border-black bg-yellow-400">
                        <p className="text-sm font-black text-black uppercase">{user.name}</p>
                        <p className="text-[10px] text-black/60 font-bold break-all">{user.email}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link 
                          href="/profile" 
                          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-black hover:bg-black hover:text-white uppercase tracking-widest transition-all"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        {isAdmin && (
                          <Link 
                            href="/admin" 
                            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-black hover:bg-black hover:text-white uppercase tracking-widest transition-all"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Shield className="w-4 h-4" />
                            <span>Admin</span>
                          </Link>
                        )}
                        <button
                          onClick={() => logout()}
                          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-red-600 hover:bg-red-600 hover:text-white uppercase tracking-widest transition-all mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="px-6 py-2.5 bg-black text-white hover:bg-yellow-400 hover:text-black font-black rounded-none border-2 border-black text-xs uppercase tracking-widest transition-all shadow-[4px_4px_0px_0px_rgba(250,204,21,1)]"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="md:hidden p-2 text-black hover:bg-black hover:text-white border-2 border-transparent hover:border-black transition-all"
              aria-label={isOpen ? "Close mobile menu" : "Open mobile menu"}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b-4 border-black overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-2">
              {['Home', 'Products', 'About', 'Contact'].map((item) => (
                <Link 
                  key={item} 
                  href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="block px-4 py-4 text-sm font-black text-black uppercase tracking-widest hover:bg-yellow-400 border-b-2 border-black/5"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              ))}
              {!user && (
                <Link 
                  href="/login" 
                  className="block w-full text-center py-4 bg-black text-white font-black uppercase tracking-widest mt-4"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
