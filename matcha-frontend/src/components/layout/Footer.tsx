export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-950 dark:to-green-900/50 border-t border-green-200 dark:border-green-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="text-center space-y-2 sm:space-y-3">
          <p className="text-sm sm:text-base text-green-800 dark:text-green-100 font-semibold">
            © 2025 Matcha
          </p>
          <p className="text-xs sm:text-sm text-green-700 dark:text-green-200 italic px-2">
            Where connections brew naturally, one cup at a time, just pass us please!
          </p>
        </div>
      </div>
    </footer>
  );
}