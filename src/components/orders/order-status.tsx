"use client"

import { useState } from "react"
import { Button } from "@components/ui/button"
import { useTranslation } from "react-i18next"

const statuses = ["All", "Pending Payment", "Shipping", "Awaiting Delivery", "Completed", "Cancelled"]

export default function OrderStatus() {
  const { t } = useTranslation("orders");
  const [activeStatus, setActiveStatus] = useState("All")

  return (
    <nav className="flex space-x-2 mb-8 overflow-x-auto">
      {statuses.map((status) => (
        <Button
          key={status}
          variant={activeStatus === status ? "default" : "outline"}
          onClick={() => setActiveStatus(status)}
        >
          {t(status.toLowerCase().replace(" ", "")) || status}
        </Button>
      ))}
    </nav>
  )
}

