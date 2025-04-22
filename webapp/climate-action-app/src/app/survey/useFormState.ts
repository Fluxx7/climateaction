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
        console.log(name, value, type);
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === "airTravelFootprint" && value === "0") {
            setFormData((prevData) => ({
                ...prevData,
                [name]: type === "number" ? Number(value) : value,
                airTravelLeisurePercentage: 0,
            }));

            setErrorMessages((prevMessages) => ({
                ...prevMessages,
                [name]: "", // Clear error if valid
            }));
            return;
        }

        if (e.target.type === "number") {
            if (value === "") {
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

                setFormData((prevData) => ({
                    ...prevData,
                    [name]: type === "number" ? Number(value) : value,
                }));
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    return {
        formData,
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