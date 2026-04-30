import { getAllTags } from '@/lib/tags'
import { TagCloud } from '@/components/tag-cloud'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tags',
}

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-serif text-[rgb(var(--color-heading))] text-center mb-8">
        Tags
      </h1>
      <TagCloud tags={tags} />
    </div>
  )
}
