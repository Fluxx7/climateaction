import { useCallback, useState } from 'react';

// used for callbacks that aren't directly caused by a ChangeEvent
export type EventSubmission = {target: {name: string, value: string | number | string[], type: string}};

export function useFormState() {
    // State to manage user's input into form
    const [formData, setFormData] = useState<{ [key: string]: any }>({});

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
    const handleChange = useCallback((e: React.ChangeEvent<any> | EventSubmission) => {
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
    }, []);

    return {
        formData,
        setFormData,
        errorMessages,
        handleChange,
    };
}