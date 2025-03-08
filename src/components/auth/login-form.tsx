"use client"

import type React from "react"

import { useState } from "react"
import { useLogin } from "@hooks/use-auth"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { Label } from "@components/ui/label"
import { useRouter } from "next/navigation"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const login = useLogin()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await login.mutateAsync({
        email,
        password,
      })

      // Redirect after successful login
      router.push("/")
    } catch (error) {
      // Error is handled by the mutation
      console.error("Login failed")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {login.error && <div className="text-red-500 text-sm">{login.error.message}</div>}
      <Button type="submit" className="w-full" disabled={login.isPending}>
        {login.isPending ? "Logging in..." : "Login"}
      </Button>
    </form>
  )
}

