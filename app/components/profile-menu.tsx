import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

export function ProfileMenu() {
  return (
    <>
      <SignedIn>
        {/* <Dropdown>
          <DropdownButton as={SidebarItem}>
            <span className="flex items-center min-w-0 gap-3">
              <Avatar
                // src="/teams/pome-dark.svg"
                initials="EJ"
                className="size-10"
                square
                alt=""
              />
              <span className="min-w-0">
                <span className="block font-medium truncate text-sm/5 text-zinc-950 dark:text-white">
                  Erica
                </span>
                <span className="block font-normal truncate text-xs/5 text-zinc-500 dark:text-zinc-400">
                  erica@example.com
                </span>
              </span>
            </span>
            <ChevronUpIcon />
          </DropdownButton>
          <AccountDropdownMenu anchor="top start" />
        </Dropdown> */}
        <UserButton />
      </SignedIn>

      <SignedOut>
        <div className="sm:px-4 sm:pb-4 sm:mt-auto">
          <SignInButton>
            <button className="flex items-center justify-center w-full px-4 py-2 space-x-2 font-medium text-gray-300 transition-all duration-200 ease-in-out bg-gray-800 border border-gray-700 rounded-md hover:text-white hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <span>Sign in</span>
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  );
}
