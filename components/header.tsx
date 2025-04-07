"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Menu, ChevronDown } from "lucide-react"
import { ModeToggle } from "./mode-toggle"

type UserData = {
  name: string
  email: string
  isLoggedIn: boolean
}

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("eduXUser")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      setUser(null)
    }
  }, [pathname]) // Re-check when pathname changes

  const handleLogout = async () => {
    // Remove user from localStorage
    localStorage.removeItem("eduXUser")

    // También eliminar cualquier otro dato de sesión que pueda existir
    localStorage.removeItem("discResults")
    localStorage.removeItem("discUserId")
    localStorage.removeItem("moodleRegistrationStatus")

    // Sign out from Supabase
    try {
      const { signOutUser } = await import("@/lib/supabase")
      await signOutUser()
    } catch (error) {
      console.error("Error signing out:", error)
    }

    // Reset user state
    setUser(null)

    // Redirect to home page
    router.push("/")
  }

  const routes = [
    { href: "/test-disc", label: "Test DISC" },
    { href: "/sobre-nosotros", label: "Sobre Nosotros" },
    { href: "/contacto", label: "Contacto" },
  ]

  const dashboardRoutes = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/test-disc", label: "Test DISC" },
  ]

  // Get initials from user name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 md:h-20 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
              eduX
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {user
              ? // Show dashboard routes for logged in users
                dashboardRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    {route.label}
                  </Link>
                ))
              : // Show regular routes for guests
                routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    {route.label}
                  </Link>
                ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />

          {user ? (
            // Logged in user UI
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                <span className="sr-only">Notificaciones</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-1 md:pl-2 md:pr-1">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block text-sm font-medium mr-1">{user.name.split(" ")[0]}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Cerrar sesión</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            // Guest UI
            <>
              <Button asChild className="hidden md:flex">
                <Link href="/iniciar-sesion">Iniciar Sesión</Link>
              </Button>
              <Button asChild variant="default">
                <Link href="/registro">Registrarse</Link>
              </Button>
            </>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="px-2 py-6">
                <Link href="/" className="flex items-center gap-2 mb-6" onClick={() => setIsOpen(false)}>
                  <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                    eduX
                  </span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {user ? (
                    // Mobile menu for logged in users
                    <>
                      <Link
                        href="/dashboard"
                        className="text-sm font-medium transition-colors hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <div className="h-px bg-border my-2" />
                      <Button
                        variant="ghost"
                        className="justify-start px-2"
                        onClick={() => {
                          handleLogout()
                          setIsOpen(false)
                        }}
                      >
                        Cerrar sesión
                      </Button>
                    </>
                  ) : (
                    // Mobile menu for guests
                    <>
                      {routes.map((route) => (
                        <Link
                          key={route.href}
                          href={route.href}
                          className="text-sm font-medium transition-colors hover:text-primary"
                          onClick={() => setIsOpen(false)}
                        >
                          {route.label}
                        </Link>
                      ))}
                      <div className="h-px bg-border my-2" />
                      <Link
                        href="/iniciar-sesion"
                        className="text-sm font-medium transition-colors hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        Iniciar Sesión
                      </Link>
                      <Link
                        href="/registro"
                        className="text-sm font-medium transition-colors hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        Registrarse
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

