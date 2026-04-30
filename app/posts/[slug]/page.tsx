import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { notFound } from 'next/navigation'
import { TableOfContents } from '@/components/table-of-contents'
import { Giscus } from '@/components/giscus'
import type { Metadata } from 'next'
import type { HeadingItem } from '@/components/table-of-contents'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'

interface Props {
  params: Promise<{ slug: string }>
}

function extractHeadings(content: string): HeadingItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const headings: HeadingItem[] = []
  let match
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[2].trim()
    const id = text.toLowerCase().replace(/[^a-z0-9一-鿿]+/g, '-').replace(/(^-|-$)/g, '')
    headings.push({ level: match[1].length, text, id })
  }
  return headings
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

  const headings = extractHeadings(post.content)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article>
        <header className="mb-8">
          <div className="text-sm text-warm-muted mb-2">
            {post.date}
            <span className="mx-2">·</span>
            <span className="uppercase">{post.category}</span>
          </div>
          <h1 className="text-3xl font-bold font-serif text-warm-heading leading-tight mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-warm-muted text-lg">{post.excerpt}</p>
          )}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-md
                bg-warm-tag text-warm-tag-text">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <TableOfContents headings={headings} />

        <div className="prose-warm max-w-reading mx-auto">
          <MDXRemote
            source={post.content}
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

      <div className="max-w-reading mx-auto mt-12 pt-8 border-t border-warm-border">
        <Giscus />
      </div>
    </div>
  )
}
