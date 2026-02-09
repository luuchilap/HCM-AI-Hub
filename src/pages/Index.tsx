import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/sections/HeroSection";
import { MembersSection } from "@/components/sections/MembersSection";
import { EventsPreview } from "@/components/sections/EventsPreview";
// import { ResearchSection } from "@/components/sections/ResearchSection";
import { CollaborateSection } from "@/components/sections/CollaborateSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <MembersSection />
      <EventsPreview />
      {/* <ResearchSection /> */}
      <CollaborateSection />
      <NewsletterSection />
    </Layout>
  );
};

export default Index;
