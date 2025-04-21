"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      setStatus("error")
      setMessage("Bitte gib eine gültige E-Mail-Adresse ein.")
      return
    }

    setStatus("loading")

    const result = await fetch("/api/newsletter/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
    const data = await result.json()
    if (!result.ok || result.status !== 200) {
      setStatus("error")
      setMessage(data.error || "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.")
      return
    }

    setStatus("success")
    setMessage("Vielen Dank! Du wirst benachrichtigt, sobald wir eröffnen.")
    setEmail("")
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            E-Mail-Adresse
          </label>
          <Input
            id="email"
            type="email"
            placeholder="ihre@email.de"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/10 border-primary focus:border-secondary text-white placeholder:text-gray-400"
            disabled={status === "loading" || status === "success"}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-secondary text-white"
          disabled={status === "loading" || status === "success"}
        >
          {status === "loading" ? "Wird gesendet..." : "Benachrichtige mich"}
        </Button>

        {status === "error" && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={16} />
            <span>{message}</span>
          </div>
        )}

        {status === "success" && (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle2 size={16} />
            <span>{message}</span>
          </div>
        )}
      </form>
    </div>
  )
}
