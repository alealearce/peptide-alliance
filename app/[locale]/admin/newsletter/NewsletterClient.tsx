'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Draft {
  id: string;
  subject_en: string;
  body_en: string;
  subject_es: string;
  body_es: string;
  approval_token: string;
  status: string;
  subscriber_count: number;
  created_at: string;
}

interface Props {
  draft: Draft | null;
  subscriberCount: number;
  sentCount: number | null;
  errorCode: string | null;
}

const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

export default function NewsletterClient({ draft, subscriberCount, sentCount, errorCode }: Props) {
  const router  = useRouter();
  const now     = new Date();
  const monthEN = MONTHS_EN[now.getMonth()];
  const monthES = MONTHS_ES[now.getMonth()];
  const year    = now.getFullYear();

  // Editor state
  const [editTab,    setEditTab]    = useState<'en' | 'es'>('en');
  const [subjectEn,  setSubjectEn]  = useState(draft?.subject_en ?? '');
  const [bodyEn,     setBodyEn]     = useState(draft?.body_en ?? '');
  const [subjectEs,  setSubjectEs]  = useState(draft?.subject_es ?? '');
  const [bodyEs,     setBodyEs]     = useState(draft?.body_es ?? '');
  const [previewLang, setPreviewLang] = useState<'en' | 'es'>('en');
  const [sending,    setSending]    = useState(false);

  // Computed values for the active edit tab
  const activeSubject    = editTab === 'en' ? subjectEn  : subjectEs;
  const setActiveSubject = editTab === 'en' ? setSubjectEn : setSubjectEs;
  const activeBody       = editTab === 'en' ? bodyEn     : bodyEs;
  const setActiveBody    = editTab === 'en' ? setBodyEn  : setBodyEs;

  // Computed values for the preview panel
  const previewSubject = previewLang === 'en' ? subjectEn : subjectEs;
  const previewBody    = previewLang === 'en' ? bodyEn    : bodyEs;
  const previewMonth   = previewLang === 'en' ? monthEN   : monthES;

  // ── Approve & Send ─────────────────────────────────────────────────────────
  async function handleApprove() {
    if (!draft) return;
    if (!confirm(`Send newsletter to ${subscriberCount} subscribers? This cannot be undone.`)) return;

    setSending(true);
    try {
      const res = await fetch('/api/newsletter/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token:      draft.approval_token,
          subject_en: subjectEn,
          body_en:    bodyEn,
          subject_es: subjectEs,
          body_es:    bodyEs,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/en/admin/newsletter?sent=${data.sent}`);
      } else {
        alert('Error sending newsletter: ' + (data.error ?? 'Unknown error'));
      }
    } catch {
      alert('Network error — please try again.');
    } finally {
      setSending(false);
    }
  }

  // ── Success screen ─────────────────────────────────────────────────────────
  if (sentCount !== null) {
    return (
      <div className="max-w-lg mx-auto py-24 px-4 text-center">
        <h1 className="text-3xl font-bold text-text mb-3">Newsletter Sent!</h1>
        <p className="text-muted text-lg mb-8">
          Successfully delivered to <strong className="text-text">{sentCount}</strong> subscribers.
        </p>
        <a
          href="/admin"
          className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition"
        >
          ← Back to Admin Dashboard
        </a>
      </div>
    );
  }

  // ── No pending draft screen ───────────────────────────────────────────────
  if (!draft) {
    return (
      <div className="max-w-lg mx-auto py-24 px-4 text-center">
        <div className="text-7xl mb-6">📭</div>
        <h1 className="text-3xl font-bold text-text mb-3">No Pending Newsletter</h1>
        <p className="text-muted text-base mb-2">
          A draft is automatically generated on the <strong>12th of each month</strong> and emailed to you for review.
        </p>
        <p className="text-muted text-sm mb-10">
          Once the draft is ready you&apos;ll receive a preview email with links to approve or edit it here.
        </p>
        <a
          href="/admin"
          className="inline-block text-primary underline underline-offset-2 font-semibold"
        >
          ← Back to Admin Dashboard
        </a>
      </div>
    );
  }

  // ── Error banner ──────────────────────────────────────────────────────────
  const errorMessage =
    errorCode === 'invalid-token' ? 'That approval link is invalid or the newsletter was already sent.' :
    errorCode === 'send-failed'   ? 'Something went wrong while sending. Please try the Approve & Send button below.' :
    errorCode === 'missing-token' ? 'Missing approval token.' :
    errorCode               ? 'An unexpected error occurred.' : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <a href="/admin" className="text-sm text-muted hover:text-primary transition-colors">
          ← Admin
        </a>
        <span className="text-muted">/</span>
        <h1 className="text-2xl font-bold text-text">Newsletter Editor</h1>
        <span className="ml-auto text-sm text-muted bg-surface px-3 py-1 rounded-full border border-border">
          {subscriberCount} subscribers
        </span>
      </div>

      {/* Error banner */}
      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">

        {/* ── Editor panel ──────────────────────────────────────────────── */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">
              Draft generated{' '}
              {new Date(draft.created_at).toLocaleDateString('en-CA', {
                month: 'long', day: 'numeric',
              })}
            </p>

            {/* Language tabs */}
            <div className="flex gap-1 bg-surface rounded-xl p-1 border border-border">
              <button
                onClick={() => setEditTab('en')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  editTab === 'en' ? 'bg-white shadow text-primary' : 'text-muted hover:text-primary'
                }`}
              >
                🇨🇦 English
              </button>
              <button
                onClick={() => setEditTab('es')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  editTab === 'es' ? 'bg-white shadow text-primary' : 'text-muted hover:text-primary'
                }`}
              >
                🌎 Español
              </button>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-text mb-1.5">
              Subject line
            </label>
            <input
              type="text"
              value={activeSubject}
              onChange={(e) => setActiveSubject(e.target.value)}
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              placeholder="Email subject…"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-semibold text-text mb-1.5">
              Body
            </label>
            <textarea
              value={activeBody}
              onChange={(e) => setActiveBody(e.target.value)}
              rows={18}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono leading-relaxed resize-none transition"
              placeholder="Newsletter body…"
            />
            <p className="text-xs text-muted mt-1">
              Each blank line becomes a paragraph break in the email.
            </p>
          </div>

          {/* Approve button */}
          <div className="pt-2 border-t border-border">
            <button
              onClick={handleApprove}
              disabled={sending}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors text-base flex items-center justify-center gap-2"
            >
              {sending
                ? 'Sending…'
                : `Approve & Send to ${subscriberCount} subscribers`}
            </button>
            <p className="text-xs text-muted text-center mt-2">
              Sends both the English and Spanish versions to the matching subscribers.
            </p>
          </div>
        </div>

        {/* ── Preview panel ──────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-text">Live Preview</span>
            <div className="flex gap-1 bg-surface rounded-xl p-1 border border-border">
              <button
                onClick={() => setPreviewLang('en')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  previewLang === 'en' ? 'bg-white shadow text-primary' : 'text-muted hover:text-primary'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setPreviewLang('es')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  previewLang === 'es' ? 'bg-white shadow text-primary' : 'text-muted hover:text-primary'
                }`}
              >
                ES
              </button>
            </div>
          </div>

          {/* Email client mock */}
          <div className="border border-border rounded-xl overflow-hidden shadow-sm">
            {/* Mock email header bar */}
            <div className="bg-gray-100 border-b border-border px-4 py-2.5 space-y-0.5">
              <p className="text-xs text-muted">
                <span className="font-semibold text-gray-600">From:</span> hi@peptidealliance.io
              </p>
              <p className="text-xs text-muted truncate">
                <span className="font-semibold text-gray-600">Subject:</span>{' '}
                {previewSubject || <em className="opacity-50">No subject</em>}
              </p>
            </div>

            {/* Email body */}
            <div className="bg-white p-5 overflow-y-auto max-h-[600px]">
              <h2 style={{ color: '#2B5EBE', marginBottom: 14, fontSize: 19, fontWeight: 700 }}>
                Peptide Alliance — {previewMonth} {year}
              </h2>

              {previewBody
                ? previewBody.split('\n').map((line, i) =>
                    line.trim()
                      ? <p key={i} style={{ marginBottom: 12, fontSize: 14, color: '#374151', lineHeight: 1.65 }}>{line}</p>
                      : null
                  )
                : <p style={{ color: '#9ca3af', fontSize: 14 }}>Start typing to see the preview…</p>
              }

              <div style={{ margin: '24px 0' }}>
                <span style={{
                  display: 'inline-block',
                  background: '#2B5EBE',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 14,
                }}>
                  {previewLang === 'es' ? 'Explore Peptide Alliance →' : 'Explore Peptide Alliance →'}
                </span>
              </div>

              <p style={{ color: '#9CA3AF', fontSize: 11, borderTop: '1px solid #e5e7eb', paddingTop: 12 }}>
                Peptide Alliance —{' '}
                The Standard in Regenerative Health
                <br />
                <span style={{ color: '#d1d5db' }}>
                  {previewLang === 'es' ? 'Cancelar suscripción' : 'Unsubscribe'}
                </span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
