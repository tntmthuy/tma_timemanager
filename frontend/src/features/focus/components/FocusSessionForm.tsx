import { FocusTimePicker } from "./FocusTimePicker";

// src/components/FocusSessionForm.tsx
type Props = {
  focusTime: string;
  breakTime: string;
  description: string;
  onChangeFocus: (value: string) => void;
  onChangeBreak: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onStart: () => void;
};

export const FocusSessionForm = ({
  focusTime,
  breakTime,
  description,
  onChangeFocus,
  onChangeBreak,
  onChangeDescription,
  onStart,
}: Props) => {
  return (
    <div className="flex h-full flex-col justify-between rounded-lg border border-yellow-200 bg-yellow-200 p-4 shadow-sm">
      <h3 className="mb-3 text-base font-semibold text-yellow-900">
        Setup Focus Session
      </h3>
      <div className="mb-4 h-px w-full bg-yellow-400" />

      <div className="flex flex-col gap-6">
        {/* Focus + Break */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-yellow-800">
              Focus Duration
            </label>
            <FocusTimePicker value={focusTime} onChange={onChangeFocus} />
          </div>
          <div>
            <label className="text-sm font-medium text-yellow-800">
              Break Duration
            </label>
            <select
              value={breakTime}
              onChange={(e) => onChangeBreak(e.target.value)}
              className="mt-1 w-full rounded-md border border-yellow-300 bg-white px-3 py-2 text-sm"
            >
              <option value="0.05">Dev Test (3s)</option>
              <option value="0">Off</option>
              {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                <option key={m} value={m.toString()}>
                  {m} min
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 text-sm font-medium text-yellow-800">
            Session Description
          </label>
          <textarea
            value={description}
            onChange={(e) => onChangeDescription(e.target.value)}
            className="h-30 w-full resize-none rounded-md border border-yellow-300 bg-white px-3 py-2 text-sm"
            placeholder="Write your focus goal..."
          />
        </div>
      </div>

      <div className="mt-4 text-right">
        <button
          onClick={onStart}
          className="rounded-md bg-yellow-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-yellow-600"
        >
          Start Focus
        </button>
      </div>
    </div>
  );
};
