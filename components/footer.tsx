import { SITE_NAME, SOCIAL_LINKS } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="border-t border-warm-border mt-16">
      <div className="max-w-5xl mx-auto px-6 py-8 text-center text-sm text-warm-muted">
        <div className="flex justify-center gap-6 mb-4">
          {SOCIAL_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-warm-heading transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
        <p>&copy; {new Date().getFullYear()} {SITE_NAME}. Built with Next.js.</p>
      </div>
    </footer>
  )
}
