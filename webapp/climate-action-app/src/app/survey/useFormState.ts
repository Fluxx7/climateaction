import { useState } from 'react';

export function useFormState() {
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
        
        // From here on, only deals with numerical fields (carbon footprint results)

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