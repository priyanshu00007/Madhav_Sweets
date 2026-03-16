"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Product } from "@/contexts/CartContext"

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  items: Array<{
    id: number
    name: string
    quantity: number
    price: number
  }>
  total: number
  total_amount?: number // From DB
  status: string
  status_name?: string // From DB
  orderDate: string
  created_at?: string // From DB
  deliveryPartner?: string
  riderName?: string
  rider_id?: number
}

interface DeliveryPartner {
  id: string
  name: string
  phone: string
  email: string
  status: "active" | "inactive"
}

interface AdminContextType {
  products: Product[]
  orders: Order[]
  deliveryPartners: DeliveryPartner[]
  isLoading: boolean
  refreshData: () => Promise<void>
  addProduct: (product: any) => Promise<void>
  updateProduct: (id: number, product: any) => Promise<void>
  deleteProduct: (id: number) => Promise<void>
  updateOrderStatus: (orderId: string, statusId: number) => Promise<void>
  allUsers: any[]
  updateUserRole: (userId: number, role: string) => Promise<void>
  assignDeliveryPartner: (orderId: string, partnerId: string) => void
  addDeliveryPartner: (partner: Omit<DeliveryPartner, "id">) => void
  updateDeliveryPartner: (id: string, partner: Partial<DeliveryPartner>) => void
  deleteDeliveryPartner: (id: string) => void
}

const AdminContext = createContext<AdminContextType | null>(null)

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshData = useCallback(async () => {
    setIsLoading(true)
    try {
      // 1. Fetch Products
      const productsRes = await fetch('/api/products')
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData)
      }

      // 2. Fetch Orders
      const ordersRes = await fetch('/api/orders')
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        const formattedOrders = ordersData.map((o: any) => ({
          ...o,
          id: o.id.toString(),
          total: o.total_amount || o.total,
          status: o.status_name || o.status,
          orderDate: o.created_at || o.orderDate,
          riderName: o.riderName || o.rider_name,
          items: []
        }))
        setOrders(formattedOrders)
      }

      // 3. Fetch Users
      const usersRes = await fetch('/api/admin/users')
      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setAllUsers(usersData)
      }

      // 4. Load partners from localStorage
      const savedPartners = localStorage.getItem("admin_delivery_partners")
      if (savedPartners) {
        setDeliveryPartners(JSON.parse(savedPartners))
      }
    } catch (err) {
      console.error("Failed to sync admin data:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  const addProduct = async (product: any) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    })
    if (res.ok) await refreshData()
  }

  const updateProduct = async (id: number, productUpdate: any) => {
    const res = await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...productUpdate })
    })
    if (res.ok) await refreshData()
  }

  const deleteProduct = async (id: number) => {
    const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' })
    if (res.ok) await refreshData()
  }

  const updateOrderStatus = async (orderId: string, statusId: number) => {
    const res = await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status_id: statusId })
    })
    if (res.ok) await refreshData()
  }

  const updateUserRole = async (userId: number, role: string) => {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role })
    })
    if (res.ok) await refreshData()
  }

  // Local-only mocks for delivery partners for now
  const assignDeliveryPartner = (orderId: string, partnerId: string) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, deliveryPartner: partnerId } : order,
    )
    setOrders(updatedOrders)
  }

  const addDeliveryPartner = (partner: Omit<DeliveryPartner, "id">) => {
    const newPartner = { ...partner, id: `partner-${Date.now()}` }
    const updatedPartners = [...deliveryPartners, newPartner]
    setDeliveryPartners(updatedPartners)
    localStorage.setItem("admin_delivery_partners", JSON.stringify(updatedPartners))
  }

  const updateDeliveryPartner = (id: string, partnerUpdate: Partial<DeliveryPartner>) => {
    const updatedPartners = deliveryPartners.map((p) => (p.id === id ? { ...p, ...partnerUpdate } : p))
    setDeliveryPartners(updatedPartners)
    localStorage.setItem("admin_delivery_partners", JSON.stringify(updatedPartners))
  }

  const deleteDeliveryPartner = (id: string) => {
    const updatedPartners = deliveryPartners.filter((p) => p.id !== id)
    setDeliveryPartners(updatedPartners)
    localStorage.setItem("admin_delivery_partners", JSON.stringify(updatedPartners))
  }

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        deliveryPartners,
        allUsers,
        isLoading,
        refreshData,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        updateUserRole,
        assignDeliveryPartner,
        addDeliveryPartner,
        updateDeliveryPartner,
        deleteDeliveryPartner,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
