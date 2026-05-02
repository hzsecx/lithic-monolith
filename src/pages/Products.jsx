import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FilterSidebar from '../components/products/FilterSidebar';
import ProductCard from '../components/products/ProductCard';

const HERO_IMAGE = 'https://media.base44.com/images/public/69f2e4b70bf151eda077e6ed/2e6e5a723_generated_image.png';

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    colors: [],
    origins: [],
    finishes: [],
    patterns: [],
    categories: [],
    priceRange: null,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat) {
      setFilters(prev => ({ ...prev, categories: [cat] }));
    }
  }, []);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['allProducts'],
    queryFn: () => base44.entities.MarbleProduct.list('-created_date', 100),
  });

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.origin?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    if (filters.colors.length > 0) result = result.filter(p => filters.colors.includes(p.color_family));
    if (filters.origins.length > 0) result = result.filter(p => filters.origins.includes(p.origin));
    if (filters.finishes.length > 0) result = result.filter(p => filters.finishes.includes(p.finish));
    if (filters.patterns.length > 0) result = result.filter(p => filters.patterns.includes(p.pattern_density));
    if (filters.categories.length > 0) result = result.filter(p => filters.categories.includes(p.category));

    switch (sortBy) {
      case 'price_asc': result.sort((a, b) => (a.price_per_sqm || 0) - (b.price_per_sqm || 0)); break;
      case 'price_desc': result.sort((a, b) => (b.price_per_sqm || 0) - (a.price_per_sqm || 0)); break;
      case 'name': result.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break;
      default: break;
    }

    return result;
  }, [products, searchQuery, filters, sortBy]);

  return (
    <div style={{ backgroundColor: '#0D1B2A', minHeight: '100vh' }}>
      {/* Hero Section with marble texture */}
      <div className="relative h-64 lg:h-80 overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Marble texture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(13,27,42,0.3) 0%, rgba(13,27,42,0.7) 100%)' }} />
        <div className="absolute bottom-8 left-6 lg:left-12">
          <p className="text-xs tracking-[0.4em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Mineral Archive
          </p>
          <h1 className="font-display text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Collection
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">

        {/* Search bar below hero */}
        <div className="py-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
            <Input
              placeholder="Search marble..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-0 text-white placeholder:text-white/30"
              style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'white' }}
            />
          </div>
        </div>

        <div className="flex gap-0 lg:gap-8 pt-8 pb-24">
          {/* Desktop Sidebar — frosted glass */}
          <div className="hidden lg:block w-56 flex-shrink-0">
            <div
              className="sticky top-24 rounded-xl p-1"
              style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <FilterSidebar filters={filters} setFilters={setFilters} dark />
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {/* Controls row */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 text-sm px-4 py-2 rounded-lg"
                style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              <div className="flex items-center gap-4 ml-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger
                    className="w-40 border text-sm"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price_asc">Price: Low → High</SelectItem>
                    <SelectItem value="price_desc">Price: High → Low</SelectItem>
                    <SelectItem value="name">Name A–Z</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {filteredProducts.length} results
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
                {Array(9).fill(0).map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-display text-2xl" style={{ color: 'rgba(255,255,255,0.4)' }}>No results found</p>
                <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    isLarge={index === 0 || index === 5}
                    dark
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      <AnimatePresence>
        {showMobileFilters && (
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onClose={() => setShowMobileFilters(false)}
            isMobile
            dark
          />
        )}
      </AnimatePresence>
    </div>
  );
}