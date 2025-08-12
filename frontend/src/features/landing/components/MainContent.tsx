export const MainContent = () => {
  return (
    <section
      className="flex min-h-screen flex-col justify-center bg-center bg-no-repeat py-20"
      style={{
        backgroundImage: "url('/images/content.png')",
        backgroundSize: "1000px auto",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center top",
      }}
    >
      <div className="mx-auto w-full max-w-[1000px] px-4">
        <div className="max-w-2xl text-left text-black">
          <h1 className="mt-8 mb-6 text-4xl font-bold">
            Master Your Time, Own Your Life
          </h1>
          <p className="mb-10 max-w-lg text-[#a09d9b]">
            Get more done with less effort. Plan smarter, stay focused, and
            manage your time like a pro — all in one place.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button className="rounded border border-black bg-[#FFDE70] px-6 py-2 font-medium text-black transition hover:bg-black hover:text-white">
              Get Started
            </button>
            <a
              href="#pricing"
              className="rounded border border-black bg-transparent px-6 py-2 font-medium text-black transition hover:bg-black hover:text-white"
            >
              View Prices
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
