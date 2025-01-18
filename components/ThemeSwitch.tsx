"use client";

import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/components/ui/button";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Pastikan komponen sudah di-mount sebelum menampilkan UI
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null; // Jangan render apa pun sampai komponen di-mount
  }

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        className="group size-9"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {/* Ikon Moon untuk tema gelap */}
        <Moon
          size={16}
          strokeWidth={2}
          className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100 dark:scale-100 dark:opacity-100"
          aria-hidden="true"
        />
        {/* Ikon Sun untuk tema terang */}
        <Sun
          size={16}
          strokeWidth={2}
          className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0 dark:scale-0 dark:opacity-0"
          aria-hidden="true"
        />
      </Button>
    </div>
  );
}