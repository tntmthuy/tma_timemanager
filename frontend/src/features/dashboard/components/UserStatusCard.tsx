import { Link } from "react-router-dom";
import type { User } from "../../auth/authSlice";
import { useAppSelector } from "../../../state/hooks";
import type { SubscriptionInfo } from "../../subscription/subscriptionSlice";

export const UserStatusCard = ({ user }: { user: User }) => {
  const subscriptions = useAppSelector((state) => state.subscription.infoList);
  const hasSubscription = subscriptions && subscriptions.length > 0;

  let recentSub: SubscriptionInfo | null = null;
  let formattedStart = "";
  let formattedExpire = "";
  let daysLeft = 0;
  let isExpiringSoon = false;

  if (hasSubscription) {
    recentSub = subscriptions.reduce((latest, current) => {
      return new Date(current.startDate) > new Date(latest.startDate)
        ? current
        : latest;
    }, subscriptions[0]);

    const startDate = new Date(recentSub.startDate);
    const endDate = new Date(recentSub.endDate);
    formattedStart = startDate.toLocaleDateString("vi-VN");
    formattedExpire = endDate.toLocaleDateString("vi-VN");
    daysLeft = Math.ceil(
      (endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    isExpiringSoon = daysLeft <= 7;
  }

  return (
    <div
      className={`mb-6 rounded-xl p-5 text-[14px] shadow-lg ${
        user.role === "PREMIUM"
          ? "border border-purple-400 bg-gradient-to-br from-indigo-900 via-purple-800 to-black text-white ring-1 ring-purple-500"
          : "border border-yellow-100 bg-yellow-200 text-gray-800"
      }`}
    >
      {/* Role + Subscription summary */}
      {user.role === "PREMIUM" && (
        <div className="mb-3 flex flex-col space-y-1">
          {/* Badge + Info (same row) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex animate-pulse items-center rounded-full border border-indigo-400 bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-400 px-3 py-1 text-sm font-semibold text-white shadow-md">
              PREMIUM
            </span>
            <span className="text-[13px] text-purple-100">
              Your Premium membership is active from{" "}
              <strong>{formattedStart}</strong> to{" "}
              <strong>{formattedExpire}</strong>.
            </span>
          </div>

          {/* Cảnh báo hoặc thông tin còn thời gian */}
          <span
            className={`text-[12px] italic ${
              isExpiringSoon ? "text-pink-300" : "text-purple-300"
            }`}
          >
            {isExpiringSoon
              ? `⚠️ Your subscription will expire in ${daysLeft} day${daysLeft > 1 ? "s" : ""}. Please renew to maintain uninterrupted access.`
              : `Your subscription is valid for another ${daysLeft} day${daysLeft > 1 ? "s" : ""}.`}
          </span>
        </div>
      )}

      {/* FREE plan layout */}
      {user.role === "FREE" && (
        <div className="mb-3 flex flex-col space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-slate-300 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm">
              FREE
            </span>
            <span className="text-[13px] text-gray-700">
              You are currently subscribed to the <strong>Free plan</strong>.
            </span>
          </div>
          <Link
            to="/mainpage/upgrade"
            className="text-[12px] text-yellow-700 italic underline hover:text-yellow-900"
          >
            Explore upgrade options →
          </Link>
        </div>
      )}

      {/* Admin badge */}
      {user.isAdmin && (
        <div className="mt-2">
          <span className="inline-block rounded bg-red-200 px-2 py-[2px] text-[12px] font-medium text-red-800">
            Administrator Privileges
          </span>
        </div>
      )}
    </div>
  );
};
