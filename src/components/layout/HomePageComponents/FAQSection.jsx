import React from "react";

const faqs = [
  {
    question: "How can I contact customer support?",
    answer:
      "Our dedicated support team is available 24/7 via email and chat to assist you with any questions or technical issues.",
  },
  {
    question: "Can I use the POS system on multiple devices?",
    answer:
      "Yes! You can access your POS system from any device — tablet, desktop, or mobile — with real-time synchronization.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Absolutely. You can start with a 14-day free trial with full access to all premium features — no credit card required.",
  },
  {
    question: "How secure is my data?",
    answer:
      "Your data is encrypted using industry-standard SSL and stored securely on our cloud servers with daily backups.",
  },
  {
    question: "Can I customize the menu layout?",
    answer:
      "Yes, our POS system allows you to fully customize menu categories, items, and prices according to your business needs.",
  },
  {
    question: "Do you provide onboarding support?",
    answer:
      "Yes, we provide personalized onboarding sessions to help you set up and learn the system quickly.",
  },
];

const FAQSection = () => {
  return (
    
    <section
      id="user-faqs"
      className="bg-white dark:bg-gray-900 py-16 px-6 sm:px-10 lg:px-20"
    >
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
          Your Questions, Answered
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400 text-lg">
          Everything you need to know about using RestoScan effectively.
        </p>
        <div className="w-20 h-1 bg-purple-600 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* FAQ Grid */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 gap-10">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {faq.question}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
