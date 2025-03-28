"use client"

import type React from "react"
import { useState } from "react"
import { useRegister } from "@hooks/use-auth"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { Label } from "@components/ui/label"
import { useRouter } from "next/navigation"

export default function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const register = useRegister()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }

    try {
      await register.mutateAsync({
        name,
        email,
        password,
      })

      // Redirect after successful registration
      router.push("/")
    } catch (error) {
      // Error is handled by the mutation
      console.error("Registration failed")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Họ tên</Label>
        <Input 
          id="name" 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
      </div>
      <div>
        <Label htmlFor="password">Mật khẩu</Label>
        <Input 
          id="password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
        <Input 
          id="confirmPassword" 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
        />
      </div>
      {(error || register.error) && (
        <div className="text-red-500 text-sm">{error || register.error?.message}</div>
      )}
      <Button type="submit" className="w-full" disabled={register.isPending}>
        {register.isPending ? "Đang đăng ký..." : "Đăng ký"}
      </Button>
    </form>
  )
} 