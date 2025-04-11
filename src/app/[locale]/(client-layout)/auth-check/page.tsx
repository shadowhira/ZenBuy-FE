"use client"

import { useEffect, useState } from "react"
import { Button } from "@components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@components/ui/card"
import { toast } from "sonner"

export default function AuthCheckPage() {
  const [authStatus, setAuthStatus] = useState<{
    authenticated: boolean
    message?: string
    user?: any
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const checkAuth = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/check", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      setAuthStatus(data)

      if (data.authenticated) {
        toast.success("Authentication successful!")
      } else {
        toast.error("Not authenticated. Please log in.")
      }
    } catch (error) {
      console.error("Auth check error:", error)
      setAuthStatus({
        authenticated: false,
        message: "Error checking authentication",
      })
      toast.error("Error checking authentication")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
          <CardDescription>Check if you are currently authenticated</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Checking authentication...</div>
          ) : authStatus ? (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-gray-100">
                <p className="font-medium">Status: {authStatus.authenticated ? "Authenticated" : "Not Authenticated"}</p>
                {authStatus.message && <p className="text-sm text-gray-500 mt-1">{authStatus.message}</p>}
              </div>

              {authStatus.authenticated && authStatus.user && (
                <div className="p-4 rounded-md bg-gray-100">
                  <p className="font-medium mb-2">User Information:</p>
                  <ul className="space-y-1 text-sm">
                    <li><span className="font-medium">ID:</span> {authStatus.user._id}</li>
                    <li><span className="font-medium">Name:</span> {authStatus.user.name}</li>
                    <li><span className="font-medium">Email:</span> {authStatus.user.email}</li>
                    <li><span className="font-medium">Role:</span> {authStatus.user.role}</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">No authentication data available</div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={checkAuth} disabled={loading}>
            {loading ? "Checking..." : "Check Again"}
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/login"}>
            Go to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
