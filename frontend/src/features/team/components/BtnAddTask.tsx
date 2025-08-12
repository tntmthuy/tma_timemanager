// components/BtnAddTask.tsx
export const BtnAddTask = () => {
  return (
    <button className="text-back flex w-[210px] cursor-pointer items-center justify-center gap-2 rounded-xs bg-gray-200 px-3 py-1 text-sm font-medium shadow transition">
      <span className="text-base font-bold">+</span>
      Add Task
    </button>
  );
};
