import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import {
  deleteAllNotificationsThunk,
  fetchNotificationsThunk,
  markAllNotificationsAsRead,
} from "../notificationSlice";
import { NotificationList } from "../components/NotificationList";
import toast from "react-hot-toast";
import {
  acceptInvitationThunk,
  declineInvitationThunk,
} from "../invitetationSlice";
import { fetchAllTeamsThunk } from "../../team/teamSlice";
import { useNavigate } from "react-router-dom";

export const NotificationPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const notifications = useAppSelector((s) => s.notification.list);
  const [activeTab, setActiveTab] = useState<"unread" | "read">("unread");

  // 🔍 Log trạng thái isRead
  useEffect(() => {
    console.log(
      "🔍 Updated list:",
      notifications.map((n) => ({ id: n.id, read: n.read })),
    );
  }, [notifications]);

  useEffect(() => {
    dispatch(fetchNotificationsThunk());
  }, [dispatch]);

  const handleAccept = async (teamId: string): Promise<string> => {
    const result = await dispatch(acceptInvitationThunk(teamId));
    if (acceptInvitationThunk.rejected.match(result)) {
      throw result.payload;
    }

    await dispatch(fetchAllTeamsThunk());
    await dispatch(fetchNotificationsThunk());
    setActiveTab("read");

    return result.payload;
  };

  const handleDecline = async (teamId: string): Promise<void> => {
    try {
      const msg = await dispatch(declineInvitationThunk(teamId)).unwrap();
      toast.success(msg);
      await dispatch(fetchNotificationsThunk());
      setActiveTab("read");
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Cannot decline invitation.",
      );
    }
  };

  //mark all
  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllNotificationsAsRead());
      toast.dismiss();
      toast.success("All notifications marked as read!");
      setActiveTab("read");
    } catch {
      toast.dismiss();
      toast.error("Failed to mark notifications as read.");
    }
  };

  //delete all
  const handleDeleteAllNotifications = async () => {
    try {
      await dispatch(deleteAllNotificationsThunk());
      toast.dismiss();
      toast.success("All notifications deleted.");
    } catch {
      toast.dismiss();
      toast.error("Failed to delete notifications.");
    }
  };

  return (
    <div className="h-full bg-white p-6">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">Notification</h2>
      <h4 className="mb-4 text-sm text-gray-500">
        All your team invitations, updates, and activity alerts are shown here.
      </h4>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("unread")}
            className={`rounded px-3 py-1 text-sm font-medium ${
              activeTab === "unread"
                ? "bg-yellow-100 text-yellow-800"
                : "text-gray-500"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("read")}
            className={`rounded px-3 py-1 text-sm font-medium ${
              activeTab === "read"
                ? "bg-gray-100 text-gray-800"
                : "text-gray-500"
            }`}
          >
            Read
          </button>
        </div>

        {/* 🎯 Icon nằm sát phải, cùng hàng */}
        <div className="text-gray-700">
          {activeTab === "unread" ? (
            <div className="group relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                onClick={handleMarkAllAsRead}
                className="h-7 w-7 cursor-pointer text-lime-500"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="absolute bottom-full mb-1 hidden rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
                Mark all as read
              </span>
            </div>
          ) : (
            <div className="group relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                onClick={handleDeleteAllNotifications}
                className="h-7 w-7 cursor-pointer text-rose-600 transition hover:scale-105"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="absolute bottom-full mb-1 hidden rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
                Delete all
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto scroll-smooth pr-1">
        <NotificationList
          key={activeTab + notifications.length}
          items={notifications}
          filter={activeTab}
          onAccept={handleAccept}
          onDecline={handleDecline}
          navigate={navigate}
        />
      </div>
    </div>
  );
};
