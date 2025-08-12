type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const FocusTimePicker = ({ value, onChange }: Props) => {
  const isDev = value === "1";
  const isCustom = !isDev;

  const total = parseInt(value);
  const hour = Math.floor(total / 60);
  const minute = total % 60;

  const hourOptions = [0, 1, 2];
  const minuteOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const h = parseInt(e.target.value);
    const newTotal = h * 60 + minute;
    onChange(newTotal.toString());
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const m = parseInt(e.target.value);
    const newTotal = hour * 60 + m;
    onChange(newTotal.toString());
  };

  return (
    <div className="mt-1 flex flex-col gap-2">
      {/* 🔘 Mode Selector */}
      <select
        value={isDev ? "1" : "custom"}
        onChange={(e) => {
          const val = e.target.value;
          if (val === "1") onChange("1");
          else onChange("60"); // default to 60 min when switching to custom
        }}
        className="w-full rounded-md border border-yellow-300 bg-white px-3 py-2 text-sm"
      >
        <option value="1">Dev Test (3s)</option>
        <option value="custom">Custom Duration</option>
      </select>

      {/* ⏱️ Custom Picker */}
      {isCustom && (
        <div className="flex gap-2">
          <select
            value={hour.toString()}
            onChange={handleHourChange}
            className="w-1/2 rounded-md border border-yellow-300 bg-white px-3 py-2 text-sm"
          >
            {hourOptions.map((h) => (
              <option key={h} value={h}>
                {h} h
              </option>
            ))}
          </select>
          <select
            value={minute.toString()}
            onChange={handleMinuteChange}
            className="w-1/2 rounded-md border border-yellow-300 bg-white px-3 py-2 text-sm"
          >
            {minuteOptions.map((m) => (
              <option key={m} value={m}>
                {m} m
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};