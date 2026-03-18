'use client';
import { useState, useEffect, useRef } from 'react';
import { FlaskConical, Trash2, Upload, FileText, CheckCircle, Clock, Loader2 } from 'lucide-react';
import type { LabResult } from '@/lib/supabase/types';

interface Props {
  businessId: string;
}

const TEST_TYPES = [
  { value: 'identity', label: 'Identity' },
  { value: 'purity', label: 'Purity' },
  { value: 'potency', label: 'Potency' },
  { value: 'sterility', label: 'Sterility' },
  { value: 'endotoxin', label: 'Endotoxin' },
  { value: 'heavy_metals', label: 'Heavy Metals' },
  { value: 'other', label: 'Other' },
];

const EMPTY_FORM = {
  product_name: '',
  test_type: 'purity',
  testing_lab: '',
  test_date: '',
  description: '',
};

export function LabResultsManager({ businessId }: Props) {
  const [results, setResults] = useState<LabResult[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/business/lab-results?businessId=${businessId}`)
      .then((r) => r.json())
      .then((d) => { setResults(d.lab_results ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [businessId]);

  const handleAdd = async () => {
    if (!form.test_type) { setError('Test type is required.'); return; }
    if (!file && !form.description.trim()) { setError('Upload a file or enter a description.'); return; }
    setError('');
    setAdding(true);

    const fd = new FormData();
    fd.append('business_id', businessId);
    fd.append('product_name', form.product_name.trim());
    fd.append('test_type', form.test_type);
    fd.append('testing_lab', form.testing_lab.trim());
    fd.append('test_date', form.test_date);
    fd.append('description', form.description.trim());
    if (file) fd.append('file', file);

    const res = await fetch('/api/business/lab-results', { method: 'POST', body: fd });
    const json = await res.json();

    if (!res.ok) { setError(json.error ?? 'Failed to add lab result.'); setAdding(false); return; }

    setResults((prev) => [json.lab_result, ...prev]);
    setForm(EMPTY_FORM);
    setFile(null);
    if (fileRef.current) fileRef.current.value = '';
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/business/lab-results/${id}`, { method: 'DELETE' });
    if (res.ok) setResults((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <FlaskConical className="w-4 h-4 text-sky" />
        <h2 className="font-heading font-bold text-lg text-text">Lab Results</h2>
      </div>
      <p className="text-xs text-muted">
        Add third-party lab test results. Upload a PDF/image or enter a description. Admin verification increases your Trust Score.
      </p>

      {/* Add form */}
      <div className="space-y-3 bg-bg border border-muted/15 rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">Product Name</span>
            <input
              type="text"
              value={form.product_name}
              onChange={(e) => setForm((f) => ({ ...f, product_name: e.target.value }))}
              placeholder="BPC-157, TB-500…"
              className="mt-1 w-full rounded-lg border border-muted/20 bg-white px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">Test Type *</span>
            <select
              value={form.test_type}
              onChange={(e) => setForm((f) => ({ ...f, test_type: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-muted/20 bg-white px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {TEST_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">Testing Lab</span>
            <input
              type="text"
              value={form.testing_lab}
              onChange={(e) => setForm((f) => ({ ...f, testing_lab: e.target.value }))}
              placeholder="Janssen Laboratories…"
              className="mt-1 w-full rounded-lg border border-muted/20 bg-white px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">Test Date</span>
            <input
              type="date"
              value={form.test_date}
              onChange={(e) => setForm((f) => ({ ...f, test_date: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-muted/20 bg-white px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Description — text-only option */}
        <div>
          <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">Description / Notes</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="e.g. 99.2% purity confirmed by HPLC. Certificate of Analysis available on request."
            rows={2}
            className="mt-1 w-full rounded-lg border border-muted/20 bg-white px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        {/* File upload */}
        <div>
          <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">Certificate of Analysis (PDF or image)</span>
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
              Upload CoA (PDF or image)
            </button>
          )}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="button"
          onClick={handleAdd}
          disabled={adding}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FlaskConical className="w-3.5 h-3.5" />}
          ADD LAB RESULT
        </button>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-sm text-muted text-center py-4">Loading…</p>
      ) : results.length === 0 ? (
        <p className="text-sm text-muted text-center py-4">No lab results added yet.</p>
      ) : (
        <div className="space-y-2">
          {results.map((r) => (
            <div key={r.id} className="flex items-start gap-3 rounded-xl border border-muted/15 bg-white px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-text capitalize">{r.test_type.replace('_', ' ')} Test</span>
                  {r.product_name && <span className="text-xs text-muted">— {r.product_name}</span>}
                  {r.verified_by_admin ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                      <Clock className="w-3 h-3" /> Pending review
                    </span>
                  )}
                </div>
                {r.testing_lab && <p className="text-xs text-muted mt-0.5">{r.testing_lab}</p>}
                {r.description && <p className="text-xs text-text/70 mt-1 bg-bg rounded-md px-2 py-1">{r.description}</p>}
                <div className="flex items-center gap-3 mt-1">
                  {r.test_date && (
                    <span className="text-xs text-muted">{new Date(r.test_date).toLocaleDateString()}</span>
                  )}
                  {r.result_url && (
                    <a href={r.result_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                      <FileText className="w-3 h-3" /> View CoA
                    </a>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(r.id)}
                className="text-muted hover:text-red-500 transition-colors shrink-0 mt-0.5"
                title="Remove lab result"
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
