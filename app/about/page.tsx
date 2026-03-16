"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Star, Heart, Award, Users, ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="bg-white text-black min-h-screen pt-24 pb-20 selection:bg-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-10"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-black border-2 border-black text-white text-[10px] font-black tracking-[0.3em] uppercase">
                <Star className="w-4 h-4 fill-yellow-400" />
                <span>Our Pure Legacy</span>
              </div>
              
              <h1 className="font-playfair text-7xl md:text-9xl font-black leading-tight tracking-tighter uppercase">
                Crafting <br />
                <span className="bg-yellow-400 px-4 inline-block -rotate-2 border-4 border-black text-black">History</span>
              </h1>
              
              <p className="text-xl font-black uppercase leading-relaxed max-w-lg">
                Since 1978, Ambrosia has been the gold standard for authentic Indian confections. No shortcuts, only pure tradition.
              </p>
            </motion.div>

            <div className="relative">
              <div className="aspect-[4/5] bg-black border-8 border-black shadow-[20px_20px_0px_0px_rgba(250,204,21,1)] overflow-hidden">
                <Image 
                  src="/images/ambrosia_sweets.png"
                  alt="Traditional Sweets Making"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-black text-white p-12 md:p-24 border-8 border-black mb-32 shadow-[16px_16px_0px_0px_rgba(250,204,21,1)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { icon: Heart, label: "Pure Ghee", desc: "We use 100% pure cow desi ghee in every single sweet box." },
              { icon: Award, label: "Zero Adulteration", desc: "No artificial colors, preservatives, or sweeteners. Ever." },
              { icon: Users, label: "Artisan Made", desc: "Handcrafted by master halwais with generations of experience." }
            ].map((v, i) => (
              <div key={i} className="space-y-6">
                <v.icon className="w-12 h-12 text-yellow-400" />
                <h3 className="text-2xl font-black uppercase tracking-tighter">{v.label}</h3>
                <p className="text-sm font-bold opacity-60 uppercase leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Story Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <div className="order-2 lg:order-1 relative">
            <div className="aspect-square bg-yellow-400 border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center p-12">
               <span className="text-[200px] font-black opacity-10 leading-none">1978</span>
               <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <p className="text-4xl font-black uppercase leading-none tracking-tighter">Established In <br />Ancient Roots</p>
               </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-5xl font-black uppercase tracking-tighter">The Ambrosia <br /><span className="text-yellow-400">Philosophy</span></h2>
            <div className="space-y-6 text-lg font-bold uppercase leading-relaxed">
              <p>Everything started in a small kitchen with a simple goal: to bring back the forgotten taste of royal Indian sweets.</p>
              <p>Today, we serve thousands of families, but our process hasn't changed. We still slow-roast our besan, we still hand-pull our lachha, and we still use the finest saffron from Kashmir.</p>
            </div>
            
            <Link 
              href="/products" 
              className="inline-flex items-center gap-4 px-10 py-5 bg-black text-white border-4 border-black font-black uppercase text-xs tracking-widest hover:bg-yellow-400 hover:text-black transition-all shadow-[8px_8px_0px_0px_rgba(250,204,21,1)] active:shadow-none"
            >
              Taste The Heritage <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
