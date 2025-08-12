import { Link } from "react-router-dom";

export const Navbar = () => {
  const linkClass = `
    relative
    after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0
    after:bg-[#FFDE70] after:transition-all after:duration-200 after:content-['']
    hover:after:w-full
    text-white hover:text-[#FFDE70]
  `;

  return (
    <nav className="bg-black py-4 text-white shadow">
      <div className="mx-auto flex w-full max-w-[1000px] items-center justify-between px-4">
        <div className="text-xl font-bold text-white">tma.</div>
        <div className="hidden items-center gap-6 md:flex">
          <a href="#pricing" className={linkClass}>
            View Prices
          </a>
          <a href="#contact" className={linkClass}>
            Contact Me
          </a>
          <p>|</p>
          <Link to="/login" className={linkClass}>
            Login
          </Link>
          <Link to="/register">
            <button
              id="navbar-getstarted"
              className="rounded bg-white px-6 py-2 font-medium text-black transition hover:bg-[#FFDE70] hover:text-black"
            >
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};