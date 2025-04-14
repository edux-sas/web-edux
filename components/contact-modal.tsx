"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ContactForm } from "@/components/contact-form"

interface ContactModalProps {
  trigger: React.ReactNode
  title?: string
  description?: string
  defaultSubject?: string
  buttonText?: string
}

export function ContactModal({
  trigger,
  title = "Envíanos un mensaje",
  description = "Completa el formulario y te responderemos a la brevedad.",
  defaultSubject,
  buttonText,
}: ContactModalProps) {
  const [open, setOpen] = useState(false)

  // Función para cerrar el modal después de enviar el formulario
  const handleSuccess = () => {
    // Esperar un momento para que el usuario vea el mensaje de éxito
    setTimeout(() => {
      setOpen(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ContactForm onSuccess={handleSuccess} defaultSubject={defaultSubject} buttonText={buttonText} />
      </DialogContent>
    </Dialog>
  )
}
