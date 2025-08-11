import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
            >
              <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'hsl(195, 90%, 45%)', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: 'hsl(145, 63%, 49%)', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path
                d="M23.9525 4.88889C25.9275 3.80556 28.25 5.37222 27.9 7.55556L26.1525 21.0389C25.855 22.95 23.88 24.1389 22.1025 23.4111L7.545 17.5222C5.5575 16.7111 4.755 14.2833 6.095 12.6389L18.0125 0.722222C19.345 -0.733333 21.73 -0.194444 22.7525 1.48889L23.9525 4.88889Z"
                fill="url(#logo-gradient)"
              />
              <path
                d="M13.419,19.2438l-4.14-4.14a1.2,1.2,0,0,1,1.7-1.7l3.29,3.29,5.78-5.78a1.2,1.2,0,0,1,1.7,1.7l-6.62,6.62A1.2,1.2,0,0,1,13.419,19.2438Z"
                fill="white"
              />
            </svg>
            <span className="font-bold text-xl" style={{color: 'hsl(220, 25%, 25%)'}}>SkillSync</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
