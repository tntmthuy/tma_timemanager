export const PremiumThankYouModal = ({
  onConfirm,
  message = "Your account has been successfully upgraded to Premium. Click OK to start enjoying full features.",
  buttonLabel = "OK",
}: {
  onConfirm: () => void;
  message?: string;
  buttonLabel?: string;
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center"
    style={{
      backgroundColor: "rgba(0,0,0,0.1)",
      backdropFilter: "blur(2px)",
    }}
  >
    <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
      <h2 className="text-yellow-900 text-2xl font-semibold mb-4">
        Welcome to Premium
      </h2>
      <p className="text-yellow-700 text-base mb-6">{message}</p>
      <button
        onClick={onConfirm}
        className="px-6 py-2 bg-yellow-500 text-white text-sm font-medium rounded hover:bg-yellow-600 transition duration-200"
      >
        {buttonLabel}
      </button>
    </div>
  </div>
);