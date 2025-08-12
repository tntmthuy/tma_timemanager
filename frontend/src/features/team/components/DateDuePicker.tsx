import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  value: Date | null;
  onChange: (date: Date | null) => void;
};

export const DueDatePicker = ({ value, onChange }: Props) => {
  const handleDateChange = (dateOnly: Date | null) => {
    if (!dateOnly) return onChange(null);
    const existingTime = value || new Date();
    const merged = new Date(dateOnly);
    merged.setHours(existingTime.getHours());
    merged.setMinutes(existingTime.getMinutes());
    onChange(merged);
  };

  const handleTimeChange = (timeOnly: Date | null) => {
    if (!value || !timeOnly) return;
    const updated = new Date(value);
    updated.setHours(timeOnly.getHours());
    updated.setMinutes(timeOnly.getMinutes());
    onChange(updated);
  };

  return (
    <div className="space-y-1">
      <label className="mb-1 block text-[10px] font-semibold text-gray-600 uppercase">
        Due Date
      </label>

      <div className="grid grid-cols-[1fr_1px_1fr] items-center rounded border border-gray-300 overflow-hidden">
        {/* Date input */}
        <ReactDatePicker
          selected={value}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          placeholderText="Date"
          className="w-full px-3 py-2 text-sm text-gray-800 focus:outline-none"
          calendarClassName="!text-sm"
        />

        {/* Vertical divider */}
        <div className="h-full w-px bg-gray-200" />

        {/* Time input */}
        <ReactDatePicker
          selected={value}
          onChange={handleTimeChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeFormat="HH:mm"
          dateFormat="HH:mm"
          placeholderText="Time"
          className="w-full px-3 py-2 text-sm text-gray-800 focus:outline-none"
          calendarClassName="!text-sm"
        />
      </div>
    </div>
  );
};