import { useEffect, useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { getForm } from '../services/api';

function FieldRow({ field }) {
  return (
    <div className="rounded-[20px] bg-white/70 p-5 ring-1 ring-plum/10">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-stone-800">
          {field.label}
          {field.required && <span className="ml-1 text-red-500">*</span>}
        </p>
        <span className="shrink-0 rounded-full bg-[#d9d9d9] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-stone-600">
          {field.type.toLowerCase()}
        </span>
      </div>

      {field.type === 'TEXT' || field.type === 'EMAIL' ? (
        <div className="mt-3 h-10 rounded-[12px] bg-[#efede5] px-4 text-sm leading-10 text-stone-400">
          Short answer text
        </div>
      ) : field.type === 'NUMBER' ? (
        <div className="mt-3 h-10 rounded-[12px] bg-[#efede5] px-4 text-sm leading-10 text-stone-400">
          Number answer
        </div>
      ) : field.type === 'DATE' ? (
        <div className="mt-3 h-10 rounded-[12px] bg-[#efede5] px-4 text-sm leading-10 text-stone-400">
          Date answer
        </div>
      ) : field.type === 'CHECKBOX' ? (
        <div className="mt-3 h-10 rounded-[12px] bg-[#efede5] px-4 text-sm leading-10 text-stone-400">
          Checkbox answer
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {(field.options || []).map((opt, idx) => (
            <div
              key={`${field.id}-${opt.id ?? idx}`}
              className="flex items-center gap-2 text-sm text-stone-600"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-stone-400 text-[10px] text-transparent">
                {field.type === 'SELECT' && '1'}
              </span>
              {opt.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FormView({ formId }) {
  const { goToHR } = useNavigation();
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!formId) return;
    getForm(formId)
      .then((data) => setForm(data))
      .catch((err) => setError(err.message || 'Failed to load the form.'));
  }, [formId]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f2efe7] font-sans text-stone-800 antialiased">
      <header className="sticky top-0 z-50 border-b border-plum/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
          <a href="!#" onClick={(e) => { e.preventDefault(); goToHR(); }} className="flex items-center gap-2.5">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-teal">
              <span className="font-serif text-xl font-bold text-white">H</span>
              <span className="absolute -bottom-1 -left-1 h-2 w-2 rounded-sm bg-gold" />
            </span>
            <span className="text-xl font-bold tracking-tight text-plum">HiOring</span>
          </a>

          <nav className="hidden items-center gap-6 text-sm font-medium text-stone-600 md:flex">
            <a href="!#" onClick={(e) => e.preventDefault()} className="transition hover:text-plum">Our news</a>
            <button
              type="button"
              onClick={goToHR}
              className="rounded-full bg-plum px-5 py-2 text-sm font-semibold text-white transition hover:bg-plum-dark"
            >
              Back to dashboard
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <div className="mx-auto w-full max-w-3xl px-5 py-8 lg:px-8">
          <button
            type="button"
            onClick={goToHR}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-plum"
          >
            <span aria-hidden="true">&larr;</span> All hiring forms
          </button>

          {error && (
            <div className="rounded-[20px] bg-red-100 px-5 py-4 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          {!form && !error && (
            <div className="rounded-[20px] bg-white/60 px-5 py-6 text-sm text-stone-500 ring-1 ring-plum/10">
              Loading form...
            </div>
          )}

          {form && (
            <div className="rounded-[20px] bg-[#f2efe7] p-5 ring-1 ring-plum/10 sm:p-8">
              <p className="text-xl font-bold tracking-tight text-plum">{form.title}</p>
              {form.description && (
                <p className="mt-3 text-sm leading-relaxed text-stone-600">{form.description}</p>
              )}
              {form.requirements && (
                <div className="mt-4 rounded-[16px] bg-white/70 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-plum">Requirements</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{form.requirements}</p>
                </div>
              )}

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-plum">Questions</h3>
                  <span className="text-xs font-medium text-stone-400">
                    {form.fields?.length ?? 0} question{(form.fields?.length ?? 0) === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {(form.fields || []).map((field) => (
                    <FieldRow key={field.id} field={field} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default FormView;