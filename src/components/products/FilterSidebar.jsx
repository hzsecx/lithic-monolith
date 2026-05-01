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

export default function FilterSidebar({ filters, setFilters, onClose, isMobile }) {
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
    setFilters({
      colors: [],
      origins: [],
      finishes: [],
      patterns: [],
      categories: [],
      priceRange: null,
    });
  };

  const activeCount = Object.values(filters).reduce((count, val) => {
    if (Array.isArray(val)) return count + val.length;
    return val ? count + 1 : count;
  }, 0);

  const Wrapper = isMobile ? motion.div : 'div';
  const wrapperProps = isMobile ? {
    initial: { x: -300 },
    animate: { x: 0 },
    exit: { x: -300 },
    className: "fixed inset-0 z-50 bg-background overflow-y-auto"
  } : {
    className: "sticky top-24 h-fit"
  };

  return (
    <Wrapper {...wrapperProps}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wider uppercase">Filters</span>
            {activeCount > 0 && (
              <span className="text-xs bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground">
                Clear
              </button>
            )}
            {isMobile && (
              <button onClick={onClose}><X className="w-5 h-5" /></button>
            )}
          </div>
        </div>

        {/* Color Spectrum */}
        <div className="mb-8">
          <h4 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Color Family</h4>
          <div className="grid grid-cols-5 gap-2">
            {COLOR_OPTIONS.map(c => (
              <button
                key={c.id}
                onClick={() => updateFilter('colors', c.id)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded transition-all ${
                  filters.colors?.includes(c.id) ? 'bg-muted ring-1 ring-foreground/20' : 'hover:bg-muted/50'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full border border-border/50"
                  style={{ backgroundColor: c.color }}
                />
                <span className="text-[10px] text-muted-foreground">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="mb-8">
          <h4 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Category</h4>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => updateFilter('categories', cat.id)}
                className={`px-3 py-1.5 text-xs border rounded-full transition-all ${
                  filters.categories?.includes(cat.id)
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border hover:border-foreground/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Origin */}
        <div className="mb-8">
          <h4 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Origin</h4>
          <div className="flex flex-wrap gap-2">
            {ORIGINS.map(origin => (
              <button
                key={origin}
                onClick={() => updateFilter('origins', origin)}
                className={`px-3 py-1.5 text-xs border rounded-full transition-all ${
                  filters.origins?.includes(origin)
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border hover:border-foreground/50'
                }`}
              >
                {origin}
              </button>
            ))}
          </div>
        </div>

        {/* Finish */}
        <div className="mb-8">
          <h4 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Surface Finish</h4>
          <div className="flex flex-wrap gap-2">
            {FINISHES.map(f => (
              <button
                key={f.id}
                onClick={() => updateFilter('finishes', f.id)}
                className={`px-3 py-1.5 text-xs border rounded-full transition-all ${
                  filters.finishes?.includes(f.id)
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border hover:border-foreground/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pattern Density */}
        <div className="mb-8">
          <h4 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Pattern Density</h4>
          <div className="flex flex-wrap gap-2">
            {PATTERNS.map(p => (
              <button
                key={p.id}
                onClick={() => updateFilter('patterns', p.id)}
                className={`px-3 py-1.5 text-xs border rounded-full transition-all ${
                  filters.patterns?.includes(p.id)
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border hover:border-foreground/50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {isMobile && (
          <Button onClick={onClose} className="w-full mt-4">
            Show Results
          </Button>
        )}
      </div>
    </Wrapper>
  );
}