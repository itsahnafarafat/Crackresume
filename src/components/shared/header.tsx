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
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00AEEF"/>
                  <stop offset="1" stopColor="#22C55E"/>
                </linearGradient>
              </defs>
              <path d="M25.321 2.67897C27.8396 2.67897 29.8732 4.71261 29.8732 7.2312V19.324C29.8732 21.8426 27.8396 23.8762 25.321 23.8762H7.23116C4.71257 23.8762 2.67894 21.8426 2.67894 19.324V7.2312C2.67894 4.71261 4.71257 2.67897 7.23116 2.67897H25.321Z" fill="url(#logo-gradient)"/>
              <path d="M29.3333 19.3333C29.3333 24.8562 24.8562 29.3333 19.3333 29.3333C13.8105 29.3333 9.33333 24.8562 9.33333 19.3333C9.33333 13.8105 13.8105 9.33333 19.3333 9.33333C24.8562 9.33333 29.3333 13.8105 29.3333 19.3333Z" fill="url(#logo-gradient)"/>
              <path d="M6.41681 12.6667C6.41681 7.14381 10.8939 2.66667 16.4168 2.66667C21.9397 2.66667 26.4168 7.14381 26.4168 12.6667C26.4168 18.1895 21.9397 22.6667 16.4168 22.6667C10.8939 22.6667 6.41681 18.1895 6.41681 12.6667Z" fill="url(#logo-gradient)"/>
              <path d="M22.0882 10.9668L14.4215 18.6335C14.1208 18.9341 13.6375 18.9341 13.3368 18.6335L10.4215 15.7181C10.1208 15.4175 10.1208 14.9341 10.4215 14.6335C10.7221 14.3328 11.2055 14.3328 11.5061 14.6335L13.8791 17.0065L21.0035 9.88214C21.3041 9.58151 21.7875 9.58151 22.0882 9.88214C22.3888 10.1828 22.3888 10.6662 22.0882 10.9668Z" fill="white"/>
            </svg>
            <span className="font-bold text-xl" style={{color: 'hsl(220, 25%, 25%)'}}>SkillSync</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
