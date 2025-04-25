import { useState } from 'react';

export function useFormState() {
    // State to manage user's input into form
    const [formData, setFormData] = useState<FormDataEntry>({
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

    // State to manage error messages for each carbon footprint input field (i.e., non numerical input)
    const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({
        totalCarbonFootprint: "",
        airTravelFootprint: "",
        homeFootprint: "",
        groundTransportationFootprint: "",
        dietFootprint: "",
        electricityFootprint: "",
        otherConsumptionFootprint: "",
    });

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<any>) => {

        const { name, value, type } = e.target;

        // NON-NUMERICAL INPUT
        if (type !== "number") {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));

            return;
        }

        /* From here on, only deals with numerical fields (carbon footprint results) */

        // INVALID INPUT
        if (value === "") {
            setErrorMessages((prevMessages) => ({
                ...prevMessages,
                [name]: "Please enter a valid number.",
            }));

            // For whatever reason, this makes sure the input field keeps updating even if the input is invalid
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
            return;
        }

        // VALID INPUT
        setErrorMessages((prevMessages) => ({ // Clear relevant error if valid
            ...prevMessages,
            [name]: "",
        }));

        setFormData((prevData) => ({ // Update the form data with the new value
            ...prevData,
            [name]: type === "number" ? Number(value) : value,
        }));

        // If the air travel footprint is updated, set the air travel leisure percentage to 0 (makes database values less confusing)
        if (name === "airtravelFootprint" && value === "0")
            setFormData((prevData) => ({
                ...prevData,
                [name]: type === "number" ? Number(value) : value,
                airTravelLeisurePercentage: 0,
            }));
    };

    return {
        formData,
        setFormData,
        errorMessages,
        handleChange,
    };
}

interface FormDataEntry {

    referredBy: string;             // Can be "family", "friends", "supervisorOrCoworker", or "Other"
    otherReferralValue: string;     // If referredBy==="Other", this is the value
    inclinationToChange: string;    // Example: "notInclined", "slightlyInclined", etc.
    largestImpactChoice: string;    // Example: "home", "electricity", etc.
    effortToBuyLocalFood: string;   // Example: "yes", "no", "occasionally"
    willingToEngageWith: string[];  // Multi-select checkbox values. Example: ["friends", "family", "coworkers", "otherCommunities", "notOpen"]

    /* Carbon footprint results from external calculator */
    totalCarbonFootprint: number; // Total combined footprint
    airTravelFootprint: number;
    homeFootprint: number;
    groundTransportationFootprint: number;
    dietFootprint: number;
    electricityFootprint: number;
    otherConsumptionFootprint: number;

    airTravelLeisurePercentage: number; // Slider value, % of air travel that is for leisure (0%-100%)

    replaceableDrivingByTransitPercentage: number;  // Slider value, % of driving that can be replaced by public transit (0%-100%)

    /* NOTE: Does not change the value of replaceableDrivingByTransitPercentage, just disables the slider. */
    drivesCar: boolean; // If false, disables replaceableDrivingByTransitPercentage slider.

    /* Open-ended responses */
    goalToReduceAirTravel: string;
    ideasToImproveDiet: string;
    willingToGiveUp: string;
    notWillingToGiveUp: string; // Example: "meat", "flying", etc.
    groupGoals: string; // Free text input
}