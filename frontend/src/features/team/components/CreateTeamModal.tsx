import { useState } from "react";
import { useAppDispatch } from "../../../state/hooks";
import { SearchMemberInput } from "./SearchMemberInput";
import toast from "react-hot-toast";
import { createTeamThunk } from "../teamSlice";
import { useNavigate } from "react-router-dom";
import type { MemberInvite } from "../member";

type Props = {
  onClose: () => void;
};

export const CreateTeamModal = ({ onClose }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [invites, setInvites] = useState<MemberInvite[]>([]);
  const [form, setForm] = useState({ teamName: "", description: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTeam = await dispatch(
        createTeamThunk({ ...form, invites }),
      ).unwrap(); // ✅ lấy team mới
      toast.success("Success! A new team is now ready.");
      setForm({ teamName: "", description: "" });

      onClose(); // đóng modal trước
      navigate(`/mainpage/team/${newTeam.id}`); // ✅ chuyển tới trang nhóm vừa tạo
    } catch (error) {
      if (error === "TEAM_LIMIT") {
        toast.error("🚫 You’ve reached your team limit on the free plan.");
      } else if (error === "TEAM_NAME_REQUIRED") {
        toast.error("⚠️ Please enter a team name.");
      } else {
        toast.error("Team creation limit reached. Upgrade to unlock more.");
      }

      console.error("Tạo nhóm thất bại:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="animate-fadeIn relative z-10 max-h-[90vh] w-full max-w-xl overflow-auto rounded-xl border border-gray-200 bg-white text-black shadow-2xl">
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Create New Team</h2>
            <button
              onClick={onClose}
              className="text-gray-400 transition hover:text-black"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="mt-4 h-px w-full bg-gray-300" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left Column: Team name + description */}
            <div className="space-y-5">
              <div>
                <label className="mb-1 block text-[10px] font-semibold text-gray-600 uppercase">
                  Team Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="teamName"
                  placeholder="Team name"
                  value={form.teamName}
                  onChange={handleChange}
                  required
                  className="w-full rounded border px-3 py-2.5 text-sm focus:ring-1 focus:ring-black focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-semibold text-gray-600 uppercase">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Add a description..."
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="min-h-[112px] w-full rounded border px-3 py-2.5 text-sm focus:ring-1 focus:ring-black focus:outline-none"
                />
              </div>
            </div>

            {/* Right Column: Invite members */}
            <div className="space-y-5">
              <div>
                <label className="mb-1 block text-[10px] font-semibold text-gray-600 uppercase">
                  Invite Members
                </label>
                <SearchMemberInput onChange={setInvites} />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full rounded bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#FFDE70] hover:text-black"
            >
              Create Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
