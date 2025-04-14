export function LicenseIcon() {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-500"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M7 7h.01" />
        <path d="M10 7h7" />
        <path d="M7 12h.01" />
        <path d="M10 12h7" />
        <path d="M7 17h.01" />
        <path d="M10 17h3" />
      </svg>
      <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-900"
        >
          <path d="M12 2L5 12l7 3 7-3z" />
          <path d="M5 22v-4.172a2 2 0 0 1 .586-1.414L12 10l6.414 6.414a2 2 0 0 1 .586 1.414V22" />
        </svg>
      </div>
    </div>
  )
}
