const candidates = [
  { initials: 'DS', name: 'Dara Sok', score: 90 },
  { initials: 'SC', name: 'Sophea Chan', score: 88 },
  { initials: 'RK', name: 'Rithy Kim', score: 85 },
  { initials: 'KT', name: 'Kim Seng Tang', score: 82 },
  { initials: 'VS', name: 'Vann Sen', score: 78 },
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function TopRankedCandidates() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-plum/10">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-lg font-bold text-plum">Top Ranked Candidates</h2>
        <span className="cursor-pointer text-xs font-semibold text-teal transition hover:text-teal-dark">
          See all
        </span>
      </div>

      <ul className="mt-2 divide-y divide-plum/10">
        {candidates.map((candidate) => (
          <li key={candidate.name} className="flex items-center gap-4 py-4">
            <button
              type="button"
              aria-label={`Select ${candidate.name}`}
              className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg border-2 border-teal/30 text-teal/50 transition hover:border-teal hover:bg-teal hover:text-white"
            >
              <CheckIcon />
            </button>

            <span className="flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-full bg-teal text-sm font-bold uppercase text-white">
              {candidate.initials}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#344e41]">{candidate.name}</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-1.5 w-full max-w-[170px] overflow-hidden rounded-full bg-plum/10">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${candidate.score}%` }}
                  />
                </div>
              </div>
            </div>

            <span className="shrink-0 text-sm font-bold text-[#344e41]">
              {candidate.score}%/100
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TopRankedCandidates;