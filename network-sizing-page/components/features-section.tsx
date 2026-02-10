"use client"

import { useEffect, useRef, useState } from "react"
import { Signal, MapPin, BarChart3, Layers, Zap, Settings2 } from "lucide-react"

const features = [
  {
    icon: Signal,
    title: "Calculs LTE complets",
    desc: "Bilan de liaison, MAPL, rayon de couverture avec modèles de propagation multiples.",
  },
  {
    icon: MapPin,
    title: "Planification cartographique",
    desc: "Placement de sites LTE sur carte interactive avec visualisation de couverture.",
  },
  {
    icon: BarChart3,
    title: "Statistiques détaillées",
    desc: "Tableaux de bord avec graphiques dynamiques pour analyser l'activité.",
  },
  {
    icon: Layers,
    title: "Multi-environnements",
    desc: "Support des environnements urbain, suburbain et rural avec paramètres adaptés.",
  },
  {
    icon: Zap,
    title: "Enregistrements",
    desc: "Sauvegarde et gestion de vos calculs avec export/import JSON complet.",
  },
  {
    icon: Settings2,
    title: "Gestion utilisateurs",
    desc: "Système d'authentification avec rôles (Admin, Enseignant, Étudiant).",
  },
]

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0]
  index: number
}) {
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

  const Icon = feature.icon

  return (
    <div
      ref={ref}
      className={`group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-500 hover:bg-secondary/50 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-foreground font-semibold text-lg mb-2">{feature.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
      </div>
    </div>
  )
}

export function FeaturesSection() {
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerVisible, setHeaderVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (headerRef.current) observer.observe(headerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="fonctions" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-800 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-primary text-sm font-medium tracking-wider uppercase">
            Fonctionnalites
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 font-serif text-balance">
            Tout ce dont vous avez besoin
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
