import { getAllPosts } from '@/lib/posts'
import { SearchBar } from '@/components/search-bar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search',
}

export default function SearchPage() {
  const allPosts = getAllPosts()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-serif text-[rgb(var(--color-heading))] mb-8">
        Search
      </h1>
      <SearchBar allPosts={allPosts} />
    </div>
  )
}
