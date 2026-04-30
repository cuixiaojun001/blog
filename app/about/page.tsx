import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
}

export default function AboutPage() {
  return (
    <div className="max-w-reading mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-serif text-warm-heading mb-8">
        About Me
      </h1>

      <div className="prose-warm">
        <p>
          Hi, I&apos;m Ke — a frontend developer passionate about building great web experiences.
          This is my personal space where I write about technology, share learnings,
          and occasionally reflect on life.
        </p>

        <h2>What I do</h2>
        <p>
          I work on web applications using React, TypeScript, and modern JavaScript tooling.
          I care about clean code, good UX, and performant applications.
        </p>

        <h2>Connect</h2>
        <ul>
          <li>
            <a href="https://github.com/cuixiaojun001" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href="mailto:cuixiaojun002@ke.com">Email</a>
          </li>
        </ul>
      </div>
    </div>
  )
}
