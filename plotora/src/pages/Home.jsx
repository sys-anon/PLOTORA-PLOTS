import Hero from '../components/Hero';
import CategoryCards from '../components/CategoryCards';
import TrustBadges from '../components/TrustBadges';
import FeaturedProperties from '../components/FeaturedProperties';
import StatsSection from '../components/StatsSection';

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryCards />
      <TrustBadges />
      <FeaturedProperties />
      <StatsSection />
    </>
  );
}

