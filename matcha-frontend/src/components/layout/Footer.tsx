export default function Footer() {
  return (
    <footer className="border-t mt-auto" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="text-center space-y-2 sm:space-y-3">
          <p className="text-sm sm:text-base font-bold">
            © 2025 Matcha
          </p>
          <p className="text-xs sm:text-sm italic px-2" style={{ color: 'var(--text-muted)' }}>
            Where connections brew naturally, one cup at a time.
          </p>
        </div>
      </div>
    </footer>
  );
}
