import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Globe, ChevronRight, Heart } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full py-16 md:py-20 lg:py-24 bg-background border-t relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>
      <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>

      <div className="container px-4 md:px-6 relative z-10">
        {/* Logo y descripción destacados */}
        <div className="flex flex-col items-center text-center mb-12 pb-12 border-b">
          <Link href="/" className="inline-block mb-6">
            <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
              eduX
            </span>
          </Link>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transformamos la educación digital con soluciones innovadoras. Nuestra plataforma combina cursos académicos
            de alta calidad, evaluaciones DISC personalizadas y tecnología de vanguardia para potenciar el desarrollo
            profesional y personal.
          </p>
          <div className="flex space-x-5 mt-8">
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 transform hover:scale-110"
            >
              <Facebook className="h-6 w-6" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 transform hover:scale-110"
            >
              <Twitter className="h-6 w-6" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 transform hover:scale-110"
            >
              <Instagram className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 transform hover:scale-110"
            >
              <Linkedin className="h-6 w-6" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>

        {/* Secciones principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10 lg:gap-16 mb-12">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold relative inline-block">
              <span className="relative z-10">Servicios</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/20"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/servicios/licencias"
                  className="text-muted-foreground hover:text-primary flex items-center group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Licencias y Equipos
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/consultoria"
                  className="text-muted-foreground hover:text-primary flex items-center group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Consultoría Educativa
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/desarrollo"
                  className="text-muted-foreground hover:text-primary flex items-center group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Desarrollo de Plataformas
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/capacitacion"
                  className="text-muted-foreground hover:text-primary flex items-center group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Capacitación Empresarial
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold relative inline-block">
              <span className="relative z-10">Test DISC</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/20"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/test-disc/sobre"
                  className="text-muted-foreground hover:text-primary flex items-center group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  ¿Qué es DISC?
                </Link>
              </li>
              <li>
                <Link
                  href="/test-disc/beneficios"
                  className="text-muted-foreground hover:text-primary flex items-center group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Beneficios
                </Link>
              </li>
              <li>
                <Link
                  href="/test-disc/precios"
                  className="text-muted-foreground hover:text-primary flex items-center group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Precios
                </Link>
              </li>
              <li>
                <Link
                  href="/test-disc/empresas"
                  className="text-muted-foreground hover:text-primary flex items-center group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Para Empresas
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold relative inline-block">
              <span className="relative z-10">Contacto</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/20"></span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Calle Principal 123, Bogotá, Colombia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <Link href="tel:+573001234567" className="text-muted-foreground hover:text-primary">
                  +57 300 123 4567
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <Link href="mailto:info@edux.com.co" className="text-muted-foreground hover:text-primary">
                  info@edux.com.co
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary shrink-0" />
                <Link href="https://www.edux.com.co" className="text-muted-foreground hover:text-primary">
                  www.edux.com.co
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Enlaces legales */}
        <div className="flex flex-wrap justify-center gap-6 py-6 border-t border-b mb-8">
          <Link href="/legal/terminos" className="text-sm text-muted-foreground hover:text-primary">
            Términos y Condiciones
          </Link>
          <Link href="/legal/privacidad" className="text-sm text-muted-foreground hover:text-primary">
            Política de Privacidad
          </Link>
          <Link href="/legal/cookies" className="text-sm text-muted-foreground hover:text-primary">
            Política de Cookies
          </Link>
          <Link href="/legal/accesibilidad" className="text-sm text-muted-foreground hover:text-primary">
            Accesibilidad
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
            © {currentYear} eduX Academy. Todos los derechos reservados. Hecho con{" "}
            <Heart className="h-4 w-4 text-red-500 inline" /> en Colombia
          </p>
        </div>
      </div>
    </footer>
  )
}

