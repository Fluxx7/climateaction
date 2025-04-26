import React, { useRef, useState, useEffect } from "react";
import * as options from "../survey/options";
import { EventSubmission, useFormState } from "../survey/useFormState";
import { RadioGroup, OpenQuestion, SliderQuestion, CheckboxGroup } from "./minorComponents";


export default function SurveyForm(userConsent: boolean) {
    const { formData, setFormData, errorMessages, handleChange } = useFormState();
    const otherRef = useRef(""); // State to manage user signature
    
    const [drivesCar, setDrivesCar] = useState(true); // Used for enabling the slider for replaceableDrivingByTransitPercentage
    const [pageNum, setPageNum] = useState(0);
    const [submitted, setSubmitted] = useState(false); // State to manage form submission



   



    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form reloading on submit

        const submissionData: { [key: string]: any; } = { ...formData }; // Copy of formData


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
            body: JSON.stringify({ data: submissionData, consent: userConsent }),
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

    const nextPage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        // Make sure all fields are answered
        if (false) {
            alert("Please answer all questions before continuing.");
            return; // Stop execution if the response is empty
        }

        setPageNum(pageNum + 1);
    };

    // Multi-select mutual exclusivity logic for willingToChange
    const isNotOpenSelected = formData.willingToEngageWith?.includes("notOpen");
    const isAnyOtherEngageSelected = formData.willingToEngageWith?.some((val: any) => val !== "notOpen");

    return !submitted ? (
        <form onSubmit={handleSubmit}>

            {/* Referred By */}
            <RadioGroup 
                name="referredBy"
                question="Who referred you to this survey?"
                options={options.referralOptions}
                value={String(formData.inclinationToChange)}
                onChange={handleChange} />
            

            {/* Willing to Change */}
            {/* Inclination to Change */}
            <RadioGroup 
                name="inclinationToChange"
                question="How inclined do you feel to change your lifestyle choices to be more sustainable?"
                options={options.inclinationOptions}
                value={String(formData.inclinationToChange)}
                onChange={handleChange} />

            {/*Largest Impact Choice */}
            <RadioGroup 
                name="largestImpactChoice"
                question="Which of your lifestyle choices do you think has the largest impact on the environment?"
                options={options.carbonFootprintCategories}
                value={String(formData.largestImpactChoice)}
                onChange={handleChange} />


            {/* Total Carbon Footprint */}
            <OpenQuestion 
                name="totalCarbonFootprint"
                question="What is your total carbon footprint in tons?"
                size="small"
                type="number"
                value={formData.totalCarbonFootprint}
                step="0.01"
                errorMessage={errorMessages.totalCarbonFootprint}
                onChange={handleChange} />


            {/* Air Travel Footprint */}
            <OpenQuestion 
                name="airTravelFootprint"
                question="What is your carbon footprint for air travel in tons?"
                size="small"
                type="number"
                value={formData.airTravelFootprint}
                step="0.01"
                errorMessage={errorMessages.totalCarbonFootprint}
                onChange={handleChange} />

            {/* Home Footprint */}
            <OpenQuestion
                name="homeFootprint"
                question="What is your carbon footprint for home in tons?"
                size="small"
                type="number"
                value={formData.homeFootprint}
                step="0.01"
                errorMessage={errorMessages.homeFootprint}
                onChange={handleChange} />

            {/* Ground Transportation Footprint */}
            <OpenQuestion 
                name="groundTransportationFootprint"
                question="What is your carbon footprint for ground transportation in tons?"
                size="small"
                type="number"
                value={formData.groundTransportationFootprint}
                step="0.01"
                errorMessage={errorMessages.groundTransportationFootprint}
                onChange={handleChange} />

            {/* Diet Footprint */}
            <OpenQuestion 
                name="dietFootprint"
                question="What is your carbon footprint for diet in tons?"
                size="small"
                type="number"
                value={formData.dietFootprint}
                step="0.01"
                errorMessage={errorMessages.dietFootprint}
                onChange={handleChange} />

            {/* Electricity Footprint */}
            <OpenQuestion 
                name="electricityFootprint"
                question="What is your carbon footprint for electricity in tons?"
                size="small"
                type="number"
                value={formData.electricityFootprint}
                step="0.01"
                errorMessage={errorMessages.electricityFootprint}
                onChange={handleChange} />

            {/* Other Consumption Footprint */}
            <OpenQuestion 
                name="otherConsumptionFootprint"
                question="What is your carbon footprint for other consumption in tons?"
                size="small"
                type="number"
                value={formData.otherConsumptionFootprint}
                step="0.01"
                errorMessage={errorMessages.otherConsumptionFootprint}
                onChange={handleChange} />

            {/* Air Travel Leisure Percentage */}

            {formData.airTravelFootprint !== 0 && (
                <SliderQuestion 
                    name="airTravelLeisurePercentage"
                    type="number"
                    value={formData.airTravelLeisurePercentage}
                    question="What percentage of your air travel is for leisure?"
                    range={["0", "100"]}
                    step="5"
                    onChange={handleChange} />
            )}


            {/* Goal to Reduce Air Travel */}
            <OpenQuestion
                name="goalToReduceAirTravel"
                question="If possible, write a goal you can pursue to reduce your air travel:"
                size="large"
                value={formData.goalToReduceAirTravel}
                onChange={handleChange} />

            {/* Replaceable Driving by Transit Percentage */}
            <SliderQuestion 
                name="replaceableDrivingByTransitPercentage"
                type="number"
                value={formData.replaceableDrivingByTransitPercentage}
                question="What percentage of your driving can be replaced by public transit?"
                range={["0", "100"]}
                step="5"
                onChange={handleChange}
                disable="I do not drive a car." />

            {/* Ideas to Improve Diet */}
            <OpenQuestion 
                name="ideasToImproveDiet"
                question="Do you have any ideas to improve your diet for the future?"
                size="large"
                value={formData.ideasToImproveDiet}
                onChange={handleChange} />

            {/* Effort to Buy Local Food */}
            <RadioGroup 
                name="effortToBuyLocalFood"
                question="Do you make an effort to buy local food?"
                options={options.effortToBuyLocalFoodOptions}
                value={formData.effortToBuyLocalFood}
                onChange={handleChange} />

            {/* Willing to Give Up */}
            <OpenQuestion 
                name="willingToGiveUp"
                question="What are you willing to give up to reduce your carbon footprint?"
                size="small"
                type="text"
                value={formData.willingToGiveUp}
                onChange={handleChange} />

            {/* Not Willing to Give Up */}
            <OpenQuestion 
                name="notWillingToGiveUp"
                question="What are you NOT willing to give up to reduce your carbon footprint?"
                size="small"
                type="text"
                value={formData.notWillingToGiveUp}
                onChange={handleChange} />

            {/* Willing to Engage With */}
            <CheckboxGroup 
                value={formData.willingToEngageOptions} 
                options={options.willingToEngageOptions} 
                name={"willingToEngageWith"} 
                question={"Would you be willing to engage with friends, family, or coworkers to reduce your climate impact?"} 
                onChange={handleChange}
            />

            {/* Group Goals */}
            <OpenQuestion 
                name="groupGoals"
                question={`Write 1-2 goals that you could pursue in a group or community to
                reduce your collective carbon footprints. (Example: "We will all
                take the S-Bahn to commute to work at least once a week" or
                "We won't fly on airplanes when we go on vacations together.`}
                size="large"
                type="text"
                value={formData.groupGoals}
                onChange={handleChange} />

            {/* Submit Button */}
            <div>
                <button type="submit" className="calc-btn">Submit</button>
            </div>
        </form>) : (
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Thank you for your submission!</h2>
            <p>Your responses have been recorded.</p>
        </div>);
};
