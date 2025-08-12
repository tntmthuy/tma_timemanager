import { useRef, useEffect, useState, type JSX } from "react";
import toast from "react-hot-toast";

type EditableTextProps = {
  text: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  tagClassName?: string;
  onSubmit: (newText: string) => void;
  as?: keyof JSX.IntrinsicElements;
  disabled?: boolean; // ✅ thêm prop disabled
  allowEmpty?: boolean; // ✅ thêm để phân biệt giữa title và mô tả
};

export const EditableText = ({
  text,
  placeholder,
  className = "",
  inputClassName = "",
  tagClassName = "",
  onSubmit,
  as = "span",
  disabled = false,
  allowEmpty,
}: EditableTextProps) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(text);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const Tag = as as keyof JSX.IntrinsicElements;

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  useEffect(() => {
    setValue(text);
  }, [text]);

  const handleSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    const cleaned = value.trim();

    if (!allowEmpty && cleaned === "") {
      toast.error("This field cannot be empty");
      return;
    }

    if (cleaned === text.trim()) {
      setEditing(false); // không cần gọi nếu không thay đổi
      return;
    }

    try {
      await onSubmit(cleaned); // ✅ gọi đúng 1 lần
    } catch (err) {
      console.error("EditableText submit failed", err);
    } finally {
      setEditing(false);
    }
  };

  const handleBlur = () => {
    setValue(text); // ✅ reset lại như cũ nếu không nhấn Enter
    setEditing(false);
  };

  return (
    <div
      className={`group flex items-center gap-2 select-none ${className}`}
      onClick={() => {
        if (!disabled) setEditing(true);
      }}
    >
      {editing ? (
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleSubmit}
          onBlur={handleBlur}
          className={`w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 transition-all duration-200 outline-none focus:border-gray-400 focus:ring-0 ${inputClassName}`}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        <>
          <Tag className={tagClassName}>{text || placeholder}</Tag>
          {!disabled && (
            <span className="flex items-center justify-center text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </span>
          )}
        </>
      )}
    </div>
  );
};
