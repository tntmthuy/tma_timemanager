export const Footer = () => {
  return (
    <footer className="bg-black px-8 py-12 text-sm text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 sm:grid-cols-2">
        <div>
          <div className="mb-3 text-lg font-bold">TimeManager</div>
          <p className="text-sm leading-relaxed text-[#B3B1B0]">
            Grow your business smarter — with a personal AI time manager.
          </p>
          <p className="mt-1 text-xs text-[#B3B1B0]">TimeManager, 2025.</p>
        </div>

        <div className="flex flex-wrap justify-between gap-8 text-[#B3B1B0]">
          <div>
            <h4 className="mb-2 font-semibold text-white">Platform</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-[#FFDE70]">Plans & Pricing</a></li>
              <li><a href="#" className="hover:text-[#FFDE70]">Personal AI Manager</a></li>
              <li><a href="#" className="hover:text-[#FFDE70]">AI Business Writer</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-white">Company</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-[#FFDE70]">Blog</a></li>
              <li><a href="#" className="hover:text-[#FFDE70]">Careers</a></li>
              <li><a href="#" className="hover:text-[#FFDE70]">News</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-white">Resources</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-[#FFDE70]">Documentation</a></li>
              <li><a href="#" className="hover:text-[#FFDE70]">Papers</a></li>
              <li><a href="#" className="hover:text-[#FFDE70]">Press Conferences</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-white">Get the app</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-[#FFDE70]">Windows</a></li>
              <li><a href="#" className="hover:text-[#FFDE70]">macOS</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-[#333] pt-4 text-xs text-[#B3B1B0]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 sm:flex-row sm:items-start">
          <p className="text-center sm:text-left">
            © 2025 TimeManager Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#FFDE70]">Terms of Service</a>
            <a href="#" className="hover:text-[#FFDE70]">Privacy Policy</a>
            <a href="#" className="hover:text-[#FFDE70]">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};