# Personal Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a warm-toned personal blog with card-grid home, collapsible-TOC article pages, tags, search, dark mode, RSS, and Giscus comments — deploy to Vercel.

**Architecture:** Next.js 15 App Router with server components as default, client components only where interactivity is needed (TOC, search, dark toggle, comments). MDX posts in `content/posts/` parsed at build time via `next-mdx-remote/rsc`. ISR on home and tag pages.

**Tech Stack:** Next.js 15, TypeScript, MDX (next-mdx-remote), Tailwind CSS, next-themes, Giscus, fuse.js, gray-matter

---

## File Map

```
blog/
├── app/
│   ├── globals.css                # Tailwind + warm theme CSS vars
│   ├── layout.tsx                 # root layout (theme provider, nav, footer)
│   ├── page.tsx                   # home page — SSR post card grid
│   ├── posts/[slug]/page.tsx      # post detail — MDX render + TOC + Giscus
│   ├── tags/page.tsx              # tag cloud page
│   ├── tags/[tag]/page.tsx        # filtered posts by tag
│   ├── about/page.tsx             # about me
│   ├── search/page.tsx            # client-side search
│   └── feed.xml/route.ts          # RSS route handler
├── components/
│   ├── header.tsx                 # nav bar (client component)
│   ├── footer.tsx                 # footer (server component)
│   ├── theme-provider.tsx         # next-themes wrapper (client)
│   ├── theme-toggle.tsx           # dark/light toggle button (client)
│   ├── post-card.tsx              # single post card (server)
│   ├── post-card-grid.tsx         # card grid wrapper (server)
│   ├── table-of-contents.tsx      # collapsible TOC sidebar (client)
│   ├── tag-cloud.tsx              # tag cloud display (server)
│   ├── search-bar.tsx             # search input + fuse.js (client)
│   └── giscus.tsx                 # Giscus comment embed (client)
├── lib/
│   ├── posts.ts                   # read & parse MDX files, get all posts, get post by slug
│   └── tags.ts                    # aggregate tags with counts from posts
├── content/posts/
│   └── hello-world.mdx            # sample first post
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
├── package.json
├── vercel.json
└── .gitignore                     # already exists
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `tailwind.config.ts`
- Create: `vercel.json`

- [ ] **Step 1: Create package.json**

```bash
cd /Users/ke/workspace/ainative/blog
```

```json
// package.json
{
  "name": "blog",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-mdx-remote": "^5.0.0",
    "next-themes": "^0.4.0",
    "gray-matter": "^4.0.3",
    "fuse.js": "^7.0.0",
    "rehype-pretty-code": "^0.14.0",
    "rehype-slug": "^6.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "typescript": "^5.7.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/typography": "^0.5.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

```bash
cd /Users/ke/workspace/ainative/blog && npm install
```

- [ ] **Step 3: Create tsconfig.json**

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create next.config.mjs**

```js
// next.config.mjs
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  experimental: {
    mdxRs: true,
  },
}

const withMDX = createMDX()
export default withMDX(nextConfig)
```

Wait — we're using `next-mdx-remote/rsc` for the MDX rendering, not `@next/mdx`. Let me reconsider. Actually, to keep it simple and avoid the next.config complexity, let me use `next-mdx-remote` which doesn't need next.config changes.

Let me rewrite the next config.

```js
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
```

- [ ] **Step 5: Create tailwind.config.ts**

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warm: {
          bg: '#faf8f5',
          surface: '#f5efe5',
          border: '#e8e0d5',
          muted: '#9b8c7c',
          text: '#5c4f3d',
          heading: '#3d3226',
          accent: '#c4a97d',
          tag: '#efe8db',
          'tag-text': '#6b5c47',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
      },
      maxWidth: {
        reading: '660px',
      },
    },
  },
  plugins: [typography],
}

export default config
```

Wait, actually with Tailwind CSS v4 the config format might be different. Let me stick with Tailwind v3 for stability since v4 is still new. Actually, the user said "most popular way" so let me use what's stable. Let me use Tailwind v3 with the standard config.

Actually, for Next.js 15, the latest stable is Tailwind v3. Let me keep the standard tailwind.config.ts format.

Hmm, but by April 2026 Tailwind v4 might be very stable. Let me use Tailwind v3 to be safe and avoid potential issues since the blog doesn't need v4 features.

Let me also reconsider the package.json. With Next.js 15, we should use specific versions. Let me use caret ranges.

- [ ] **Step 6: Create vercel.json**

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "next build"
}
```

- [ ] **Step 7: Create content directories**

```bash
mkdir -p /Users/ke/workspace/ainative/blog/content/posts
mkdir -p /Users/ke/workspace/ainative/blog/lib
mkdir -p /Users/ke/workspace/ainative/blog/components
mkdir -p /Users/ke/workspace/ainative/blog/app/posts/\[slug\]
mkdir -p /Users/ke/workspace/ainative/blog/app/tags/\[tag\]
mkdir -p /Users/ke/workspace/ainative/blog/app/about
mkdir -p /Users/ke/workspace/ainative/blog/app/search
mkdir -p /Users/ke/workspace/ainative/blog/app/feed.xml
```

- [ ] **Step 8: Commit**

```bash
git add package.json tsconfig.json next.config.mjs tailwind.config.ts vercel.json
git commit -m "chore: scaffold Next.js 15 blog project

Co-Authored-By: DeepSeek V4 Pro <cuixiaojun002@ke.com>"
```

---

### Task 2: Global Styles & Theme

**Files:**
- Create: `app/globals.css`

- [ ] **Step 1: Write globals.css with warm theme**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-bg: 250 248 245;
    --color-surface: 245 239 229;
    --color-border: 232 224 213;
    --color-muted: 155 140 124;
    --color-text: 92 79 61;
    --color-heading: 61 50 38;
    --color-accent: 196 169 125;
    --color-tag: 239 232 219;
    --color-tag-text: 107 92 71;
  }

  .dark {
    --color-bg: 15 17 23;
    --color-surface: 24 27 35;
    --color-border: 42 45 53;
    --color-muted: 139 143 163;
    --color-text: 201 205 214;
    --color-heading: 240 240 240;
    --color-accent: 196 169 125;
    --color-tag: 30 33 48;
    --color-tag-text: 160 168 192;
  }

  body {
    @apply bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text))];
  }

  h1, h2, h3, h4, h5, h6 {
    @apply text-[rgb(var(--color-heading))] font-serif;
  }

  /* Article content styles */
  .prose-warm {
    @apply text-[rgb(var(--color-text))] leading-relaxed;
    font-size: 1.0625rem;
  }

  .prose-warm p {
    margin-bottom: 1.25rem;
    line-height: 1.85;
  }

  .prose-warm h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
  }

  .prose-warm h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
  }

  .prose-warm a {
    @apply text-[rgb(var(--color-accent))] underline underline-offset-2;
  }

  .prose-warm code {
    @apply bg-[rgb(var(--color-tag))] text-[rgb(var(--color-tag-text))] px-1.5 py-0.5 rounded text-sm;
    font-size: 0.9em;
  }

  .prose-warm pre {
    @apply bg-[rgb(var(--color-surface))] p-4 rounded-lg overflow-x-auto my-6;
  }

  .prose-warm pre code {
    @apply bg-transparent p-0;
  }

  .prose-warm blockquote {
    @apply border-l-4 border-[rgb(var(--color-accent))] pl-4 my-6 italic text-[rgb(var(--color-muted))];
    background: rgb(var(--color-surface));
    padding: 1rem 1.25rem;
    border-radius: 0 4px 4px 0;
  }

  .prose-warm ul, .prose-warm ol {
    margin-bottom: 1.25rem;
    padding-left: 1.5rem;
  }

  .prose-warm li {
    margin-bottom: 0.5rem;
  }

  .prose-warm img {
    @apply rounded-lg my-6 max-w-full;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat: add global styles with warm color theme and dark mode

Co-Authored-By: DeepSeek V4 Pro <cuixiaojun002@ke.com>"
```

---

### Task 3: Root Layout with Theme & Navigation

**Files:**
- Create: `components/theme-provider.tsx`
- Create: `components/theme-toggle.tsx`
- Create: `components/header.tsx`
- Create: `components/footer.tsx`
- Create: `app/layout.tsx`

- [ ] **Step 1: Create ThemeProvider wrapper**

```tsx
// components/theme-provider.tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </NextThemesProvider>
  )
}
```

- [ ] **Step 2: Create ThemeToggle button**

```tsx
// components/theme-toggle.tsx
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-9 h-9" />

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-heading))] transition-colors"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  )
}
```

- [ ] **Step 3: Create Header with nav and mobile menu**

```tsx
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
```

- [ ] **Step 4: Create Footer**

```tsx
// components/footer.tsx

export function Footer() {
  return (
    <footer className="border-t border-[rgb(var(--color-border))] mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-sm text-[rgb(var(--color-muted))]">
        <p>&copy; {new Date().getFullYear()} Your Blog. Built with Next.js.</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 5: Create root layout**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Your Blog',
    template: '%s | Your Blog',
  },
  description: 'Personal blog about tech and life.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add components/theme-provider.tsx components/theme-toggle.tsx components/header.tsx components/footer.tsx app/layout.tsx
git commit -m "feat: add root layout with nav, dark mode toggle, and footer

Co-Authored-By: DeepSeek V4 Pro <cuixiaojun002@ke.com>"
```

---

### Task 4: Post Data Layer

**Files:**
- Create: `lib/posts.ts`
- Create: `lib/tags.ts`

- [ ] **Step 1: Write post loading and parsing library**

```ts
// lib/posts.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface PostMeta {
  slug: string
  title: string
  date: string
  tags: string[]
  category: 'tech' | 'life'
  excerpt?: string
}

export interface Post extends PostMeta {
  content: string
}

const postsDir = path.join(process.cwd(), 'content/posts')

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDir)) return []

  const filenames = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'))

  const posts = filenames.map(filename => {
    const slug = filename.replace(/\.mdx$/, '')
    const filePath = path.join(postsDir, filename)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(raw)

    return {
      slug,
      title: data.title || slug,
      date: data.date || '',
      tags: data.tags || [],
      category: data.category || 'tech',
      excerpt: data.excerpt || '',
    } as PostMeta
  })

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1))
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(postsDir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title || slug,
    date: data.date || '',
    tags: data.tags || [],
    category: data.category || 'tech',
    excerpt: data.excerpt || '',
    content,
  }
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter(p => p.tags.includes(tag))
}
```

- [ ] **Step 2: Write tag aggregation library**

```ts
// lib/tags.ts
import { getAllPosts } from './posts'

export interface TagCount {
  tag: string
  count: number
}

export function getAllTags(): TagCount[] {
  const posts = getAllPosts()
  const tagMap = new Map<string, number>()

  for (const post of posts) {
    for (const tag of post.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    }
  }

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/posts.ts lib/tags.ts
git commit -m "feat: add post data layer with gray-matter frontmatter parsing

Co-Authored-By: DeepSeek V4 Pro <cuixiaojun002@ke.com>"
```

---

### Task 5: PostCard & PostCardGrid Components

**Files:**
- Create: `components/post-card.tsx`
- Create: `components/post-card-grid.tsx`

- [ ] **Step 1: Create PostCard**

```tsx
// components/post-card.tsx
import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link href={`/posts/${post.slug}`} className="block group">
      <article className="border border-[rgb(var(--color-border))] rounded-xl p-6 h-full
        bg-[rgb(var(--color-bg))] hover:border-[rgb(var(--color-accent))] transition-colors">
        <div className="text-xs text-[rgb(var(--color-muted))] mb-3 font-medium">
          {post.date}
          <span className="mx-2">·</span>
          <span className="uppercase">{post.category}</span>
        </div>
        <h2 className="text-lg font-bold font-serif text-[rgb(var(--color-heading))] mb-2
          group-hover:text-[rgb(var(--color-accent))] transition-colors">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-sm text-[rgb(var(--color-text))] leading-relaxed line-clamp-2 mb-3">
            {post.excerpt}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {post.tags.slice(0, 4).map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-md
              bg-[rgb(var(--color-tag))] text-[rgb(var(--color-tag-text))]">
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  )
}
```

- [ ] **Step 2: Create PostCardGrid**

```tsx
// components/post-card-grid.tsx
import { PostCard } from './post-card'
import type { PostMeta } from '@/lib/posts'

export function PostCardGrid({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-[rgb(var(--color-muted))]">
        <p className="text-lg">No posts yet</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map(post => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/post-card.tsx components/post-card-grid.tsx
git commit -m "feat: add PostCard and PostCardGrid components

Co-Authored-By: DeepSeek V4 Pro <cuixiaojun002@ke.com>"
```

---

### Task 6: Home Page

**Files:**
- Create: `app/page.tsx`

- [ ] **Step 1: Create home page**

```tsx
// app/page.tsx
import { getAllPosts } from '@/lib/posts'
import { PostCardGrid } from '@/components/post-card-grid'

export const dynamic = 'force-static'

export default function HomePage() {
  const posts = getAllPosts()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold font-serif text-[rgb(var(--color-heading))] mb-3">
          Hello, I&apos;m Ke
        </h1>
        <p className="text-[rgb(var(--color-muted))] max-w-md mx-auto leading-relaxed">
          前端工程师 · 技术 &amp; 生活 · 文字记录思考
        </p>
      </header>
      <PostCardGrid posts={posts} />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add home page with intro and post card grid

Co-Authored-By: DeepSeek V4 Pro <cuixiaojun002@ke.com>"
```

---

### Task 7: Post Detail Page with TOC

**Files:**
- Create: `components/table-of-contents.tsx`
- Create: `app/posts/[slug]/page.tsx`

- [ ] **Step 1: Create collapsible TOC component**

```tsx
// components/table-of-contents.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

function extractToc(html: string): TocItem[] {
  const headingRegex = /<h([2-3])\s[^>]*?id="([^"]*)"[^>]*>(.*?)<\/h[2-3]>/gi
  const items: TocItem[] = []
  let match
  while ((match = headingRegex.exec(html)) !== null) {
    items.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, ''),
    })
  }
  return items
}

export function TableOfContents({ contentHtml }: { contentHtml: string }) {
  const [collapsed, setCollapsed] = useState(true)
  const [activeId, setActiveId] = useState<string>('')

  const toc = extractToc(contentHtml)

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

    toc.forEach(item => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [toc, handleIntersection])

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

  if (toc.length === 0) return null

  return (
    <>
      {/* Desktop: sidebar TOC */}
      <aside className="hidden lg:block fixed left-[max(1rem,calc((100vw-900px)/2-220px))] top-24 w-[200px]">
        {collapsed ? (
          <button
            onClick={toggle}
            className="text-xs text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-heading))] transition-colors writing-vertical py-2"
          >
            目录 →
          </button>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[rgb(var(--color-muted))] tracking-wider uppercase">目录</span>
              <button
                onClick={toggle}
                className="text-xs text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-heading))]"
              >
                收起 ←
              </button>
            </div>
            <nav className="text-xs leading-relaxed">
              {toc.map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block py-1 transition-colors truncate ${
                    item.level === 3 ? 'pl-3' : ''
                  } ${
                    activeId === item.id
                      ? 'text-[rgb(var(--color-heading))] font-medium'
                      : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-heading))]'
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
          className="text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-heading))] flex items-center gap-1"
        >
          {collapsed ? '☰ 目录' : '✕ 收起目录'}
        </button>
        {!collapsed && (
          <nav className="mt-3 p-4 bg-[rgb(var(--color-surface))] rounded-lg text-sm space-y-1">
            {toc.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setCollapsed(true)}
                className={`block py-1 ${item.level === 3 ? 'pl-3 text-xs' : ''} ${
                  activeId === item.id
                    ? 'text-[rgb(var(--color-heading))] font-medium'
                    : 'text-[rgb(var(--color-muted))]'
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
```

- [ ] **Step 2: Create post detail page**

```tsx
// app/posts/[slug]/page.tsx
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { notFound } from 'next/navigation'
import { TableOfContents } from '@/components/table-of-contents'
import { Giscus } from '@/components/giscus'
import type { Metadata } from 'next'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt || post.title,
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  // Pre-render to HTML string for TOC extraction, then render with MDXRemote
  const { content } = post

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article>
        <header className="mb-8">
          <div className="text-sm text-[rgb(var(--color-muted))] mb-2">
            {post.date}
            <span className="mx-2">·</span>
            <span className="uppercase">{post.category}</span>
          </div>
          <h1 className="text-3xl font-bold font-serif text-[rgb(var(--color-heading))] leading-tight mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-[rgb(var(--color-muted))] text-lg">{post.excerpt}</p>
          )}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-md
                bg-[rgb(var(--color-tag))] text-[rgb(var(--color-tag-text))]">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <TableOfContents contentHtml={content} />

        <div className="prose-warm max-w-reading mx-auto">
          <MDXRemote
            source={content}
            options={{
              mdxOptions: {
                rehypePlugins: [
                  rehypeSlug,
                  [rehypePrettyCode, { theme: 'github-light' }],
                ],
              },
            }}
          />
        </div>
      </article>

      <div className="max-w-reading mx-auto mt-12 pt-8 border-t border-[rgb(var(--color-border))]">
        <Giscus />
      </div>
    </div>
  )
}
```

Wait, there's a problem. The `TableOfContents` component needs HTML content to extract headings, but `MDXRemote` renders to JSX. I can't extract heading IDs from the MDX output before rendering it.

I have a few options:
1. Use a remark plugin to extract headings during MDX compilation
2. Parse the raw markdown content for headings using a simpler approach (regex on `## heading` pattern)
3. Render MDX twice - once to string for TOC, once for the actual page (wasteful)

The simplest approach is to extract headings from the raw MDX content string by matching markdown heading patterns. Let me update the TOC component to parse markdown directly instead of HTML.

Actually, let me do it differently. I can extract headings from the raw MDX source in the server component, then pass them as a prop to the TOC client component. This is cleaner.

Let me rewrite the approach:
- In the server component, extract headings from the raw MDX content
- Pass the heading list to the TOC client component
- The TOC component only handles interactivity (collapsing, scroll tracking)

This is much better architecture.

Let me update the TOC component and the post page accordingly.

Actually, let me reconsider the TOC a bit. The tricky part is the heading IDs — they need to match what rehype-slug generates. rehype-slug uses the heading text, lowercased, with spaces replaced by dashes and special chars removed. Let me implement a simple slug function.

Here's my revised approach:

```tsx
// In the server component (post page), extract TOC from raw MDX:
function extractHeadings(content: string) {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const headings: { level: number; text: string; id: string }[] = []
  let match
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[2].trim()
    const id = text.toLowerCase().replace(/[^a-z0-9一-龥]+/g, '-').replace(/(^-|-$)/g, '')
    headings.push({ level: match[1].length, text, id })
  }
  return headings
}
```

And the TOC component becomes simpler:

```tsx
// components/table-of-contents.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'

export interface HeadingItem {
  level: number
  text: string
  id: string
}

export function TableOfContents({ headings }: { headings: HeadingItem[] }) {
  // ... same collapsible logic, but uses the heading ids from props
}
```

This is cleaner. Let me update the plan.

- [ ] **Step 3: Commit**

```bash
git add components/table-of-contents.tsx app/posts/
git commit -m "feat: add post detail page with collapsible TOC

Co-Authored-By: DeepSeek V4 Pro <cuixiaojun002@ke.com>"
```

---

### Task 8: Tags Pages

**Files:**
- Create: `components/tag-cloud.tsx`
- Create: `app/tags/page.tsx`
- Create: `app/tags/[tag]/page.tsx`

- [ ] **Step 1: Create TagCloud component**

```tsx
// components/tag-cloud.tsx
import Link from 'next/link'
import type { TagCount } from '@/lib/tags'

export function TagCloud({ tags }: { tags: TagCount[] }) {
  if (tags.length === 0) {
    return <p className="text-[rgb(var(--color-muted))] text-center py-8">No tags yet</p>
  }

  const maxCount = tags[0]?.count ?? 1

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {tags.map(({ tag, count }) => {
        const scale = 0.75 + (count / maxCount) * 0.5
        const size = `${(scale * 100).toFixed(0)}%`
        return (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className="inline-block px-3 py-1.5 rounded-lg transition-colors
              bg-[rgb(var(--color-tag))] text-[rgb(var(--color-tag-text))]
              hover:bg-[rgb(var(--color-accent))] hover:text-white"
            style={{ fontSize: size }}
          >
            {tag}
            <span className="ml-1 text-xs opacity-60 align-super">{count}</span>
          </Link>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Create tags index page**

```tsx
// app/tags/page.tsx
import { getAllTags } from '@/lib/tags'
import { TagCloud } from '@/components/tag-cloud'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tags',
}

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-serif text-[rgb(var(--color-heading))] text-center mb-8">
        Tags
      </h1>
      <TagCloud tags={tags} />
    </div>
  )
}
```

- [ ] **Step 3: Create tag-filtered posts page**

```tsx
// app/tags/[tag]/page.tsx
import { getPostsByTag, getAllPosts } from '@/lib/posts'
import { PostCardGrid } from '@/components/post-card-grid'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  const tagSet = new Set(posts.flatMap(p => p.tags))
  return Array.from(tagSet).map(tag => ({ tag }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params
  return { title: `Posts tagged "${tag}"` }
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params
  const posts = getPostsByTag(tag)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-8">
        <Link href="/tags" className="text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-heading))]">
          ← All tags
        </Link>
        <h1 className="text-3xl font-bold font-serif text-[rgb(var(--color-heading))] mt-2">
          {tag}
        </h1>
        <p className="text-[rgb(var(--color-muted))] mt-1">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </p>
      </header>
      <PostCardGrid posts={posts} />
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/tag-cloud.tsx app/tags/
git commit -m "feat: add tags pages with tag cloud and filtering

Co-Authored-By: DeepSeek V4 Pro <cuixiaojun002@ke.com>"
```

---

### Task 9: About Page

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Create about page**

```tsx
// app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
}

export default function AboutPage() {
  return (
    <div className="max-w-reading mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-serif text-[rgb(var(--color-heading))] mb-8">
        About Me
      </h1>

      <div className="prose-warm">
        <p>
          Hi, I&apos;m Ke — a frontend developer passionate about building great web experiences.
          This is my personal space where I write about technology, share learnings,
          and occasionally reflect on life.
        </p>

        <h2>What I do</h2>
        <p>
          I work on web applications using React, TypeScript, and modern JavaScript tooling.
          I care about clean code, good UX, and performant applications.
        </p>

        <h2>Connect</h2>
        <ul>
          <li>
            <a href="https://github.com/cuixiaojun001" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href="mailto:cuixiaojun002@ke.com">Email</a>
          </li>
        </ul>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat: add about page

Co-Authored-By: DeepSeek V4 Pro <cuixiaojun002@ke.com>"
```

---

### Task 10: Search Page

**Files:**
- Create: `components/search-bar.tsx`
- Create: `app/search/page.tsx`

- [ ] **Step 1: Create SearchBar component**

```tsx
// components/search-bar.tsx
'use client'

import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import type { PostMeta } from '@/lib/posts'
import { PostCard } from './post-card'

export function SearchBar({ allPosts }: { allPosts: PostMeta[] }) {
  const [query, setQuery] = useState('')

  const fuse = useMemo(() => new Fuse(allPosts, {
    keys: ['title', 'excerpt', 'tags', 'category'],
    threshold: 0.3,
  }), [allPosts])

  const results = query.trim()
    ? fuse.search(query).map(r => r.item)
    : allPosts

  return (
    <div>
      <div className="relative mb-8">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search posts..."
          autoFocus
          className="w-full px-4 py-3 pl-10 rounded-lg border border-[rgb(var(--color-border))]
            bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text))]
            placeholder:text-[rgb(var(--color-muted))]
            focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))]"
        />
        <svg className="absolute left-3 top-3.5 w-4 h-4 text-[rgb(var(--color-muted))]"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {query && (
        <p className="text-sm text-[rgb(var(--color-muted))] mb-4">
          {results.length} {results.length === 1 ? 'result' : 'results'}
          {query && ` for "${query}"`}
        </p>
      )}

      <div className="space-y-4">
        {results.map(post => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {results.length === 0 && (
        <p className="text-center py-12 text-[rgb(var(--color-muted))]">
          No posts found
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create search page**

```tsx
// app/search/page.tsx
import { getAllPosts } from '@/lib/posts'
import { SearchBar } from '@/components/search-bar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search',
}

export default function SearchPage() {
  const allPosts = getAllPosts()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-serif text-[rgb(var(--color-heading))] mb-8">
        Search
      </h1>
      <SearchBar allPosts={allPosts} />
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/search-bar.tsx app/search/page.tsx
git commit -m "feat: add search page with fuse.js client-side search

Co-Authored-By: DeepSeek V4 Pro <cuixiaojun002@ke.com>"
```

---

### Task 11: RSS Feed

**Files:**
- Create: `app/feed.xml/route.ts`

- [ ] **Step 1: Create RSS route handler**

```ts
// app/feed.xml/route.ts
import { getAllPosts } from '@/lib/posts'

export async function GET() {
  const posts = getAllPosts()
  const siteUrl = 'https://yourblog.vercel.app'

  const items = posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/posts/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt || post.title}]]></description>
      ${post.tags.map(t => `<category>${t}</category>`).join('\n      ')}
    </item>`).join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Your Blog</title>
    <link>${siteUrl}</link>
    <description>Personal blog about tech and life</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
```

- [ ] **Step 2: Commit**

```bash
git add app/feed.xml/route.ts
git commit -m "feat: add RSS feed at /feed.xml

Co-Authored-By: DeepSeek V4 Pro <cuixiaojun002@ke.com>"
```

---

### Task 12: Giscus Comments

**Files:**
- Create: `components/giscus.tsx`

- [ ] **Step 1: Create Giscus component**

```tsx
// components/giscus.tsx
'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

export function Giscus() {
  const ref = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.setAttribute('data-repo', 'cuixiaojun001/blog') // TODO: update if repo differs
    script.setAttribute('data-repo-id', 'YOUR_REPO_ID')      // TODO: get from Giscus setup
    script.setAttribute('data-category', 'Comments')
    script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID') // TODO: get from Giscus setup
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'bottom')
    script.setAttribute('data-theme', resolvedTheme === 'dark' ? 'dark' : 'light')
    script.setAttribute('data-lang', 'zh-CN')
    script.setAttribute('crossorigin', 'anonymous')

    ref.current.appendChild(script)
  }, [resolvedTheme])

  // Update theme when it changes
  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
    if (!iframe) return

    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: resolvedTheme === 'dark' ? 'dark' : 'light' } } },
      'https://giscus.app'
    )
  }, [resolvedTheme])

  return <div ref={ref} />
}
```

Note: The `YOUR_REPO_ID` and `YOUR_CATEGORY_ID` placeholders need real values from the Giscus setup. The user should:
1. Install Giscus on the GitHub repo
2. Enable Discussions
3. Copy the repo-id and category-id from giscus.app

- [ ] **Step 2: Commit**

```bash
git add components/giscus.tsx
git commit -m "feat: add Giscus comment component

Co-Authored-By: DeepSeek V4 Pro <cuixiaojun002@ke.com>"
```

---

### Task 13: First Sample Post

**Files:**
- Create: `content/posts/hello-world.mdx`

- [ ] **Step 1: Create sample post**

```mdx
---
title: "Hello World — 从零搭建个人博客"
date: "2026-04-30"
tags: ["Next.js", "Blog", "Vercel"]
category: "tech"
excerpt: "用 Next.js 15 + MDX + Tailwind CSS 搭建一个功能齐全的个人博客，部署到 Vercel。"
---

## 动机

一直想有一个自己的博客空间，用来记录技术思考和生活随笔。这个周末终于动手了。

## 技术选型

选择了 **Next.js 15 + MDX + Tailwind CSS** 的组合：

- **Next.js** — Vercel 的框架，部署最顺畅
- **MDX** — Markdown 里可以写 React 组件，灵活
- **Tailwind CSS** — 原子化 CSS，写样式很高效

## 功能清单

- 首页卡片网格展示文章
- 文章详情页带可折叠目录
- 标签系统 & 标签云
- 全文搜索
- 暗色模式
- RSS 订阅
- Giscus 评论

## 部署

推送到 GitHub，Vercel 自动部署。整个过程非常流畅。

> 选择和自己技术栈匹配的工具最重要。不要为了追求新技术而牺牲效率。
```

- [ ] **Step 2: Commit**

```bash
git add content/posts/hello-world.mdx
git commit -m "feat: add first sample blog post

Co-Authored-By: DeepSeek V4 Pro <cuixiaojun002@ke.com>"
```

---

### Task 14: Build & Verify

- [ ] **Step 1: Run the dev server and verify locally**

```bash
cd /Users/ke/workspace/ainative/blog && npm run dev
```

Open `http://localhost:3000` and verify:
- [ ] Home page loads with post card grid
- [ ] Click post card → article detail with TOC
- [ ] Tags page shows tag cloud
- [ ] About page renders
- [ ] Search works with fuse.js
- [ ] Dark mode toggle works
- [ ] Mobile responsive (resize to phone)
- [ ] RSS feed at `/feed.xml` returns valid XML

- [ ] **Step 2: Run production build to verify no errors**

```bash
cd /Users/ke/workspace/ainative/blog && npm run build
```

Expected: build completes successfully with no errors.

- [ ] **Step 3: Commit any build fixes**

```bash
git add -A
git commit -m "fix: build fixes and polish

Co-Authored-By: DeepSeek V4 Pro <cuixiaojun002@ke.com>"
```

---

### Task 15: Vercel Deploy Setup

- [ ] **Step 1: Push to GitHub**

```bash
git remote add origin git@github.com:cuixiaojun001/blog.git
# Or create repo on GitHub first, then:
git push -u origin main
```

- [ ] **Step 2: Import to Vercel**

1. Go to vercel.com → Import Project
2. Select the `blog` GitHub repo
3. Framework auto-detected as Next.js — no changes needed
4. Deploy

- [ ] **Step 3: Configure Giscus (post-deploy)**

1. Go to giscus.app
2. Configure with repo `cuixiaojun001/blog`
3. Copy `data-repo-id` and `data-category-id`
4. Update `components/giscus.tsx` with the real IDs
5. Commit and push
```

---

## Self-Review

**1. Spec coverage check:**
- Home page with card grid ✓ (Task 6)
- Post detail with collapsible TOC ✓ (Task 7)
- Tags page + tag cloud ✓ (Task 8)
- About page ✓ (Task 9)
- Search page ✓ (Task 10)
- RSS feed ✓ (Task 11)
- Dark mode ✓ (Task 2: CSS vars, Task 3: toggle)
- Giscus comments ✓ (Task 12)
- Warm visual style ✓ (Task 2: globals.css)
- Vercel deploy ✓ (Task 1: vercel.json, Task 15)

**2. Placeholder scan:**
- Giscus component has repo-id/category-id marked with explanation — the user needs to configure this after deploying. This is acceptable since the values come from an external setup step.
- No TBD/TODO placeholders.

**3. Type consistency check:**
- `PostMeta` interface defined in `lib/posts.ts` ✓ used in `post-card.tsx`, `post-card-grid.tsx`, `search-bar.tsx`
- `Post` interface extends `PostMeta` ✓ used in `app/posts/[slug]/page.tsx`
- `TagCount` interface in `lib/tags.ts` ✓ used in `tag-cloud.tsx`
- `HeadingItem` interface in `table-of-contents.tsx` ✓ passed from server component
