import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useFormsBackNav } from '../hooks/useFormsBackNav';
import { listForms, listSubmissions, sendEmail } from '../services/api';

const isWorkspace = window.location.pathname.startsWith('/workspace');
const basePath = isWorkspace ? '/workspace' : '/hr';

const EMAIL_TEMPLATES = {
  INTERVIEW: {
    name: 'interview',
    label: 'Interview Invitation',
    subject: 'Interview Invitation',
  },
  REJECTION: {
    name: 'rejection',
    label: 'Rejection',
    subject: 'Update regarding your application',
  },
};

function CandidateEmailPage() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const backTo = useFormsBackNav();
  const [form, setForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState(new Set());
  const [emailType, setEmailType] = useState('INTERVIEW');
  const [previewMode, setPreviewMode] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const [emailContext, setEmailContext] = useState({
    candidateName: '',
    jobTitle: '',
    companyName: 'HiOring',
    senderName: '',
    senderTitle: 'HR Team',
    officeAddress: '',
    mapLink: '',
    scheduleLink: '',
  });

  const load = async () => {
    if (!formId) return;
    setLoading(true);
    setError(null);
    try {
      const [formData, submissionsData] = await Promise.all([
        listForms().then(forms => forms.find(f => f.id === formId)),
        listSubmissions(formId),
      ]);
      setForm(formData);
      setSubmissions(Array.isArray(submissionsData) ? submissionsData : []);
    } catch (err) {
      setError(err.message || 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [formId]);

  useEffect(() => {
    if (location.state?.selectedCandidates && submissions.length > 0) {
      const selectedIds = location.state.selectedCandidates;
      const selectedSet = new Set(selectedIds);
      setSelectedCandidates(selectedSet);
      
      const firstSelected = submissions.find(s => selectedIds.includes(s.id));
      if (firstSelected) {
        setSelectedCandidate(firstSelected);
        setEmailContext(prev => ({
          ...prev,
          candidateName: firstSelected.email?.split('@')[0] || 'Candidate',
          jobTitle: form?.title || 'Position',
        }));
      }
    }
    if (location.state?.emailType) {
      setEmailType(location.state.emailType);
    }
  }, [location.state, submissions, form]);

  const handleCandidateSelect = (candidate) => {
    setSelectedCandidate(candidate);
    setSelectedCandidates(new Set([candidate.id]));
    setEmailContext(prev => ({
      ...prev,
      candidateName: candidate.email?.split('@')[0] || 'Candidate',
      jobTitle: form?.title || 'Position',
    }));
    setPreviewMode(false);
  };

  const handleCandidateToggle = (candidateId) => {
    setSelectedCandidates((prev) => {
      const next = new Set(prev);
      if (next.has(candidateId)) {
        next.delete(candidateId);
        if (next.size === 0) setSelectedCandidate(null);
      } else {
        next.add(candidateId);
        const candidate = submissions.find(s => s.id === candidateId);
        if (candidate) setSelectedCandidate(candidate);
      }
      return next;
    });
    setPreviewMode(false);
  };

  const handleEmailTypeChange = (type) => {
    setEmailType(type);
    setPreviewMode(false);
  };

  const handlePreview = () => {
    const candidatesToPreview = selectedCandidates.size > 0 
      ? Array.from(selectedCandidates).map(id => submissions.find(s => s.id === id)).filter(Boolean)
      : (selectedCandidate ? [selectedCandidate] : []);

    if (candidatesToPreview.length === 0) {
      setError('Please select at least one candidate first.');
      return;
    }
    setPreviewMode(true);
    setError(null);
  };

  const handleSend = async () => {
    const candidatesToSend = selectedCandidates.size > 0 
      ? Array.from(selectedCandidates).map(id => submissions.find(s => s.id === id)).filter(Boolean)
      : (selectedCandidate ? [selectedCandidate] : []);

    if (candidatesToSend.length === 0) {
      setError('Please select at least one candidate.');
      return;
    }

    setSending(true);
    setError(null);
    try {
      const template = EMAIL_TEMPLATES[emailType];
      
      for (const candidate of candidatesToSend) {
        const candidateContext = {
          ...emailContext,
          candidateName: candidate.email?.split('@')[0] || 'Candidate',
        };
        await sendEmail(
          candidate.email,
          template.subject,
          template.name,
          candidateContext
        );
      }
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedCandidate(null);
        setSelectedCandidates(new Set());
        setPreviewMode(false);
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to send email.');
    } finally {
      setSending(false);
    }
  };

  const renderEmailPreview = () => {
    const template = EMAIL_TEMPLATES[emailType];
    const previewCandidate = selectedCandidate || (selectedCandidates.size > 0 ? submissions.find(s => selectedCandidates.has(s.id)) : null);
    const candidateName = previewCandidate?.email?.split('@')[0] || emailContext.candidateName || 'Candidate';
    
    if (emailType === 'INTERVIEW') {
      return (
        <div className="rounded-[16px] bg-white p-6 ring-1 ring-plum/10">
          <h3 className="mb-4 text-lg font-bold text-plum">Email Preview</h3>
          <div className="mb-4 rounded-lg bg-gray-50 p-4 text-sm">
            <p><strong>To:</strong> {selectedCandidates.size > 1 ? `${selectedCandidates.size} recipients` : previewCandidate?.email}</p>
            <p><strong>Subject:</strong> {template.subject}</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-700">
            <p>Hello {candidateName},</p>
            <p className="mt-2">We are excited to invite you to an in-person interview for the <strong>{emailContext.jobTitle}</strong> position at <strong>{emailContext.companyName}</strong>.</p>
            <div className="mt-4 rounded bg-gray-50 p-3">
              <p><strong>Location:</strong></p>
              <p>{emailContext.companyName} Office</p>
              <p>{emailContext.officeAddress || 'Address to be confirmed'}</p>
            </div>
            <p className="mt-4">We have multiple interview times available. Please click the link below to select a time that works best for you:</p>
            <div className="mt-4">
              <a href={emailContext.scheduleLink || '#'} className="inline-block rounded bg-plum px-4 py-2 text-white">
                Schedule Your Interview
              </a>
            </div>
            <p className="mt-4">We look forward to meeting you in person!</p>
            <div className="mt-6 border-t pt-4">
              <p>Best regards,</p>
              <p><strong>{emailContext.senderName || 'HR Team'}</strong></p>
              <p>{emailContext.senderTitle}, {emailContext.companyName}</p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="rounded-[16px] bg-white p-6 ring-1 ring-plum/10">
          <h3 className="mb-4 text-lg font-bold text-plum">Email Preview</h3>
          <div className="mb-4 rounded-lg bg-gray-50 p-4 text-sm">
            <p><strong>To:</strong> {selectedCandidates.size > 1 ? `${selectedCandidates.size} recipients` : previewCandidate?.email}</p>
            <p><strong>Subject:</strong> {template.subject}</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-700">
            <p>Hi {candidateName},</p>
            <p className="mt-2">Thank you for taking the time to apply for the <strong>{emailContext.jobTitle}</strong> position at <strong>{emailContext.companyName}</strong>. It was a pleasure getting to know you and learning more about your background.</p>
            <p className="mt-4">While we were genuinely impressed by your skills, we have decided to move forward with another candidate whose experience more closely matches our current needs for this role.</p>
            <p className="mt-4">We deeply appreciate the effort you put into the interview process and your interest in joining our team. We wish you the absolute best in your career and future job search.</p>
            <div className="mt-6 border-t pt-4">
              <p>Best regards,</p>
              <p><strong>{emailContext.senderName || 'HR Team'}</strong></p>
              <p>{emailContext.senderTitle}, {emailContext.companyName}</p>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f2efe7] font-sans text-stone-800 antialiased">
      <header className="sticky top-0 z-50 border-b border-plum/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
          <a href="!#" onClick={(e) => { e.preventDefault(); backTo(); }} className="flex items-center gap-2.5">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-teal">
              <span className="font-serif text-xl font-bold text-white">H</span>
              <span className="absolute -bottom-1 -left-1 h-2 w-2 rounded-sm bg-gold" />
            </span>
            <span className="text-xl font-bold tracking-tight text-plum">HiOring</span>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-medium text-stone-600 md:flex">
            <button
              type="button"
              onClick={backTo}
              className="rounded-full bg-plum px-5 py-2 text-sm font-semibold text-white transition hover:bg-plum-dark"
            >
              Back to dashboard
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-grow px-5 py-8 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(`${basePath}/forms/${formId}/submissions`)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-plum"
        >
          <span aria-hidden="true">&larr;</span> Back to submissions
        </button>

        {error && (
          <div className="mb-5 rounded-[20px] bg-red-100 px-5 py-4 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-[20px] bg-[#a7eda7] px-5 py-4 text-sm font-semibold text-[#0d6921]">
            Email sent successfully!
          </div>
        )}

        {loading && (
          <div className="rounded-[20px] bg-white/60 px-5 py-6 text-sm text-stone-500 ring-1 ring-plum/10">
            Loading candidates...
          </div>
        )}

        {!loading && form && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[20px] bg-[#f2efe7] p-5 ring-1 ring-plum/10 sm:p-8">
              <h2 className="text-2xl font-bold tracking-tight text-plum">Send Email to Candidate</h2>
              <p className="mt-1 text-sm text-stone-500">{form.title}</p>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold text-plum">Select Candidates</label>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-stone-500">
                    {selectedCandidates.size > 0 ? `${selectedCandidates.size} selected` : 'Select candidates to email'}
                  </span>
                  {submissions.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedCandidates.size === submissions.length) {
                          setSelectedCandidates(new Set());
                          setSelectedCandidate(null);
                        } else {
                          const allIds = new Set(submissions.map(s => s.id));
                          setSelectedCandidates(allIds);
                          setSelectedCandidate(submissions[0]);
                        }
                      }}
                      className="text-xs font-semibold text-[#588157] hover:text-[#344e41]"
                    >
                      {selectedCandidates.size === submissions.length ? 'Deselect All' : 'Select All'}
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto rounded-[16px] bg-white/70 ring-1 ring-plum/10">
                  {submissions.length === 0 ? (
                    <p className="p-4 text-center text-sm text-stone-500">No candidates available</p>
                  ) : (
                    submissions.map((submission) => (
                      <button
                        key={submission.id}
                        type="button"
                        onClick={() => handleCandidateToggle(submission.id)}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-plum/5 ${
                          selectedCandidates.has(submission.id) ? 'bg-plum/10 font-semibold text-plum' : 'text-stone-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCandidates.has(submission.id)}
                          onChange={() => handleCandidateToggle(submission.id)}
                          className="h-4 w-4 rounded border-gray-300 text-[#588157] focus:ring-[#588157]"
                        />
                        {submission.email}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold text-plum">Email Type</label>
                <div className="flex gap-3">
                  {Object.entries(EMAIL_TEMPLATES).map(([key, template]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleEmailTypeChange(key)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        emailType === key
                          ? 'bg-plum text-white'
                          : 'bg-white/70 text-stone-700 ring-1 ring-plum/10 hover:bg-plum/5'
                      }`}
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-plum">Sender Name</label>
                  <input
                    type="text"
                    value={emailContext.senderName}
                    onChange={(e) => setEmailContext({ ...emailContext, senderName: e.target.value })}
                    className="w-full rounded-[12px] border border-plum/20 bg-white px-4 py-2 text-sm text-stone-800 outline-none transition focus:border-plum focus:ring-2 focus:ring-plum/20"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-plum">Company Name</label>
                  <input
                    type="text"
                    value={emailContext.companyName}
                    onChange={(e) => setEmailContext({ ...emailContext, companyName: e.target.value })}
                    className="w-full rounded-[12px] border border-plum/20 bg-white px-4 py-2 text-sm text-stone-800 outline-none transition focus:border-plum focus:ring-2 focus:ring-plum/20"
                    placeholder="Company name"
                  />
                </div>
                {emailType === 'INTERVIEW' && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-plum">Office Address</label>
                      <input
                        type="text"
                        value={emailContext.officeAddress}
                        onChange={(e) => setEmailContext({ ...emailContext, officeAddress: e.target.value })}
                        className="w-full rounded-[12px] border border-plum/20 bg-white px-4 py-2 text-sm text-stone-800 outline-none transition focus:border-plum focus:ring-2 focus:ring-plum/20"
                        placeholder="Office address"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-plum">Schedule Link</label>
                      <input
                        type="text"
                        value={emailContext.scheduleLink}
                        onChange={(e) => setEmailContext({ ...emailContext, scheduleLink: e.target.value })}
                        className="w-full rounded-[12px] border border-plum/20 bg-white px-4 py-2 text-sm text-stone-800 outline-none transition focus:border-plum focus:ring-2 focus:ring-plum/20"
                        placeholder="https://calendly.com/..."
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={!selectedCandidate}
                  className="flex-1 rounded-full border border-plum/30 px-4 py-2.5 text-sm font-semibold text-plum transition hover:bg-plum hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Preview Email
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={selectedCandidates.size === 0 && !selectedCandidate || sending}
                  className="flex-1 rounded-full bg-plum px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-plum-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending ? 'Sending...' : `Send Email (${selectedCandidates.size || (selectedCandidate ? 1 : 0)})`}
                </button>
              </div>
            </div>

            <div className="rounded-[20px] bg-[#f2efe7] p-5 ring-1 ring-plum/10 sm:p-8">
              {previewMode && selectedCandidate ? (
                renderEmailPreview()
              ) : (
                <div className="flex h-full items-center justify-center rounded-[16px] bg-white/70 p-8 text-center text-stone-500 ring-1 ring-plum/10">
                  <div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto h-12 w-12 text-plum/30">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-4 text-sm font-medium">Select a candidate and click "Preview Email" to see the email content</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CandidateEmailPage;
