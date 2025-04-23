"use client";

import { useState } from "react";
import * as options from "./options";
import { useFormState } from './useFormState';

export default function Home() {

    const { formData, setFormData, errorMessages, handleChange } = useFormState();
    const [drivesCar, setDrivesCar] = useState(true); // Used for enabling the slider for replaceableDrivingByTransitPercentage

    // Options for radio buttons for multiple choice questions
    // Used for inclinationToChange, largestImpactChoice, effortToBuyLocalFood
    type Option = {
        value: string;
        label: string;
    };

    // RadioGroup interface for rendering radio button groups
    // This is used for inclinationToChange, largestImpactChoice, and effortToBuyLocalFood
    interface RadioGroupProps {
        name: string; // Name of the radio group (same as key in formData)
        legend: string; // Question
        options: Option[]; // Array of options for the radio buttons 
        value: string; // Currently selected value (passed in from formData)
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }

    // RadioGroup component for rendering radio button groups
    const RadioGroup = ({
        name,
        legend,
        options,
        value,
        onChange
    }: RadioGroupProps) => {
        return (
            <fieldset>
                <legend>{legend}</legend>
                {options.map((option) => (
                    <label key={option.value}> {/* Label for each option from options */}
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

        const submissionData = {...formData}; // Copy of formData

        // Converts empty willingToEngageWith selection to "notOpen"
        if (submissionData.willingToEngageWith.length === 0)
            submissionData.willingToEngageWith = ["notOpen"];

        const response = await fetch('/api/submitForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionData),
        });

        if (response.ok) {
            console.log('Form submitted successfully');
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
                updated = current.filter((val) => val !== "notOpen");
                updated.push(value);
            }
        } else {
            updated = current.filter((val) => val !== value);
        }
        
        setFormData(prev => ({ ...prev, willingToEngageWith: updated }));
    };

    // Multi-select mutual exclusivity logic for willingToChange
    const isNotOpenSelected = formData.willingToEngageWith.includes("notOpen");
    const isAnyOtherEngageSelected = formData.willingToEngageWith.some(val => val !== "notOpen");

    return (
        <div className="grid grid-rows-[1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main style={{ width: "75%" }}>
                <form onSubmit={handleSubmit}>

                    {/* Referred By */}
                    <fieldset>
                        <legend >Who referred you to this survey?</legend>
                        {options.referallOptions.map(option => (
                            <label key={option.value}>
                                <input
                                    type="radio"
                                    name="referredBy"
                                    value={option.value}
                                    checked={formData.referredBy === option.value}
                                    onChange={handleChange}
                                />
                                {option.label}
                            </label>
                        ))}
                        <label className="inline-label">
                            <input
                                type="radio"
                                name="referredBy"
                                value="Other"
                                onChange={handleChange}
                                checked={formData.referredBy === "Other"}
                            />
                            Other (please specify):
                        </label>
                        <input
                            type="text"
                            name="otherReferralValue"
                            disabled={formData.referredBy !== 'Other'}
                            value={formData.otherReferralValue}
                            onChange={handleChange}
                            className="border rounded-md p-2"
                            style={{
                                color: formData.referredBy === 'Other' ? 'var(--foreground)' : 'gray',
                                borderColor: formData.referredBy === 'Other' ? 'white' : 'gray'
                            }}
                        />
                    </fieldset>

                    {/* Willing to Change */}
                    {/* Inclination to Change */}
                    <RadioGroup
                        name="inclinationToChange"
                        legend="How inclined do you feel to change your lifestyle choices to be more sustainable?"
                        options={options.inclinationOptions}
                        value={String(formData.inclinationToChange)}
                        onChange={handleChange}
                    />

                    {/*Largest Impact Choice */}
                    <RadioGroup
                        name="largestImpactChoice"
                        legend="Which of your lifestyle choices do you think has the largest impact on the environmenmt?"
                        options={options.carbonFootprintCategories}
                        value={String(formData.largestImpactChoice)}
                        onChange={handleChange}
                    />


                    {/* Total Carbon Footprint */}
                    <legend className="carbon-footprint-question">What is your carbon footprint?</legend>
                    <p className="text-red-500 text-sm">
                        {errorMessages.totalCarbonFootprint || "\u00A0"} { /* No-break-space character to maintain paragraph height for consistent formatting */}
                    </p>
                    <input
                        className={`input-base ${errorMessages.totalCarbonFootprint ? 'input-error' : 'input-normal'}`}
                        name="totalCarbonFootprint"
                        type="number"
                        step="0.01"
                        value={formData.totalCarbonFootprint}
                        onChange={handleChange}
                    />


                    {/* Air Travel Footprint */}
                    <legend className="carbon-footprint-question"> What is your carbon footprint for air travel?</legend>
                    <p className="text-red-500 text-sm">
                        {errorMessages.airTravelFootprint || "\u00A0"}
                    </p>
                    <input
                        className={`input-base ${errorMessages.totalCarbonFootprint ? 'input-error' : 'input-normal'}`}
                        name="airTravelFootprint"
                        type="number"
                        step="0.01"
                        value={formData.airTravelFootprint}
                        onChange={handleChange}
                    />

                    {/* Home Footprint */}
                    <legend className="carbon-footprint-question"> What is your carbon footprint for home?</legend>
                    <p className="text-red-500 text-sm">
                        {errorMessages.homeFootprint || "\u00A0"}
                    </p>
                    <input
                        className={`input-base ${errorMessages.totalCarbonFootprint ? 'input-error' : 'input-normal'}`}
                        name="homeFootprint"
                        type="number"
                        step="0.01"
                        value={formData.homeFootprint}
                        onChange={handleChange}
                    />

                    {/* Ground Transportation Footprint */}
                    <legend className="carbon-footprint-question"> What is your carbon footprint for ground transportation?</legend>
                    <p className="text-red-500 text-sm">
                        {errorMessages.groundTransportationFootprint || "\u00A0"}
                    </p>
                    <input
                        className={`input-base ${errorMessages.totalCarbonFootprint ? 'input-error' : 'input-normal'}`}
                        name="groundTransportationFootprint"
                        type="number"
                        step="0.01"
                        value={formData.groundTransportationFootprint}
                        onChange={handleChange}
                    />

                    {/* Diet Footprint */}
                    <legend className="carbon-footprint-question"> What is your carbon footprint for diet?</legend>
                    <p className="text-red-500 text-sm">
                        {errorMessages.dietFootprint || "\u00A0"}
                    </p>
                    <input
                        className={`input-base ${errorMessages.totalCarbonFootprint ? 'input-error' : 'input-normal'}`}
                        name="dietFootprint"
                        type="number"
                        step="0.01"
                        value={formData.dietFootprint}
                        onChange={handleChange}
                    />

                    {/* Electricity Footprint */}
                    <legend className="carbon-footprint-question"> What is your carbon footprint for electricity?</legend>
                    <p className="text-red-500 text-sm">
                        {errorMessages.electricityFootprint || "\u00A0"}
                    </p>
                    <input
                        className={`input-base ${errorMessages.totalCarbonFootprint ? 'input-error' : 'input-normal'}`}
                        name="electricityFootprint"
                        type="number"
                        step="0.01"
                        value={formData.electricityFootprint}
                        onChange={handleChange}
                    />

                    {/* Other Consumption Footprint */}
                    <legend className="carbon-footprint-question"> What is your carbon footprint for other consumption?</legend>
                    <p className="text-red-500 text-sm">
                        {errorMessages.otherConsumptionFootprint || "\u00A0"}
                    </p>
                    <input
                        className={`input-base ${errorMessages.totalCarbonFootprint ? 'input-error' : 'input-normal'}`}
                        name="otherConsumptionFootprint"
                        type="number"
                        step="0.01"
                        value={formData.otherConsumptionFootprint}
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
                    <legend> If possible, write a goal you can pursue to reduce your air travel: </legend>
                    <textarea
                        className="large-text-box"
                        name="goalToReduceAirTravel"
                        value={formData.goalToReduceAirTravel}
                        onChange={handleChange}
                    />
                    className={`input-base ${errorMessages.totalCarbonFootprint ? 'input-error' : 'input-normal'}`}
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
                            checked={!drivesCar}
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
                    <legend> Do you have any ideas to improve your diet for the future?</legend>
                    <textarea
                        className="large-text-box"
                        name="ideasToImproveDiet"
                        value={formData.ideasToImproveDiet}
                        onChange={handleChange}
                    />

                    {/* Effort to Buy Local Food */}
                    <RadioGroup
                        name="effortToBuyLocalFood"
                        legend="Do you make an effort to buy local food?"
                        options={options.effortToBuyLocalFoodOptions}
                        value={formData.effortToBuyLocalFood}
                        onChange={handleChange}
                    />

                    {/* Willing to Give Up */}
                    <legend> What are you willing to give up to reduce your carbon footprint?</legend>
                    <input
                        className="input-base"
                        name="willingToGiveUp"
                        type="text"
                        value={formData.willingToGiveUp}
                        onChange={handleChange}
                    />

                    {/* Not Willing to Give Up */}
                    <legend> What are you NOT willing to give up to reduce your carbon footprint?</legend>
                    <input
                        className="input-base"
                        name="notWillingToGiveUp"
                        type="text"
                        value={formData.notWillingToGiveUp}
                        onChange={handleChange}
                    />

                    {/* Willing to Engage With */}
                    <legend> Would you be willing to engage with friends, family, or coworkers to reduce your climate impact?</legend>
                    {options.willingToEngageOptions.map((option) => (
                        <label key={option.value}>
                            <input
                                type="checkbox"
                                name="willingToEngageWith"
                                value={option.value}
                                disabled={(isNotOpenSelected && option.value !== "notOpen") || (isAnyOtherEngageSelected && option.value === "notOpen")}
                                checked={formData.willingToEngageWith.includes(option.value)}
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
                        value={formData.groupGoals}
                        onChange={handleChange}
                    />

                    {/* Submit Button */}
                    <div>
                        <button type="submit" className="calc-btn">Submit</button>
                    </div>
                </form>
            </main>
        </div>
    );
}