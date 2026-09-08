import { useState } from 'react';
import { createForm, getToken } from '../../services/api';
import { useNavigation } from '../../context/NavigationContext';

const FIELD_TYPES = ['TEXT', 'NUMBER', 'DATE', 'CHECKBOX', 'RADIO', 'SELECT'];

const DEFAULT_FIELDS = [
  { label: 'First name', type: 'TEXT', required: true, options: [] },
  { label: 'Last name', type: 'TEXT', required: true, options: [] },
  { label: 'Phone number', type: 'TEXT', required: false, options: [] },
  { label: 'Email', type: 'EMAIL', required: true, options: [] },
];

function FieldTypeSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-[38px] w-36 shrink-0 rounded-[20px] bg-[#d9d9d9] px-3 text-xs font-medium text-stone-700 outline-none transition focus:bg-[#cfcfcf]"
    >
      {FIELD_TYPES.map((t) => (
        <option key={t} value={t}>
          {t.charAt(0) + t.slice(1).toLowerCase()}
        </option>
      ))}
    </select>
  );
}

function OptionsEditor({ options, onChange }) {
  const update = (idx, value) => {
    const next = options.map((o, i) => (i === idx ? { value } : o));
    onChange(next);
  };

  return (
    <div className="mt-2 space-y-2">
      {options.map((opt, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span className="text-xs text-stone-400">{idx + 1}.</span>
          <input
            value={opt.value}
            onChange={(e) => update(idx, e.target.value)}
            placeholder="Option label"
            className="h-9 flex-1 rounded-[12px] bg-[#d9d9d9] px-3 text-sm text-stone-700 outline-none"
          />
          <button
            type="button"
            onClick={() => onChange(options.filter((_, i) => i !== idx))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-stone-400 transition hover:bg-red-100 hover:text-red-500"
            aria-label="Remove option"
          >
            &times;
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...options, { value: '' }])}
        className="text-xs font-semibold text-plum transition hover:underline"
      >
        + Add option
      </button>
    </div>
  );
}

function FieldCard({ field, index, onChange, onRemove }) {
  return (
    <div className="flex flex-col rounded-[20px] bg-white/70 p-4 shadow-sm ring-1 ring-plum/10">
      <div className="flex w-full items-start gap-3">
        <div className="group relative w-full">
          <input
            id={`field-label-${index}`}
            type="text"
            value={field.label}
            onChange={(e) => onChange({ ...field, label: e.target.value })}
            placeholder=" "
            className="peer w-full border-b-2 border-neutral-300 bg-transparent pb-1.5 pt-5 text-base text-neutral-900 outline-none transition-colors duration-300"
          />
          <label
            htmlFor={`field-label-${index}`}
            className="pointer-events-none absolute left-0 top-5 text-base text-neutral-400 transition-all duration-300 ease-out group-hover:text-neutral-600 peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-neutral-900 peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-neutral-900"
          >
            Question
          </label>
          <span className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 bg-neutral-900 transition-transform duration-300 ease-out group-hover:scale-x-100 peer-focus:scale-x-100 peer-[:not(:placeholder-shown)]:scale-x-100" />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone-400 transition hover:bg-red-100 hover:text-red-500"
          aria-label="Remove field"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path strokeLinecap="round" d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
          </svg>
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs font-semibold text-plum">Type:</span>
        <FieldTypeSelect value={field.type} onChange={(type) => onChange({ ...field, type })} />
        <label className="ml-auto flex shrink-0 cursor-pointer items-center gap-2 text-xs font-medium text-stone-600">
          <input
            type="checkbox"
            checked={!!field.required}
            onChange={(e) => onChange({ ...field, required: e.target.checked })}
            className="h-4 w-4 rounded accent-plum"
          />
          Required
        </label>
      </div>

      {(field.type === 'RADIO' || field.type === 'SELECT') && (
        <OptionsEditor options={field.options || []} onChange={(options) => onChange({ ...field, options })} />
      )}
    </div>
  );
}

function UploadZone({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[20px] border-2 border-dashed border-plum/20 bg-white/60 px-6 py-8 text-center transition hover:border-plum/40">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d9d9d9] text-plum">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-plum">{title}</p>
        <p className="mt-0.5 text-xs text-stone-500">{subtitle}</p>
      </div>
    </div>
  );
}

function UploadSection() {
  return (
    <section className="rounded-[20px] bg-[#f2efe7] p-5 ring-1 ring-plum/10 sm:p-6">
      <h3 className="text-lg font-bold text-plum">Uploads</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <UploadZone
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6"><circle cx="12" cy="8" r="3.5" /><path strokeLinecap="round" d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>}
          title="Photo"
          subtitle="Drop your photo here"
        />
        <UploadZone
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6"><path strokeLinecap="round" d="M7 3h7l4 4v14a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" /><path strokeLinecap="round" d="M14 3v4h4" /></svg>}
          title="Upload your CV"
          subtitle="Drop your CV here / PDF Max 10MB"
        />
        <UploadZone
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6"><path strokeLinecap="round" d="M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2h7l2 2 4 4z" /></svg>}
          title="Cover letter"
          subtitle="Drop your cover letter here"
        />
      </div>
      <p className="mt-3 text-[11px] text-stone-400">
        Note: uploaded files are stored as a single CV attachment per submission.
      </p>
    </section>
  );
}

function FormBuilder() {
  const { goToHR } = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [fields, setFields] = useState(DEFAULT_FIELDS);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [needsSignIn, setNeedsSignIn] = useState(false);

  const addField = () => {
    setFields((prev) => [...prev, { label: '', type: 'TEXT', required: false, options: [] }]);
  };

  const updateField = (idx, next) => {
    setFields((prev) => prev.map((f, i) => (i === idx ? next : f)));
  };

  const removeField = (idx) => {
    setFields((prev) => prev.filter((_, i) => i !== idx));
  };

  const buildPayload = () => {
    const clean = fields
      .map((f) => ({
        label: f.label.trim(),
        type: f.type === 'EMAIL' ? 'TEXT' : f.type,
        required: !!f.required,
        options: (f.options || [])
          .map((o) => ({ value: o.value }))
          .filter((o) => o.value.trim() !== ''),
      }))
      .filter((f) => f.label !== '');

    return {
      title: title.trim(),
      description: description.trim() || undefined,
      requirements: requirements.trim() || undefined,
      fields: clean,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNeedsSignIn(false);
    setError(null);

    if (!title.trim()) {
      setError('Form title is required.');
      return;
    }
    if (fields.length === 0) {
      setError('Add at least one question.');
      return;
    }

    const payload = buildPayload();
    if (payload.fields.length === 0) {
      setError('Add at least one question with a label.');
      return;
    }

    setSubmitting(true);
    try {
      await createForm(payload);
      setSuccess(true);
      setTimeout(() => goToHR(), 1300);
    } catch (err) {
      if (err.status === 401) {
        setNeedsSignIn(true);
      } else {
        setError(err.message || 'Failed to publish the form.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[20px] bg-[#f2efe7] p-5 ring-1 ring-plum/10 sm:p-8 lg:p-10">
      <p className="text-center font-sans text-xl font-semibold text-plum">New Hiring Form</p>

      <label className="mb-2 mt-4 block text-base font-extrabold text-plum">
        Title <span className="text-red-500">*</span>
      </label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Hiring - UX Designer — Product Team"
        className="w-full rounded-[20px] bg-[#d9d9d9] px-5 py-4 text-lg font-semibold text-stone-800 outline-none transition placeholder:font-normal placeholder:text-stone-400 focus:bg-[#cfcfcf] sm:text-xl"
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-bold text-plum">JOB DESCRIPTION</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe the role..."
            className="w-full resize-y rounded-[20px] bg-[#d9d9d9] px-4 py-3 text-sm text-stone-700 outline-none transition placeholder:text-stone-400 focus:bg-[#cfcfcf]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-plum">
            Job Requirements <span className="text-red-500">*</span>
          </label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            rows={5}
            placeholder="eg. React, Node.js, MySQL, etc.."
            className="w-full resize-y rounded-[20px] bg-[#d9d9d9] px-4 py-3 text-sm text-stone-700 outline-none transition placeholder:text-stone-400 focus:bg-[#cfcfcf]"
          />
        </div>
      </div>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-plum">Questions</h3>
          <button
            type="button"
            onClick={addField}
            className="rounded-full bg-plum px-4 py-2 text-xs font-semibold text-white transition hover:bg-plum-dark"
          >
            + Add question
          </button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {fields.map((field, idx) => (
            <FieldCard
              key={idx}
              field={field}
              index={idx}
              onChange={(next) => updateField(idx, next)}
              onRemove={() => removeField(idx)}
            />
          ))}
        </div>
      </section>

      <div className="mt-8">
        <UploadSection />
      </div>

      {success && (
        <div className="mt-6 rounded-[20px] bg-[#a7eda7] px-5 py-4 text-sm font-semibold text-[#0d6921]">
          Your hiring form has been published successfully!
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-[20px] bg-red-100 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {needsSignIn && (
        <div className="mt-6 flex flex-col items-start gap-3 rounded-[20px] bg-white/70 px-5 py-4 text-sm font-medium text-stone-700 ring-1 ring-plum/10">
          <p>You need to sign in before publishing a form.</p>
          <a
            href={`${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/auth/google`}
            className="rounded-full bg-plum px-5 py-2 text-sm font-semibold text-white transition hover:bg-plum-dark"
          >
            Sign in with Google
          </a>
        </div>
      )}

      <div className="mt-8 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={goToHR}
          className="rounded-[20px] border border-plum/30 px-6 py-3 text-sm font-semibold text-plum transition hover:bg-plum/5"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-[20px] bg-plum px-8 py-3 text-sm font-semibold text-white transition hover:bg-plum-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Publishing...' : 'Publish form'}
        </button>
      </div>
    </form>
  );
}

export default FormBuilder;