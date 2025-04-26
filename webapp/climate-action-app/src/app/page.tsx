"use client";

import React, { useRef } from "react";
import * as options from "./survey/options";
import { useFormState } from './survey/useFormState';
import { useEffect, useState } from "react";
import * as pages from "./survey/pageStates";

export default function Home() {
    const [consentText, setConsentText] = useState<string[]>([]); // State to store the consent paragraph and final line
    const { formData, setFormData, errorMessages, handleChange } = useFormState();
    const otherRef = useRef(""); // State to manage user signature
    const [refBy, setRefBy] = useState(""); // State to manage user signature
    const [drivesCar, setDrivesCar] = useState(true); // Used for enabling the slider for replaceableDrivingByTransitPercentage
    const [userConsent, setUserConsent] = useState(false); // State to manage user consent
    const [signature, setSignature] = useState(""); // State to manage user signature
    const [pageNum, setPageNum] = useState(0);
    const [submitted, setSubmitted] = useState(false); // State to manage form submission

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

    // Manages the referral radio buttons
    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            "referredBy": refBy === "Other" ? otherRef : refBy,
            }));
    }, [refBy, otherRef]);

   

    const OpenQuestion = ({
        name,
        question,
        size,
        type,
        value,
        className,
        step,
        errorMessage,
        onChange
    }: pages.InputQuestionProps) => {
        return (
        <div className={className}>
            <legend className="carbon-footprint-question font-bold">{question}</legend>
            <p className="text-red-500 text-sm">
                {errorMessage || "\u00A0"} { /* No-break-space character to maintain paragraph height for consistent formatting */}
            </p>
            {size === "large" ? 
                (<textarea
                    className= {`large-text-box input-base ${errorMessage ? "input-error" : "input-normal"}`}
                    name={name}
                    value={value}
                    onChange={onChange}
                />) 
                : (<input
                    className={`input-base ${errorMessage ? 'input-error' : 'input-normal'}`}
                    name={name}
                    type={type}
                    value={value}
                    step={step}
                    onChange={onChange}
                />)}
        </div>
        );
    };

    

    // RadioGroup component for rendering radio button groups
    const RadioGroup = ({
        name,
        legend,
        options,
        value,
        className,
        onChange,
    }: pages.RadioGroupProps) => {
        return (
            <fieldset className={className}>
                <legend className="font-bold">{legend}</legend>
                {options.map((option) => (
                    <label key={name + "-" + option.value}> {/* Label for each option from options */}
                        {/* Radio button for each option */}
                        <input
                            type="radio"
                            name={name} // Name of the radio group, matches the key in formData
                            value={option.value} // Value of a specific option
                            checked={value === option.value} // Compares selected value with value of current option
                            onChange={onChange}
                        />
                        {option.label} {/* Label for the radio button */}
                    </label>
                ))}
            </fieldset>
        );
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form reloading on submit

        const submissionData: { [key: string]: any } = { ...formData }; // Copy of formData

        // Converts empty willingToEngageWith selection to "notOpen"
        if (submissionData.willingToEngageWith?.length === 0)
            submissionData.willingToEngageWith = ["notOpen"];


        if (!submissionData.drivesCar)
            submissionData.replaceableDrivingByTransitPercentage = 0; // If user does not drive, set replaceableDrivingByTransitPercentage to 0

        const response = await fetch('/api/submitForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data: submissionData, consent: userConsent}),
        });

        if (response.ok) {
            console.log('Form submitted successfully');
            setSubmitted(true); // Set submitted to true to indicate form submission
        } else {
            console.error('Error submitting form');
        }
    };

    // Multi-select mutual exclusivity logic for willingToEngageWith 
    const handleEngageCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        const current = formData.willingToEngageWith;

        let updated: string[];

        if (checked) {
            if (value === "notOpen") {
                updated = ["notOpen"];
            } else {
                updated = current.filter((val: any) => val !== "notOpen");
                updated.push(value);
            }
        } else {
            updated = current.filter((val: any) => val !== value);
        }

        setFormData(prev => ({ ...prev, willingToEngageWith: updated }));
    };


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

    const nextPage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        // Make sure all fields are answered
        if (false) { 
            alert("Please answer all questions before continuing.");
            return; // Stop execution if the response is empty
        }

        setPageNum(pageNum+1);
    }

    // Multi-select mutual exclusivity logic for willingToChange
    const isNotOpenSelected = formData.willingToEngageWith?.includes("notOpen");
    const isAnyOtherEngageSelected = formData.willingToEngageWith?.some((val:any) => val !== "notOpen");

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
                 (!submitted ? (
                    <form onSubmit={handleSubmit}>

                        {/* Referred By */}
                        <fieldset className="outer-box">
                            <legend className="font-bold">Who referred you to this survey?</legend>
                            {options.referralOptions.map(option => (
                                <label key={"referredBy-"+option.value}>
                                    <input
                                        type="radio"
                                        name="referredBy"
                                        value={option.value}
                                        onChange={e => setRefBy(e.target.value)}
                                    />
                                    {option.label}
                                </label>
                            ))}
                            <label className="inline-flex">
                                <input
                                    type="radio"
                                    name="referredBy"
                                    value="Other"
                                    onChange={e => setRefBy(e.target.value)}
                                />
                                Other (please specify):
                                <input
                                    type="text"
                                    name="otherReferralValue"
                                    disabled={refBy !== 'Other'}
                                    onChange={e => otherRef.current = e.target.value}
                                    className="border rounded-md p-2"
                                    style={{
                                        color: refBy === 'Other' ? 'var(--text)' : 'gray',
                                        borderColor: refBy === 'Other' ? 'white' : 'gray',
                                        background: refBy === 'Other' ? 'var(--background)' :  '#045656'
                                    }}
                                />
                            </label>
                            
                        </fieldset>

                        {/* Willing to Change */}
                        {/* Inclination to Change */}
                        <RadioGroup className="outer-box"
                            name="inclinationToChange"
                            legend="How inclined do you feel to change your lifestyle choices to be more sustainable?"
                            options={options.inclinationOptions}
                            value={String(formData.inclinationToChange)}
                            onChange={handleChange}
                        />

                        {/*Largest Impact Choice */}
                        <RadioGroup className="outer-box"
                            name="largestImpactChoice"
                            legend="Which of your lifestyle choices do you think has the largest impact on the environment?"
                            options={options.carbonFootprintCategories}
                            value={String(formData.largestImpactChoice)}
                            onChange={handleChange}
                        />


                        {/* Total Carbon Footprint */}
                        <OpenQuestion className="outer-box"
                            name="totalCarbonFootprint" 
                            question="What is your total carbon footprint in tons?" 
                            size="small" 
                            type="number" 
                            value={formData.totalCarbonFootprint} 
                            step="0.01"
                            errorMessage={errorMessages.totalCarbonFootprint}
                            onChange={handleChange}                            
                        />


                        {/* Air Travel Footprint */}
                        <OpenQuestion className="outer-box"
                            name="airTravelFootprint" 
                            question="What is your carbon footprint for air travel in tons?" 
                            size="small" 
                            type="number" 
                            value={formData.airTravelFootprint} 
                            step="0.01"
                            errorMessage={errorMessages.totalCarbonFootprint}
                            onChange={handleChange}                            
                        />

                        {/* Home Footprint */}
                        <OpenQuestion className="outer-box"
                            name="homeFootprint" 
                            question="What is your carbon footprint for home in tons?" 
                            size="small" 
                            type="number" 
                            value={formData.homeFootprint} 
                            step="0.01"
                            errorMessage={errorMessages.homeFootprint}
                            onChange={handleChange}                            
                        />

                        {/* Ground Transportation Footprint */}
                        <OpenQuestion className="outer-box"
                            name="groundTransportationFootprint" 
                            question="What is your carbon footprint for ground transportation in tons?" 
                            size="small" 
                            type="number" 
                            value={formData.groundTransportationFootprint} 
                            step="0.01"
                            errorMessage={errorMessages.groundTransportationFootprint}
                            onChange={handleChange}                            
                        />

                        {/* Diet Footprint */}
                        <OpenQuestion className="outer-box"
                            name="dietFootprint" 
                            question="What is your carbon footprint for diet in tons?" 
                            size="small" 
                            type="number" 
                            value={formData.dietFootprint} 
                            step="0.01"
                            errorMessage={errorMessages.dietFootprint}
                            onChange={handleChange}                            
                        />

                        {/* Electricity Footprint */}
                        <OpenQuestion className="outer-box"
                            name="electricityFootprint" 
                            question="What is your carbon footprint for electricity in tons?" 
                            size="small" 
                            type="number" 
                            value={formData.electricityFootprint} 
                            step="0.01"
                            errorMessage={errorMessages.electricityFootprint}
                            onChange={handleChange}                            
                        />

                        {/* Other Consumption Footprint */}
                        <OpenQuestion className="outer-box"
                            name="otherConsumptionFootprint" 
                            question="What is your carbon footprint for other consumption in tons?" 
                            size="small" 
                            type="number" 
                            value={formData.otherConsumptionFootprint} 
                            step="0.01"
                            errorMessage={errorMessages.otherConsumptionFootprint}
                            onChange={handleChange}                            
                        />

                        {/* Air Travel Leisure Percentage */}
                        {formData.airTravelFootprint !== 0 && (
                            <div className="range-input">
                                <legend>What percentage of your air travel is for leisure?</legend>
                                <input
                                    type="range"
                                    name="airTravelLeisurePercentage"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={formData.airTravelLeisurePercentage}
                                    onChange={handleChange}
                                />
                                <span>{formData.airTravelLeisurePercentage}%</span>
                            </div>
                        )}

                        
                        {/* Goal to Reduce Air Travel */}
                        <OpenQuestion className="outer-box"
                            name="goalToReduceAirTravel" 
                            question="If possible, write a goal you can pursue to reduce your air travel:" 
                            size="large" 
                            value={formData.goalToReduceAirTravel}
                            onChange={handleChange}                            
                        />
                        
                        {/* Replaceable Driving by Transit Percentage */}
                        <div className={`range-input ${drivesCar ? '' : 'disabled-range-input'}`}>
                            <legend> What percentage of your driving can be replaced by public transit?</legend>
                            <input
                                type="range"
                                name="replaceableDrivingByTransitPercentage"
                                min="0"
                                max="100"
                                step="5"
                                value={formData.replaceableDrivingByTransitPercentage}
                                onChange={handleChange}
                                disabled={!drivesCar}
                            />
                            <span>{drivesCar ? formData.replaceableDrivingByTransitPercentage : 0}%</span>
                        </div>
                        {/* Checkbox for "I do not drive a car" */}
                        <label>
                            <input
                                type="checkbox"
                                name="drivesCar"
                                //checked={!drivesCar}
                                onChange={(e) => {
                                    setDrivesCar(!e.target.checked);
                                    setFormData((prev) => ({
                                        ...prev,
                                        drivesCar: !drivesCar
                                    }));
                                }}
                            />
                            I do not drive a car.
                        </label>

                        {/* Ideas to Improve Diet */}
                        <OpenQuestion className="outer-box"
                            name="ideasToImproveDiet" 
                            question="Do you have any ideas to improve your diet for the future?" 
                            size="large" 
                            value={formData.ideasToImproveDiet}
                            onChange={handleChange}                            
                        />

                        {/* Effort to Buy Local Food */}
                        <RadioGroup className="outer-box"
                            name="effortToBuyLocalFood"
                            legend="Do you make an effort to buy local food?"
                            options={options.effortToBuyLocalFoodOptions}
                            value={formData.effortToBuyLocalFood}
                            onChange={handleChange}
                        />

                        {/* Willing to Give Up */}
                        <OpenQuestion className="outer-box"
                            name="willingToGiveUp" 
                            question="What are you willing to give up to reduce your carbon footprint?" 
                            size="small" 
                            type="text"
                            value={formData.willingToGiveUp}
                            onChange={handleChange}                            
                        />

                        <legend> What are you willing to give up to reduce your carbon footprint?</legend>
                        <input
                            className="input-base"
                            name="willingToGiveUp"
                            type="text"
                            onChange={handleChange}
                        />

                        {/* Not Willing to Give Up */}
                        <legend> What are you NOT willing to give up to reduce your carbon footprint?</legend>
                        <input
                            className="input-base"
                            name="notWillingToGiveUp"
                            type="text"
                            //value={formData.notWillingToGiveUp}
                            onChange={handleChange}
                        />

                        {/* Willing to Engage With */}
                        <legend> Would you be willing to engage with friends, family, or coworkers to reduce your climate impact?</legend>
                        {options.willingToEngageOptions.map((option) => (
                            <label key={"willingToEngageWith-" + option.value}>
                                <input
                                    type="checkbox"
                                    name="willingToEngageWith"
                                    value={option.value}
                                    disabled={(isNotOpenSelected && option.value !== "notOpen") || (isAnyOtherEngageSelected && option.value === "notOpen")}
                                    checked={formData.willingToEngageWith?.includes(option.value)}
                                    onChange={(e) => handleEngageCheckboxChange(e)}
                                />
                                {option.label}
                            </label>

                        ))}

                        {/* Group Goals */}
                        <legend>
                            Write 1-2 goals that you could pursue in a group or community to
                            reduce your collective carbon footprints. (Example: "We will all
                            take the S-Bahn to commute to work at least once a week" or
                            "We won't fly on airplanes when we go on vacations together.") </legend>
                        <textarea
                            className="large-text-box"
                            name="groupGoals"
                            //value={formData.groupGoals}
                            onChange={handleChange}
                        />

                        {/* Submit Button */}
                        <div>
                            <button type="submit" className="calc-btn">Submit</button>
                        </div>
                    </form>
                ): (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Thank you for your submission!</h2>
                        <p>Your responses have been recorded.</p>
                    </div>
                ))}
            </main>
        </div>
    );
}