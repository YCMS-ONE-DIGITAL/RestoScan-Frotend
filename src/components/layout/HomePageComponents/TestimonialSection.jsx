import React from "react";

const TestimonialSection = () => {
  const testimonials = [
    {
      desc: `"We're able to track every order in real time, keep our menu updated, and quickly manage payments. It's like having an extra set of hands in the restaurant."`,
      title: "Harshal Mali",
      subtitle: "Owner of Borivali Restaurant",
    },
    {
      desc: `"The QR Code menu and payment integration have made a huge difference for us, especially after the pandemic. Customers love the ease, and we’ve seen faster table turnover."`,
      title: "Harshal Mali",
      subtitle: "Owner of Nashik Restaurant",
    },
    {
      desc: `"We're able to track every order in real time, keep our menu updated, and quickly manage payments. It's like having an extra set of hands in the restaurant."`,
      title: "Michael Scott",
      subtitle: "Owner of Downtown Eats",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-20 px-6 sm:px-10 lg:px-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3">
          What Restaurant Owners Are Saying
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Hear from real restaurants using RestoScan to run smoother, faster, and smarter.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed italic mb-6">
              {t.desc}
            </p>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;
