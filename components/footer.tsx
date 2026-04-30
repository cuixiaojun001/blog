// components/footer.tsx

export function Footer() {
  return (
    <footer className="border-t border-[rgb(var(--color-border))] mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-sm text-[rgb(var(--color-muted))]">
        <p>&copy; {new Date().getFullYear()} Your Blog. Built with Next.js.</p>
      </div>
    </footer>
  )
}
