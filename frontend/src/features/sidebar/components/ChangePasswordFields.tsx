interface Props {
  currentPassword: string;
  newPassword: string;
  confirmationPassword: string;
  setCurrentPassword: (v: string) => void;
  setNewPassword: (v: string) => void;
  setConfirmationPassword: (v: string) => void;
}

export const ChangePasswordFields = ({
  currentPassword,
  newPassword,
  confirmationPassword,
  setCurrentPassword,
  setNewPassword,
  setConfirmationPassword,
}: Props) => {

const passwordChecks = [
    {
      label: "At least 8 characters",
      isValid: newPassword.length >= 8,
    },
    {
      label: "Contains letters",
      isValid: /[a-zA-Z]/.test(newPassword),
    },
    {
      label: "Contains digits",
      isValid: /\d/.test(newPassword),
    },
    {
      label: "Contains special character (@ $ ! % * # ? &)",
      isValid: /[@$!%*#?&]/.test(newPassword),
    },
  ];
const CheckIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-4 text-green-600"
    >
      <path
        fill-rule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clip-rule="evenodd"
      />
    </svg>
  );

  const InfoIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-4 text-yellow-400"
    >
      <path
        fill-rule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
        clip-rule="evenodd"
      />
    </svg>
  );
  return (
    <div className="min-h-[220px] flex-1 space-y-2 bg-white">
      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmationPassword}
        onChange={(e) => setConfirmationPassword(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
      />
      <ul className="space-y-2 pt-2 text-sm">
        {passwordChecks.map((check, index) => (
          <li key={index} className="flex items-center gap-2 text-gray-700">
            {check.isValid ? CheckIcon : InfoIcon}
            {check.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

