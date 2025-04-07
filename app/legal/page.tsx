"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, ArrowUp } from "lucide-react"

export default function LegalPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("terminos")

  // Efecto para manejar la navegación desde enlaces externos
  useEffect(() => {
    const section = searchParams.get("section")
    if (section && ["terminos", "privacidad", "cookies", "accesibilidad"].includes(section)) {
      setActiveTab(section)

      // Scroll a la sección después de un pequeño retraso para asegurar que el DOM esté listo
      setTimeout(() => {
        const element = document.getElementById(section)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100)
    }
  }, [searchParams])

  // Función para manejar el scroll hacia arriba
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="container py-12 md:py-16 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Políticas Legales</h1>
        <div className="flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Inicio
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span>Legal</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <div className="sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-2 border-b">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="terminos">Términos y Condiciones</TabsTrigger>
            <TabsTrigger value="privacidad">Política de Privacidad</TabsTrigger>
            <TabsTrigger value="cookies">Política de Cookies</TabsTrigger>
            <TabsTrigger value="accesibilidad">Accesibilidad</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="terminos" id="terminos" className="space-y-6">
          <h2 className="text-2xl font-bold">Términos y Condiciones</h2>
          <p className="text-muted-foreground">Última actualización: 7 de abril de 2025</p>

          <div className="space-y-6 text-muted-foreground">
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">1. Introducción</h3>
              <p>
                Bienvenido a eduX Academy. Estos Términos y Condiciones rigen el uso de nuestro sitio web ubicado en
                www.edux.com.co (en adelante, "el Sitio") y todos los servicios relacionados proporcionados por eduX
                Academy (en adelante, "nosotros", "nuestro" o "eduX").
              </p>
              <p>
                Al acceder o utilizar nuestro Sitio, usted acepta estar legalmente obligado por estos Términos y
                Condiciones. Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestro Sitio o
                servicios.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">2. Uso del Sitio</h3>
              <p>
                2.1. <strong>Elegibilidad:</strong> Para utilizar ciertas funciones de nuestro Sitio, debe tener al
                menos 18 años o la mayoría de edad legal en su jurisdicción, lo que sea mayor.
              </p>
              <p>
                2.2. <strong>Registro de cuenta:</strong> Al registrarse en nuestro Sitio, usted acepta proporcionar
                información precisa, actualizada y completa. Usted es responsable de mantener la confidencialidad de su
                contraseña y de todas las actividades que ocurran bajo su cuenta.
              </p>
              <p>
                2.3. <strong>Uso prohibido:</strong> Usted acepta no utilizar nuestro Sitio para cualquier propósito
                ilegal o prohibido por estos Términos. No puede utilizar nuestro Sitio de manera que pueda dañar,
                deshabilitar, sobrecargar o deteriorar nuestro Sitio o interferir con el uso de cualquier otra parte.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">3. Propiedad Intelectual</h3>
              <p>
                3.1. <strong>Contenido del Sitio:</strong> Todo el contenido, características y funcionalidad de nuestro
                Sitio, incluyendo, pero no limitado a, texto, gráficos, logotipos, iconos, imágenes, clips de audio,
                descargas digitales, compilaciones de datos y software, son propiedad de eduX Academy o de nuestros
                proveedores de contenido y están protegidos por leyes de derechos de autor, marcas registradas y otras
                leyes de propiedad intelectual.
              </p>
              <p>
                3.2. <strong>Licencia limitada:</strong> Se le otorga una licencia limitada, no exclusiva, no
                transferible y revocable para acceder y utilizar nuestro Sitio para su uso personal y no comercial.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">4. Cursos y Servicios</h3>
              <p>
                4.1. <strong>Descripción de los cursos:</strong> eduX Academy ofrece diversos cursos y servicios
                educativos. Nos esforzamos por proporcionar descripciones precisas de nuestros cursos, pero no
                garantizamos que todas las descripciones sean exactas, completas, confiables, actuales o libres de
                errores.
              </p>
              <p>
                4.2. <strong>Inscripción y pago:</strong> La inscripción en nuestros cursos está sujeta a disponibilidad
                y al pago de las tarifas aplicables. Todos los pagos son procesados a través de nuestros proveedores de
                servicios de pago seguros.
              </p>
              <p>
                4.3. <strong>Política de reembolso:</strong> Ofrecemos un período de garantía de satisfacción de 7 días
                para nuestros cursos. Si no está satisfecho con un curso, puede solicitar un reembolso completo dentro
                de los 7 días posteriores a la compra, siempre que no haya completado más del 30% del contenido del
                curso.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">5. Test DISC</h3>
              <p>
                5.1. <strong>Propósito:</strong> El test DISC proporcionado por eduX Academy es una herramienta de
                evaluación de comportamiento diseñada para fines educativos y de desarrollo personal.
              </p>
              <p>
                5.2. <strong>No diagnóstico:</strong> El test DISC no es una herramienta de diagnóstico psicológico o
                médico. Los resultados no deben interpretarse como asesoramiento médico o psicológico profesional.
              </p>
              <p>
                5.3. <strong>Confidencialidad:</strong> Respetamos la confidencialidad de sus resultados del test DISC.
                Consulte nuestra Política de Privacidad para obtener más información sobre cómo manejamos esta
                información.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">6. Limitación de Responsabilidad</h3>
              <p>
                En la máxima medida permitida por la ley aplicable, eduX Academy no será responsable por daños
                indirectos, incidentales, especiales, consecuentes o punitivos, o cualquier pérdida de beneficios o
                ingresos, ya sea incurrida directa o indirectamente, o cualquier pérdida de datos, uso, buena voluntad,
                u otras pérdidas intangibles, resultantes de:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Su acceso o uso o incapacidad para acceder o usar el Sitio;</li>
                <li>Cualquier conducta o contenido de terceros en el Sitio;</li>
                <li>Cualquier contenido obtenido del Sitio; y</li>
                <li>Acceso no autorizado, uso o alteración de sus transmisiones o contenido.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">7. Modificaciones</h3>
              <p>
                Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos Términos en
                cualquier momento. Si una revisión es material, proporcionaremos al menos 30 días de aviso antes de que
                los nuevos términos entren en vigencia. Lo que constituye un cambio material será determinado a nuestra
                sola discreción.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">8. Ley Aplicable</h3>
              <p>
                Estos Términos se regirán e interpretarán de acuerdo con las leyes de Colombia, sin tener en cuenta sus
                disposiciones sobre conflictos de leyes.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">9. Contacto</h3>
              <p>Si tiene alguna pregunta sobre estos Términos, por favor contáctenos a través de info@edux.com.co.</p>
            </section>
          </div>
        </TabsContent>

        <TabsContent value="privacidad" id="privacidad" className="space-y-6">
          <h2 className="text-2xl font-bold">Política de Privacidad</h2>
          <p className="text-muted-foreground">Última actualización: 7 de abril de 2025</p>

          <div className="space-y-6 text-muted-foreground">
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">1. Introducción</h3>
              <p>
                En eduX Academy, respetamos su privacidad y nos comprometemos a proteger sus datos personales. Esta
                Política de Privacidad describe cómo recopilamos, utilizamos y compartimos su información cuando visita
                nuestro sitio web www.edux.com.co o utiliza nuestros servicios.
              </p>
              <p>
                Al utilizar nuestro sitio web y servicios, usted acepta las prácticas descritas en esta Política de
                Privacidad.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">2. Información que Recopilamos</h3>
              <p>
                2.1. <strong>Información personal:</strong> Podemos recopilar información personal que usted nos
                proporciona directamente, como su nombre, dirección de correo electrónico, número de teléfono, dirección
                postal, información de pago y cualquier otra información que elija proporcionar.
              </p>
              <p>
                2.2. <strong>Información de uso:</strong> Recopilamos automáticamente cierta información sobre cómo
                utiliza nuestro sitio web, incluyendo su dirección IP, tipo de navegador, páginas visitadas, tiempo de
                acceso y páginas de referencia.
              </p>
              <p>
                2.3. <strong>Resultados del test DISC:</strong> Cuando realiza un test DISC en nuestra plataforma,
                recopilamos sus respuestas y generamos resultados basados en esas respuestas.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">3. Cómo Utilizamos su Información</h3>
              <p>Utilizamos la información que recopilamos para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Proporcionar, mantener y mejorar nuestros servicios;</li>
                <li>Procesar transacciones y enviar notificaciones relacionadas;</li>
                <li>Enviar información técnica, actualizaciones, alertas de seguridad y mensajes de soporte;</li>
                <li>Responder a sus comentarios, preguntas y solicitudes;</li>
                <li>Desarrollar nuevos productos y servicios;</li>
                <li>Monitorear y analizar tendencias, uso y actividades en relación con nuestros servicios;</li>
                <li>Personalizar su experiencia en nuestro sitio web;</li>
                <li>Detectar, investigar y prevenir actividades fraudulentas y no autorizadas.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">4. Compartir su Información</h3>
              <p>Podemos compartir su información personal en las siguientes circunstancias:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Con proveedores de servicios que trabajan en nuestro nombre;</li>
                <li>Para cumplir con obligaciones legales;</li>
                <li>Para proteger y defender nuestros derechos y propiedad;</li>
                <li>Con su consentimiento o según sus instrucciones.</li>
              </ul>
              <p>No vendemos su información personal a terceros.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">5. Seguridad de los Datos</h3>
              <p>
                Implementamos medidas de seguridad diseñadas para proteger su información personal contra acceso,
                alteración, divulgación o destrucción no autorizados. Sin embargo, ningún método de transmisión por
                Internet o método de almacenamiento electrónico es 100% seguro, por lo que no podemos garantizar su
                seguridad absoluta.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">6. Sus Derechos</h3>
              <p>
                Dependiendo de su ubicación, puede tener ciertos derechos con respecto a su información personal,
                incluyendo:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Acceder a su información personal;</li>
                <li>Corregir información inexacta o incompleta;</li>
                <li>Eliminar su información personal;</li>
                <li>Restringir u oponerse al procesamiento de su información;</li>
                <li>Solicitar la portabilidad de sus datos;</li>
                <li>Retirar su consentimiento en cualquier momento.</li>
              </ul>
              <p>Para ejercer estos derechos, por favor contáctenos a través de info@edux.com.co.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">7. Cambios a esta Política</h3>
              <p>
                Podemos actualizar esta Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio
                publicando la nueva Política de Privacidad en esta página y actualizando la fecha de "última
                actualización" en la parte superior.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">8. Contacto</h3>
              <p>
                Si tiene alguna pregunta sobre esta Política de Privacidad, por favor contáctenos a través de
                info@edux.com.co.
              </p>
            </section>
          </div>
        </TabsContent>

        <TabsContent value="cookies" id="cookies" className="space-y-6">
          <h2 className="text-2xl font-bold">Política de Cookies</h2>
          <p className="text-muted-foreground">Última actualización: 7 de abril de 2025</p>

          <div className="space-y-6 text-muted-foreground">
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">1. ¿Qué son las Cookies?</h3>
              <p>
                Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (computadora, tableta o
                teléfono móvil) cuando visita un sitio web. Las cookies son ampliamente utilizadas para hacer que los
                sitios web funcionen de manera más eficiente, así como para proporcionar información a los propietarios
                del sitio.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">2. Cómo Utilizamos las Cookies</h3>
              <p>En eduX Academy, utilizamos cookies para los siguientes propósitos:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Cookies esenciales:</strong> Estas cookies son necesarias para el funcionamiento de nuestro
                  sitio web y no pueden ser desactivadas en nuestros sistemas. Generalmente se establecen solo en
                  respuesta a acciones realizadas por usted que equivalen a una solicitud de servicios, como establecer
                  sus preferencias de privacidad, iniciar sesión o completar formularios.
                </li>
                <li>
                  <strong>Cookies de rendimiento:</strong> Estas cookies nos permiten contar visitas y fuentes de
                  tráfico para que podamos medir y mejorar el rendimiento de nuestro sitio. Nos ayudan a saber qué
                  páginas son las más y menos populares y ver cómo los visitantes se mueven por el sitio.
                </li>
                <li>
                  <strong>Cookies de funcionalidad:</strong> Estas cookies permiten que el sitio proporcione
                  funcionalidades y personalización mejoradas. Pueden ser establecidas por nosotros o por proveedores
                  externos cuyos servicios hemos agregado a nuestras páginas.
                </li>
                <li>
                  <strong>Cookies de publicidad:</strong> Estas cookies pueden ser establecidas a través de nuestro
                  sitio por nuestros socios publicitarios. Pueden ser utilizadas por esas empresas para construir un
                  perfil de sus intereses y mostrarle anuncios relevantes en otros sitios.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">3. Tipos de Cookies que Utilizamos</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Nombre</th>
                      <th className="text-left py-2 px-4">Proveedor</th>
                      <th className="text-left py-2 px-4">Propósito</th>
                      <th className="text-left py-2 px-4">Expiración</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-4">_ga</td>
                      <td className="py-2 px-4">Google Analytics</td>
                      <td className="py-2 px-4">
                        Registra una identificación única que se utiliza para generar datos estadísticos sobre cómo el
                        visitante utiliza el sitio web.
                      </td>
                      <td className="py-2 px-4">2 años</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">_gid</td>
                      <td className="py-2 px-4">Google Analytics</td>
                      <td className="py-2 px-4">
                        Registra una identificación única que se utiliza para generar datos estadísticos sobre cómo el
                        visitante utiliza el sitio web.
                      </td>
                      <td className="py-2 px-4">24 horas</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">_gat</td>
                      <td className="py-2 px-4">Google Analytics</td>
                      <td className="py-2 px-4">Se utiliza para limitar la velocidad de solicitud.</td>
                      <td className="py-2 px-4">1 minuto</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">edux_session</td>
                      <td className="py-2 px-4">eduX Academy</td>
                      <td className="py-2 px-4">
                        Mantiene el estado de la sesión del usuario a través de las páginas.
                      </td>
                      <td className="py-2 px-4">Sesión</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">edux_preferences</td>
                      <td className="py-2 px-4">eduX Academy</td>
                      <td className="py-2 px-4">Almacena las preferencias del usuario, como el tema oscuro/claro.</td>
                      <td className="py-2 px-4">1 año</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">4. Cómo Controlar las Cookies</h3>
              <p>
                La mayoría de los navegadores web permiten cierto control de la mayoría de las cookies a través de la
                configuración del navegador. Para obtener más información sobre las cookies, incluido cómo ver qué
                cookies se han establecido y cómo administrarlas y eliminarlas, visite www.aboutcookies.org o
                www.allaboutcookies.org.
              </p>
              <p>
                Para optar por no ser rastreado por Google Analytics en todos los sitios web, visite
                http://tools.google.com/dlpage/gaoptout.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">5. Cambios a esta Política</h3>
              <p>
                Podemos actualizar nuestra Política de Cookies de vez en cuando. Le notificaremos cualquier cambio
                publicando la nueva Política de Cookies en esta página y actualizando la fecha de "última actualización"
                en la parte superior.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">6. Contacto</h3>
              <p>
                Si tiene alguna pregunta sobre nuestra Política de Cookies, por favor contáctenos a través de
                info@edux.com.co.
              </p>
            </section>
          </div>
        </TabsContent>

        <TabsContent value="accesibilidad" id="accesibilidad" className="space-y-6">
          <h2 className="text-2xl font-bold">Accesibilidad</h2>
          <p className="text-muted-foreground">Última actualización: 7 de abril de 2025</p>

          <div className="space-y-6 text-muted-foreground">
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">1. Nuestro Compromiso</h3>
              <p>
                En eduX Academy, nos comprometemos a hacer que nuestro sitio web sea accesible para todos los usuarios,
                independientemente de sus capacidades o discapacidades. Nuestro objetivo es cumplir con las Pautas de
                Accesibilidad para el Contenido Web (WCAG) 2.1 nivel AA.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">2. Medidas de Accesibilidad Implementadas</h3>
              <p>Hemos implementado las siguientes medidas para mejorar la accesibilidad de nuestro sitio web:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Estructura semántica: Utilizamos elementos HTML semánticos para proporcionar una estructura clara y
                  significativa.
                </li>
                <li>
                  Contraste de color: Aseguramos un contraste adecuado entre el texto y el fondo para mejorar la
                  legibilidad.
                </li>
                <li>Texto alternativo: Proporcionamos texto alternativo para todas las imágenes no decorativas.</li>
                <li>Navegación por teclado: Nuestro sitio es completamente navegable utilizando solo el teclado.</li>
                <li>
                  Tamaño de texto ajustable: Los usuarios pueden ajustar el tamaño del texto sin perder funcionalidad.
                </li>
                <li>Etiquetas de formulario: Todos los campos de formulario tienen etiquetas asociadas.</li>
                <li>Mensajes de error: Proporcionamos mensajes de error claros y sugerencias para la corrección.</li>
                <li>Modo oscuro: Ofrecemos un modo oscuro para reducir la fatiga visual.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">3. Tecnologías de Asistencia Compatibles</h3>
              <p>Nuestro sitio web es compatible con las siguientes tecnologías de asistencia:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Lectores de pantalla (JAWS, NVDA, VoiceOver, TalkBack)</li>
                <li>Software de reconocimiento de voz</li>
                <li>Ampliadores de pantalla</li>
                <li>Teclados alternativos y dispositivos de entrada</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">4. Limitaciones Conocidas</h3>
              <p>
                A pesar de nuestros esfuerzos, puede haber algunas áreas de nuestro sitio web que aún no son
                completamente accesibles. Estamos trabajando continuamente para mejorar la accesibilidad de nuestro
                sitio web.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">5. Comentarios y Contacto</h3>
              <p>
                Valoramos sus comentarios sobre la accesibilidad de nuestro sitio web. Si encuentra alguna barrera de
                accesibilidad o tiene sugerencias para mejorar, por favor contáctenos a través de info@edux.com.co.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">6. Evaluación y Mejora Continua</h3>
              <p>
                Realizamos evaluaciones regulares de accesibilidad de nuestro sitio web y trabajamos continuamente para
                identificar y resolver problemas de accesibilidad. Este es un proceso continuo y estamos comprometidos a
                mejorar constantemente la accesibilidad de nuestro sitio web.
              </p>
            </section>
          </div>
        </TabsContent>
      </Tabs>

      <div className="fixed bottom-6 right-6">
        <Button onClick={scrollToTop} size="icon" className="rounded-full shadow-lg" aria-label="Volver arriba">
          <ArrowUp className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

