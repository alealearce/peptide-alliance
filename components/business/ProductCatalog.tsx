'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Package, Loader2, ExternalLink } from 'lucide-react';
import type { Product } from '@/lib/supabase/types';

interface Props {
  businessId: string;
}

const PRODUCT_TYPES = [
  { value: 'peptide', label: 'Peptide' },
  { value: 'supplement', label: 'Supplement' },
  { value: 'pharmaceutical', label: 'Pharmaceutical' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'service', label: 'Service' },
  { value: 'other', label: 'Other' },
];

const EMPTY_FORM = {
  sku: '',
  name: '',
  product_type: 'peptide',
  description: '',
  quantity_duration: '',
  price: '',
  product_url: '',
};

export function ProductCatalog({ businessId }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/business/products?businessId=${businessId}`)
      .then((r) => r.json())
      .then((d) => { setProducts(d.products ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [businessId]);

  const handleAdd = async () => {
    if (!form.name.trim()) { setError('Product name is required.'); return; }
    setError('');
    setAdding(true);

    const res = await fetch('/api/business/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_id: businessId,
        name: form.name.trim(),
        product_type: form.product_type,
        description: form.description.trim() || null,
        sku: form.sku.trim() || null,
        price: form.price ? parseFloat(form.price) : null,
        quantity_duration: form.quantity_duration.trim() || null,
        product_url: form.product_url.trim() || null,
      }),
    });

    const json = await res.json();
    if (!res.ok) { setError(json.error ?? 'Failed to add product.'); setAdding(false); return; }

    setProducts((prev) => [...prev, json.product]);
    setForm(EMPTY_FORM);
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/business/products/${id}`, { method: 'DELETE' });
    if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Package className="w-4 h-4 text-primary" />
        <h2 className="font-heading font-bold text-lg text-text">Product Catalog</h2>
      </div>
      <p className="text-xs text-muted">
        Add each product or service you offer. They&apos;ll appear on your public listing.
      </p>

      {/* Inline add form */}
      <div className="flex flex-wrap gap-2 items-end bg-bg border border-muted/15 rounded-xl p-3">
        {/* SKU */}
        <div className="flex flex-col gap-1 min-w-[80px]">
          <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">SKU</span>
          <input
            type="text"
            value={form.sku}
            onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
            placeholder="SKU-001"
            className="w-24 rounded-lg border border-muted/20 bg-white px-2.5 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Type */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">Type</span>
          <select
            value={form.product_type}
            onChange={(e) => setForm((f) => ({ ...f, product_type: e.target.value }))}
            className="rounded-lg border border-muted/20 bg-white px-2.5 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {PRODUCT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
          <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">Product / Service Name *</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="BPC-157 Injectable"
            className="w-full rounded-lg border border-muted/20 bg-white px-2.5 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
          <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">Description</span>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Research-grade, lyophilized..."
            className="w-full rounded-lg border border-muted/20 bg-white px-2.5 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Quantity / Duration */}
        <div className="flex flex-col gap-1 min-w-[120px]">
          <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">Qty / Duration</span>
          <input
            type="text"
            value={form.quantity_duration}
            onChange={(e) => setForm((f) => ({ ...f, quantity_duration: e.target.value }))}
            placeholder="30 days / 5mg vial"
            className="w-36 rounded-lg border border-muted/20 bg-white px-2.5 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1 min-w-[90px]">
          <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">Price ($)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            placeholder="49.99"
            className="w-24 rounded-lg border border-muted/20 bg-white px-2.5 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Product URL */}
        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">Product URL</span>
          <input
            type="url"
            value={form.product_url}
            onChange={(e) => setForm((f) => ({ ...f, product_url: e.target.value }))}
            placeholder="https://yoursite.com/product"
            className="w-full rounded-lg border border-muted/20 bg-white px-2.5 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* ADD button */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={adding}
          className="self-end flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          ADD
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Product list */}
      {loading ? (
        <p className="text-sm text-muted text-center py-4">Loading…</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-muted text-center py-4">No products added yet. Use the form above to add your first product.</p>
      ) : (
        <div className="divide-y divide-muted/10 rounded-xl border border-muted/15 overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-[60px_80px_1fr_1fr_120px_80px_80px_40px] gap-3 px-4 py-2 bg-bg">
            {['SKU', 'Type', 'Name', 'Description', 'Qty / Duration', 'Price', 'URL', ''].map((h) => (
              <span key={h} className="text-[10px] font-semibold text-muted uppercase tracking-wide">{h}</span>
            ))}
          </div>
          {products.map((p) => (
            <div key={p.id} className="grid grid-cols-[60px_80px_1fr_1fr_120px_80px_80px_40px] gap-3 px-4 py-3 bg-white items-center">
              <span className="text-xs text-muted font-mono truncate">{p.sku || '—'}</span>
              <span className="text-xs text-muted capitalize">{p.product_type}</span>
              <span className="text-sm font-medium text-text truncate">{p.name}</span>
              <span className="text-xs text-muted truncate">{p.description || '—'}</span>
              <span className="text-xs text-muted truncate">{p.quantity_duration || '—'}</span>
              <span className="text-sm font-semibold text-text">
                {p.price != null ? `$${Number(p.price).toFixed(2)}` : '—'}
              </span>
              <span className="text-xs">
                {p.product_url
                  ? <a href={p.product_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3" />Link</a>
                  : <span className="text-muted">—</span>
                }
              </span>
              <button
                type="button"
                onClick={() => handleDelete(p.id)}
                className="text-muted hover:text-red-500 transition-colors"
                title="Remove product"
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
