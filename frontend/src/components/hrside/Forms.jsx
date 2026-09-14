
import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { listForms, deleteForm, copyForm, updateFormSchedule } from '../../services/api';
import {
  DEFAULT_CLOSE_WINDOW_MS,
  formatDateTime,
  getFormStatus,
  getNextFormsStatusTime,
  toLocalInput,
} from '../../utils/forms';
import { useNow } from '../../hooks/useNow';

const templates = [
  { name: 'New Form', icon: true },
  { name: 'Standard form', icon: false },
];

const statusStyles = {
  Live: 'bg-[#a7eda7] text-[#0d6921]',
  Full: 'bg-teal text-white',
  Paused: 'bg-gold text-plum',
  Closed: 'bg-white text-[#757575]',
  Scheduled: 'bg-gold text-plum',
};

const statusDots = {
  Live: 'bg-[#0d6921]',
  Full: 'bg-white',
  Paused: 'bg-plum',
  Closed: 'bg-[#757575]',
  Scheduled: 'bg-plum',
};

function TemplateCard({ template, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[10rem] cursor-pointer flex-col overflow-hidden rounded-[20px] border-2 border-plum text-left transition-transform duration-300 ease-out hover:scale-[1.05] ${
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
    </button>
  );
}

function RecentCard({ form, now, onView, onEdit, onDelete, onDuplicate, onCopyLink, onCloseNow, onOpen }) {
  const applicants = form.applicants ?? form.submissionCount ?? 0;
  const score = Math.min(Number(applicants) || 0, 100);
  const status = getFormStatus(form, now);

  return (
    <article
      role={onCopyLink ? 'button' : undefined}
      tabIndex={onCopyLink ? 0 : undefined}
      onClick={onCopyLink}
      onKeyDown={(e) => {
        if (onCopyLink && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onCopyLink();
        }
      }}
      title={onCopyLink ? 'Click to copy application link' : undefined}
      className={`flex h-full w-[250px] shrink-0 flex-col rounded-[18px] bg-plum p-5 transition-transform duration-300 ease-out hover:scale-[1.05] ${
        onCopyLink ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-end">
        {(onView || onEdit || onDelete || onCopyLink) && (
          <div
            className="popup"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Form actions"
              aria-haspopup="true"
              className="burger cursor-pointer"
            >
              <span />
              <span />
              <span />
            </button>

            <nav className="popup-window" aria-label="Form actions">
              <legend>Form actions</legend>
              <ul>
                {onView && (
                  <li>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onView();
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      View form
                    </button>
                  </li>
                )}
                {(onCloseNow || onOpen) && <hr />}
                {onCloseNow && (
                  <li>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseNow();
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" />
                        <path strokeLinecap="round" d="M9 9l6 6M15 9l-6 6" />
                      </svg>
                      Close form
                    </button>
                  </li>
                )}
                {onOpen && (
                  <li>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen();
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                      Set close time
                    </button>
                  </li>
                )}
                {onView && onEdit && <hr />}
                {onEdit && (
                  <li>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                      Edit form
                    </button>
                  </li>
                )}
                {onDuplicate && <hr />}
                {onDuplicate && (
                  <li>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate();
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Duplicate form
                    </button>
                  </li>
                )}
                {onDelete && <hr />}
                {onDelete && (
                  <li>
                    <button
                      type="button"
                      className="popup-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                        <path strokeLinecap="round" d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
                      </svg>
                      Delete form
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        )}
      </div>

      <h3 className="mt-6 font-sans text-[17px] font-black leading-tight text-[#F2F0E8]">
        {form.title}
      </h3>

      <p className="mt-1.5 text-[13px] text-[#F2F0E8]">{applicants} applicants</p>

      <div className="mt-auto flex items-center justify-between gap-2 pt-10">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] font-semibold ${statusStyles[status] ?? statusStyles.Live}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${statusDots[status] ?? statusDots.Live}`} />
          {status}
        </span>
      </div>

      {form.closeAt && (
        <p className="mt-2 text-[11px] font-medium text-[#F2F0E8]/75">
          Close at: {formatDateTime(form.closeAt)}
        </p>
      )}

      {status === 'Scheduled' && form.openAt && (
        <p className="mt-1 text-[11px] font-medium text-[#F2F0E8]/75">
          Opens at: {formatDateTime(form.openAt)}
        </p>
      )}

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

function DeleteFormModal({ title, error, deleting, onCancel, onConfirm }) {
  const [confirmText, setConfirmText] = useState('');
  const confirmed = confirmText.trim().toLowerCase().startsWith('remove');

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-plum-dark/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Delete form"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-[20px] bg-[#f2efe7] p-6 shadow-2xl ring-1 ring-plum/10"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-sans text-xl font-bold text-plum">Delete form?</h3>
        <p className="mt-2 text-sm text-stone-600">
          This will permanently delete{' '}
          <span className="font-semibold text-plum">{title}</span>.
        </p>
        <p className="mt-3 text-sm font-semibold text-red-600">
          Type "Remove" to confirm deletion.
        </p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="Type 'Remove' to confirm"
          autoFocus
          className="mt-3 w-full rounded-[12px] border border-red-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
        />
        {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-full border border-plum/30 px-4 py-2 text-sm font-semibold text-plum transition hover:bg-plum hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!confirmed || deleting}
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CloseFormModal({ title, error, busy, onCancel, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-plum-dark/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Close form"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-[20px] bg-[#f2efe7] p-6 shadow-2xl ring-1 ring-plum/10"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-sans text-xl font-bold text-plum">Close {title}?</h3>
        <p className="mt-2 text-sm text-stone-600">
          Applications will stop immediately. You can reopen it anytime by setting a new close time.
        </p>
        {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-full border border-plum/30 px-4 py-2 text-sm font-semibold text-plum transition hover:bg-plum hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? 'Closing...' : 'Close form'}
          </button>
        </div>
      </div>
    </div>
  );
}

function OpenFormModal({ title, error, busy, defaultCloseAt, onCancel, onConfirm }) {
  const [closeAtLocal, setCloseAtLocal] = useState(() => toLocalInput(defaultCloseAt));
  const closeAtISO = (() => {
    if (!closeAtLocal) return null;
    const d = new Date(closeAtLocal);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  })();
  const valid = closeAtISO != null && new Date(closeAtISO) > new Date();
  const minLocal = toLocalInput(new Date());

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-plum-dark/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Set close time"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-[20px] bg-[#f2efe7] p-6 shadow-2xl ring-1 ring-plum/10"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-sans text-xl font-bold text-plum">Open &ldquo;{title}&rdquo;?</h3>
        <p className="mt-2 text-sm text-stone-600">
          The form opens immediately and closes automatically at the time below.
        </p>
        <label className="mb-2 mt-4 block text-sm font-bold text-plum">Close at</label>
        <input
          type="datetime-local"
          value={closeAtLocal}
          min={minLocal}
          onChange={(e) => setCloseAtLocal(e.target.value)}
          className="w-full rounded-[20px] bg-[#d9d9d9] px-4 py-3 text-sm text-stone-800 outline-none transition focus:bg-[#cfcfcf]"
        />
        {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-full border border-plum/30 px-4 py-2 text-sm font-semibold text-plum transition hover:bg-plum hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(closeAtISO)}
            disabled={busy || !valid}
            className="rounded-full bg-plum px-4 py-2 text-sm font-semibold text-white transition hover:bg-plum-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? 'Opening...' : 'Open form'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Forms() {
  const { goToCreateForm, goToLogin, goToFormView, goToEditForm } = useNavigation();
  const [recentForms, setRecentForms] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(null);
  const copyTimer = useRef(null);
  const [dupNotice, setDupNotice] = useState(null);
  const dupTimer = useRef(null);
  const [duplicating, setDuplicating] = useState(false);
  const [closeTarget, setCloseTarget] = useState(null);
  const [openTarget, setOpenTarget] = useState(null);
  const [scheduleBusy, setScheduleBusy] = useState(false);
  const [scheduleError, setScheduleError] = useState(null);
  const now = useNow(getNextFormsStatusTime(recentForms));

  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
    if (dupTimer.current) clearTimeout(dupTimer.current);
  }, []);

  useEffect(() => {
    listForms()
      .then((forms) => {
        if (Array.isArray(forms)) setRecentForms(forms);
      })
      .catch((err) => {
        if (err.status === 401) goToLogin();
      });
  }, []);

  const handleNewForm = (template) => {
    goToCreateForm(template);
  };

  const confirmDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteForm(deleteTarget.id);
      setRecentForms((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      if (err.status === 401) {
        goToLogin();
      } else {
        setDeleteError(err.message || 'Failed to delete the form.');
      }
    } finally {
      setDeleting(false);
    }
  };

  const copyLink = async (form) => {
    const url = `${window.location.origin}/apply/${form.id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
      } catch {
        /* ignore */
      }
      document.body.removeChild(textarea);
    }
    setCopiedLink(form.title);
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleDuplicate = async (form) => {
    if (duplicating) return;
    setDuplicating(true);
    try {
      const dup = await copyForm(form.id);
      setRecentForms((prev) => [dup, ...prev]);
      setDupNotice(dup.title || 'Form duplicated');
      if (dupTimer.current) window.clearTimeout(dupTimer.current);
      dupTimer.current = window.setTimeout(() => setDupNotice(null), 3000);
    } catch (err) {
      if (err.status === 401) {
        goToLogin();
      }
    } finally {
      setDuplicating(false);
    }
  };

  const applySchedule = async (form, closeAtISO) => {
    if (!form || scheduleBusy) return;
    setScheduleBusy(true);
    setScheduleError(null);
    try {
      const updated = await updateFormSchedule(form.id, closeAtISO);
      setRecentForms((prev) =>
        prev.map((f) =>
          f.id === form.id
            ? { ...f, ...updated, submissionCount: f.submissionCount ?? updated.submissionCount }
            : f
        )
      );
      setCloseTarget(null);
      setOpenTarget(null);
    } catch (err) {
      if (err.status === 401) {
        goToLogin();
      } else {
        setScheduleError(err.message || 'Failed to update the form schedule.');
      }
    } finally {
      setScheduleBusy(false);
    }
  };

  const closeFormNow = () => {
    if (!closeTarget) return;
    applySchedule(closeTarget, new Date().toISOString());
  };

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
              <TemplateCard
                key={t.name}
                template={t}
                onClick={() => handleNewForm(t.icon ? 'blank' : 'standard')}
              />
            ))}
          </div>

          <div className="mt-14">
            <div className="flex items-center justify-between">
              <h3 className="font-sans text-2xl font-bold text-plum">Recent forms</h3>
              <span className="rounded-full bg-plum px-3 py-1 text-xs font-bold text-white">
                {recentForms.length} total
              </span>
            </div>
            {recentForms.length > 0 ? (
              <div className="mt-6 flex gap-6 overflow-x-auto px-3 pb-4 pt-2">
                {recentForms.map((form) => (
                  <div key={form.id} className="w-[250px] shrink-0">
                    <RecentCard
                      form={form}
                      now={now}
                      onView={() => goToFormView(form.id)}
                      onEdit={(form.submissionCount ?? 0) === 0 ? () => goToEditForm(form.id) : undefined}
                      onDelete={() => setDeleteTarget(form)}
                      onDuplicate={() => handleDuplicate(form)}
                      onCopyLink={() => copyLink(form)}
                      onCloseNow={
                        getFormStatus(form, now) === 'Live' || getFormStatus(form, now) === 'Scheduled'
                          ? () => setCloseTarget(form)
                          : undefined
                      }
                      onOpen={
                        getFormStatus(form, now) === 'Closed'
                          ? () => setOpenTarget(form)
                          : undefined
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm text-stone-500">No forms yet. Create your first form to get started.</p>
            )}
          </div>
        </div>
      </div>

      {deleteTarget && (
        <DeleteFormModal
          title={deleteTarget.title}
          error={deleteError}
          deleting={deleting}
          onCancel={() => { setDeleteTarget(null); setDeleteError(null); }}
          onConfirm={confirmDelete}
        />
      )}

      {closeTarget && (
        <CloseFormModal
          title={closeTarget.title}
          error={scheduleError}
          busy={scheduleBusy}
          onCancel={() => { setCloseTarget(null); setScheduleError(null); }}
          onConfirm={closeFormNow}
        />
      )}

      {openTarget && (
        <OpenFormModal
          title={openTarget.title}
          error={scheduleError}
          busy={scheduleBusy}
          defaultCloseAt={new Date(Date.now() + DEFAULT_CLOSE_WINDOW_MS)}
          onCancel={() => { setOpenTarget(null); setScheduleError(null); }}
          onConfirm={(closeAtISO) => applySchedule(openTarget, closeAtISO)}
        />
      )}

      {copiedLink && (
        <div className="fixed bottom-6 right-6 z-[120] flex items-center gap-2 rounded-full bg-plum py-3 pl-5 pr-6 text-sm font-semibold text-white shadow-2xl shadow-plum/30">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gold">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Link copied! Share &ldquo;{copiedLink}&rdquo; with applicants.
        </div>
      )}

      {dupNotice && (
        <div className="fixed bottom-6 right-6 z-[120] flex items-center gap-2 rounded-full bg-plum py-3 pl-5 pr-6 text-sm font-semibold text-white shadow-2xl shadow-plum/30">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gold">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Duplicated &ldquo;{dupNotice}&rdquo;.
        </div>
      )}
    </section>
  );
}

export default Forms;
