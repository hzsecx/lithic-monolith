import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FilterSidebar from '../components/products/FilterSidebar';
import ProductCard from '../components/products/ProductCard';

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
    <div className="pt-20 lg:pt-24 min-h-screen">
      {/* Page Header */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-8 lg:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-2">Mineral Archive</p>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold tracking-tight">Collection</h1>
        </motion.div>

        {/* Search & Controls */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search marble..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-transparent border-border"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 text-sm border border-border px-4 py-2 rounded"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_asc">Price: Low → High</SelectItem>
                <SelectItem value="price_desc">Price: High → Low</SelectItem>
                <SelectItem value="name">Name A–Z</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground hidden sm:block">
              {filteredProducts.length} results
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 pb-24">
        <div className="flex gap-8 lg:gap-12">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {Array(9).fill(0).map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-display text-2xl text-muted-foreground">No results found</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    isLarge={index === 0 || index === 5}
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
          />
        )}
      </AnimatePresence>
    </div>
  );
}