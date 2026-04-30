'use client'

import { useEffect, useState, useCallback } from 'react'

export interface HeadingItem {
  level: number
  text: string
  id: string
}

export function TableOfContents({ headings }: { headings: HeadingItem[] }) {
  const [collapsed, setCollapsed] = useState(true)
  const [activeId, setActiveId] = useState<string>('')

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        setActiveId(entry.target.id)
        break
      }
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0,
    })

    headings.forEach(item => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings, handleIntersection])

  // Restore collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('toc-collapsed')
    if (saved !== null) setCollapsed(saved === 'true')
  }, [])

  const toggle = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('toc-collapsed', String(next))
  }

  if (headings.length === 0) return null

  return (
    <>
      {/* Desktop: sidebar TOC */}
      <aside className="hidden lg:block fixed left-[max(1rem,calc((100vw-900px)/2-220px))] top-24 w-[200px]">
        {collapsed ? (
          <button
            onClick={toggle}
            className="text-xs text-warm-muted hover:text-warm-heading transition-colors py-2"
            style={{ writingMode: 'vertical-rl' }}
          >
            目录 →
          </button>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-warm-muted tracking-wider uppercase">目录</span>
              <button
                onClick={toggle}
                className="text-xs text-warm-muted hover:text-warm-heading"
              >
                收起 ←
              </button>
            </div>
            <nav className="text-xs leading-relaxed">
              {headings.map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block py-1 transition-colors truncate ${
                    item.level === 3 ? 'pl-3' : ''
                  } ${
                    activeId === item.id
                      ? 'text-warm-heading font-medium'
                      : 'text-warm-muted hover:text-warm-heading'
                  }`}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </div>
        )}
      </aside>

      {/* Mobile: top drawer TOC */}
      <div className="lg:hidden mb-6">
        <button
          onClick={toggle}
          className="text-sm text-warm-muted hover:text-warm-heading flex items-center gap-1"
        >
          {collapsed ? '☰ 目录' : '✕ 收起目录'}
        </button>
        {!collapsed && (
          <nav className="mt-3 p-4 bg-warm-surface rounded-lg text-sm space-y-1">
            {headings.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setCollapsed(true)}
                className={`block py-1 ${item.level === 3 ? 'pl-3 text-xs' : ''} ${
                  activeId === item.id
                    ? 'text-warm-heading font-medium'
                    : 'text-warm-muted'
                }`}
              >
                {item.text}
              </a>
            ))}
          </nav>
        )}
      </div>
    </>
  )
}
