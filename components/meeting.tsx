"use client"

import { useEffect } from "react"
import { getCalApi } from "@calcom/embed-react"

export default function Schedulewidget() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "quote-project" })
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
      })
    })()
  }, [])

  return (
    <button
      className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
      data-cal-namespace="quote-project"
      data-cal-link="wahyu-ikbal-m/quote-project"
      data-cal-config='{"layout":"month_view"}'
    >
      Get a Quote
    </button>
  )
}
