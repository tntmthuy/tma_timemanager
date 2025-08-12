import { PageSectionWrapper } from "./PageSectionWrapper";

export const ContactSection = () => {
  return (
    <PageSectionWrapper>
      <section
        id="contact"
        className="bg-white bg-cover bg-center px-4 py-16 text-black"
        style={{ backgroundImage: "url('/images/contact.png')" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="hidden md:block" />

          <div className="bg-white bg-opacity-90 p-8 rounded-lg">
            <form className="space-y-4 max-w-md w-full mx-auto">
              <h2 className="text-2xl font-bold">Let’s Optimize Your Time Together</h2>
              <p className="text-sm text-[#4B4B4B] leading-relaxed">
                Need help getting started or have questions about our time management tools?
                We’re here to help you work smarter, not harder.
              </p>
              <input
                type="email"
                placeholder="Your email"
                className="w-full border border-black rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              <input
                type="text"
                placeholder="Your name"
                className="w-full border border-black rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              <textarea
                rows={4}
                placeholder="Your message"
                className="w-full border border-black rounded px-4 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button
                type="submit"
                className="rounded border border-black bg-[#FFDE70] px-6 py-2 font-medium text-black transition hover:bg-black hover:text-[#FFF6EE]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </PageSectionWrapper>
  );
};