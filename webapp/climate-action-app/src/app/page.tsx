"use client";

import React, { useRef } from "react";
import * as options from "./survey/options";
import { useFormState } from './survey/useFormState';
import { useEffect, useState } from "react";
import * as pages from "./survey/pageStates";
import { SurveyForm } from "./components/components";

export default function Home() {
    const [consentText, setConsentText] = useState<string[]>([]); // State to store the consent paragraph and final line
    const [userConsent, setUserConsent] = useState(false); // State to manage user consent
    const [signature, setSignature] = useState(""); // State to manage user signature
    
    useEffect(() => {

        // Trigger the database initialization when the page is loaded (only initializes if it has not been initialized yet)
        const initDatabase = async () => {
            try {
                const response = await fetch('/api/init-db');
                if (response.ok) {
                    console.log('Database initialized');
                } else {
                    console.error('Error initializing database');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        initDatabase();

        // Retrieve consent form from public/consentForm.txt
        fetch("/consentForm.txt")
            .then((res) => res.text())
            .then((text) => {
                const paragraphs = text.split(/\n\s*\n/).slice(0, 3);

                setConsentText(paragraphs);
            })
            .catch((err) => {
                console.error("Failed to load consent form:", err);
            });
    }, []);

    

   

    


    // Function to handle textarea change
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSignature(e.target.value); // Update state with textarea value
    };

    // Function to handle the "Continue" button click
    const continueToSurvey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        // Check if the response length is not 0 (after trimming whitespace)
        if (signature.trim().length === 0) {
            alert("Please provide your name before continuing.");
            return; // Stop execution if the response is empty
        }

        setUserConsent(true);
    };

    

    return (
        <div className="grid grid-rows-[1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main style={{ width: "75%" }}>
                {/* Logo at the top */}
                <header className="logo-container mb-8">
                    <img src="/wpilogo.png" alt="Logo" className="logo" />
                </header>
                {!userConsent ? 
                (
                    <div>
                        {consentText.map((para, index) => (
                            <React.Fragment key={index}>
                                <p className="mb-4">{para}</p>

                                {/* Insert textbox between 2nd and 3rd paragraph */}
                                {index === 1 && (
                                    <div className="flex items-center">
                                        <label htmlFor="response" className="mr-4">Name: </label>
                                        <textarea id="response" name="response" className="border rounded-md p-2 mb-4" rows={1} cols={25} onChange={handleInputChange}></textarea>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}

                        <div className="flex flex-col justify-center items-center mb-4">
                            <button onClick={continueToSurvey} className="calc-btn w-50">
                                Continue
                            </button>
                        </div>
                    </div>
                ) 
                :
                <SurveyForm/>}
                 
            </main>
        </div>
    );
}