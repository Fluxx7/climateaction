"use client";

// import Image from "next/image";
import { useState, useRef } from "react";

export default function Home() {

  const [activeLang, setActiveLang] = useState("en"); // Active language

  const [usePrimaryEnIframe, setUsePrimaryEnIframe] = useState(true); // Determines which English iframe to use
  const [usePrimaryDeIframe, setUsePrimaryDeIframe] = useState(true); // Determines which German iframe to use

  const [enableRestartButton, setEnableRestartButton] = useState(true); // For temporarily disabling the restart button after its used

  // English iframe references
  const enIframeRef = useRef<HTMLIFrameElement>(null);
  const enIframeRefSecondary = useRef<HTMLIFrameElement>(null);

  // German iframe reference
  const deIframeRef = useRef<HTMLIFrameElement>(null);
  const deIframeRefSecondary = useRef<HTMLIFrameElement>(null);
  
  const restartIframe = (lang: string) => {

    // Prevent the restart button from being clicked multiple times
    if (!enableRestartButton)
      return;
    
    // Switch iframe and restart previous one for future restarts
    if (lang === "en" && enIframeRef.current && enIframeRefSecondary.current) {
      if (usePrimaryEnIframe) {
        setUsePrimaryEnIframe(false);
        enIframeRef.current.src += "";
      } else {
        setUsePrimaryEnIframe(true);
        enIframeRefSecondary.current.src += "";
      }

    } else if (lang === "de" && deIframeRef.current && deIframeRefSecondary.current) {
      if (usePrimaryDeIframe) {
        setUsePrimaryDeIframe(false);
        deIframeRef.current.src += "";
      } else {
        setUsePrimaryDeIframe(true);
        deIframeRefSecondary.current.src += "";
      }
    }

    setEnableRestartButton(false);
    setTimeout(() => {
      setEnableRestartButton(true);
    }, 1000);
  };

  const swapIframe = (lang: string) => {
    
    // Does nothing if trying to swap to already active language
    if (activeLang === lang)
      return;
    
    if (lang === "de" && enIframeRef.current && enIframeRefSecondary.current) {
      setActiveLang("de"); // Switches to German

      // Restarts the previous English iframe
      if (usePrimaryEnIframe) {
        enIframeRef.current.src += "";
      } else {
        enIframeRefSecondary.current.src += "";
      }
    } else if (lang === "en" && deIframeRef.current && deIframeRefSecondary.current) {
      
      setActiveLang("en"); // Switches to English

      // Restarts the previous German iframe
      if (usePrimaryDeIframe) {
        setUsePrimaryDeIframe(false);
        deIframeRef.current.src += "";
      } else {
        setUsePrimaryDeIframe(true);
        deIframeRefSecondary.current.src += "";
      }
    }
  }
  const reloadIframe = (lang: string) => {
    if (lang === "en" && enIframeRef.current) {
      enIframeRef.current.src += "";
    } else if (lang === "de" && deIframeRef.current) {
      deIframeRef.current.src += "";
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {/* Language toggle buttons and restart button */}
        <div className="flex gap-4 mb-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => swapIframe("en")}
          >
            English
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => swapIframe("de")}
          >
            Deutsche
          </button>

          {/*Restart button*/}
          <button 
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => {restartIframe(activeLang)}}
          >
            Restart
          </button>

        </div>

        {/* English Iframe */}
        <iframe
          ref={enIframeRef}
          width="710"
          height="1300"
          frameBorder="0"
          scrolling="no"
          src="https://calculator.carbonfootprint.com/calculator.aspx"
          style={{display: activeLang === "en" && usePrimaryEnIframe? "block" : "none"}}
        ></iframe>
        <iframe
          ref={enIframeRefSecondary}
          width="710"
          height="1300"
          frameBorder="0"
          scrolling="no"
          src="https://calculator.carbonfootprint.com/calculator.aspx"
          style={{display: activeLang === "en" && !usePrimaryEnIframe ? "block" : "none"}}
        ></iframe>

        {/* German Iframes */}
        <iframe
          ref={deIframeRef}
          width="710"
          height="1300"
          frameBorder="0"
          scrolling="no"
          src="https://calculator.carbonfootprint.com/calculator.aspx?lang=de"
          style={{display: activeLang === "de" && usePrimaryDeIframe? "block" : "none"}}
        ></iframe>
        <iframe
          ref={deIframeRefSecondary}
          width="710"
          height="1300"
          frameBorder="0"
          scrolling="no"
          src="https://calculator.carbonfootprint.com/calculator.aspx?lang=de"
          style={{display: activeLang === "de" && !usePrimaryDeIframe ? "block" : "none"}}
        ></iframe>
        {/*Default node.js website content*/}
        {/**<Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>*/}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/**<a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>*/}
      </footer>
    </div>
  );
}
