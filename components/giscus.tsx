// components/giscus.tsx
'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

export function Giscus() {
  const ref = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.setAttribute('data-repo', 'cuixiaojun001/blog')
    script.setAttribute('data-repo-id', 'R_kgDOSQqa9g')
    script.setAttribute('data-category', 'Comments')
    script.setAttribute('data-category-id', 'DIC_kwDOSQqa9s4C8CiB')
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'bottom')
    script.setAttribute('data-theme', resolvedTheme === 'dark' ? 'dark' : 'light')
    script.setAttribute('data-lang', 'zh-CN')
    // crossorigin removed — causes CORS issues with GitHub API proxy

    ref.current.appendChild(script)
  }, [resolvedTheme])

  // Update theme when it changes
  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
    if (!iframe) return

    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: resolvedTheme === 'dark' ? 'dark' : 'light' } } },
      'https://giscus.app'
    )
  }, [resolvedTheme])

  return <div ref={ref} />
}
