import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getForm, submitFormAnswers } from '../services/api';

function FieldRow({ field, value, onChange, showErrors }) {
  const error = showErrors && field.required && !String(value ?? '').trim();

  const inputClass = 'mt-3 h-10 w-full rounded-[12px] bg-[#efede5] px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-plum/40';
  const errorText = () =>
    error ? <p className="mt-1 text-[11px] font-semibold text-red-500">This question is required.</p> : null;

  const renderInput = () => {
    switch (field.type) {
      case 'NUMBER':
        return (
          <input
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Number answer"
            className={inputClass}
          />
        );
      case 'DATE':
        return (
          <input
            type="date"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />
        );
      case 'CHECKBOX':
        return (
          <div className="mt-3 space-y-2">
            {(field.options || []).map((opt, idx) => {
              const selected = (value || '').split(', ').filter(Boolean);
              const isChecked = selected.includes(opt.value);
              return (
                <label
                  key={`${field.id}-${opt.id ?? idx}`}
                  className="flex w-fit cursor-pointer items-center gap-2 text-sm text-stone-700"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...selected, opt.value]
                        : selected.filter((v) => v !== opt.value);
                      onChange(next.join(', '));
                    }}
                    className="h-4 w-4 accent-plum"
                  />
                  {opt.value}
                </label>
              );
            })}
          </div>
        );
      case 'RADIO':
        return (
          <div className="mt-3 space-y-2">
            {(field.options || []).map((opt, idx) => (
              <label
                key={`${field.id}-${opt.id ?? idx}`}
                className="flex w-fit cursor-pointer items-center gap-2 text-sm text-stone-700"
              >
                <input
                  type="radio"
                  name={`field-${field.id}`}
                  checked={value === opt.value}
                  onChange={() => onChange(opt.value)}
                  className="accent-plum"
                />
                {opt.value}
              </label>
            ))}
          </div>
        );
      case 'SELECT':
        return (
          <select
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              Select an option...
            </option>
            {(field.options || []).map((opt, idx) => (
              <option key={`${field.id}-${opt.id ?? idx}`} value={opt.value}>
                {opt.value}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type="text"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Short answer text"
            className={inputClass}
          />
        );
    }
  };

  return (
    <div className="rounded-[20px] bg-white/70 p-5 ring-1 ring-plum/10">
      <p className="text-sm font-semibold text-stone-800">
          {field.label}
          {field.required && <span className="ml-1 text-red-500">*</span>}
        </p>
      {renderInput()}
      {errorText()}
    </div>
  );
}

function ApplyForm() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!formId) return;
    getForm(formId)
      .then((data) => setForm(data))
      .catch((err) => setError(err.message || 'Failed to load the form.'));
  }, [formId]);

  const requiredEmpty = (form?.fields || []).some(
    (f) => f.required && !String(answers[f.id] ?? '').trim()
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;
    if (requiredEmpty) {
      setShowErrors(true);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        // Mocking CV file ID for now, as file upload is not yet implemented
        cvFileId: 0, 
        answers: (form.fields || [])
          .map((f) => ({ fieldId: f.id, value: answers[f.id] ?? '' }))
          .filter((a) => a.value !== ''),
      };
      await submitFormAnswers(form.id, payload);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit the application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f2efe7] font-sans text-stone-800 antialiased">
      <header className="sticky top-0 z-50 border-b border-plum/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
          <span className="flex items-center gap-2.5">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-teal">
              <span className="font-serif text-xl font-bold text-white">H</span>
              <span className="absolute -bottom-1 -left-1 h-2 w-2 rounded-sm bg-gold" />
            </span>
            <span className="text-xl font-bold tracking-tight text-plum">HiOring</span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-stone-400">
            Job application
          </span>
        </div>
      </header>

      <main className="flex-grow">
        <div className="mx-auto w-full max-w-3xl px-5 py-8 lg:px-8">
          {submitted ? (
            <div className="rounded-[20px] bg-white/70 p-8 text-center ring-1 ring-plum/10">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal/15 text-teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <p className="mt-4 text-xl font-bold text-plum">Application submitted!</p>
              <p className="mt-2 text-sm text-stone-600">Thank you for applying. We will review your application shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="mb-5 rounded-[20px] bg-red-100 px-5 py-4 text-sm font-semibold text-red-600">
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
                        <FieldRow
                          key={field.id}
                          field={field}
                          value={answers[field.id]}
                          onChange={(val) => setAnswers((prev) => ({ ...prev, [field.id]: val }))}
                          showErrors={showErrors}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-6 w-full rounded-full bg-plum py-3 text-sm font-semibold text-white transition hover:bg-plum-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
                  >
                    {submitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default ApplyForm;