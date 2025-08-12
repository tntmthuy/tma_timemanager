type BtnAddColumnProps = {
  onClick?: () => void;
};

export const BtnAddColumn = ({ onClick }: BtnAddColumnProps) => {
  return (
    <button
      onClick={onClick}
      className="flex w-[230px] flex-shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium text-black shadow transition"
    >
      <span className="text-xl font-bold">+</span>
      Add Column
    </button>
  );
};
