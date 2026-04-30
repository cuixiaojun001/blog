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
