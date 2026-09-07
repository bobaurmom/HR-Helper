function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function Badge({ count }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#F90808] px-1 text-[10px] font-bold leading-none text-white">
      {count}
    </span>
  );
}

function TopBar() {
  return (
    <div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-3">
      <h1 className="font-sans text-[26px] font-bold leading-none tracking-tight text-[#344e41]">
        OVERVIEW
      </h1>

      <div className="relative order-last w-full sm:order-none sm:w-[300px]">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder="Search here"
          className="h-[51px] w-full rounded-full border border-plum/10 bg-white pl-12 pr-5 text-sm text-stone-600 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-teal"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-[51px] w-[51px] items-center justify-center rounded-2xl bg-white text-plum shadow-sm ring-1 ring-plum/10 transition hover:text-teal"
        >
          <BellIcon />
          <Badge count="2" />
        </button>

        <button
          type="button"
          aria-label="Messages"
          className="relative flex h-[51px] w-[51px] items-center justify-center rounded-2xl bg-white text-plum shadow-sm ring-1 ring-plum/10 transition hover:text-teal"
        >
          <MessageIcon />
          <Badge count="2" />
        </button>

        <span className="flex h-[43px] w-[43px] items-center justify-center rounded-full bg-teal text-sm font-bold uppercase text-white shadow-sm">
          DS
        </span>
      </div>
    </div>
  );
}

export default TopBar;