"use client";

import React from "react";
import { useEffect, useState } from "react";
import SurveyForm from "./components/formComponent";
import ConsentPage from "./components/consentComponent";

export default function Home() {
    const [userConsent, setUserConsent] = useState(false); // State to manage user consent
    
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
    }, []);

    // Function to handle the "Continue" button click
    const continueToSurvey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, signature: string) => {
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
                {
                !userConsent ? 
                    <ConsentPage contButtonCallback={continueToSurvey}/> :
                    <SurveyForm consent={userConsent}/>
                }
                 
            </main>
        </div>
    );
}