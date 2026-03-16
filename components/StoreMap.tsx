"use client"

import { MapPin } from "lucide-react"

export default function StoreMap() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-sm font-black text-black uppercase tracking-[0.5em] border-l-4 border-yellow-400 pl-4">Visit Us</h2>
          <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">Find Our <br /><span className="text-yellow-400 bg-black px-2">Temple</span></h3>
        </div>
        <p className="text-lg font-black uppercase opacity-60">Located in the heart of Mumbai, our flagship store is where tradition meets modern excellence. Come experience the heritage of pure desi ghee sweets.</p>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <MapPin className="w-8 h-8 text-yellow-400" aria-hidden="true" />
            <div>
              <p className="text-xs font-black uppercase opacity-40">Headquarters</p>
              <p className="text-sm font-black uppercase">123 Sweet Lane, Bandra West, Mumbai</p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative group grayscale hover:grayscale-0 transition-all duration-700">
         <div className="absolute inset-0 bg-yellow-400 translate-x-4 translate-y-4 -z-10 border-4 border-black"></div>
         <div className="aspect-video w-full border-8 border-black overflow-hidden bg-gray-100">
            <iframe 
              title="Ambrosia Store Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.4410342371477!2d72.8257007761004!3d19.044332952959882!2m3!1f0!2f0!3f0!3m2!1i1024!2i2476!4v1710500000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
         </div>
      </div>
    </div>
  )
}
