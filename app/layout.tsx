import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/toaster"

const inter = Inter({ subsets: ["latin"] })

// Asegurarnos de que baseUrl sea siempre una URL válida
// Verificamos que la URL tenga el formato correcto antes de usarla
const getBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL
  // Verificar si la URL tiene el formato correcto (comienza con http:// o https://)
  if (envUrl && (envUrl.startsWith("http://") || envUrl.startsWith("https://"))) {
    return envUrl
  }
  // URL de fallback garantizada
  return "https://edux.com.co"
}

// Usar una URL base segura
const baseUrl = getBaseUrl()

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "eduX Academy - Impulsa la transformación y lidera en tu segmento",
    template: "%s | eduX Academy",
  },
  description:
    "En eduX convertimos tu visión en innovación. Descubre soluciones integrales en software a la medida, educación virtual, desarrollo de habilidades blandas y tecnología de punta para instituciones.",
  keywords: [
    "educación virtual",
    "test DISC",
    "desarrollo profesional",
    "software educativo",
    "habilidades blandas",
    "SIE",
    "formación profesional",
    "Colombia",
  ],
  authors: [{ name: "eduX Academy", url: baseUrl }],
  creator: "eduX Academy",
  publisher: "eduX Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.png", color: "#00a5e9" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: baseUrl,
    siteName: "eduX Academy",
    title: "eduX Academy - Impulsa la transformación y lidera en tu segmento",
    description:
      "En eduX convertimos tu visión en innovación. Descubre soluciones integrales en software a la medida, educación virtual, desarrollo de habilidades blandas y tecnología de punta para instituciones.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "eduX Academy - Impulsa la transformación y lidera en tu segmento",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "eduX Academy - Impulsa la transformación y lidera en tu segmento",
    description:
      "En eduX convertimos tu visión en innovación. Descubre soluciones integrales en software a la medida, educación virtual, desarrollo de habilidades blandas y tecnología de punta para instituciones.",
    images: ["/og-image.png"],
    creator: "@edux",
    site: "@edux",
  },
  verification: {
    google: "verificación-google", // Reemplaza con tu código de verificación de Google
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      "es-ES": baseUrl,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Favicon y manifest */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Metaetiquetas adicionales para SEO */}
        <meta name="application-name" content="eduX Academy" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="eduX Academy" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#00a5e9" />
        <meta name="theme-color" content="#00a5e9" />

        {/* Metaetiquetas Open Graph adicionales */}
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="eduX Academy - Impulsa la transformación y lidera en tu segmento" />
        <meta property="og:locale" content="es_ES" />
        <meta property="og:site_name" content="eduX Academy" />

        {/* Metaetiquetas Twitter adicionales */}
        <meta name="twitter:image" content="/og-image.png" />
        <meta name="twitter:image:alt" content="eduX Academy - Impulsa la transformación y lidera en tu segmento" />
        <meta name="twitter:site" content="@edux" />

        {/* Metaetiquetas para SEO local */}
        <meta name="geo.region" content="CO" />
        <meta name="geo.placename" content="Colombia" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
