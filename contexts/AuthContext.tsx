"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import RoleSelectionModal from "@/components/RoleSelectionModal"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user" | "rider"
  avatar_url?: string
}

interface AuthContextType {
  user: User | null
  logout: () => void
  isAdmin: boolean
  isLoading: boolean
  updateRole: (role: "user" | "rider") => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    if (session?.user) {
      const userData = {
        id: (session.user as any).id || "1",
        name: session.user.name || "",
        email: session.user.email || "",
        role: (session.user as any).role || (session.user.email === 'admin@ambrosia.com' ? 'admin' : 'user'),
        avatar_url: session.user.image || undefined,
      };
      setUser(userData as User);

      // Automatic role modal deactivated - handled via settings
      // setShowRoleModal(true);
    } else {
      setUser(null);
      sessionStorage.removeItem('role_prompted');
    }
  }, [session, status]);

  const logout = async () => {
    await signOut({ callbackUrl: '/login' });
  }

  const updateRole = async (role: "user" | "rider") => {
    try {
      const res = await fetch('/api/user/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        // Refresh session to reflect role change
        window.location.reload();
      }
    } catch (err) {
      console.error("Role update failed:", err);
    } finally {
      setShowRoleModal(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        updateRole,
        isAdmin: user?.role === "admin" || user?.email === 'admin@ambrosia.com',
        isLoading: status === 'loading',
      }}
    >
      {children}
      <RoleSelectionModal 
        isOpen={showRoleModal} 
        currentRole={user?.role || 'user'} 
        onSelect={updateRole} 
      />
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
