// components/footer.tsx

export function Footer() {
  return (
    <footer className="border-t border-warm-border mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-sm text-warm-muted">
        <p>&copy; {new Date().getFullYear()} Your Blog. Built with Next.js.</p>
      </div>
    </footer>
  )
}
