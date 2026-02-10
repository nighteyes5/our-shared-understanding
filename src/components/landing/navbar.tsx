"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Radio } from "lucide-react"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-9 h-9">
            <div className="absolute inset-0 rounded-lg bg-primary/20" />
            <Radio className="w-5 h-5 text-primary relative z-10" />
          </div>
          <span className="text-foreground font-semibold text-lg tracking-tight font-serif">
            NetDim
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Fonctions", "Avantages", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-secondary text-sm bg-transparent"
            onClick={() => window.location.href = '/login'}
          >
            Connexion
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 pb-6 animate-fade-in">
          <div className="flex flex-col gap-4 pt-2">
            {["Fonctions", "Avantages", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm py-2"
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <Button 
                variant="outline" 
                className="border-border text-foreground w-full bg-transparent"
                onClick={() => window.location.href = '/login'}
              >
                Connexion
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
