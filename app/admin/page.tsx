"use client"

import { useState, useEffect } from "react"
import { 
  Package, ShoppingBag, Users, TrendingUp, Plus, Edit, 
  Trash2, Eye, ChevronRight, Loader2, X, Search, 
  Shield, Bike, Star, Activity, MapPin, Clock, 
  CreditCard, CheckCircle2, AlertCircle, Info
} from "lucide-react"
import { useAdmin } from "@/contexts/AdminContext"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { getImageUrl } from "@/lib/image-utils"

export default function AdminDashboard() {
  const { 
    products, orders, allUsers, isLoading, 
    deleteProduct, updateOrderStatus, addProduct, updateProduct, updateUserRole
  } = useAdmin()
  
  const [activeTab, setActiveTab] = useState("overview")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"product" | "user" | "details" | "orderDetail">("product")
  const [editingItem, setEditingItem] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Form State for Product
  const [productForm, setProductForm] = useState({
    name: "", description: "", price: "", discount_price: "",
    category: "Classic", image_url: "", stock: "50", 
    is_featured: false, tags: ""
  })

  useEffect(() => {
    if (editingItem && modalType === "product") {
      setProductForm({
        name: editingItem.name,
        description: editingItem.description,
        price: editingItem.price.toString(),
        discount_price: editingItem.discount_price?.toString() || "",
        category: editingItem.category || editingItem.categoryName || "Classic",
        image_url: editingItem.image_url || editingItem.image || "",
        stock: editingItem.stock_quantity?.toString() || editingItem.stock?.toString() || "50",
        is_featured: editingItem.is_featured || false,
        tags: Array.isArray(editingItem.tags) ? editingItem.tags.join(", ") : editingItem.tags || ""
      })
    }
  }, [editingItem, modalType])

  const stats = [
    { label: "Inventory", value: products.length, icon: Package, color: "bg-black" },
    { label: "Orders", value: orders.length, icon: ShoppingBag, color: "bg-yellow-400" },
    { label: "Personnel", value: allUsers.length, icon: Users, color: "bg-black" },
    { label: "Revenue", value: `₹${orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0).toLocaleString()}`, icon: TrendingUp, color: "bg-yellow-400" },
  ]

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return "border-yellow-500 text-yellow-600"
      case "processing": return "border-blue-500 text-blue-600"
      case "shipped": return "border-purple-500 text-purple-600"
      case "delivered": return "border-green-500 text-green-600"
      case "reached": return "border-cyan-500 text-cyan-600 animate-pulse"
      case "picked up": return "border-orange-500 text-orange-600"
      default: return "border-black text-black"
    }
  }

  const statusMap: Record<string, number> = {
    "Pending": 1, "Processing": 2, "Awaiting Rider": 3,
    "Partner Accepted": 4, "Picked Up": 5, "Near Location": 6,
    "Reached": 7, "Delivered": 8, "Cancelled": 9
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...productForm,
      price: parseFloat(productForm.price),
      discount_price: productForm.discount_price ? parseFloat(productForm.discount_price) : null,
      stock: parseInt(productForm.stock),
      tags: productForm.tags.split(",").map(t => t.trim())
    }

    if (editingItem && editingItem.id) {
      await updateProduct(editingItem.id, payload)
    } else {
      await addProduct(payload)
    }
    setIsModalOpen(false)
  }

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredUsers = allUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  const riders = allUsers.filter(u => u.role === 'rider')

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
         <Loader2 className="w-16 h-16 animate-spin text-yellow-400" />
         <p className="text-xs font-black uppercase tracking-[0.5em] animate-pulse">Synchronizing Command Center...</p>
      </div>
    )
  }

  return (
    <div className="space-y-12 pb-20 selection:bg-yellow-400">
      
      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={i} 
            className={`border-8 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${stat.color === 'bg-black' ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <stat.icon className={`w-10 h-10 ${stat.color === 'bg-yellow-400' ? 'text-black' : 'text-yellow-400'}`} />
              <Activity className="w-4 h-4 opacity-20" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-1 opacity-60">{stat.label}</p>
            <p className="text-4xl font-black tracking-tighter uppercase">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Command Logic */}
      <div className="bg-white border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col xl:flex-row">
        
        {/* Sidebar Nav */}
        <div className="w-full xl:w-80 border-b-8 xl:border-b-0 xl:border-r-8 border-black bg-black p-8 space-y-4">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "products", label: "Inventory", icon: Package },
            { id: "orders", label: "Logistics", icon: ShoppingBag },
            { id: "users", label: "Personnel", icon: Users },
            { id: "delivery", label: "Riders", icon: Bike },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between p-6 font-black uppercase tracking-widest text-[10px] transition-all border-4 ${
                activeTab === tab.id
                  ? "bg-yellow-400 border-black text-black translate-x-2 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                  : "bg-transparent border-transparent text-white/40 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <tab.icon className="w-4 h-4" /> {tab.label}
              </div>
            </button>
          ))}
        </div>

        {/* Dynamic Content Pane */}
        <div className="flex-1 p-8 md:p-12 min-h-[800px] bg-[#fffcf5]">
          <div className="mb-12 flex flex-col md:flex-row gap-6 justify-between items-center">
             <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 text-black" />
                <input 
                  type="text" 
                  placeholder="FILTER SYSTEM RECORDS..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border-4 border-black pl-12 pr-6 py-4 font-black uppercase text-xs focus:bg-yellow-400 outline-none"
                />
             </div>
             {activeTab === 'products' && (
               <button 
                onClick={() => { setModalType('product'); setEditingItem(null); setProductForm({name: "", description: "", price: "", discount_price: "", category: "Classic", image_url: "", stock: "50", is_featured: false, tags: ""}); setIsModalOpen(true); }}
                className="bg-black text-white px-10 py-5 font-black uppercase text-xs border-4 border-black shadow-[6px_6px_0px_0px_rgba(250,204,21,1)] hover:bg-yellow-400 hover:text-black transition-all"
               >
                 Instate Inventory
               </button>
             )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   <div className="bg-white border-4 border-black p-8 space-y-6">
                      <h4 className="text-xl font-black uppercase underline decoration-yellow-400 decoration-8 underline-offset-4">Log History</h4>
                      <div className="space-y-4">
                        {orders.slice(0, 8).map(order => (
                          <div key={order.id} className="flex justify-between items-center bg-gray-50 border-2 border-black/5 p-4">
                             <div>
                                <p className="font-black text-[10px] uppercase">{order.customerName}</p>
                                <p className="text-[8px] opacity-40 uppercase">VALUATION: ₹{order.total}</p>
                             </div>
                             <span className={`text-[8px] font-black uppercase px-2 py-1 border-2 ${getStatusColor(order.status)}`}>{order.status}</span>
                          </div>
                        ))}
                      </div>
                   </div>
                   <div className="space-y-12">
                      <div className="bg-black text-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(250,204,21,1)]">
                         <h4 className="text-xl font-black uppercase mb-4 text-yellow-400">Personnel Status</h4>
                         <div className="grid grid-cols-2 gap-6">
                            <div>
                               <p className="text-[10px] font-bold opacity-40 uppercase">Total Users</p>
                               <p className="text-3xl font-black">{allUsers.length}</p>
                            </div>
                            <div>
                               <p className="text-[10px] font-bold opacity-40 uppercase">Active Riders</p>
                               <p className="text-3xl font-black text-green-400">{riders.length}</p>
                            </div>
                         </div>
                      </div>
                      <div className="bg-white border-4 border-black p-8">
                         <h4 className="text-xl font-black uppercase mb-4">Stock Integrity</h4>
                         <p className="text-[10px] font-bold opacity-40 uppercase mb-4">Low inventory warnings</p>
                         <div className="space-y-3">
                            {products.filter(p => (Number(p.stock_quantity) || 0) < 10).map(p => (
                              <div key={p.id} className="flex justify-between border-b-2 border-black/5 pb-2">
                                 <p className="font-black text-[10px] uppercase italic">{p.name}</p>
                                 <p className="font-black text-red-600">CRITICAL: {p.stock_quantity || 0}</p>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === "products" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white border-4 border-black p-6 space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">
                      <div className="relative aspect-video border-4 border-black bg-black overflow-hidden group">
                         <Image src={getImageUrl(product.image_url || product.image || "")} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase text-yellow-600">{product.categoryName || product.category || 'Classic'}</p>
                        <h4 className="font-black uppercase text-sm leading-tight line-clamp-1">{product.name}</h4>
                        <p className="font-black font-mono text-lg">₹{product.price}</p>
                      </div>
                      <div className="flex gap-4 pt-4 border-t-2 border-black/5">
                        <button onClick={() => { setEditingItem(product); setModalType('product'); setIsModalOpen(true); }} className="flex-1 bg-white border-2 border-black py-2 font-black uppercase text-[10px] hover:bg-yellow-400 transition-all">Update</button>
                        <button onClick={() => deleteProduct(product.id)} className="flex-1 bg-black text-white py-2 font-black uppercase text-[10px] hover:bg-red-600 transition-all">Purge</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "users" && (
                <div className="bg-white border-4 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <table className="w-full text-left">
                    <thead className="bg-black text-white text-[10px] font-black uppercase tracking-widest italic">
                       <tr>
                         <th className="p-6">Personnel</th>
                         <th className="p-6">Communication</th>
                         <th className="p-6">Access Role</th>
                         <th className="p-6 text-right">Switch Protocol</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-black/5">
                       {filteredUsers.map(user => (
                         <tr key={user.id} className="hover:bg-yellow-50 transition-colors">
                            <td className="p-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 border-2 border-black bg-yellow-400 flex items-center justify-center font-black">
                                     {user.name[0]}
                                  </div>
                                  <span className="font-black uppercase text-xs">{user.name}</span>
                               </div>
                            </td>
                            <td className="p-6 font-bold text-[10px] opacity-40">{user.email}</td>
                            <td className="p-6">
                               <span className={`px-4 py-1.5 border-4 text-[8px] font-black uppercase ${user.role === 'admin' ? 'bg-black text-white border-black' : user.role === 'rider' ? 'bg-blue-100 text-blue-600 border-blue-600' : 'bg-white text-gray-400 border-gray-100'}`}>
                                  {user.role}
                               </span>
                            </td>
                            <td className="p-6 text-right">
                               <select 
                                onChange={(e) => updateUserRole(user.id, e.target.value)}
                                className="bg-white border-4 border-black font-black uppercase text-[8px] p-2 outline-none focus:bg-yellow-400"
                                value={user.role}
                               >
                                  <option value="user">DEFAULT USER</option>
                                  <option value="rider">LOGISTICS RIDER</option>
                                  <option value="admin">GLOBAL ADMIN</option>
                               </select>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "delivery" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {riders.map(rider => (
                    <div key={rider.id} className="bg-black text-white border-8 border-black p-10 space-y-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                       <Shield className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 -rotate-12" />
                       <div className="flex justify-between items-start">
                          <div className="w-20 h-20 bg-yellow-400 text-black border-4 border-black flex items-center justify-center text-4xl font-black rotate-2">
                             {rider.name[0]}
                          </div>
                          <div className="bg-green-400 text-black px-4 py-2 text-[8px] font-black uppercase rotate-6">Ready For Mission</div>
                       </div>
                       <div className="space-y-1 relative z-10">
                          <h4 className="text-3xl font-black uppercase italic tracking-tighter">{rider.name}</h4>
                          <p className="text-[10px] opacity-60 font-mono italic tracking-widest">{rider.email}</p>
                       </div>
                       <div className="grid grid-cols-2 gap-4 pt-6 border-t-4 border-white/20 relative z-10">
                          <div>
                             <p className="text-[8px] font-black uppercase opacity-40 mb-1">Success Ops</p>
                             <p className="text-2xl font-black">12.8k</p>
                          </div>
                          <div>
                             <p className="text-[8px] font-black uppercase opacity-40 mb-1">Efficiency</p>
                             <p className="text-2xl font-black text-yellow-400">99.2%</p>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "orders" && (
                <div className="space-y-8">
                   {orders.map((order) => (
                    <div key={order.id} className="bg-white border-8 border-black p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative group">
                       <div className="lg:col-span-2">
                          <p className="text-[8px] font-black uppercase opacity-20 mb-2 italic">Transmission ID</p>
                          <p className="font-mono font-black text-xs">#{order.id.toString().padStart(8, '0')}</p>
                       </div>
                       <div className="lg:col-span-3">
                          <p className="text-[8px] font-black uppercase opacity-20 mb-2 italic">Asset Owner</p>
                          <p className="font-black uppercase text-sm leading-none">{order.customerName}</p>
                          <p className="text-[8px] opacity-40 mt-1 font-bold">{order.customerEmail}</p>
                       </div>
                       <div className="lg:col-span-2">
                          <p className="text-[8px] font-black uppercase opacity-20 mb-2 italic">Valuation</p>
                          <p className="text-2xl font-black font-mono tracking-tighter">₹{order.total}</p>
                       </div>
                       <div className="lg:col-span-3">
                          <p className="text-[8px] font-black uppercase opacity-20 mb-2 italic">Tactical Status</p>
                          <select value={order.status} onChange={(e) => updateOrderStatus(order.id, statusMap[e.target.value] || 1)} className={`w-full bg-white border-4 border-black font-black uppercase text-[10px] py-4 px-4 focus:bg-yellow-400 outline-none ${getStatusColor(order.status)}`}>
                             {Object.keys(statusMap).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                       </div>
                       <div className="lg:col-span-2 flex justify-end gap-3">
                          <button onClick={() => { setEditingItem(order); setModalType('orderDetail'); setIsModalOpen(true); }} className="p-5 border-4 border-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><Eye className="w-5 h-5" /></button>
                       </div>
                    </div>
                  ))}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ADMIN OVERLAY SYSTEM */}
      <AnimatePresence>
         {isModalOpen && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
              <motion.div 
                initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }}
                className="bg-white border-8 border-black w-full max-w-2xl max-h-[90vh] overflow-y-auto p-12 relative shadow-[24px_24px_0px_0px_rgba(250,204,21,1)]"
              >
                 <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-4 border-4 border-black hover:bg-red-600 hover:text-white transition-all z-50">
                    <X className="w-6 h-6" />
                 </button>

                 {modalType === 'product' && (
                    <form onSubmit={handleProductSubmit} className="space-y-10">
                       <h3 className="text-6xl font-black uppercase tracking-tighter mb-4 italic underline decoration-yellow-400 decoration-8">{editingItem ? 'Edit Spec' : 'Inventory Load'}</h3>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-3">
                             <label className="text-[10px] font-black uppercase tracking-[0.4em]">Asset Name</label>
                             <input type="text" required value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} className="w-full border-4 border-black p-5 font-black uppercase text-xs focus:bg-yellow-400 outline-none" placeholder="e.g. KAJU KATLI" />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black uppercase tracking-[0.4em]">Classification</label>
                             <select value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} className="w-full border-4 border-black p-5 font-black uppercase text-xs focus:bg-yellow-400 outline-none appearance-none">
                                <option value="Classic">Classic Collection</option>
                                <option value="Ghee Special">Ghee Special</option>
                                <option value="Syrup Base">Syrup Base</option>
                                <option value="Signature">Signature Heritage</option>
                             </select>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                          <div className="space-y-3">
                             <label className="text-[10px] font-black uppercase tracking-[0.4em]">Base Valuation</label>
                             <input type="number" required value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} className="w-full border-4 border-black p-5 font-black text-xs focus:bg-yellow-400 outline-none" />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black uppercase tracking-[0.4em]">M.R.P Spec</label>
                             <input type="number" value={productForm.discount_price} onChange={(e) => setProductForm({...productForm, discount_price: e.target.value})} className="w-full border-4 border-black p-5 font-black text-xs focus:bg-yellow-400 outline-none" />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black uppercase tracking-[0.4em]">Stock Mass</label>
                             <input type="number" value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} className="w-full border-4 border-black p-5 font-black text-xs focus:bg-yellow-400 outline-none" />
                          </div>
                       </div>

                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em]">Visual Data (Drive ID / Direct URL)</label>
                          <input type="text" value={productForm.image_url} onChange={(e) => setProductForm({...productForm, image_url: e.target.value})} className="w-full border-4 border-black p-5 font-black text-[10px] focus:bg-yellow-400 outline-none" placeholder="INSERT SECURE URL" />
                       </div>

                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em]">Heritage Summary</label>
                          <textarea value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} className="w-full border-4 border-black p-6 font-black uppercase text-[10px] focus:bg-yellow-400 outline-none min-h-[140px] leading-relaxed" placeholder="DESCRIBE THE CRAFT..." />
                       </div>

                       <div className="flex items-center gap-6 bg-[#fffcf5] p-8 border-4 border-black">
                          <input type="checkbox" id="featured" checked={productForm.is_featured} onChange={(e) => setProductForm({...productForm, is_featured: e.target.checked})} className="w-8 h-8 border-4 border-black checked:bg-yellow-400 accent-black" />
                          <label htmlFor="featured" className="font-black uppercase text-xs tracking-[0.3em]">Elite Featured Status</label>
                       </div>

                       <button type="submit" className="w-full bg-black text-white py-8 border-4 border-black font-black uppercase text-sm tracking-[0.5em] shadow-[12px_12px_0px_0px_rgba(250,204,21,1)] hover:bg-yellow-400 hover:text-black transition-all active:translate-y-4 active:shadow-none">
                          {editingItem ? 'Finalize Reconfiguration' : 'Deploy To Production'}
                       </button>
                    </form>
                 )}

                 {modalType === 'orderDetail' && editingItem && (
                    <div className="space-y-12">
                       <h3 className="text-5xl font-black uppercase tracking-tighter italic">Transmission Brief</h3>
                       
                       <div className="grid grid-cols-2 gap-10 border-b-8 border-black pb-10">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black uppercase opacity-20">Recipient Alias</p>
                             <p className="text-2xl font-black uppercase">{editingItem.customerName}</p>
                             <p className="text-[10px] opacity-40 font-bold">{editingItem.customerEmail}</p>
                          </div>
                          <div className="text-right space-y-1">
                             <p className="text-[10px] font-black uppercase opacity-20">Transmission Clock</p>
                             <p className="text-xl font-black">{new Date(editingItem.orderDate).toLocaleDateString()}</p>
                             <p className="text-[10px] opacity-40 font-bold">{new Date(editingItem.orderDate).toLocaleTimeString()}</p>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Payload Analysis</p>
                          <div className="space-y-4">
                             {/* Note: Items need to be fetched separately if not included in the 'orders' object */}
                             <div className="bg-gray-50 p-6 border-4 border-black flex justify-between items-center">
                                <div>
                                   <p className="font-black text-xs uppercase">Assorted Sweet Collection</p>
                                   <p className="text-[8px] opacity-40 uppercase">VALUATION: ₹{editingItem.total}</p>
                                </div>
                                <span className="bg-black text-white px-2 py-1 text-[8px] font-black uppercase italic">Secured</span>
                             </div>
                          </div>
                       </div>

                       <div className="bg-yellow-400 p-8 border-4 border-black flex flex-col md:flex-row justify-between items-center gap-6">
                          <div className="flex items-center gap-4">
                             <CreditCard className="w-10 h-10" />
                             <div>
                                <p className="text-[8px] font-black uppercase opacity-60">Payment Protocol</p>
                                <p className="text-xl font-black">{editingItem.payment_status || 'CONFIRMED'}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[8px] font-black uppercase opacity-60">Total Value</p>
                             <p className="text-4xl font-black font-mono">₹{editingItem.total}</p>
                          </div>
                       </div>
                    </div>
                 )}
              </motion.div>
           </motion.div>
         )}
      </AnimatePresence>

    </div>
  )
}
