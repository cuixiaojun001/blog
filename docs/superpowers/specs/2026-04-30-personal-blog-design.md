# Personal Blog — Design Spec

## Overview

个人综合型博客网站，用 Next.js + MDX 构建，部署到 Vercel。内容涵盖技术文章和个人随笔。

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Content**: MDX (Markdown + React components)
- **Styling**: Tailwind CSS
- **Dark mode**: next-themes
- **Comments**: Giscus (GitHub Discussions)
- **Search**: fuse.js (client-side)
- **Deploy**: Vercel (auto deploy on git push)

## Project Structure

```
blog/
├── app/
│   ├── layout.tsx              # root layout (nav, footer, theme)
│   ├── page.tsx                # home — post card grid
│   ├── posts/[slug]/page.tsx   # post detail — centered reading + collapsible TOC
│   ├── tags/page.tsx           # tag cloud/index
│   ├── tags/[tag]/page.tsx     # posts filtered by tag
│   ├── about/page.tsx          # about me
│   ├── search/page.tsx         # client-side search
│   └── feed.xml/route.ts       # RSS feed
├── components/
├── content/posts/              # Markdown posts
├── lib/                        # post parsing, tag aggregation, etc.
├── public/
├── tailwind.config.ts
├── next.config.js
└── package.json
```

## Content Model

每篇文章是一个 `.mdx` 文件，存储在 `content/posts/`。Frontmatter:

```yaml
title: "Post Title"
date: "2026-04-30"
tags: ["Next.js", "React"]
category: "tech"   # tech | life
excerpt: "Optional summary"
---
```

## Page Designs

### Home (`/`)
- 顶部居中个人简介（姓名、一句话介绍）
- 文章列表使用 2 列卡片网格
- 每张卡片：日期 · 分类、标题、摘要
- 分页加载（ISR）

### Post Detail (`/posts/[slug]`)
- 左侧可折叠目录栏（展开显示 TOC，收起为窄条）
- 正文居中，最大宽度 660px
- 目录高亮当前阅读位置（IntersectionObserver）
- 移动端目录变为顶部抽屉菜单
- 底部：Giscus 评论区

### Tags (`/tags`)
- 所有标签云状展示，标签大小反映文章数量
- 点击进入 `/tags/[tag]`，同样卡片网格列出该标签下的文章

### About (`/about`)
- 居中单页，个人简介 + 社交链接（GitHub、邮箱等）

### Search (`/search`)
- 搜索框 + fuse.js 实时过滤结果

### RSS (`/feed.xml`)
- Route Handler 动态生成 XML，包含全部文章

## Visual Style

- **色调**: 雅致暖色 — 奶油色基底 (#faf8f5)，衬线字体标题，暖色系标签
- **暗色模式**: next-themes 切换，默认亮色，可切换到深色
- **导航栏**: Logo | Posts | Tags | About | 搜索图标 | 暗色切换按钮
- **移动端**: 汉堡菜单展开导航

## Features

| Feature    | Solution                                      |
|------------|-----------------------------------------------|
| Dark mode  | next-themes, toggle in navbar                 |
| Comments   | Giscus (GitHub Discussions backend, free)     |
| Search     | fuse.js, client-side fuzzy search             |
| RSS        | Route Handler at /feed.xml                    |
| Tags       | Computed from frontmatter, aggregated at build|
| Code highlight | rehype-pretty-code or shiki               |
| SEO        | generateMetadata per page, Open Graph tags    |
| Responsive | Tailwind responsive utilities, mobile-first   |

## Build & Deploy

- `vercel.json` configures the Next.js build
- Push to GitHub → Vercel auto-deploys
- ISR on home/tag pages (revalidate on new post push)
