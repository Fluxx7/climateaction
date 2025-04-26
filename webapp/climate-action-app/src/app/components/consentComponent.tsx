"use client";

import { sign } from "crypto";
import React, { useEffect } from "react";
import { useState } from "react";

export default function ConsentPage(contButtonCallback: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, signature: string) => void) {
    const [consentText, setConsentText] = useState<string[]>([]); // State to store the consent paragraph and final line
    const [signature, setSignature] = useState(""); // State to manage user signature

    // Retrieve consent form from public/consentForm.txt
    useEffect(() => {
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

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSignature(e.target.value); // Update state with textarea value
    };

    return <div>
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
            <button onClick={(e) => contButtonCallback(e, signature)} className="calc-btn w-50">
                Continue
            </button>
        </div>
    </div>
};