
const templates = [
  { name: 'New Form', icon: true },
  { name: 'Standard form', icon: false },
];

const recentForms = [
  { id: 'ux', title: 'UX Designer \u2014 Product Team', applicants: '84', status: 'Live' },
  { id: 'be', title: 'Backend Engineer', applicants: '37', status: 'Full' },
  { id: 'mi', title: 'Marketing Intern', applicants: '84', status: 'Paused' },
  { id: 'sa', title: 'Sales Associate', applicants: '111', status: 'Closed' },
  { id: 'da', title: 'Data Analyst', applicants: '52', status: 'Live' },
  { id: 'po', title: 'Product Owner', applicants: '23', status: 'Full' },
  { id: 'hr', title: 'HR Coordinator', applicants: '18', status: 'Paused' },
  { id: 'qa', title: 'QA Engineer', applicants: '65', status: 'Live' },
  { id: 'fd', title: 'Frontend Developer', applicants: '97', status: 'Closed' },
];

const statusStyles = {
  Live: 'bg-[#a7eda7] text-[#0d6921]',
  Full: 'bg-teal text-white',
  Paused: 'bg-gold text-plum',
  Closed: 'bg-white text-[#757575]',
};

const statusDots = {
  Live: 'bg-[#0d6921]',
  Full: 'bg-white',
  Paused: 'bg-plum',
  Closed: 'bg-[#757575]',
};

function TemplateCard({ template }) {
  return (
    <div
      className={`flex min-h-[10rem] flex-col overflow-hidden rounded-[20px] border-2 border-plum transition-transform duration-300 ease-out hover:scale-[1.05] ${
        template.icon ? 'bg-[#d9d9d9]' : 'bg-plum'
      }`}
    >
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        {template.icon ? (
          <span className="text-5xl font-bold leading-none text-plum">+</span>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-12 w-12 text-[#f2f0e8]"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <path strokeLinecap="round" d="M8 9h8M8 13h8M8 17h5" />
          </svg>
        )}
      </div>
      <div className="rounded-b-[18px] border-t-2 border-plum bg-[#f2f0e8] px-4 py-3.5">
        <p className="text-center text-base font-semibold text-plum">{template.name}</p>
      </div>
    </div>
  );
}

function Avatar({ children, className }) {
  return (
    <div className={`flex h-[36px] w-[36px] items-center justify-center rounded-full text-xs font-bold ${className}`}>
      {children}
    </div>
  );
}

function RecentCard({ form }) {
  const score = Math.min(Number(form.applicants) || 0, 100);
  const words = form.title.split(/[^a-zA-Z]+/).filter(Boolean);
  const a1 = words[0]?.[0]?.toUpperCase() || 'U';
  const a2 = words[1]?.[0]?.toUpperCase() || 'S';

  return (
    <article className="flex h-full w-[250px] shrink-0 flex-col rounded-[18px] bg-plum p-5 transition-transform duration-300 ease-out hover:scale-[1.05]">
      <div className="flex items-center justify-end">
        <button
          type="button"
          aria-label="More options"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-plum transition hover:bg-gold/80"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <circle cx="5" cy="12" r="1.6" />
            <circle cx="12" cy="12" r="1.6" />
            <circle cx="19" cy="12" r="1.6" />
          </svg>
        </button>
      </div>

      <h3 className="mt-6 font-sans text-[17px] font-black leading-tight text-[#F2F0E8]">
        {form.title}
      </h3>

      <p className="mt-1.5 text-[13px] text-[#F2F0E8]">{form.applicants} applicants</p>

      <div className="mt-auto flex items-center justify-between gap-2 pt-10">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] font-semibold ${statusStyles[form.status]}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${statusDots[form.status]}`} />
          {form.status}
        </span>
        <div className="relative flex h-[48px] w-[76px]">
          <Avatar className="absolute left-0 top-[6px] z-[1] bg-gold text-plum">{a1}</Avatar>
          <Avatar className="absolute left-[18px] top-[6px] z-[2] bg-teal text-[#F2F0E8]">{a2}</Avatar>
          <div className="absolute left-[36px] top-[6px] z-[3] flex h-9 w-9 items-center justify-center rounded-full border-2 border-plum bg-[#F2F0E8] text-xs font-bold text-plum">
            +{form.applicants}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <progress
          value={score}
          max="100"
          className="h-1 w-full appearance-none overflow-hidden rounded-full [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-black/20 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-[#F2F0E8] [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-[#F2F0E8]"
        />
      </div>
    </article>
  );
}

function Forms() {
  return (
    <section id="forms" className="bg-[#fffef9] py-16 lg:py-24">
      <div className="mx-auto max-w-site px-6 lg:px-8">
        <div className="rounded-[20px] bg-[#f2f0e8] p-6 sm:p-10 lg:p-14">
          <p className="font-sans text-2xl font-semibold text-plum">HiOring Forms</p>
          <h2 className="mt-4 font-sans text-3xl font-bold tracking-tight text-plum sm:text-4xl">
            What role are you hiring for today?
          </h2>
          <p className="mt-3 text-base font-semibold text-plum">Start a new form or view the existing ones</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => (
              
                <TemplateCard key={t.name} template={t} />
            ))}
          </div>

          <div className="mt-14">
            <div className="flex items-center justify-between">
              <h3 className="font-sans text-2xl font-bold text-plum">Recent forms</h3>
              <span className="rounded-full bg-plum px-3 py-1 text-xs font-bold text-white">9 total</span>
            </div>
            <div className="mt-6 flex gap-6 overflow-x-auto px-3 pb-4 pt-2">
              {recentForms.map((form) => (
                <div key={form.id} className="w-[250px] shrink-0">
                  <RecentCard form={form} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Forms;
