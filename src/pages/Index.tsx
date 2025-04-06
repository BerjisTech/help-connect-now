
import Layout from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import ConsultantsSection from '@/components/home/ConsultantsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import AboutContactSection from '@/components/home/AboutContactSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ConsultantsSection />
      <HowItWorksSection />
      <AboutContactSection />
    </Layout>
  );
};

export default Index;
