"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {

    const referredByOptions = [
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
        { value: "otherConsumption", label: "Other Consumption (Example: buying clothes)" }
    ];

    const airTravelTypes = [
        { value: "visitingFriendsAndRelatives", label: "Visiting Friends and Relatives" },
        { value: "leisure", label: "Leisure" },
        { value: "business", label: "Business" },
        { value: "other", label: "Other" },
        { value: "doesNotFly", label: "I do not use flights" },
        { value: "notWilling", label: "I am not willing to give up air travel" }
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
        alias: "",                  // Used to identify the user with a custom name 
        referredBy: "", // 
        inclinationToChange: "",
        largestImpactChocie: "",
        carbonFootprint: 0,
        willingToChange: [] as string[],
        rankedWillingToChange: [
            "Home",
            "Electricity",
            "Diet",
            "Ground Transportation",
            "Air Travel",
            "Other Consumption",
        ],
        airTravelToGiveUp: [] as string[],
        dietToGiveUp: "",
        homeOrElectricityToGiveUp: "",
        groundTransportationToGiveUp: "",
        consumptionToGiveUp: "",
        willingToEngageWith: [] as string[],
        individualGoals: [] as string[],
        groupGoals: [] as string[],
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
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Logging form data to console for now
        console.log(formData);

        // IN THE FUTURE: Send formData to database
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
    const handleAirTravelCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    };

    // Multi-select mutual exclusivity logic for willingToChange
    const isNotOpenSelected = formData.willingToEngageWith.includes("notOpen");
    const isAnyOtherEngageSelected = formData.willingToEngageWith.some(val => val !== "notOpen");

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">

            <Link href="/">
                <button className="calc-btn">Home</button>
            </Link>
            <main style={{ width: "50%" }}>
                <form>
                    {/* Alias Input */}
                    <input
                        type="text"
                        name="alias"
                        placeholder="Alias"
                        value={formData.alias}
                        onChange={handleChange}
                        className="input-field"
                    />
                    
                    <br/> 
                    {/* Referred By */}
                    <fieldset>
                        <legend>Who referred you to this survey?</legend>
                        {referredByOptions.map(option => (
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
                            name="referredBy"
                            placeholder="Please specify your referral source"
                            disabled={formData.referredBy !== "Other"}
                            value= {formData.referredBy !== "Other" ? "Other" : formData.referredBy}
                            onChange={handleChange}
                        />
                    </fieldset>
                    
                    <br/> 
                    {/* Inclination to Change */}
                    <fieldset>
                        <legend>How inclined do you feel to change your lifestyle choices to be more sustainable?</legend>
                        {inclinationOptions.map(option => (
                            <label key={option.value}>
                                <input
                                    type="radio"
                                    name="inclinationToChange"
                                    value={option.value}
                                    checked={formData.inclinationToChange === option.value}
                                    onChange={handleChange}
                                />
                                {option.label}
                            </label>
                        ))}
                    </fieldset>
                    
                    <br/> 
                    {/*Largest Impact Choice */}
                    <fieldset>
                        <legend>Which of your lifestyle choices do you think has the largest impact on the environmenmt?</legend>
                        {carbonFootprintCategories.map(option => (
                            <label key={option.value}>
                                <input
                                    type="radio"
                                    name="largestImpactChocie"
                                    value={option.value}
                                    checked={formData.largestImpactChocie === option.value}
                                    onChange={handleChange}
                                />
                                {option.label}
                            </label>
                        ))}
                    </fieldset>
                    
                    <br/> 
                    {/* Submit Button */}
                    <div>
                        <button type="submit" className="calc-btn">Submit</button>
                    </div>
                </form>
            </main>
        </div>
    );
}
