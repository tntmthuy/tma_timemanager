import { useSelector } from "react-redux";
import type { RootState } from "../../../state/store";

interface Props {
  firstname: string;
  lastname: string;
  gender: "male" | "female" | "unsure";
  setFirstname: (v: string) => void;
  setLastname: (v: string) => void;
  setGender: React.Dispatch<React.SetStateAction<"male" | "female" | "unsure">>;
}

export const ProfileInfoFields = ({
  firstname,
  lastname,
  gender,
  setFirstname,
  setLastname,
  setGender,
}: Props) => {
  const email = useSelector((state: RootState) => state.auth.user?.email);
  if (!email) return null;

  return (
    <div className="flex-1 space-y-4 bg-white">
      {/* 🧾 Họ & Tên */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-500">First Name</label>
          <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-800" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500">Last Name</label>
          <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-800" />
        </div>
      </div>

      {/* ✉️ Email */}
      <div>
        <label className="text-xs font-semibold text-gray-500">Email</label>
        <input type="email" value={email} readOnly className="w-full cursor-not-allowed rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400" />
      </div>

      {/* 🚻 Giới tính */}
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-500">Gender</label>
        <div className="flex gap-6 text-sm accent-black">
          <label className="flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 text-gray-800 transition hover:text-black">
            <input type="radio" name="gender" value="male" checked={gender === "male"} onChange={() => setGender("male")} />
            Male
          </label>
          <label className="flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 text-gray-800 transition hover:text-black">
            <input type="radio" name="gender" value="female" checked={gender === "female"} onChange={() => setGender("female")} />
            Female
          </label>
          <label className="flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 text-gray-800 transition hover:text-black">
            <input type="radio" name="gender" value="unsure" checked={gender === "unsure"} onChange={() => setGender("unsure")} />
            Other
          </label>
        </div>
      </div>
    </div>
  );
};