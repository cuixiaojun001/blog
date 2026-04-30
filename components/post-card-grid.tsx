import { PostCard } from './post-card'
import type { PostMeta } from '@/lib/posts'

export function PostCardGrid({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-warm-muted">
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
