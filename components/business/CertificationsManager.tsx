'use client';
import { useState, useEffect, useRef } from 'react';
import { Award, Trash2, Upload, FileText, CheckCircle, Clock, Loader2 } from 'lucide-react';
import type { Certification } from '@/lib/supabase/types';

interface Props {
  businessId: string;
}

const EMPTY_FORM = {
  name: '',
  issuing_body: '',
  expires_at: '',
};

export function CertificationsManager({ businessId }: Props) {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/business/certifications?businessId=${businessId}`)
      .then((r) => r.json())
      .then((d) => { setCerts(d.certifications ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [businessId]);

  const handleAdd = async () => {
    if (!form.name.trim()) { setError('Certification name is required.'); return; }
    setError('');
    setAdding(true);

    const fd = new FormData();
    fd.append('business_id', businessId);
    fd.append('name', form.name.trim());
    fd.append('issuing_body', form.issuing_body.trim());
    fd.append('expires_at', form.expires_at);
    if (file) fd.append('file', file);

    const res = await fetch('/api/business/certifications', { method: 'POST', body: fd });
    const json = await res.json();

    if (!res.ok) { setError(json.error ?? 'Failed to add certification.'); setAdding(false); return; }

    setCerts((prev) => [json.certification, ...prev]);
    setForm(EMPTY_FORM);
    setFile(null);
    if (fileRef.current) fileRef.current.value = '';
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/business/certifications/${id}`, { method: 'DELETE' });
    if (res.ok) setCerts((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Award className="w-4 h-4 text-gold" />
        <h2 className="font-heading font-bold text-lg text-text">Certifications</h2>
      </div>
      <p className="text-xs text-muted">
        Upload your GMP, ISO, FDA, or other certifications. Admin will verify them and boost your Trust Score.
      </p>

      {/* Add form */}
      <div className="space-y-3 bg-bg border border-muted/15 rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">Certification Name *</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="GMP Certified, ISO 9001, FDA Registered…"
              className="mt-1 w-full rounded-lg border border-muted/20 bg-white px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">Issuing Body</span>
            <input
              type="text"
              value={form.issuing_body}
              onChange={(e) => setForm((f) => ({ ...f, issuing_body: e.target.value }))}
              placeholder="FDA, NSF International, ISO…"
              className="mt-1 w-full rounded-lg border border-muted/20 bg-white px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">Expiry Date</span>
            <input
              type="date"
              value={form.expires_at}
              onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-muted/20 bg-white px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* File upload */}
          <div>
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">Certificate File (optional)</span>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
            {file ? (
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
                <FileText className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs text-text flex-1 truncate">{file.name}</span>
                <button type="button" onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ''; }} className="text-muted hover:text-red-500">×</button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-1 w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-muted/30 bg-white px-3 py-2 text-sm text-muted hover:border-primary/40 hover:text-primary transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload PDF or image
              </button>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="button"
          onClick={handleAdd}
          disabled={adding}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-3.5 h-3.5" />}
          ADD CERTIFICATION
        </button>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-sm text-muted text-center py-4">Loading…</p>
      ) : certs.length === 0 ? (
        <p className="text-sm text-muted text-center py-4">No certifications added yet.</p>
      ) : (
        <div className="space-y-2">
          {certs.map((c) => (
            <div key={c.id} className="flex items-start gap-3 rounded-xl border border-muted/15 bg-white px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-text">{c.name}</span>
                  {c.verified_by_admin ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                      <Clock className="w-3 h-3" /> Pending review
                    </span>
                  )}
                </div>
                {c.issuing_body && <p className="text-xs text-muted mt-0.5">{c.issuing_body}</p>}
                <div className="flex items-center gap-3 mt-1">
                  {c.expires_at && (
                    <span className="text-xs text-muted">Expires: {new Date(c.expires_at).toLocaleDateString()}</span>
                  )}
                  {c.certificate_url && (
                    <a href={c.certificate_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                      <FileText className="w-3 h-3" /> View file
                    </a>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(c.id)}
                className="text-muted hover:text-red-500 transition-colors shrink-0 mt-0.5"
                title="Remove certification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
