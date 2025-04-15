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
  title: "Impulsa la transformación y lidera en tu segmento",
  description:
    "En eduX convertimos tu visión en innovación. Descubre soluciones integrales en software a la medida, educación virtual, desarrollo de habilidades blandas y tecnología de punta para instituciones.",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon.png" }],
    apple: { url: "/favicon.png" },
    shortcut: { url: "/favicon.png" },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
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
