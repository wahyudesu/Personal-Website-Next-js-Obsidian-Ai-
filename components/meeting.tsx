import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function Schedulewidget() {
    useEffect(() => {
      // Initialize Cal.com widget
      const initCalendar = async () => {
        try {
          const cal = await getCalApi();
          // Configure calendar UI
          cal("ui", {
            styles: { branding: { brandColor: "#000000" } },
            hideEventTypeDetails: false,
            layout: "month_view"
          });
        } catch (error) {
          console.error("Failed to initialize calendar:", error);
        }
      };
  
      initCalendar();
    }, []);
  
    return (
      <button
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        data-cal-namespace="quote-project"
        data-cal-link="wahyu-ikbal-m/quote-project"
        data-cal-config='{"layout":"month_view"}'
      >
        Schedule a Meeting
      </button>
    );
  }