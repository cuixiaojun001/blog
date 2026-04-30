import { getAllPosts } from '@/lib/posts'
import { PostCardGrid } from '@/components/post-card-grid'

export const dynamic = 'force-static'

export default function HomePage() {
  const posts = getAllPosts()

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold font-serif text-warm-heading mb-3">
          Hello, I&apos;m Cris
        </h1>
        <p className="text-warm-muted max-w-md mx-auto leading-relaxed">
          AI Agent &amp; Cloud Native 学习记录
        </p>
      </header>
      <PostCardGrid posts={posts} />
    </div>
  )
}
