import { Radio } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-8 h-8">
            <div className="absolute inset-0 rounded-lg bg-primary/20" />
            <Radio className="w-4 h-4 text-primary relative z-10" />
          </div>
          <span className="text-foreground font-semibold tracking-tight font-serif">NetDim</span>
        </div>

        <div className="flex items-center gap-8">
          {["Fonctions", "Avantages", "Contact", "Documentation"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              {item}
            </a>
          ))}
        </div>

        <p className="text-muted-foreground text-sm">
          {"2026 NetDim. Tous droits reserves."}
        </p>
      </div>
    </footer>
  )
}
