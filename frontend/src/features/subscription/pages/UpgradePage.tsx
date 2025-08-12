// src/features/subscription/pages/UpgradePage.tsx
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { fetchPlansThunk } from "../subscriptionSlice";
import { PlanCheckoutSidebar } from "../components/PlanCheckoutSidebar";
import { PremiumThankYouModal } from "../components/PremiumThanhYouModal";
import axios from "axios";
import { fetchUserProfileThunk } from "../../auth/authSlice";
import { ConfirmModal } from "../../team/components/ConfirmModal";

type SubscriptionPlan = {
  type: "WEEKLY" | "MONTHLY" | "YEARLY";
  price: number;
  currency: string;
  displayName: string;
};

const planDescriptions: Record<SubscriptionPlan["type"], string> = {
  WEEKLY:
    "Ideal for short-term use or quick testing. Expires in 7 days. Renew manually.",
  MONTHLY: "Best for regular use. Lasts 30 days and requires manual renewal.",
  YEARLY: "Most cost-effective. Access for a full year with one payment.",
};

export const UpgradePage = () => {
  const dispatch = useAppDispatch();
  const { plans, loading } = useAppSelector((state) => state.subscription);
  const user = useAppSelector((state) => state.auth.user);

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (user?.role === "PREMIUM") {
      setSelectedPlan(plan);
      setShowConfirmModal(true);
    } else {
      setSelectedPlan(plan);
      setShowModal(true);
    }
  };
  useEffect(() => {
    dispatch(fetchPlansThunk());
  }, [dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get("paymentId");
    const payerId = params.get("PayerID");
    const planType = params.get("planType");

    if (paymentId && payerId && planType) {
      const token = localStorage.getItem("token");
      axios
        .get("http://localhost:8081/payment/success", {
          params: { paymentId, PayerID: payerId, planType },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.status === "success") {
            localStorage.setItem("token", res.data.token);
            setSelectedPlan(null);
            setShowModal(true);
            window.history.replaceState({}, "", "/mainpage/upgrade");
          }
        });
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-yellow-50 px-20 py-24">
      <div className="mb-20 text-center">
        <h2 className="text-4xl font-bold text-yellow-900">
          Upgrade Your Account
        </h2>
        <p className="mt-4 text-base text-yellow-700">
          Select a plan to unlock full features of the website
        </p>
        <div className="mt-6 flex justify-center gap-3">
          {[...Array(3)].map((_, idx) => (
            <span key={idx} className="h-3 w-3 rounded-full bg-yellow-400" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-20 md:grid-cols-3">
        <div>
          <h3 className="mb-6 text-xl font-bold text-yellow-900">
            Why go premium?
          </h3>
          <ul className="space-y-4">
            {[
              "Unlimited team creation",
              "AI-powered sub-task suggestions",
              "Calendar",
            ].map((item) => (
              <li key={item} className="flex items-center gap-4">
                <span className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-[15px] text-yellow-800">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3 className="mb-6 text-xl font-bold text-yellow-900">
            Choose your plan
          </h3>

          {loading ? (
            <div className="text-yellow-700">Loading plans...</div>
          ) : plans.length === 0 ? (
            <div className="text-yellow-700">No plans available</div>
          ) : (
            <div className="space-y-6">
              {plans.map((plan: SubscriptionPlan) => (
                <div
                  key={plan.type}
                  className="flex items-center justify-between rounded-md border border-yellow-200 bg-yellow-100 px-8 py-5 shadow-sm transition hover:bg-yellow-200"
                >
                  <div>
                    <span
                      title={planDescriptions[plan.type]}
                      className="text-[15px] font-semibold text-yellow-900"
                    >
                      {plan.displayName}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-sm text-yellow-700">
                      ${Number(plan.price).toFixed(2)} /{" "}
                      {plan.type.toLowerCase()}
                    </span>
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      type="button"
                      className="rounded bg-yellow-500 px-5 py-2 text-sm font-semibold text-white hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
              {showConfirmModal && selectedPlan && (
                <ConfirmModal
                  title="You Already Have PREMIUM"
                  message={`Continuing will reset the subscription from the beginning.`}
                  onConfirm={() => {
                    setShowConfirmModal(false);
                    setShowModal(true);
                  }}
                  onCancel={() => {
                    setSelectedPlan(null);
                    setShowConfirmModal(false);
                  }}
                />
              )}
            </div>
          )}
          {selectedPlan && showModal && (
            <PlanCheckoutSidebar
              plan={selectedPlan}
              onClose={() => setShowModal(false)}
            />
          )}

          {!selectedPlan && showModal && (
            <PremiumThankYouModal
              message="Your account has been successfully upgraded to Premium. Click OK to refresh and start exploring all features."
              buttonLabel="OK"
              onConfirm={() => {
                dispatch(fetchUserProfileThunk());
                window.location.reload();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
