'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  User, Mail, Package, Settings, 
  ChevronRight, Camera, Heart, Clock, Navigation, Bike, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import LogisticsTracker from '@/components/LogisticsTracker';

export default function ProfilePage() {
  const { user, logout, isLoading, updateRole } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState<any[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      fetchOrders();
    }
  }, [activeTab, user]);

  const fetchOrders = async () => {
    setIsOrdersLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setIsOrdersLoading(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (activeTab === 'orders' && orders.some(o => o.status_id < 8)) {
      interval = setInterval(fetchOrders, 8000); // Poll every 8s for live tracking
    }
    return () => clearInterval(interval);
  }, [activeTab, orders]);


  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-8 border-black border-t-yellow-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#fffcf5] text-black pt-24 pb-12 selection:bg-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="bg-white border-8 border-black p-8 md:p-14 mb-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 -translate-y-1/2 translate-x-1/2 rotate-45 group-hover:bg-black transition-all duration-700"></div>
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="relative">
              <div className="w-48 h-48 bg-yellow-400 border-8 border-black flex items-center justify-center overflow-hidden rotate-2 group-hover:rotate-0 transition-transform">
                <Image 
                  src={user.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.name} 
                  alt={user.name} 
                  width={200}
                  height={200}
                  className="object-cover"
                />
              </div>
              <button className="absolute -bottom-4 -right-4 p-4 bg-black text-white border-4 border-black hover:bg-yellow-400 hover:text-black transition-all shadow-lg active:scale-95">
                <Camera className="w-6 h-6" />
              </button>
            </div>
            
            <div className="text-center md:text-left space-y-6 flex-1">
              <div className="space-y-4">
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                   <p className="text-[10px] font-black text-white bg-black uppercase tracking-[0.4em] px-3 py-1 italic">Ambrosia Elite Member</p>
                   {user.role === 'rider' && (
                     <p className="text-[10px] font-black text-black bg-yellow-400 border-2 border-black uppercase tracking-[0.4em] px-3 py-1">Verified Rider</p>
                   )}
                   {user.role === 'admin' && (
                     <p className="text-[10px] font-black text-black bg-yellow-400 border-2 border-black uppercase tracking-[0.4em] px-3 py-1">Administrator</p>
                   )}
                </div>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">{user.name}</h1>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <span className="flex items-center gap-3 text-black bg-white border-4 border-black px-6 py-3 text-xs font-black uppercase tracking-widest">
                   <Mail className="w-4 h-4" /> {user.email}
                </span>
                {user.role === 'rider' && (
                  <Link href="/rider" className="flex items-center gap-3 text-black bg-black text-white border-4 border-black px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all">
                     <Bike className="w-4 h-4" /> Go to Rider Dashboard
                  </Link>
                )}
              </div>
            </div>
            
            <button 
              onClick={logout}
              className="px-12 py-6 bg-black text-white border-4 border-black font-black uppercase tracking-widest hover:bg-red-600 transition-all active:translate-y-2 shadow-[8px_8px_0px_0px_rgba(239,68,68,0.2)]"
            >
              Terminate
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <aside className="lg:col-span-3 space-y-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-8 border-4 border-black text-left transition-all group ${
                  activeTab === item.id 
                    ? 'bg-yellow-400 font-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] translate-x-1' 
                    : 'bg-white font-black hover:bg-black hover:text-white'
                }`}
              >
                <div className="flex items-center gap-5">
                  <item.icon className="w-6 h-6" />
                  <span className="uppercase tracking-widest text-xs">{item.label}</span>
                </div>
                <ChevronRight className={`w-5 h-5 transition-transform ${activeTab === item.id ? 'translate-x-2' : 'group-hover:translate-x-2'}`} />
              </button>
            ))}
          </aside>

          <main className="lg:col-span-9">
            <div className="bg-white border-8 border-black p-8 md:p-16 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] min-h-[700px]">
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div 
                    key="profile"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-16"
                  >
                    <div className="border-b-8 border-black pb-8">
                       <h2 className="text-6xl md:text-8xl font-black text-black uppercase tracking-tighter">My Protocol</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-black uppercase tracking-[0.4em] ml-1">Assigned Alias</label>
                        <input type="text" defaultValue={user.name} className="w-full bg-white border-4 border-black px-10 py-6 text-black font-black uppercase text-sm focus:bg-yellow-400 outline-none" />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-black uppercase tracking-[0.4em] ml-1">Communication Channel</label>
                        <input type="email" disabled value={user.email} className="w-full bg-gray-50 border-4 border-black px-10 py-6 text-black/40 font-black uppercase text-sm cursor-not-allowed" />
                      </div>
                    </div>
                    <button className="px-16 py-6 bg-black text-white border-4 border-black font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all">
                      Save Config
                    </button>
                  </motion.div>
                )}

                {activeTab === 'orders' && (
                  <motion.div 
                    key="orders"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="border-b-8 border-black pb-8">
                       <h2 className="text-6xl md:text-8xl font-black text-black uppercase tracking-tighter">Acquisitions</h2>
                    </div>

                    {isOrdersLoading ? (
                      <div className="py-24 flex flex-col items-center gap-6">
                         <div className="w-16 h-16 border-8 border-black border-t-yellow-400 rounded-full animate-spin"></div>
                         <p className="font-black uppercase tracking-widest text-xs opacity-40">Decrypting Logistics...</p>
                      </div>
                    ) : orders.length > 0 ? (
                      <div className="space-y-8">
                        {orders.map((order) => (
                          <div key={order.id} className="bg-[#fffcf5] border-4 border-black p-8 hover:bg-white transition-all">
                             <div className="flex flex-col gap-6">
                                 <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                   <div className="space-y-2">
                                      <div className="flex flex-wrap items-center gap-4">
                                         <p className="font-mono font-black text-lg">#{order.id.toString().padStart(6, '0')}</p>
                                         <span className={`px-4 py-1.5 text-[8px] font-black uppercase border-4 ${
                                           order.status_id === 8 ? 'bg-black text-yellow-400 border-black' : 
                                           order.status_id === 7 ? 'bg-yellow-400 border-black text-black animate-pulse' : 
                                           'bg-white text-black border-black'
                                         }`}>
                                           {order.status_name}
                                         </span>
                                      </div>
                                      <div className="flex flex-col gap-1 opacity-40">
                                         <div className="flex items-center gap-3">
                                            <Clock className="w-4 h-4" />
                                            <p className="text-[10px] font-black uppercase">{new Date(order.created_at).toLocaleDateString()} @ {new Date(order.created_at).toLocaleTimeString()}</p>
                                         </div>
                                         {order.rider_name && (
                                           <div className="flex items-center gap-3 text-blue-600 font-black">
                                              <Navigation className="w-4 h-4" />
                                              <p className="text-[10px] uppercase tracking-widest">Bullet Rider: {order.rider_name}</p>
                                           </div>
                                         )}
                                      </div>
                                   </div>
                                   <div className="text-right">
                                      <p className="text-[10px] font-black uppercase opacity-20 italic">Valuation</p>
                                      <p className="text-4xl font-black font-mono tracking-tighter">₹{order.total_amount}</p>
                                   </div>
                                </div>

                                {order.status_id < 8 && order.status_id > 0 && (
                                   <div className="border-t-4 border-black/5 pt-4">
                                      <LogisticsTracker 
                                        statusId={order.status_id} 
                                        statusName={order.status_name} 
                                        riderName={order.rider_name} 
                                      />
                                   </div>
                                )}

                                {order.delivery_otp && order.status_id === 7 && (
                                   <div className="bg-black text-white border-8 border-black p-10 flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
                                      <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400 animate-pulse"></div>
                                      <p className="text-[10px] font-black uppercase tracking-[0.6em] text-yellow-400 italic">Share Secure Token To Finalize</p>
                                      <p className="text-7xl font-black tracking-[0.4em] font-mono">{order.delivery_otp}</p>
                                      <p className="text-[8px] font-bold opacity-40 uppercase">Rider is awaiting confirmation at terminal</p>
                                   </div>
                                )}


                                <div className="flex gap-4">
                                   <button className="flex-1 px-8 py-4 bg-white border-2 border-black font-black uppercase text-[10px] hover:bg-yellow-400 transition-all">Details</button>
                                   {order.status_id === 8 && <button className="flex-1 px-8 py-4 bg-black text-white border-2 border-black font-black uppercase text-[10px] hover:bg-yellow-400 hover:text-black">Feedback</button>}
                                </div>
                             </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-24 text-center">
                        <Package className="w-24 h-24 mx-auto opacity-10 mb-6" />
                        <p className="font-black uppercase tracking-widest opacity-40">Purchase history empty</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div 
                    key="settings"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-16"
                  >
                    <div className="border-b-8 border-black pb-8">
                       <h2 className="text-6xl md:text-8xl font-black text-black uppercase tracking-tighter">Preferences</h2>
                    </div>
                    <div className="bg-black text-white p-10 border-4 border-black shadow-[8px_8px_0px_0px_rgba(250,204,21,1)]">
                       <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                          <div className="space-y-2">
                             <h3 className="text-2xl font-black uppercase italic">Logistics Program</h3>
                             <p className="text-[10px] font-bold uppercase opacity-60">Enlist as an Ambrosia Bullet Rider and earn per delivery.</p>
                          </div>
                          <div className="flex gap-4 bg-white/10 p-2 border-2 border-white/20">
                             <button onClick={() => updateRole('user')} className={`px-6 py-3 text-[10px] font-black uppercase ${user.role === 'user' ? 'bg-yellow-400 text-black' : 'hover:bg-white/10'}`}>User</button>
                             <button onClick={() => updateRole('rider')} className={`px-6 py-3 text-[10px] font-black uppercase ${user.role === 'rider' ? 'bg-yellow-400 text-black' : 'hover:bg-white/10'}`}>Rider</button>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
