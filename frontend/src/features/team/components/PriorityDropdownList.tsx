import { useState, useEffect, useRef } from "react";

type Priority = "HIGH" | "MEDIUM" | "LOW" | null;

type PriorityDropdownProps = {
  selected: Priority;
  onSelect: (priority: Priority) => void;
};

const priorities = [
  {
    value: null,
    label: "No priority",
    iconColor: "text-gray-500",
    textColor: "text-gray-500",
    bgColor: "bg-gray-50",
  },
  {
    value: "HIGH",
    label: "High",
    iconColor: "text-red-600",
    textColor: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    iconColor: "text-blue-600",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    value: "LOW",
    label: "Low",
    iconColor: "text-green-600",
    textColor: "text-green-600",
    bgColor: "bg-green-50",
  },
];

export const PriorityDropdown = ({
  selected,
  onSelect,
}: PriorityDropdownProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const selectedItem =
    priorities.find((p) => p.value === selected) ?? priorities[0];

  return (
    <div className="relative space-y-1" ref={dropdownRef}>
      <label className="block text-[10px] font-semibold text-gray-600 uppercase">
        Priority
      </label>

      {/* 🔘 Pill button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`relative flex w-full cursor-pointer items-center justify-between rounded-full px-3 py-1 text-[10px] font-medium tracking-wide uppercase ${selectedItem.bgColor} ${selectedItem.textColor}`}
      >
        <span className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className={`h-3 w-3 ${selectedItem.iconColor}`}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.097 1.515a.75.75 0 0 1 .589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 1 1 1.47.294L16.665 7.5h3.585a.75.75 0 0 1 0 1.5h-3.885l-1.2 6h3.585a.75.75 0 0 1 0 1.5h-3.885l-1.08 5.397a.75.75 0 1 1-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 1 1-1.47-.294l1.02-5.103H3.75a.75.75 0 0 1 0-1.5h3.885l1.2-6H5.25a.75.75 0 0 1 0-1.5h3.885l1.08-5.397a.75.75 0 0 1 .882-.588ZM10.365 9l-1.2 6h4.47l1.2-6h-4.47Z"
            />
          </svg>
          {selectedItem.label}
        </span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="h-3 w-3 text-gray-400"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.53 16.28a.75.75 
              0 0 1-1.06 0l-7.5-7.5a.75.75 
              0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 
              0 1 1 1.06 1.06l-7.5 7.5Z"
          />
        </svg>
      </button>

      {/* 📃 Dropdown menu */}
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded border border-gray-200 bg-white shadow-md">
          {priorities.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onSelect(item.value as Priority); // ✅ ép đúng kiểu
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-1 text-[10px] font-medium tracking-wide uppercase ${item.bgColor} ${item.textColor} transform cursor-pointer transition hover:-translate-y-[2px] hover:shadow-md`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className={`h-3 w-3 ${item.iconColor}`}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.097 1.515a.75.75 0 0 1 .589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 1 1 1.47.294L16.665 7.5h3.585a.75.75 0 0 1 0 1.5h-3.885l-1.2 6h3.585a.75.75 0 0 1 0 1.5h-3.885l-1.08 5.397a.75.75 0 1 1-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 1 1-1.47-.294l1.02-5.103H3.75a.75.75 0 0 1 0-1.5h3.885l1.2-6H5.25a.75.75 0 0 1 0-1.5h3.885l1.08-5.397a.75.75 0 0 1 .882-.588ZM10.365 9l-1.2 6h4.47l1.2-6h-4.47Z"
                />
              </svg>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
