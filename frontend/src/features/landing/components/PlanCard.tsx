import { useNavigate } from "react-router-dom";

interface PlanCardProps {
  duration: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  duration,
  price,
  features = [],
  isPopular,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const navBtn = document.getElementById("navbar-getstarted");
    if (navBtn) {
      navBtn.classList.add(
      "bg-yellow-400",       // ✅ nền vàng đậm
      "text-black",          // ✅ chữ đen rõ
      "font-bold",           // ✅ chữ đậm
      "scale-110",           // ✅ phóng to nhẹ
      "ring-2",
      "ring-yellow-200",
      "ring-offset-2",
      "shadow-lg",
      "transition",
      "duration-300"
    );

    }

    setTimeout(() => {
      if (navBtn) {
        navBtn.classList.remove(
          "bg-[#FFDE70]",
          "text-black",
          "font-bold",
          "scale-110",
          "shadow-lg",
          "ring-2",
          "ring-offset-2",
          "ring-yellow-300",
          "transition",
          "duration-300"
        );
      }
      navigate("/register");
    }, 1200);
  };

  return (
    <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-md hover:shadow-lg transition duration-300 flex flex-col">
      {isPopular && (
        <div className="mb-4 self-start rounded-full bg-[#FFDE70] px-3 py-1 text-xs font-semibold text-black">
          Popular
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#333] tracking-wide uppercase">{duration}</h3>
      <p className="mt-2 text-4xl font-bold text-black">{price}</p>
      <ul className="mt-6 space-y-2 text-sm text-[#6B6B6B] flex-1">
        {features.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-[#FFDE70]">✔</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={handleClick}
        className="mt-8 w-full rounded-lg bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-[#9f9c92] hover:text-black"
      >
        Get Started
      </button>
    </div>
  );
};