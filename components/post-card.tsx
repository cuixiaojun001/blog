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
