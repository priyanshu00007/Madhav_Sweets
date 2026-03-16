"use client"

import { motion } from "framer-motion"
import { Send, MapPin, Phone, Mail, Instagram, Twitter, Facebook } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="bg-white text-black min-h-screen pt-24 pb-20 selection:bg-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-6 mb-24">
          <p className="text-xs font-black uppercase tracking-[0.5em] bg-yellow-400 inline-block px-2">Get In Touch</p>
          <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">Connect <br /><span className="bg-black text-white px-4">With Us</span></h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Info Side */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: MapPin, title: "Our Store", detail: "123 Sweet Lane, Bandra West, Mumbai" },
                { icon: Phone, title: "Phone", detail: "+91 98765 43210" },
                { icon: Mail, title: "Email", detail: "hello@ambrosia.com" },
                { icon: Instagram, title: "Instagram", detail: "@ambrosia_sweets" }
              ].map((item, i) => (
                <div key={i} className="bg-black text-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(250,204,21,1)]">
                  <item.icon className="w-10 h-10 mb-6 text-yellow-400" />
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-2">{item.title}</h3>
                  <p className="text-xs font-bold uppercase opacity-60 leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="aspect-video bg-gray-100 border-8 border-black flex items-center justify-center p-8 relative overflow-hidden group">
               <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
               <p className="relative z-10 text-4xl font-black opacity-10 uppercase text-center">Interactive Map <br />Placeholder</p>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white border-8 border-black p-10 md:p-14 shadow-[16px_16px_0px_0px_rgba(250,204,21,1)]">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-12">Send A Message</h2>
            
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest pl-1">Full Identity</label>
                    <input type="text" className="w-full bg-white border-4 border-black p-5 text-black font-black uppercase focus:bg-yellow-400 focus:outline-none transition-all" placeholder="John Doe" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest pl-1">Email Connection</label>
                    <input type="email" className="w-full bg-white border-4 border-black p-5 text-black font-black uppercase focus:bg-yellow-400 focus:outline-none transition-all" placeholder="name@email.com" />
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest pl-1">Subject</label>
                <input type="text" className="w-full bg-white border-4 border-black p-5 text-black font-black uppercase focus:bg-yellow-400 focus:outline-none transition-all" placeholder="Corporate Gifting / Wedding Inquiry" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest pl-1">Message Detail</label>
                <textarea rows={5} className="w-full bg-white border-4 border-black p-5 text-black font-black uppercase focus:bg-yellow-400 focus:outline-none transition-all" placeholder="How can we help you celebrate?"></textarea>
              </div>

              <button className="w-full bg-black text-white p-6 border-4 border-black font-black uppercase text-sm tracking-widest hover:bg-yellow-400 hover:text-black transition-all shadow-[8px_8px_0px_0px_rgba(250,204,21,1)] active:shadow-none translate-y-0 active:translate-y-2">
                 Submit Request
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}
