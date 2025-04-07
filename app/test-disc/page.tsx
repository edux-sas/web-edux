"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import DiscPromoBanner from "@/components/disc-promo-banner"
import DiscTrainingBanner from "@/components/disc-training-banner"
import CertificationSection from "@/components/certification-section"
import TalentBoostSection from "@/components/talent-boost-section"
import { ContactModal } from "@/components/contact-modal"
import { useEffect, useState } from "react"

export default function TestDiscPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Verificar autenticación al cargar la página
    const checkAuth = () => {
      const userData = localStorage.getItem("eduXUser")
      if (userData) {
        try {
          const user = JSON.parse(userData)
          setIsAuthenticated(!!user.isLoggedIn)
        } catch (e) {
          console.error("Error parsing user data:", e)
          setIsAuthenticated(false)
        }
      } else {
        setIsAuthenticated(false)
      }
    }

    checkAuth()

    // Agregar un event listener para detectar cambios en localStorage
    window.addEventListener("storage", checkAuth)

    return () => {
      window.removeEventListener("storage", checkAuth)
    }
  }, [])

  const plans = [
    {
      id: "professional",
      name: "Profesional",
      price: "$169.000 COP",
      description: "Perfecto para desarrollo profesional",
      features: [
        "Informe detallado de perfil DISC",
        "Análisis de fortalezas y áreas de mejora",
        "Recomendaciones personalizadas",
        "Compatibilidad con roles laborales",
        "Estrategias de comunicación efectiva",
        "Acceso de por vida",
      ],
      cta: "Comprar Ahora",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Empresarial",
      price: "Contactar",
      description: "Para equipos y organizaciones",
      features: [
        "Informes detallados para todos los miembros",
        "Análisis de compatibilidad de equipo",
        "Recomendaciones para mejorar la dinámica grupal",
        "Dashboard para gestión de resultados",
        "Sesión de interpretación con experto",
        "Integración con sistemas de RRHH",
      ],
      cta: "Contactar Ventas",
    },
  ]

  return (
    <div className="container py-12 md:py-24 lg:py-32">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Test DISC - Descubre tu perfil de comportamiento
          </h1>
          <p className="text-muted-foreground md:text-xl">
            El test DISC es una herramienta de evaluación que analiza el comportamiento y las emociones de las personas
            en diferentes entornos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
        {plans.map((plan) => (
          <Card key={plan.id} className={`flex flex-col ${plan.popular ? "border-primary shadow-lg" : ""}`}>
            {plan.popular && (
              <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">Más Popular</div>
            )}
            <CardHeader className="p-6">
              <CardTitle>{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.id !== "enterprise" && <span className="text-muted-foreground ml-1">USD</span>}
              </div>
              <CardDescription className="mt-2">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow p-6 pt-0">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              {plan.id === "enterprise" ? (
                <ContactModal
                  trigger={
                    <Button className="w-full" variant="outline">
                      {plan.cta}
                    </Button>
                  }
                  defaultSubject="ventas"
                  title="Solicitar información sobre Plan Empresarial"
                  description="Completa el formulario y nuestro equipo de ventas se pondrá en contacto contigo para brindarte más información sobre nuestro Plan Empresarial."
                  buttonText="Enviar solicitud"
                />
              ) : (
                <Button asChild className="w-full">
                  <Link href={isAuthenticated ? `/dashboard` : `/test-disc/checkout/${plan.id}`}>
                    {isAuthenticated ? "Ver mi Dashboard" : plan.cta}
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Resto del contenido... */}
      {/* Video Explicativo */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-center mb-8">Conoce nuestro test DISC</h2>
        <div className="max-w-3xl mx-auto">
          <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/19Twt9LHHLQ"
              title="Conoce nuestro test y formación DISC"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="text-center text-muted-foreground mt-4">
            Descubre cómo el test DISC puede ayudarte a entender mejor tu estilo de comportamiento y mejorar tus
            relaciones personales y profesionales.
          </p>
        </div>
      </div>

      {/* Componente promocional del Test DISC */}
      <DiscPromoBanner />

      {/* Nuevo componente de potenciación del talento */}
      <TalentBoostSection />

      {/* Nuevo componente de formación en habilidades blandas */}
      <DiscTrainingBanner />

      {/* Nuevo componente de certificación profesional */}
      <CertificationSection />
    </div>
  )
}

