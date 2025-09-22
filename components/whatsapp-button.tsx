"use client"

import { useEffect } from "react"

interface WhatsAppButtonProps {
  phoneNumber?: string
}

export function WhatsAppButton({ phoneNumber = "+573171165904" }: WhatsAppButtonProps) {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hola, me interesa conocer más sobre los servicios de eduX.")
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  useEffect(() => {
    // Cargar Font Awesome si no está disponible
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
      document.head.appendChild(link)
    }
  }, [])

  return (
    <a
      href={`https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hola, me interesa conocer más sobre los servicios de eduX.")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed bottom-10 right-10 z-50
        bg-primary hover:bg-primary/80 text-primary-foreground
        rounded-full
        flex items-center justify-center
        shadow-lg
        transition-colors duration-300
        no-underline
      "
      style={{
        width: '60px',
        height: '60px',
        fontSize: '30px'
      }}
      aria-label="Contactar por WhatsApp"
    >
      <i className="fa fa-whatsapp" style={{ marginTop: '2px' }}></i>
    </a>
  )
}