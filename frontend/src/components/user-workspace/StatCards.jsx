import { getFormStatus, getNextFormsStatusTime } from '../../utils/forms';
import { useNow } from '../../hooks/useNow';

function StatCard({ stat }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-plum/10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-plum/55">
        {stat.label}
      </p>
      <div className="mt-4 flex items-end justify-between gap-2">
        <span className="font-sans text-[40px] font-extrabold leading-none tracking-tight text-plum">
          {stat.value}
        </span>
        <span className="pb-1 text-xs font-medium text-stone-500">{stat.suffix}</span>
      </div>
    </div>
  );
}

function StatCards({ forms = [], submissions = [], loading = false }) {
  const now = useNow(getNextFormsStatusTime(forms));
  const activeJobs = forms.filter((f) => getFormStatus(f, now) === 'Live').length;
  const totalApplicants = submissions.length;
  const approved = submissions.filter((s) => s.status === 'APPROVED').length;
  const scored = submissions.filter((s) => s.cvScore != null);
  const avg =
    scored.length > 0
      ? Math.round(scored.reduce((sum, s) => sum + Number(s.cvScore) || 0, 0) / scored.length)
      : null;

  const stats = [
    { label: 'ACTIVE JOBS', value: loading ? '…' : String(activeJobs), suffix: 'open' },
    { label: 'TOTAL APPLICANTS', value: loading ? '…' : String(totalApplicants), suffix: 'total' },
    { label: 'APPROVED', value: loading ? '…' : String(approved), suffix: 'approved' },
    {
      label: 'AVG AI MATCH SCORE',
      value: loading ? '…' : avg != null ? `${avg}/100` : '—',
      suffix: 'avg match',
    },
  ];

  return (
    <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </section>
  );
}

export default StatCards;