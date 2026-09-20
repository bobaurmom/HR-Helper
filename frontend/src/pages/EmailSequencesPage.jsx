import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/user-workspace/Navbar';
import TopBar from '../components/user-workspace/TopBar';
import { listForms, listSubmissions } from '../services/api';

const EMAIL_TEMPLATES = {
  INTERVIEW: {
    name: 'interview',
    label: 'Interview Invitation',
  },
  REJECTION: {
    name: 'rejection',
    label: 'Rejection',
  },
};

function EmailSequencesPage() {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [submissionsByForm, setSubmissionsByForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState(new Set());
  const [emailType, setEmailType] = useState('INTERVIEW');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const formsData = await listForms();
        if (cancelled) return;
        const submissionsByFormId = {};
        for (const form of Array.isArray(formsData) ? formsData : []) {
          if (form.submissionCount === 0) continue;
          const subs = await listSubmissions(form.id).catch(() => []);
          if (cancelled) return;
          submissionsByFormId[form.id] = Array.isArray(subs) ? subs : [];
        }
        setForms(Array.isArray(formsData) ? formsData : []);
        setSubmissionsByForm(submissionsByFormId);
      } catch {
        if (!cancelled) {
          setForms([]);
          setSubmissionsByForm({});
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const formsById = new Map(forms.map((f) => [f.id, f]));

  const handleFormSelect = (form) => {
    setSelectedForm(form);
    setSelectedCandidates(new Set());
  };

  const handleCandidateToggle = (candidateId) => {
    setSelectedCandidates((prev) => {
      const next = new Set(prev);
      if (next.has(candidateId)) next.delete(candidateId);
      else next.add(candidateId);
      return next;
    });
  };

  const handleSendEmail = () => {
    if (selectedForm && selectedCandidates.size > 0) {
      const candidateIds = Array.from(selectedCandidates);
      navigate(`/workspace/forms/${selectedForm.id}/email`, {
        state: { 
          selectedCandidates: candidateIds,
          emailType,
        }
      });
    }
  };

  const filteredSubmissions = selectedForm 
    ? (submissionsByForm[selectedForm.id] || [])
    : [];

  const toggleSelectAll = () => {
    setSelectedCandidates((prev) =>
      prev.size === filteredSubmissions.length ? new Set() : new Set(filteredSubmissions.map((s) => s.id))
    );
  };

  return (
    <div className="flex min-h-screen bg-[#fffef9] font-sans text-stone-800 antialiased">
      <Navbar />
      <main className="min-w-0 flex-1 px-5 pb-10 pt-24 sm:px-8 lg:ml-[297px] lg:pt-10">
        <div className="mx-auto max-w-site">
          <TopBar />
          
          <div className="mt-6">
            <h1 className="text-2xl font-bold text-[#344e41]">Email Sequences</h1>
            <p className="mt-1 text-sm text-stone-500">Send interview invitations or rejection emails to candidates</p>
          </div>



          {loading ? (
            <div className="mt-6 rounded-[20px] bg-white/60 px-5 py-6 text-sm text-stone-500 ring-1 ring-plum/10">
              Loading forms and candidates...
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-1">
                <div className="rounded-[20px] bg-white p-5 ring-1 ring-plum/10">
                  <h2 className="text-lg font-bold text-[#344e41]">Select Job</h2>
                  <div className="mt-4 max-h-96 overflow-y-auto">
                    {forms.length === 0 ? (
                      <p className="text-sm text-stone-500">No forms available</p>
                    ) : (
                      forms.map((form) => (
                        <button
                          key={form.id}
                          type="button"
                          onClick={() => handleFormSelect(form)}
                          className={`w-full rounded-[12px] px-4 py-3 text-left text-sm transition ${
                            selectedForm?.id === form.id
                              ? 'bg-[#588157] text-white'
                              : 'bg-gray-50 text-stone-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="font-semibold">{form.title}</div>
                          <div className="mt-1 text-xs opacity-80">
                            {form.submissionCount} candidate{form.submissionCount !== 1 ? 's' : ''}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {selectedForm && (
                  <div className="mt-4 rounded-[20px] bg-white p-5 ring-1 ring-plum/10">
                    <h2 className="text-lg font-bold text-[#344e41]">Email Type</h2>
                    <div className="mt-4 flex gap-3">
                      {Object.entries(EMAIL_TEMPLATES).map(([key, template]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setEmailType(key)}
                          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                            emailType === key
                              ? 'bg-[#588157] text-white'
                              : 'bg-gray-50 text-stone-700 ring-1 ring-plum/10 hover:bg-gray-100'
                          }`}
                        >
                          {template.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="xl:col-span-2">
                {selectedForm ? (
                  <div className="rounded-[20px] bg-white p-5 ring-1 ring-plum/10">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-[#344e41]">
                        Candidates for {selectedForm.title}
                      </h2>
                      {filteredSubmissions.length > 0 && (
                        <button
                          type="button"
                          onClick={toggleSelectAll}
                          className="text-sm font-semibold text-[#588157] hover:text-[#344e41]"
                        >
                          {selectedCandidates.size === filteredSubmissions.length ? 'Deselect All' : 'Select All'}
                        </button>
                      )}
                    </div>

                    {filteredSubmissions.length === 0 ? (
                      <p className="mt-4 text-sm text-stone-500">No candidates for this job</p>
                    ) : (
                      <div className="mt-4 max-h-96 overflow-y-auto">
                        {filteredSubmissions.map((submission) => (
                          <div
                            key={submission.id}
                            className={`mb-2 flex items-center justify-between rounded-[12px] px-4 py-3 transition ${
                              selectedCandidates.has(submission.id)
                                ? 'bg-[#588157]/10 ring-1 ring-[#588157]'
                                : 'bg-gray-50 ring-1 ring-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={selectedCandidates.has(submission.id)}
                                onChange={() => handleCandidateToggle(submission.id)}
                                className="h-4 w-4 rounded border-gray-300 text-[#588157] focus:ring-[#588157]"
                              />
                              <div>
                                <div className="text-sm font-semibold text-stone-800">{submission.email}</div>
                                <div className="text-xs text-stone-500">
                                  Status: {submission.status}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedCandidates.size > 0 && (
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={handleSendEmail}
                          className="rounded-full bg-[#588157] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#344e41]"
                        >
                          Send Email ({selectedCandidates.size})
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-[20px] bg-white p-8 text-center ring-1 ring-plum/10">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto h-12 w-12 text-stone-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-4 text-sm font-medium text-stone-500">Select a job to view candidates</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default EmailSequencesPage;
