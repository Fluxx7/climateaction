import React from "react";
import * as options from "./options";

 // Options for radio buttons for multiple choice questions
    // Used for inclinationToChange, largestImpactChoice, effortToBuyLocalFood
    type Option = {
        value: string;
        label: string;
    };

// RadioGroup interface for rendering radio button groups
// This is used for inclinationToChange, largestImpactChoice, and effortToBuyLocalFood
export interface RadioGroupProps {
    name: string; // Name of the radio group (same as key in formData)
    legend: string; // Question
    options: Option[]; // Array of options for the radio buttons 
    value: string; // Currently selected value (passed in from formData)
    className?: string; // classes for fieldset
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface InputQuestionProps {
    name: string; // key for answer in formData
    question: string; // Question
    size: string;
    type?: string;
    value?: string; // Currently selected value (passed in from formData)
    className?: string; //classes for div
    errorMessage?: string;
    step?: number | string;
    onChange: (e: React.ChangeEvent<any>) => void;
}