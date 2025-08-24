
export function Logo() {
  return (
    <svg
      aria-label="Crackresume logo"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-auto"
    >
      <rect width="32" height="32" rx="8" fill="hsl(var(--primary))" />
      <path
        d="M22 9C19.9877 9 18.0532 9.79017 16.636 11.2073C15.2188 12.6245 14.4286 14.559 14.4286 16.5714C14.4286 18.5838 15.2188 20.5183 16.636 21.9355C18.0532 23.3527 19.9877 24.1429 22 24.1429"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 16.5714L14.4286 21L22 9"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
