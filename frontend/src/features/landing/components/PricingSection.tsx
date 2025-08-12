import { PlanCard } from "./PlanCard";

export const PricingSection = () => {
  const sharedFeatures = [
    "AI-powered sub-task suggestions",
    "Unlimited team creation",
    "Team calendar access",
  ];

  return (
    <section id="pricing" className="bg-[#FFDE70] px-0 py-20 text-black">
      <div className="mx-auto w-full max-w-[1000px] px-4">
        <div className="mb-6 text-center">
          <h2 className="inline-block rounded-md px-4 py-1 text-3xl font-bold">
            Choose Your Plan
          </h2>
          <p className="mt-2 text-sm text-yellow-900">
            Same features, just better value over time!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          <PlanCard duration="Weekly" price="$1.00" features={sharedFeatures} />
          <PlanCard
            duration="Monthly"
            price="$3.00"
            features={sharedFeatures}
          />
          <PlanCard
            duration="Yearly"
            price="$25.00"
            features={sharedFeatures}
            isPopular
          />
        </div>
      </div>
    </section>
  );
};
