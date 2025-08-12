export const PageSectionWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full max-w-[1000px] mx-auto px-4">
      {children}
    </div>
  );
};