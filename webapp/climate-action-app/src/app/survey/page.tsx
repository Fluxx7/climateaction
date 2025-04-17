"use client";

import { useState } from "react";
import Link from "next/link";
import { group } from "console";

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

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">

            <Link href="/">
                <button className="calc-btn">Home</button>
            </Link>
            <main>

            </main>
        </div>
    );
}
