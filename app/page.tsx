import { getAllPosts } from '@/lib/posts'
import { PostCardGrid } from '@/components/post-card-grid'

export const dynamic = 'force-static'

export default function HomePage() {
  const posts = getAllPosts()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold font-serif text-warm-heading mb-3">
          Hello, I&apos;m Ke
        </h1>
        <p className="text-warm-muted max-w-md mx-auto leading-relaxed">
          前端工程师 · 技术 &amp; 生活 · 文字记录思考
        </p>
      </header>
      <PostCardGrid posts={posts} />
    </div>
  )
}
