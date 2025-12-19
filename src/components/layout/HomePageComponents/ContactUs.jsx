import React from "react";

const ContactUs = () => {
  return (
<section className="w-full px-5 sm:px-8 py-16 lg:py-24 transition-colors duration-300 bg-white dark:bg-gray-900"   id="contact"
>      {/* Title */}
       <div className="text-center mb-12">
    <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-white mb-3">
      Get in Touch
    </h2>
    <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
      Have questions or need help? Reach out to us — we’d love to hear from you.
    </p>
  </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
    {/* Left Image */}
    <div className="overflow-hidden rounded-2xl shadow-md">
      <img
        src="https://images.unsplash.com/photo-1572021335469-31706a17aaef?q=80&w=800&auto=format&fit=crop"
        alt="Contact Us"
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
      />
    </div>

        {/* Right Side Info */}
        <div className="space-y-10">
          {/* Address */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Our Address
            </h3>
            <div className="flex items-start gap-4">
              <svg
                className="w-6 h-6 text-indigo-500 mt-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeWidth="1.5"
                  d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0Z"
                />
                <circle cx="12" cy="10" r="3" />
              </svg>

              <div>
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  Bond Hobbs Inc
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  957 Jamie Station, Lamontborough, SD 27319-9459
                </p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact Email
            </h3>
            <div className="flex items-start gap-4">
              <svg
                className="w-6 h-6 text-indigo-500 mt-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeWidth="1.5"
                  d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 01-2 2H4a2 2 0 01-2-2V10a2 2 0 01.8-1.6l8-6a2 2 0 012.4 0l8 6Z"
                />
                <path
                  strokeWidth="1.5"
                  d="m22 10-8.97 5.7a1.94 1.94 0 01-2.06 0L2 10"
                />
              </svg>

              <div>
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  Email Us
                </p>
                <a
                  href="mailto:support@example.com"
                  className="text-indigo-500 hover:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition"
                >
                  support@example.com
                </a>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Call Us
            </h3>
            <div className="flex items-start gap-4">
              <svg
                className="w-6 h-6 text-indigo-500 mt-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeWidth="1.5"
                  d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.15 9.81 19.79 19.79 0 010 1.18 2 2 0 012 0h3a2 2 0 012 1.72 13.07 13.07 0 00.7 2.81 2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 007.07 7.07l1.27-1.27a2 2 0 012.11-.45 13.07 13.07 0 002.81.7A2 2 0 0122 16.92z"
                />
              </svg>

              <div>
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  Customer Support
                </p>
                <a
                  href="tel:+11234567890"
                  className="text-indigo-500 hover:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition"
                >
                  +1 (123) 456-7890
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
