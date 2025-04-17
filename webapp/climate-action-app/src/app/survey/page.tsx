"use client";

import { useState } from "react";
import Link from "next/link";
import { group } from "console";

export default function Home() {

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
