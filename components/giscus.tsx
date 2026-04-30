'use client'

import GiscusComponent from '@giscus/react'
import { useTheme } from 'next-themes'

export function Giscus() {
  const { resolvedTheme } = useTheme()

  return (
    <GiscusComponent
      repo="cuixiaojun001/blog"
      repoId="R_kgDOSQqa9g"
      category="Comments"
      categoryId="DIC_kwDOSQqa9s4C8CiB"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      lang="zh-CN"
    />
  )
}
