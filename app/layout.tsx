import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://edux.com.co"),
  title: "Impulsa la transformación y lidera en tu segmento",
  description:
    "En eduX convertimos tu visión en innovación. Descubre soluciones integrales en software a la medida, educación virtual, desarrollo de habilidades blandas y tecnología de punta para instituciones.",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/favicon.ico" }],
  },
  openGraph: {
    title: "Impulsa la transformación y lidera en tu segmento",
    description:
      "En eduX convertimos tu visión en innovación. Descubre soluciones integrales en software a la medida, educación virtual, desarrollo de habilidades blandas y tecnología de punta para instituciones.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "eduX - Impulsa la transformación y lidera en tu segmento",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Impulsa la transformación y lidera en tu segmento",
    description:
      "En eduX convertimos tu visión en innovación. Descubre soluciones integrales en software a la medida, educación virtual, desarrollo de habilidades blandas y tecnología de punta para instituciones.",
    images: ["/og-image.png"],
    creator: "@edux",
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta property="og:image" content="https://edux.com.co/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="https://edux.com.co/og-image.png" />
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

