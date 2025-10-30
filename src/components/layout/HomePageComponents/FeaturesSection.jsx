import React from "react";

const FeaturesSection = () => {
  const features = [
    {
      title: "Streamline Order Management",
      desc: "Track dine-in, delivery, and takeaway orders in one unified dashboard. Reduce wait times and keep every order organized effortlessly.",
      img: "https://restoscan.com/landing/order-management.png",
      reverse: false,
    },
    {
      title: "Optimize Table Reservations",
      desc: "Manage real-time table bookings, avoid double reservations, and maximize your restaurant’s seating efficiency during rush hours.",
      img: "https://restoscan.com/landing/table-reservation.png",
      reverse: true,
    },
    {
      title: "Effortless Menu Management",
      desc: "Easily add, update, or remove dishes anytime. Keep your menu fresh and automatically synced across POS and customer screens.",
      img: "https://restoscan.com/landing/menu-management.png",
      reverse: false,
    },
  ];

  return (
    <section className="w-full bg-white dark:bg-gray-900 py-20">
  <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-24" id="control-section">
    {/* Title */}
    <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
        Take Control of Your Restaurant
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-lg mt-3 max-w-2xl mx-auto">
        Smart, simple, and scalable tools to make restaurant management effortless.
      </p>
      <div className="w-16 h-1 bg-purple-500 mx-auto mt-5 rounded-full"></div>
    </div>

    {/* Features */}
    {features.map((feature, i) => (
      <div
        key={i}
        className={`flex flex-col-reverse lg:flex-row ${
          feature.reverse ? "lg:flex-row-reverse" : ""
        } items-center gap-14 lg:gap-20`}
      >
        {/* Text */}
        <div className="flex-1 text-center lg:text-left space-y-5">
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
            {feature.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
            {feature.desc}
          </p>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-800 p-4 sm:p-6">
            <img
              src={feature.img}
              alt={feature.title}
              className="rounded-xl object-cover w-full max-w-md"
            />
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

  );
};

export default FeaturesSection;
