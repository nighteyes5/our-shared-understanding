"use client"

import { useEffect, useRef, useState } from "react"

function HexGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }
    resize()

    let time = 0
    const hexSize = 30
    const width = canvas.offsetWidth
    const height = canvas.offsetHeight

    const drawHex = (cx: number, cy: number, size: number, opacity: number) => {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6
        const x = cx + size * Math.cos(angle)
        const y = cy + size * Math.sin(angle)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.strokeStyle = `rgba(0, 200, 255, ${opacity})`
      ctx.lineWidth = 0.8
      ctx.stroke()
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      time += 0.005

      const horizDist = hexSize * Math.sqrt(3)
      const vertDist = hexSize * 1.5

      for (let row = 0; row < height / vertDist + 2; row++) {
        for (let col = 0; col < width / horizDist + 2; col++) {
          const x = col * horizDist + (row % 2 === 1 ? horizDist / 2 : 0)
          const y = row * vertDist

          const distFromCenter = Math.sqrt(
            Math.pow(x - width / 2, 2) + Math.pow(y - height / 2, 2)
          )
          const wave = Math.sin(distFromCenter * 0.005 - time * 3)
          const opacity = Math.max(0, (wave + 1) * 0.08)

          drawHex(x, y, hexSize - 2, opacity)
        }
      }

      requestAnimationFrame(animate)
    }

    const id = requestAnimationFrame(animate)
    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

export function VisualSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="avantages" className="relative py-32 px-6 overflow-hidden">
      <HexGrid />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Interface mockup */}
          <div
            className={`transition-all duration-1000 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
            }`}
          >
            <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-2xl shadow-primary/5">
              {/* Window header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-chart-4/60" />
                  <div className="w-3 h-3 rounded-full bg-chart-2/60" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-muted-foreground">NetDim LTE - Dashboard</span>
                </div>
              </div>

              {/* Mock interface */}
              <div className="p-6 space-y-4">
                {/* Top bar */}
                <div className="flex items-center gap-3">
                  <div className="h-8 flex-1 rounded-lg bg-secondary flex items-center px-3">
                    <span className="text-xs text-muted-foreground">Band: 1800 MHz</span>
                  </div>
                  <div className="h-8 w-24 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="text-xs text-primary font-medium">Calculer</span>
                  </div>
                </div>

                {/* Grid of values */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Fréquence", value: "1800 MHz" },
                    { label: "MAPL", value: "142.3 dB" },
                    { label: "Rayon", value: "1.8 km" },
                    { label: "Puissance", value: "43 dBm" },
                    { label: "Modèle", value: "Okumura" },
                    { label: "Env.", value: "Urbain" },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-lg bg-secondary/70 text-center">
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                      <div className="text-sm font-semibold text-foreground mt-1">{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Chart mock */}
                <div className="h-32 rounded-lg bg-secondary/50 flex items-end justify-center gap-2 px-4 pb-3">
                  {[40, 65, 85, 70, 90, 55, 75, 95, 60, 80].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-primary/30 transition-all duration-500 hover:bg-primary/60"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 100}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Text */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
            }`}
          >
            <span className="text-primary text-sm font-medium tracking-wider uppercase">
              Interface intuitive
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6 font-serif text-balance leading-tight">
              Interface intuitive et complète
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
              {"Calculs LTE, planification cartographique et statistiques détaillées dans une seule plateforme."}
            </p>

            {/* Metrics */}
            <div className="space-y-6">
              {[
                { label: "Calculs de bilan de liaison", pct: 100 },
                { label: "Planification sur carte", pct: 100 },
                { label: "Gestion utilisateurs", pct: 100 },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground">{metric.label}</span>
                    <span className="text-primary">{metric.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: visible ? `${metric.pct}%` : "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
