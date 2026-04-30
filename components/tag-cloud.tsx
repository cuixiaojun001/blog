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
