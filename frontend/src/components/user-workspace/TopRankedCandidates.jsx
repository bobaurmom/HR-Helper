import { useNavigation } from '../../context/NavigationContext';

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

const initialsFromEmail = (email = '') => {
  const local = email.split('@')[0] || email;
  const parts = local.split(/[.\s_-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return local.slice(0, 2).toUpperCase();
};

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-4 py-3">
          <div className="h-[30px] w-[30px] animate-pulse rounded-lg bg-plum/10" />
          <div className="h-[43px] w-[43px] animate-pulse rounded-full bg-plum/10" />
          <div className="flex-1">
            <div className="h-3 w-1/2 animate-pulse rounded-full bg-plum/10" />
            <div className="mt-2 h-1.5 w-2/3 animate-pulse rounded-full bg-plum/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

function TopRankedCandidates({ submissions = [], formsById = new Map(), loading = false }) {
  const { goToHR, goToSubmissions } = useNavigation();

  const candidates = [...submissions]
    .filter((s) => s.cvScore != null && s.email)
    .sort((a, b) => Number(b.cvScore) - Number(a.cvScore))
    .slice(0, 5)
    .map((s) => ({
      id: s.id,
      formId: s.formId,
      email: s.email,
      score: Number(s.cvScore) || 0,
      initials: initialsFromEmail(s.email),
      jobTitle: formsById.get(s.formId)?.title,
      status: s.status,
    }));

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-plum/10">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-lg font-bold text-plum">Top Ranked Candidates</h2>
        <button
          type="button"
          onClick={goToHR}
          className="cursor-pointer text-xs font-semibold text-teal transition hover:text-teal-dark"
        >
          See all
        </button>
      </div>

      {loading ? (
        <div className="mt-2">
          <LoadingSkeleton />
        </div>
      ) : candidates.length > 0 ? (
        <ul className="mt-2 divide-y divide-plum/10">
          {candidates.map((candidate) => (
            <li key={candidate.id} className="flex items-center gap-4 py-4">
              <button
                type="button"
                aria-label={`Select ${candidate.email}`}
                className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg border-2 border-teal/30 text-teal/50 transition hover:border-teal hover:bg-teal hover:text-white"
              >
                <CheckIcon />
              </button>

              <span className="flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-full bg-teal text-sm font-bold uppercase text-white">
                {candidate.initials}
              </span>

              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => goToSubmissions(candidate.formId)}
                  className="truncate text-sm font-semibold text-[#344e41] transition hover:text-plum"
                  title="View submissions"
                >
                  {candidate.email}
                </button>
                {candidate.jobTitle && (
                  <p className="mt-0.5 truncate text-xs text-stone-500">{candidate.jobTitle}</p>
                )}
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
      ) : (
        <p className="mt-4 text-sm text-stone-500">
          No scored submissions yet. Applications will appear here once received.
        </p>
      )}
    </section>
  );
}

export default TopRankedCandidates;