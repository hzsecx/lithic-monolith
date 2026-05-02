import React from 'react';
import { motion } from 'framer-motion';
import { X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COLOR_OPTIONS = [
  { id: 'white', label: 'White', color: '#F5F5F0' },
  { id: 'grey', label: 'Grey', color: '#8E8E8E' },
  { id: 'black', label: 'Black', color: '#1A1A1A' },
  { id: 'beige', label: 'Beige', color: '#D4C5A9' },
  { id: 'green', label: 'Green', color: '#4A5D4E' },
  { id: 'brown', label: 'Brown', color: '#6B4226' },
  { id: 'blue', label: 'Blue', color: '#4A6B7C' },
  { id: 'pink', label: 'Pink', color: '#C4A0A0' },
  { id: 'red', label: 'Red', color: '#8B3A3A' },
  { id: 'gold', label: 'Gold', color: '#B8960C' },
];

const ORIGINS = ['Italy', 'Turkey', 'Spain', 'Greece', 'Brazil', 'India', 'Portugal', 'Egypt'];
const FINISHES = [
  { id: 'polished', label: 'Polished' },
  { id: 'honed', label: 'Honed' },
  { id: 'leathered', label: 'Leathered' },
  { id: 'brushed', label: 'Brushed' },
  { id: 'tumbled', label: 'Tumbled' },
];
const PATTERNS = [
  { id: 'minimal', label: 'Minimal' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'high_movement', label: 'High Movement' },
];
const CATEGORIES = [
  { id: 'slab', label: 'Slab' },
  { id: 'tile', label: 'Tile' },
  { id: 'block', label: 'Block' },
  { id: 'countertop', label: 'Countertop' },
  { id: 'mosaic', label: 'Mosaic' },
];

export default function FilterSidebar({ filters, setFilters, onClose, isMobile, dark }) {
  const updateFilter = (key, value) => {
    setFilters(prev => {
      const current = prev[key];
      if (Array.isArray(current)) {
        return {
          ...prev,
          [key]: current.includes(value) ? current.filter(v => v !== value) : [...current, value]
        };
      }
      return { ...prev, [key]: prev[key] === value ? null : value };
    });
  };

  const clearFilters = () => {
    setFilters({ colors: [], origins: [], finishes: [], patterns: [], categories: [], priceRange: null });
  };

  const activeCount = Object.values(filters).reduce((count, val) => {
    if (Array.isArray(val)) return count + val.length;
    return val ? count + 1 : count;
  }, 0);

  const textColor = dark ? 'rgba(255,255,255,0.8)' : undefined;
  const mutedColor = dark ? 'rgba(255,255,255,0.4)' : undefined;
  const pillBase = dark
    ? 'border border-white/15 text-white/60 hover:border-white/40 hover:text-white/90 text-xs px-2.5 py-1 rounded-full transition-all'
    : 'border border-border text-xs px-3 py-1.5 rounded-full transition-all hover:border-foreground/50';
  const pillActive = dark
    ? 'border border-white/50 bg-white/10 text-white text-xs px-2.5 py-1 rounded-full transition-all'
    : 'bg-foreground text-background border-foreground text-xs px-3 py-1.5 rounded-full';

  const Wrapper = isMobile ? motion.div : 'div';
  const wrapperProps = isMobile ? {
    initial: { x: -320 },
    animate: { x: 0 },
    exit: { x: -320 },
    className: "fixed inset-0 z-50 overflow-y-auto",
    style: { backgroundColor: '#0D1B2A' }
  } : {
    className: "h-fit"
  };

  const sectionLabel = {
    fontSize: '10px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: dark ? 'rgba(255,255,255,0.35)' : undefined,
    marginBottom: '10px',
    display: 'block',
  };

  return (
    <Wrapper {...wrapperProps}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: mutedColor }} />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: textColor }}>
              Filters
            </span>
            {activeCount > 0 && (
              <span
                className="text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold"
                style={{ backgroundColor: '#C9A96E', color: '#0D1B2A' }}
              >
                {activeCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-[10px] tracking-wider uppercase"
                style={{ color: mutedColor }}
              >
                Clear
              </button>
            )}
            {isMobile && (
              <button onClick={onClose} style={{ color: textColor }}>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Color Family */}
        <div className="mb-6">
          <span style={sectionLabel}>Color Family</span>
          <div className="grid grid-cols-5 gap-1.5">
            {COLOR_OPTIONS.map(c => (
              <button
                key={c.id}
                onClick={() => updateFilter('colors', c.id)}
                className="flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all"
                style={{
                  backgroundColor: filters.colors?.includes(c.id)
                    ? (dark ? 'rgba(255,255,255,0.1)' : undefined)
                    : 'transparent',
                  outline: filters.colors?.includes(c.id) ? '1px solid rgba(201,169,110,0.6)' : 'none',
                }}
              >
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: c.color, border: '1px solid rgba(255,255,255,0.2)' }}
                />
                <span className="text-[9px]" style={{ color: mutedColor }}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mb-6" style={{ height: '1px', backgroundColor: dark ? 'rgba(255,255,255,0.07)' : undefined }} />

        {/* Category */}
        <div className="mb-6">
          <span style={sectionLabel}>Category</span>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => updateFilter('categories', cat.id)}
                className={filters.categories?.includes(cat.id) ? pillActive : pillBase}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Origin */}
        <div className="mb-6">
          <span style={sectionLabel}>Origin</span>
          <div className="flex flex-wrap gap-1.5">
            {ORIGINS.map(origin => (
              <button
                key={origin}
                onClick={() => updateFilter('origins', origin)}
                className={filters.origins?.includes(origin) ? pillActive : pillBase}
              >
                {origin}
              </button>
            ))}
          </div>
        </div>

        {/* Surface Finish */}
        <div className="mb-6">
          <span style={sectionLabel}>Surface Finish</span>
          <div className="flex flex-wrap gap-1.5">
            {FINISHES.map(f => (
              <button
                key={f.id}
                onClick={() => updateFilter('finishes', f.id)}
                className={filters.finishes?.includes(f.id) ? pillActive : pillBase}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pattern Density */}
        <div className="mb-6">
          <span style={sectionLabel}>Pattern Density</span>
          <div className="flex flex-wrap gap-1.5">
            {PATTERNS.map(p => (
              <button
                key={p.id}
                onClick={() => updateFilter('patterns', p.id)}
                className={filters.patterns?.includes(p.id) ? pillActive : pillBase}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {isMobile && (
          <Button
            onClick={onClose}
            className="w-full mt-4"
            style={{ backgroundColor: '#C9A96E', color: '#0D1B2A' }}
          >
            Show Results
          </Button>
        )}
      </div>
    </Wrapper>
  );
}