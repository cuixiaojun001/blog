'use client'

import { useEffect, useRef } from 'react'

export function Giscus() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return

    const script = document.createElement('script')
    script.src = 'https://utteranc.es/client.js'
    script.async = true
    script.setAttribute('repo', 'cuixiaojun001/blog')
    script.setAttribute('issue-term', 'pathname')
    script.setAttribute('theme', 'preferred-color-scheme')
    script.setAttribute('crossorigin', 'anonymous')

    ref.current.appendChild(script)
  }, [])

  return <div ref={ref} />
}
