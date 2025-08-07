import React from "react";
import styles from "./LaoderCss.module.css";

function Loader({ loader }) {
  return (
    <div
      className={`
        fixed inset-0 flex items-center justify-center z-50
        transition-opacity duration-500 ease-in-out
        ${
          loader
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }
        ${styles.loaderBg} ${styles.skyGlow}
      `}>
      <div className="flex flex-col items-center justify-center">
        <div
          className={`relative w-24 h-12 md:w-32 md:h-16 bg-gradient-to-r from-gray-200 to-cyan-300 rounded-full ${styles.cloudDrift}`}>
          <svg
            className={`absolute top-3 left-1/2 transform -translate-x-1/2 w-10 h-10 md:w-12 md:h-12 text-yellow-200 ${styles.lightningFlash}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>

          <div
            className={`absolute top-12 md:top-16 left-1/4 w-1 h-5 bg-cyan-300 rounded-full ${styles.rainFall1}`}></div>
          <div
            className={`absolute top-12 md:top-16 left-1/2 w-1 h-5 bg-cyan-300 rounded-full ${styles.rainFall2}`}></div>
          <div
            className={`absolute top-12 md:top-16 left-3/4 w-1 h-5 bg-cyan-300 rounded-full ${styles.rainFall3}`}></div>
        </div>

        <p className="mt-6 text-gray-100 text-sm md:text-base font-semibold tracking-wide animate-pulse">
          Loading Sky...
        </p>
      </div>
    </div>
  );
}

export default Loader;
