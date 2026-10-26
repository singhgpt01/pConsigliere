import React, { useState, useEffect } from 'react';
import { addCommodity, updateCommodity, type AdminCommodity } from '../../services/commodityService';
import type { CommodityCategoryType, CommoditySpec } from '../../data/commodities';
import { Layers, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface CommodityFormProps {
  onCommoditySaved: () => void;
  editingCommodity: AdminCommodity | null;
  onCancel: () => void;
}

export const CommodityForm: React.FC<CommodityFormProps> = ({
  onCommoditySaved,
  editingCommodity,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CommodityCategoryType>('energy');
  const [tagline, setTagline] = useState('');
  const [overview, setOverview] = useState('');
  const [availabilityNote, setAvailabilityNote] = useState('');
  const [featured, setFeatured] = useState(false);
  const [specs, setSpecs] = useState<CommoditySpec[]>([
    { label: 'Standard', val: '' },
    { label: 'Terms Handled', val: 'CIF / FOB' }
  ]);

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (editingCommodity) {
      setName(editingCommodity.name || '');
      setCategory(editingCommodity.category || 'energy');
      setTagline(editingCommodity.tagline || '');
      setOverview(editingCommodity.overview || '');
      setAvailabilityNote(editingCommodity.availabilityNote || '');
      setFeatured(Boolean(editingCommodity.featured));
      setSpecs(editingCommodity.specs && editingCommodity.specs.length > 0 ? [...editingCommodity.specs] : [
        { label: 'Standard', val: '' }
      ]);
      setStatus('idle');
      setErrorMessage('');
    } else {
      setName('');
      setCategory('energy');
      setTagline('');
      setOverview('');
      setAvailabilityNote('');
      setFeatured(false);
      setSpecs([
        { label: 'Standard', val: '' },
        { label: 'Terms Handled', val: 'CIF / FOB' }
      ]);
      setStatus('idle');
      setErrorMessage('');
    }
  }, [editingCommodity]);

  const handleAddSpec = () => {
    setSpecs(prev => [...prev, { label: '', val: '' }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(prev => prev.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'label' | 'val', value: string) => {
    setSpecs(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Commodity Name is required.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    const categoryLabels: Record<CommodityCategoryType, string> = {
      energy: 'Energy',
      industrial: 'Industrial',
      agriculture: 'Agriculture'
    };

    const cleanSpecs = specs.filter(s => s.label.trim() && s.val.trim());

    const commodityPayload = {
      name: name.trim(),
      category,
      categoryLabel: categoryLabels[category],
      tagline: tagline.trim(),
      overview: overview.trim(),
      availabilityNote: availabilityNote.trim() || 'Subject to verified refinery allocation and counterparty due diligence.',
      featured,
      specs: cleanSpecs
    };

    try {
      if (editingCommodity) {
        await updateCommodity(editingCommodity.id, commodityPayload);
      } else {
        await addCommodity(commodityPayload);
      }
      setStatus('success');
      setTimeout(() => {
        onCommoditySaved();
      }, 500);
    } catch (err: any) {
      console.error('[CommodityForm] Save failed:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Failed to save commodity. Check permissions.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      {errorMessage && (
        <div className="security-header" style={{ marginBottom: '1rem', color: 'var(--adm-del)' }}>
          <AlertCircle size={14} />
          <span>{errorMessage}</span>
        </div>
      )}

      {status === 'success' && (
        <div className="security-header" style={{ marginBottom: '1rem', color: 'var(--adm-new-t)' }}>
          <CheckCircle2 size={14} />
          <span>Commodity saved successfully!</span>
        </div>
      )}

      {/* Commodity Name */}
      <div className="form-group mb-2">
        <label className="section-title-xs">COMMODITY NAME</label>
        <input
          type="text"
          placeholder="e.g. EN590 10 PPM Ultra-Low-Sulphur Diesel"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="modern-input"
        />
      </div>

      {/* Category */}
      <div className="form-group mb-2">
        <label className="section-title-xs">MARKET DIVISION / CATEGORY</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value as CommodityCategoryType)}
          className="modern-input"
          style={{ height: '42px', cursor: 'pointer' }}
        >
          <option value="energy">Energy Division (Refined Fuels, LNG, Crude)</option>
          <option value="industrial">Industrial Division (Urea, Sulphur)</option>
          <option value="agriculture">Agricultural Division (Sugar, Wheat, Corn)</option>
        </select>
      </div>

      {/* Tagline */}
      <div className="form-group mb-2">
        <label className="section-title-xs">COMMERCIAL SPECIFICATION TAGLINE</label>
        <input
          type="text"
          placeholder="e.g. Refined Automotive Gasoil (Euro 5/6 Standard)"
          value={tagline}
          onChange={e => setTagline(e.target.value)}
          className="modern-input"
        />
      </div>

      {/* Overview */}
      <div className="form-group mb-2">
        <label className="section-title-xs">COMMERCIAL OVERVIEW</label>
        <textarea
          rows={3}
          placeholder="Facilitating supply relationships for high-specification automotive gasoil..."
          value={overview}
          onChange={e => setOverview(e.target.value)}
          className="modern-textarea"
        />
      </div>

      {/* Availability Note */}
      <div className="form-group mb-3">
        <label className="section-title-xs">ALLOCATION & AVAILABILITY PROTOCOL</label>
        <input
          type="text"
          placeholder="Subject to verified refinery allocation and counterparty due diligence."
          value={availabilityNote}
          onChange={e => setAvailabilityNote(e.target.value)}
          className="modern-input"
        />
      </div>

      {/* Featured Checkbox */}
      <div className="form-group mb-3" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <input
          type="checkbox"
          id="featuredToggle"
          checked={featured}
          onChange={e => setFeatured(e.target.checked)}
          style={{ cursor: 'pointer', width: '16px', height: '16px' }}
        />
        <label htmlFor="featuredToggle" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--adm-text)', cursor: 'pointer' }}>
          Display as Featured Commodity on Homepage Hero
        </label>
      </div>

      {/* Dynamic Key Specs */}
      <div className="form-group mb-4">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label className="section-title-xs" style={{ margin: 0 }}>
            <Layers size={14} /> KEY SPECIFICATIONS & TERMS
          </label>
          <button
            type="button"
            onClick={handleAddSpec}
            className="action-btn-pro"
            style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <Plus size={12} /> ADD SPEC
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {specs.map((spec, index) => (
            <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Spec Label (e.g. Sulphur)"
                value={spec.label}
                onChange={e => handleSpecChange(index, 'label', e.target.value)}
                className="modern-input"
                style={{ flex: 1, margin: 0, padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
              />
              <input
                type="text"
                placeholder="Value (e.g. Max 10 PPM)"
                value={spec.val}
                onChange={e => handleSpecChange(index, 'val', e.target.value)}
                className="modern-input"
                style={{ flex: 1.5, margin: 0, padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
              />
              {specs.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(index)}
                  className="action-btn-pro delete"
                  style={{ padding: '0.4rem' }}
                  title="Remove spec"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="button-primary"
          style={{ flex: 1 }}
        >
          {status === 'submitting'
            ? 'SAVING...'
            : editingCommodity
            ? 'UPDATE COMMODITY'
            : 'PUBLISH COMMODITY'}
        </button>
        {editingCommodity && (
          <button
            type="button"
            onClick={onCancel}
            className="action-btn-pro"
            style={{ padding: '0.75rem 1rem' }}
          >
            CANCEL
          </button>
        )}
      </div>
    </form>
  );
};
