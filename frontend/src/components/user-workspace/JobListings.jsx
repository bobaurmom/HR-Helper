import { useEffect, useState } from 'react';
import { listForms } from '../../services/api';

function StatusPill({ status }) {
  const live = status === 'Live';
  return (
    <span
      className={`rounded-md px-2.5 py-1 text-[11px] font-semibold leading-none ${
        live ? 'bg-teal/10 text-teal' : 'bg-stone-100 text-stone-500'
      }`}
    >
      {status}
    </span>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function JobListings() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    listForms()
      .then((data) => {
        if (Array.isArray(data)) setForms(data);
      })
      .catch(() => {});
  }, []);

  const jobs = forms.map((form) => ({
    title: form.title,
    meta:
      (form.description && form.description.slice(0, 60)) ||
      (form.requirements && form.requirements.slice(0, 60)) ||
      'No description',
    status: form.isOpen ? 'Live' : 'Closed',
    applicants: form.submissionCount ?? 0,
  }));

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-plum/10">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-lg font-bold text-plum">Job Listings</h2>
        <span className="cursor-pointer text-xs font-semibold text-teal transition hover:text-teal-dark">
          See all
        </span>
      </div>

      {jobs.length > 0 ? (
        <ul className="mt-2 divide-y divide-plum/10">
          {jobs.map((job, index) => (
            <li key={`${job.title}-${index}`} className="flex items-center justify-between gap-3 py-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#344e41]">{job.title}</p>
                <p className="mt-0.5 truncate text-xs text-stone-500">{job.meta}</p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <StatusPill status={job.status} />
                <span className="flex items-center gap-1.5 text-xs font-semibold text-stone-500">
                  <UsersIcon />
                  {job.applicants}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-stone-500">No job listings yet.</p>
      )}
    </section>
  );
}

export default JobListings;