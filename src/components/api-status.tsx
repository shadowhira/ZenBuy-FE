"use client"

import { useEffect, useState } from "react"
import { fetchApi } from "@services/api"

export function ApiStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const response = await fetchApi<{ status: string }>("/health")
        setStatus("connected")
        setMessage(response.status)
      } catch (error) {
        setStatus("error")
        setMessage(error instanceof Error ? error.message : "Unknown error")
      }
    }

    checkApiConnection()
  }, [])

  return (
    <div className="p-4 rounded-md border">
      <h3 className="font-semibold">API Status</h3>
      <div className="flex items-center mt-2">
        <div
          className={`w-3 h-3 rounded-full mr-2 ${
            status === "loading" ? "bg-yellow-500" : status === "connected" ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span>
          {status === "loading"
            ? "Checking connection..."
            : status === "connected"
              ? `Connected: ${message}`
              : `Error: ${message}`}
        </span>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        API URL: {process.env.NEXT_PUBLIC_API_URL || "https://api.zenbuy.com"}
      </div>
    </div>
  )
}

