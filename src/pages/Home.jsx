import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import HeroSection from '../components/home/HeroSection';
import FeaturedGrid from '../components/home/FeaturedGrid';
import CategoryShowcase from '../components/home/CategoryShowcase';
import StatsSection from '../components/home/StatsSection';

const HERO_IMAGE = 'https://media.base44.com/images/public/69f2e4b70bf151eda077e6ed/e819093b8_generated_bc70e5ce.png';

export default function Home() {
  const { data: products = [] } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => base44.entities.MarbleProduct.list('-created_date', 12),
  });

  return (
    <div style={{ backgroundColor: '#0A0A0A' }}>
      <HeroSection heroImage={HERO_IMAGE} />
      <StatsSection />
      <FeaturedGrid products={products} />
      <CategoryShowcase />
    </div>
  );
}