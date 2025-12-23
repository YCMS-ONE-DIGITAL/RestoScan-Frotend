import React from "react";
import { motion } from "framer-motion";
import GetStartedButton from "./GetStartedButton";
import banner1 from "../../../assets/banner1.png";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="bg-gradient-to-br from-gray-50 via-purple-50 to-purple-100 dark:from-gray-900 dark:to-purple-950 overflow-hidden"
    >
      {/* Wrapper */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-20 lg:py-28 flex flex-col-reverse lg:flex-row items-center justify-between gap-16">
        
        {/* 🟣 LEFT — TEXT */}
        <motion.div
          className="flex-1 text-center lg:text-left space-y-8"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Power Your Restaurant <br />
            with{" "}
            <span className="text-purple-600 dark:text-purple-400">
              Smart POS Software
            </span>
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Manage orders, menus, tables, and payments effortlessly — all in one
            dashboard. Boost productivity, cut errors, and grow faster with
            RestoScan.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
            <GetStartedButton
              text="Start Free Trial"
              onClick={() =>
                (window.location.href =
                  "https://restoscan.com/restaurant-signup")
              }
            />

          </div>
        </motion.div>

        {/* 🟣 RIGHT — IMAGE */}
        <motion.div
          className="flex-1 flex justify-center relative order-first lg:order-last"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Animated Glow Effect */}
          <div className="absolute -inset-6 bg-purple-300/25 dark:bg-purple-600/20 rounded-3xl blur-3xl animate-pulse"></div>

          <img
            src={banner1}
            alt="POS Dashboard Preview"
            className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
