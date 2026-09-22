export function ButterIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Butter stick */}
      <rect x="2" y="5" width="20" height="14" rx="2" />
      {/* Top layer (lighter butter) */}
      <path d="M2 10h20" />
      {/* Wrapper lines */}
      <path d="M9 5v14" />
      <path d="M15 5v14" />
    </svg>
  );
}
