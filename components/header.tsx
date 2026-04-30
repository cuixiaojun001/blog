'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './theme-toggle'
import { useState } from 'react'
import { SITE_NAME } from '@/lib/constants'

const links = [
  { href: '/', label: 'Posts' },
  { href: '/tags', label: 'Tags' },
  { href: '/about', label: 'About' },
]

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-warm-border">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif font-bold text-xl text-warm-heading">
          {SITE_NAME}
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`transition-colors ${
                (l.href === '/' ? pathname === '/' : pathname.startsWith(l.href))
                  ? 'text-warm-heading font-medium'
                  : 'text-warm-muted hover:text-warm-heading'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/search"
            className="text-warm-muted hover:text-warm-heading"
            aria-label="Search"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
          <ThemeToggle />
        </nav>

        <button
          className="sm:hidden p-2 text-warm-muted"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
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

      {open && (
        <div className="sm:hidden border-t border-warm-border px-6 py-4 space-y-3">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-sm text-warm-muted hover:text-warm-heading"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-4 pt-2">
            <Link href="/search" onClick={() => setOpen(false)}
              className="text-warm-muted">
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
