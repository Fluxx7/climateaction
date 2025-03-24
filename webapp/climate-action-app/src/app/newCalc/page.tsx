"use client";

// import Image from "next/image";
import { useState, useRef } from "react";

export default function Home() {

  const [activeLang, setActiveLang] = useState("en"); // Active language

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <a href="..">
        <button className="flex px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" >Main Calculator</button>
      </a>
      <main>
        {/* Language toggle buttons and restart button */}
        <div className="flex gap-4 mb-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setActiveLang("en")}
          >
            English
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => setActiveLang("de")}
          >
            Deutsche
          </button>
        </div>
        </main>
      
    </div>
  );
}
