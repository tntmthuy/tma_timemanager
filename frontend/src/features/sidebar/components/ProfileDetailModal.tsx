// src/features/sidebar/components/ProfileDetailModal.tsx
import { useSelector } from "react-redux";
import { useState } from "react";
import { useAppDispatch } from "../../../state/hooks";
import {
  changePasswordThunk,
  updateAvatarThunk,
  updateProfileInfoThunk,
} from "../../auth/authSlice";
import { ProfileInfoFields } from "./ProfileInfoFields";
import { ChangePasswordFields } from "./ChangePasswordFields";
import type { RootState } from "../../../state/store";
import toast from "react-hot-toast";

export const ProfileDetailModal = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<"info" | "password">("info");

  // 🧠 State lưu form input
  const [firstname, setFirstname] = useState(user!.firstname);
  const [lastname, setLastname] = useState(user!.lastname);
  const [gender, setGender] = useState(
    user?.gender
      ? (user.gender.toLowerCase() as "male" | "female" | "unsure")
      : "unsure",
  );

  //State change pasword
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");

  // 📤 Upload avatar
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    dispatch(updateAvatarThunk(file)).then(() => {
      toast.dismiss();
      toast.success("Your profile has been updated!");
    });
  };

  // ✅ Confirm ➤ gọi API cập nhật info
  const handleConfirm = () => {
    if (activeTab === "info") {
      dispatch(
        updateProfileInfoThunk({
          firstname,
          lastname,
          gender: gender.toUpperCase() as "MALE" | "FEMALE" | "UNSURE",
        }),
      )
        .unwrap()
        .then(() => {
          toast.dismiss();
          toast.success("Your profile has been updated!");
        })
        .catch(() => {
          toast.dismiss();
          toast.error("Failed to update profile.");
        });
    } else if (activeTab === "password") {
      if (!currentPassword || !newPassword || !confirmationPassword) {
        toast.error("Please fill in all password fields.");
        return;
      }

      dispatch(
        changePasswordThunk({
          currentPassword,
          newPassword,
          confirmationPassword,
        }),
      )
        .unwrap()
        .then(() => {
          toast.dismiss();
          toast.success("Your password has been updated!");

          // ✅ Reset form fields sau khi đổi xong
          setCurrentPassword("");
          setNewPassword("");
          setConfirmationPassword("");
        })
        .catch((errMessage) => {
          toast.dismiss();
          switch (errMessage) {
            case "CURRENT_PASSWORD_REQUIRED":
              toast.error("Please enter your current password.");
              break;
            case "PASSWORD_REQUIRED":
              toast.error("Please enter a new password.");
              break;
            case "PASSWORD_TOO_WEAK":
              toast.error(
                "Password must contain letters, digits and a special character.",
              );
              break;
            case "CONFIRMATION_PASSWORD_REQUIRED":
              toast.error("Please confirm your new password.");
              break;
            case "WRONG_PASSWORD":
              toast.error("Your current password is incorrect.");
              break;
            case "PASSWORD_CONFIRMATION_MISMATCH":
              toast.error("New password and confirmation do not match.");
              break;
            default:
              toast.error("Failed to change password.");
              break;
          }
          // ✅ Reset field
          setCurrentPassword("");
          setNewPassword("");
          setConfirmationPassword("");
        });
    }
  };

  if (!user) return null;

  return (
    <div className="relative overflow-hidden rounded-md">
      {/* 🎨 Background */}
      <div
        className="relative z-0 flex min-h-[440px] gap-6 rounded-md bg-cover bg-center p-6 pt-10"
        style={{ backgroundImage: "url('/images/bg5.jpg')" }}
      >
        {/* 🖼 Avatar */}
        <div className="relative flex-shrink-0">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Avatar"
              className="h-32 w-32 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-300 font-semibold text-white">
              {user.firstname?.charAt(0) ?? "?"}
            </div>
          )}
          <div className="mt-2 flex w-32 justify-center">
            <label
              htmlFor="avatarInput"
              className="cursor-pointer rounded-md bg-black px-3 py-1 text-sm font-semibold text-gray-200 transition hover:bg-gray-800 hover:font-bold"
            >
              Change Avatar
              <input
                type="file"
                id="avatarInput"
                accept="image/*"
                hidden
                onChange={handleUpload}
              />
            </label>
          </div>
        </div>

        {/* 🧍‍♂️ Tabs */}
        <div className="flex-1">
          <div className="space-y-4 rounded-md bg-white px-6 py-4 shadow-md">
            <div className="mb-4 flex gap-4 border-b border-b-gray-200">
              <button
                onClick={() => setActiveTab("info")}
                className={`rounded-md rounded-b-none border-b-2 px-4 py-2 text-sm font-semibold transition ${activeTab === "info" ? "border-yellow-500 bg-yellow-200 text-yellow-800" : "border-transparent text-gray-600 hover:text-yellow-700"}`}
              >
                User Info
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`rounded-md rounded-b-none border-b-2 px-4 py-2 text-sm font-semibold transition ${activeTab === "password" ? "border-yellow-500 bg-yellow-200 text-yellow-800" : "border-transparent text-gray-600 hover:text-yellow-700"}`}
              >
                Change Password
              </button>
            </div>

            {activeTab === "info" && (
              <ProfileInfoFields
                firstname={firstname}
                lastname={lastname}
                gender={gender}
                setFirstname={setFirstname}
                setLastname={setLastname}
                setGender={setGender}
              />
            )}
            {activeTab === "password" && (
              <ChangePasswordFields
                currentPassword={currentPassword}
                newPassword={newPassword}
                confirmationPassword={confirmationPassword}
                setCurrentPassword={setCurrentPassword}
                setNewPassword={setNewPassword}
                setConfirmationPassword={setConfirmationPassword}
              />
            )}
          </div>
        </div>
      </div>

      {/* ✅ Nút Confirm */}
      <div className="absolute right-6 bottom-4 z-10">
        <button
          onClick={handleConfirm}
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-800 hover:font-bold"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};
