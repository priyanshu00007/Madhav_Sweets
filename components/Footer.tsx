import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Send } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t-8 border-black pt-24 pb-12 selection:bg-yellow-400 selection:text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-10">
            <Link href="/" className="inline-block">
               <span className="font-playfair text-6xl font-black tracking-tighter uppercase leading-none">
                 AMBROSIA <br />
                 <span className="text-yellow-400">SWEETS</span>
               </span>
            </Link>
            <p className="text-xl font-black uppercase leading-relaxed max-w-sm opacity-60">
              Supreme Indian mithai. Pure desi ghee only. No compromises since 1978.
            </p>
            <div className="flex gap-4">
                {[{ icon: Instagram, label: "Instagram" }, { icon: Twitter, label: "Twitter" }, { icon: Facebook, label: "Facebook" }].map((social, i) => (
                  <a key={i} href="#" className="w-14 h-14 border-4 border-white flex items-center justify-center hover:bg-yellow-400 hover:text-black hover:border-black transition-all group" aria-label={social.label}>
                     <social.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </a>
                ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400">Territory</h4>
              <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
                <li><Link href="/" className="hover:underline decoration-4 underline-offset-8 decoration-yellow-400">Home</Link></li>
                <li><Link href="/products" className="hover:underline decoration-4 underline-offset-8 decoration-yellow-400">Gallery</Link></li>
                <li><Link href="/about" className="hover:underline decoration-4 underline-offset-8 decoration-yellow-400">Heritage</Link></li>
                <li><Link href="/contact" className="hover:underline decoration-4 underline-offset-8 decoration-yellow-400">Connect</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400">Collections</h4>
              <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
                <li className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer">Traditional</li>
                <li className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer">Pure Ghee</li>
                <li className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer">Festive</li>
                <li className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer">Gifting</li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1 space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400">Headquarters</h4>
              <div className="space-y-6 text-[10px] font-black uppercase tracking-widest leading-loose">
                <div className="flex items-start gap-3">
                   <MapPin className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                   <span>123 Sweet Lane, Bandra West <br />Mumbai, India</span>
                </div>
                <div className="flex items-center gap-3">
                   <Phone className="w-4 h-4 text-yellow-400" />
                   <span>+91 98765 43210</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-yellow-400 p-12 lg:p-16 border-8 border-white text-black mb-24 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-black/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
           <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="space-y-4 text-center lg:text-left">
                 <h3 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none">Join The <br /><span className="bg-black text-white px-2">Inner Circle</span></h3>
                 <p className="text-sm font-black uppercase">Get access to secret batches & royal discounts.</p>
              </div>
              <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
                 <input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="bg-white border-4 border-black p-6 font-black uppercase text-xs focus:outline-none focus:translate-x-[-4px] focus:translate-y-[-4px] transition-all"
                 />
                  <button className="bg-black text-white px-12 py-6 border-4 border-black font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all" aria-label="Subscribe to newsletter">
                    Subscribe
                  </button>
              </div>
           </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t-2 border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
            © {new Date().getFullYear()} Ambrosia Supreme Mithai - All Rights Reserved.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest opacity-40">
             <Link href="#" className="hover:opacity-100">Privacy Policy</Link>
             <Link href="#" className="hover:opacity-100">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
