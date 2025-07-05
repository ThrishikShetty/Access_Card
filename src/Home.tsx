"use client";

import React from "react";
import { motion } from "framer-motion";

const Home: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-pink-200 overflow-hidden">
      {/* Subtle Dotted Background Pattern */}
      <svg
        className="absolute w-full h-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="black" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Foreground Content */}
      <motion.div
        className="z-10 px-4 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-5xl md:text-3xl font-bold text-black"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Welcome to Hamsi Code
        </motion.h1>

        <motion.p
          className="mt-4 text-black text-sm "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Comment <span className="font-semibold">"Code"</span> for the source code — I’ll send it via DM
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Home;
