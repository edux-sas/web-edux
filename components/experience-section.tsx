"use client"

import Image from "next/image"

export default function ExperienceSection() {
  const clients = [
    { name: "UTEDÉ", logo: "/images/logos/utede.png", width: 180, height: 60 },
    { name: "UNICATÓLICA", logo: "/images/logos/unicatolica.png", width: 180, height: 60 },
    { name: "Universidad Cooperativa", logo: "/images/logos/unicooperativa.png", width: 180, height: 60 },
    { name: "San Martín", logo: "/images/logos/sanmartin.png", width: 180, height: 60 },
    { name: "UNIMETA", logo: "/images/logos/unimeta.webp", width: 180, height: 60 },
    { name: "Palacio & Abogados", logo: "/images/logos/palacio.png", width: 180, height: 60 },
    { name: "C&SB", logo: "/images/logos/csb.png", width: 180, height: 60 },
    { name: "Cámara de Comercio de Bogotá", logo: "/images/logos/camara-comercio.png", width: 180, height: 60 },
    { name: "Contraloría", logo: "/images/logos/contraloria.png", width: 220, height: 60 },
    { name: "Alcaldía de Guadalajara de Buga", logo: "/images/logos/alcaldia-buga.png", width: 200, height: 60 },
  ]

  // Estilos para el carrusel
  const carouselStyles = `
    @keyframes carousel {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(calc(-200px * ${clients.length}));
      }
    }
    
    .animate-carousel {
      animation: carousel 30s linear infinite;
    }
    
    .hover\\:pause:hover {
      animation-play-state: paused;
    }
  `

  return (
    <section className="w-full py-20 md:py-28 bg-[#f0f0ff] dark:bg-slate-900/50">
      <style jsx global>
        {carouselStyles}
      </style>
      <div className="container px-6 md:px-8">
        <div className="flex flex-col md:flex-row items-start gap-16 md:gap-20">
          <div className="flex-shrink-0 flex flex-col items-center md:items-start">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-0 text-center md:text-left">
              Nuestra experiencia
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
            <div>
              <p className="text-muted-foreground text-lg">
                Cada proyecto es una oportunidad para generar un impacto real y duradero. Nos enorgullece trabajar codo
                a codo con nuestros clientes, entendiendo sus necesidades y ofreciendo soluciones personalizadas que
                potencian su éxito en la era digital.
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-muted-foreground text-lg mb-6">
                ¿Te gustaría conocer más sobre cómo hemos transformado organizaciones? ¡Contáctanos y descubre cómo
                podemos llevar tu empresa al siguiente nivel!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 md:mt-24">
          <div className="relative overflow-hidden py-14 px-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
            <div className="logos-carousel flex animate-carousel gap-10 hover:pause">
              {[...clients, ...clients].map((client, index) => (
                <div
                  key={`${client.name}-${index}`}
                  className="relative h-20 min-w-[200px] flex-shrink-0 transition-all duration-300 hover:scale-110 bg-white dark:bg-slate-700 rounded-lg p-5 shadow-sm"
                >
                  <Image src={client.logo || "/placeholder.svg"} alt={client.name} fill className="object-contain" />
                </div>
              ))}
            </div>

            {/* Gradient overlays for fade effect */}
            <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white dark:from-slate-800 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white dark:from-slate-800 to-transparent z-10"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

