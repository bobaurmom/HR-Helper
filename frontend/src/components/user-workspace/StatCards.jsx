const stats = [
  { label: 'ACTIVE JOBS', value: '2', suffix: 'open' },
  { label: 'TOTAL APPLICANTS', value: '7', suffix: 'this month' },
  { label: 'INTERVIEWS SCHEDULED', value: '1', suffix: 'Upcoming' },
  { label: 'AVG AI MATCH SCORE', value: '81/100', suffix: 'avg match' },
];

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

function StatCards() {
  return (
    <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </section>
  );
}

export default StatCards;