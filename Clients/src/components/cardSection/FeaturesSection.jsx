import React from "react";
import FeatureCard from "../../components/featureCard/FeatureCard";
import { ShieldCheck, Smartphone, Stethoscope } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 bg-blue-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800">Key Features</h2>
        <p className="text-gray-600 mt-2">
          Everything you need in one place to feel secure and supported.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        <FeatureCard
          icon={<ShieldCheck size={40} />}
          title="Secure Policy Management"
          description="Store, view, and manage all your policies securely with end-to-end encryption."
        />
        <FeatureCard
          icon={<Smartphone size={40} />}
          title="Instant Claims Tracking"
          description="Get real-time updates on your claim status directly from your dashboard."
        />
        <FeatureCard
          icon={<Stethoscope size={40} />}
          title="24/7 Doctor Support"
          description="Access licensed medical professionals anytime through our integrated support system."
        />
      </div>
    </section>
  );
};

export default FeaturesSection;
