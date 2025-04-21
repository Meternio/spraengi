import { Mail } from "lucide-react"

export default function SocialLinks() {
  return (
    <div className="flex justify-center space-x-6">
      <a
        href="mailto:bar@spraengi.ch"
        className="text-white hover:text-primary transition-colors"
        aria-label="E-Mail"
      >
        <Mail size={24} />
      </a>
    </div>
  )
}
