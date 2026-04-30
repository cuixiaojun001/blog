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
