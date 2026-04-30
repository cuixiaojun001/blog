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
          className="w-full px-4 py-3 pl-10 rounded-lg border border-warm-border
            bg-warm-bg text-warm-text
            placeholder:text-warm-muted
            focus:outline-none focus:ring-2 focus:ring-warm-accent"
        />
        <svg className="absolute left-3 top-3.5 w-4 h-4 text-warm-muted"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {query && (
        <p className="text-sm text-warm-muted mb-4">
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
        <p className="text-center py-12 text-warm-muted">
          No posts found
        </p>
      )}
    </div>
  )
}
