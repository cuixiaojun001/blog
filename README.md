# Blog

个人技术博客，基于 Next.js 15 + MDX + Tailwind CSS 构建。

## 在线地址

<https://blog-five-inky-38.vercel.app/>

## 技术栈

- **框架**: Next.js 15 (App Router)
- **内容**: MDX (Markdown + React 组件)
- **样式**: Tailwind CSS
- **部署**: Vercel (<https://vercel.com/cxj2856801855-2793s-projects/blog>)
- **评论**: Utterances (基于 GitHub Issues)

## 本地开发

```bash
npm install
npm run dev
```

访问 <http://localhost:3000>。

## 文章目录

内容放在 `content/posts/` 目录，使用 `.mdx` 格式。

Frontmatter 格式：

```yaml
---
title: "文章标题"
date: "2026-05-11"
tags: ["Tag1", "Tag2"]
category: "tech"  # tech | life
excerpt: "文章摘要"
---
```

## 部署

推送到 `main` 分支后，Vercel 自动部署。
