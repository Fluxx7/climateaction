"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {

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

    // State to manage user's input into form
    const [formData, setFormData] = useState({
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
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
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
    const handleEngageCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    };

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
    const isNotOpenSelected = formData.willingToEngageWith.includes("notOpen");
    const isAnyOtherEngageSelected = formData.willingToEngageWith.some(val => val !== "notOpen");

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
                            className="border border-gray rounded-md p-2"
                            style={{color: formData.referredBy === 'Other' ? 'var(--foreground)' : 'gray'}}
                        />
                    </fieldset>
                    <br />

                    {/* Willing to Change */}
                    {/* Inclination to Change */}
                    <RadioGroup
                        name="inclinationToChange"
                        legend="How inclined do you feel to change your lifestyle choices to be more sustainable?"
                        options={inclinationOptions}
                        value={formData.inclinationToChange}
                        onChange={handleChange}
                    />

                    <br />
                    {/*Largest Impact Choice */}
                    <RadioGroup
                        name="largestImpactChoice"
                        legend="Which of your lifestyle choices do you think has the largest impact on the environmenmt?"
                        options={carbonFootprintCategories}
                        value={formData.largestImpactChoice}
                        onChange={handleChange}
                    />
                    <br />


                    {/* Submit Button */}
                    <div>
                        <button type="submit" className="calc-btn">Submit</button>
                    </div>
                </form>
            </main>
        </div>
    );
}
