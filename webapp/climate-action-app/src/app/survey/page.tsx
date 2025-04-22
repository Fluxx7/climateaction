"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {

    const [drivesCar, setDrivesCar] = useState(true);

    const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({
        totalCarbonFootprint: "",
        airTravelFootprint: "",
        homeFootprint: "",
        groundTransportationFootprint: "",
        dietFootprint: "",
        electricityFootprint: "",
        otherConsumptionFootprint: "",
    });

    type Option = {
        value: string;
        label: string;
    };

    interface RadioGroupProps {
        name: string;
        legend: string;
        options: Option[];
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }

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
                    <label key={option.value}>
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={onChange}
                        />
                        {option.label}
                    </label>
                ))}
            </fieldset>
        );
    };

    const referallOptions = [
        { value: "family", label: "Family" },
        { value: "friends", label: "Friends" },
        { value: "supervisorOrCoworker", label: "Supervisor/Coworkers" },
    ];

    const inclinationOptions = [
        { value: "notInclined", label: "Not Inclined" },
        { value: "slightlyInclined", label: "Slightly Inclined" },
        { value: "moderatelyInclined", label: "Moderately Inclined" },
        { value: "veryInclined", label: "Very Inclined" }
    ];

    // Used for largestImpactChoice, willingToChange, and rankedWillingToChange
    const carbonFootprintCategories = [
        { value: "home", label: "Home" },
        { value: "electricity", label: "Electricity" },
        { value: "diet", label: "Diet" },
        { value: "groundTransportation", label: "Ground Transportation" },
        { value: "airTravel", label: "Air Travel" },
        { value: "otherConsumption", label: "Other Consumption (Example: buying clothes or furniture)" }
    ];

    const effortToBuyLocalFoodOptions = [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "occasionally", label: "Occasionally" }
    ];

    const willingToEngageOptions = [
        { value: "friends", label: "I would engage with friends" },
        { value: "family", label: "I would engage with family" },
        { value: "coworkers", label: "I would engage with coworkers" },
        { value: "otherCommunities", label: "I would engage with other communities" },
        { value: "notOpen", label: "I would not be open to engaging in a community" }
    ];

    interface FormData {
        referredBy: string; // Example: "family", "friends", etc.
        otherReferralValue: string; // Free text input
        inclinationToChange: string; // Example: "notInclined", "slightlyInclined", etc.
        largestImpactChoice: string; // Example: "home", "electricity", etc.
        totalCarbonFootprint: number; // Numeric input
        airTravelFootprint: number; // Numeric input
        homeFootprint: number; // Numeric input
        groundTransportationFootprint: number; // Numeric input
        dietFootprint: number; // Numeric input
        electricityFootprint: number; // Numeric input
        otherConsumptionFootprint: number; // Numeric input
        airTravelLeisurePercentage: number; // Slider value (0-100)
        goalToReduceAirTravel: string; // Free text input
        drivesCar: boolean; // Checkbox value
        replaceableDrivingByTransitPercentage: number; // Slider value (0-100)
        ideasToImproveDiet: string; // Free text input
        effortToBuyLocalFood: string; // Example: "yes", "no", "occasionally"
        willingToGiveUp: string; // Example: "meat", "flying", etc.
        notWillingToGiveUp: string; // Example: "meat", "flying", etc.
        willingToEngageWith: string[]; // Multi-select checkbox values
        groupGoals: string; // Free text input
    }
    // State to manage user's input into form
    const [formData, setFormData] = useState<FormData>({
        referredBy: "", // 
        otherReferralValue: "",
        inclinationToChange: "",
        largestImpactChoice: "",
        totalCarbonFootprint: 0,
        airTravelFootprint: 0,
        homeFootprint: 0,
        groundTransportationFootprint: 0,
        dietFootprint: 0,
        electricityFootprint: 0,
        otherConsumptionFootprint: 0,
        airTravelLeisurePercentage: 0,
        goalToReduceAirTravel: "",
        drivesCar: true,
        replaceableDrivingByTransitPercentage: 0,
        ideasToImproveDiet: "",
        effortToBuyLocalFood: "",
        willingToGiveUp: "",
        notWillingToGiveUp: "",
        willingToEngageWith: [] as string[],
        groupGoals: "",
    });



    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value, type } = e.target;

        console.log(formData.airTravelFootprint);

        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "number" ? Number(value) : value,
        }));

        console.log("here");

        if (e.target.type === "number") {
            console.log("is number");
            if (value === "") {
                console.log("value is empty");
                setErrorMessages((prevMessages) => ({
                    ...prevMessages,
                    [name]: "Please enter a valid number.",
                }));
                return;
            } else {
                setErrorMessages((prevMessages) => ({
                    ...prevMessages,
                    [name]: "", // Clear error if valid
                }));
            }
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form reloading on submit

        const response = await fetch('/api/submitForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            console.log('Form submitted successfully');
        } else {
            console.error('Error submitting form');
        }
    };

    // Handle multi-select checkbox changes
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, group: string) => {
        const { value, checked } = e.target;
        const current = formData[group as keyof typeof formData] as string[];
        const updated = checked
            ? [...current, value]
            : current.filter((item) => item !== value);
        setFormData(prev => ({ ...prev, [group]: updated }));
    };

    // Multi-select mutual exclusivity logic for willingToEngageWith 
    /*const handleEngageCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        const current = formData.willingToEngageWith;

        let updated: string[] = [];

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
    };*/

    /**
     * Multi-select mutual exclusivity logic for airTravelToGiveUp
     * This is a bit different from willingToEngageWith because it has two mutually exclusive options: 
     * (doesNotFly and notWilling) and the rest are mutually exclusive.
     */
    /*const handleAirTravelCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        const current = formData.airTravelToGiveUp;

        let updated: string[] = [];

        const exclusive = ["doesNotFly", "notWilling"];
        if (checked) {
            if (exclusive.includes(value)) {
                updated = [value];
            } else {
                updated = current.filter((val) => !exclusive.includes(val));
                updated.push(value);
            }
        } else {
            updated = current.filter((val) => val !== value);
        }

        setFormData((prev) => ({ ...prev, airTravelToGiveUp: updated }));
    };*/

    // Multi-select mutual exclusivity logic for willingToChange
    //const isNotOpenSelected = formData.willingToEngageWith.includes("notOpen");
    //const isAnyOtherEngageSelected = formData.willingToEngageWith.some(val => val !== "notOpen");

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">

            <Link href="/">
                <button className="calc-btn">Home</button>
            </Link>
            <main style={{ width: "50%" }}>
                <form onSubmit={handleSubmit}>

                    {/* Referred By */}
                    <fieldset>
                        <legend>Who referred you to this survey?</legend>
                        {referallOptions.map(option => (
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
                    <br />

                    {/* Willing to Change */}
                    {/* Inclination to Change */}
                    <RadioGroup
                        name="inclinationToChange"
                        legend="How inclined do you feel to change your lifestyle choices to be more sustainable?"
                        options={inclinationOptions}
                        value={String(formData.inclinationToChange)}
                        onChange={handleChange}
                    />

                    <br />
                    {/*Largest Impact Choice */}
                    <RadioGroup
                        name="largestImpactChoice"
                        legend="Which of your lifestyle choices do you think has the largest impact on the environmenmt?"
                        options={carbonFootprintCategories}
                        value={String(formData.largestImpactChoice)}
                        onChange={handleChange}
                    />
                    <br />

                    {/* Total Carbon Footprint */}
                    <legend>What is your carbon footprint?</legend>
                    <p className="text-red-500 text-sm min-h-[1rem]">
                        {errorMessages.totalCarbonFootprint || "\u00A0"}
                    </p>
                    <input
                        className={`border p-2 rounded-md ${errorMessages.totalCarbonFootprint ? 'border-red-500' : 'border-gray-300'}`}
                        name="totalCarbonFootprint"
                        type="number"
                        step="0.01"
                        value={formData.totalCarbonFootprint}
                        onChange={handleChange}
                    />
                    <br />
                    <br />

                    {/* Air Travel Footprint */}
                    <legend> What is your carbon footprint for air travel?</legend>
                    <p className="text-red-500 text-sm min-h-[1rem]">
                        {errorMessages.airTravelFootprint || "\u00A0"}
                    </p>
                    <input
                        className={`border p-2 rounded-md ${errorMessages.airTravelFootprint ? 'border-red-500' : 'border-gray-300'}`}
                        name="airTravelFootprint"
                        type="number"
                        step="0.01"
                        value={formData.airTravelFootprint}
                        onChange={handleChange}
                    />
                    <br />
                    <br />

                    {/* Home Footprint */}
                    <legend> What is your carbon footprint for home?</legend>
                    <p className="text-red-500 text-sm min-h-[1rem]">
                        {errorMessages.homeFootprint || "\u00A0"}
                    </p>
                    <input
                        className={`border p-2 rounded-md ${errorMessages.homeFootprint ? 'border-red-500' : 'border-gray-300'}`}
                        name="homeFootprint"
                        type="number"
                        step="0.01"
                        value={formData.homeFootprint}
                        onChange={handleChange}
                    />
                    <br />
                    <br />

                    {/* Ground Transportation Footprint */}
                    <legend> What is your carbon footprint for ground transportation?</legend>
                    <p className="text-red-500 text-sm min-h-[1rem]">
                        {errorMessages.groundTransportationFootprint || "\u00A0"}
                    </p>
                    <input
                        className={`border p-2 rounded-md ${errorMessages.groundTransportationFootprint ? 'border-red-500' : 'border-gray-300'}`}
                        name="groundTransportationFootprint"
                        type="number"
                        step="0.01"
                        value={formData.groundTransportationFootprint}
                        onChange={handleChange}
                    />
                    <br />
                    <br />

                    {/* Diet Footprint */}
                    <legend> What is your carbon footprint for diet?</legend>
                    <p className="text-red-500 text-sm min-h-[1rem]">
                        {errorMessages.dietFootprint || "\u00A0"}
                    </p>
                    <input
                        className={`border p-2 rounded-md ${errorMessages.dietFootprint ? 'border-red-500' : 'border-gray-300'}`}
                        name="dietFootprint"
                        type="number"
                        step="0.01"
                        value={formData.dietFootprint}
                        onChange={handleChange}
                    />
                    <br />
                    <br />

                    {/* Electricity Footprint */}
                    <legend> What is your carbon footprint for electricity?</legend>
                    <p className="text-red-500 text-sm min-h-[1rem]">
                        {errorMessages.electricityFootprint || "\u00A0"}
                    </p>
                    <input
                        className={`border p-2 rounded-md ${errorMessages.electricityFootprint ? 'border-red-500' : 'border-gray-300'}`}
                        name="electricityFootprint"
                        type="number"
                        step="0.01"
                        value={formData.electricityFootprint}
                        onChange={handleChange}
                    />
                    <br />
                    <br />

                    {/* Other Consumption Footprint */}
                    <legend> What is your carbon footprint for other consumption?</legend>
                    <p className="text-red-500 text-sm min-h-[1rem]">
                        {errorMessages.otherConsumptionFootprint || "\u00A0"}
                    </p>
                    <input
                        className={`border p-2 rounded-md ${errorMessages.otherConsumptionFootprint ? 'border-red-500' : 'border-gray-300'}`}
                        name="otherConsumptionFootprint"
                        type="number"
                        step="0.01"
                        value={formData.otherConsumptionFootprint}
                        onChange={handleChange}
                    />
                    <br />
                    <br />

                    {/* Air Travel Leisure Percentage */}
                    {formData.airTravelFootprint !== 0 && (
                        <>
                            <legend>What percentage of your air travel is for leisure?</legend>
                            <input
                                type="range"
                                name="airTravelLeisurePercentage"
                                min="0"
                                max="100"
                                step="5"
                                value={formData.airTravelLeisurePercentage}
                                onChange={handleChange}
                                className="w-[calc(100%-4rem)] align-middle"
                            />
                            <span className="align-middle ml-2">{formData.airTravelLeisurePercentage}%</span>
                        </>
                    )}

                    {/* Goal to Reduce Air Travel */}
                    <legend> If possible, write a goal you can pursue to reduce your air travel: </legend>
                    <input
                        className={`border p-2 rounded-md`}
                        name="goalToReduceAirTravel"
                        type="text"
                        value={formData.otherConsumptionFootprint}
                        onChange={handleChange}
                    />
                    <br />
                    <br />

                    {/* Replaceable Driving by Transit Percentage */}
                    <legend> What percentage of your driving can be replaced by public transit?</legend>
                    <input
                        type="range"
                        name="replaceableDrivingByTransitPercentage"
                        min="0"
                        max="100"
                        step="5"
                        value={drivesCar ? formData.replaceableDrivingByTransitPercentage : 0}
                        onChange={handleChange}
                        className="w-[calc(100%-4rem)] align-middle"
                        disabled={!drivesCar}
                    />
                    <span
                        className="align-middle ml-2"
                        style={{
                            color: drivesCar ? "var(--foreground)" : "gray",
                        }}
                    >
                        {drivesCar ? formData.replaceableDrivingByTransitPercentage : 0}%
                    </span>

                    {/* Checkbox for "I do not drive a car" */}
                    <br />
                    <label>
                        <input
                            type="checkbox"
                            name="drivesCar"
                            checked={!drivesCar}
                            onChange={(e) => {
                                setDrivesCar(!e.target.checked);
                                setFormData((prev) => ({
                                    ...prev,
                                    drivesCar: drivesCar
                                }));
                            }}
                        />
                        I do not drive a car.
                    </label>
                    <br />
                    <br />

                    {/* Ideas to Improve Diet */}
                    <legend> Do you have any ideas to improve your diet for the future?</legend>

                    <br />
                    <br />

                    {/* Effort to Buy Local Food */}
                    <RadioGroup
                        name="effortToBuyLocalFood"
                        legend="Do you make an effort to buy local food?"
                        options={effortToBuyLocalFoodOptions}
                        value={formData.effortToBuyLocalFood}
                        onChange={handleChange}
                    />
                    <br />
                    <br />

                    {/* Willing to Give Up */}
                    <legend> What are you willing to give up to reduce your carbon footprint?</legend>
                    <input
                        className={`border p-2 rounded-md`}
                        name="willingToGiveUp"
                        type="text"
                        value={formData.willingToGiveUp}
                        onChange={handleChange}
                    />
                    <br />
                    <br />

                    {/* Not Willing to Give Up */}
                    <legend> What are you NOT willing to give up to reduce your carbon footprint?</legend>
                    <input
                        className={`border p-2 rounded-md`}
                        name="notWillingToGiveUp"
                        type="text"
                        value={formData.notWillingToGiveUp}
                        onChange={handleChange}
                    />
                    <br />
                    <br />

                    {/* Willing to Engage With */}
                    <legend> Would you be willing to engage with friends, family, or coworkers to reduce your climate impact?</legend>

                    {willingToEngageOptions.map((option) => (
                        <label key={option.value}>
                            <input
                                type="checkbox"
                                name="willingToEngageWith"
                                value={option.value}
                                checked={formData.willingToEngageWith.includes(option.value)}
                                onChange={(e) => handleCheckboxChange(e, "willingToEngageWith")}
                            />
                            {option.label}
                        </label>
                        
                    ))}

                    <br />
                    <br />

                    {/* Group Goals */}
                    <legend> 
                        Write 1-2 goals that you could pursue in a group or community to 
                        reduce your collective carbon footprints. (Example: "We will all 
                        take the S-Bahn to commute to work at least once a week" or 
                        "We won't fly on airplanes when we go on vacations together.") </legend>
                        <input
                            className={`border p-2 rounded-md`}
                            name="groupGoals"
                            type="text"
                            value={formData.groupGoals}
                            onChange={handleChange}
                        />
                    {/* Submit Button */}
                    <br />
                    <br />
                    <div>
                        <button type="submit" className="calc-btn">Submit</button>
                    </div>
                </form>
            </main>
        </div>
    );
}
