// components/header.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './theme-toggle'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Posts' },
  { href: '/tags', label: 'Tags' },
  { href: '/about', label: 'About' },
]

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-[rgb(var(--color-border))]">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif font-bold text-xl text-[rgb(var(--color-heading))]">
          Your Blog
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`transition-colors ${
                pathname === l.href
                  ? 'text-[rgb(var(--color-heading))] font-medium'
                  : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-heading))]'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/search"
            className="text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-heading))]"
            aria-label="Search"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
          <ThemeToggle />
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 text-[rgb(var(--color-muted))]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-[rgb(var(--color-border))] px-4 py-4 space-y-3">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-heading))]"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-4 pt-2">
            <Link href="/search" onClick={() => setOpen(false)}
              className="text-[rgb(var(--color-muted))]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  )
}
