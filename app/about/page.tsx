import { MDXRemote } from 'next-mdx-remote/rsc'
import { readFileSync } from 'fs'
import path from 'path'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
}

export default function AboutPage() {
  const filePath = path.join(process.cwd(), 'content/about.mdx')
  const source = readFileSync(filePath, 'utf-8')

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold font-serif text-warm-heading mb-8">
        About Me
      </h1>
      <div className="prose-warm">
        <MDXRemote source={source} />
      </div>
    </div>
  )
}
