"use client";

import React, { useEffect, useState } from "react";
import { EventSubmission } from "../survey/useFormState";

// Options for radio buttons for multiple choice questions
// Used for inclinationToChange, largestImpactChoice, effortToBuyLocalFood
export type RadioOption = {
    value: string;
    label: string;
    textValue?: boolean;
};

export type CheckboxOption = {
    value: string;
    label: string;
    exclusion_groups?: string[]; // if a value is provided, this will forbid selecting this with anything that doesn't share this value
};

// Basic fields any question component needs
export interface BasicQuestionProps {
    name: string; // key for answer in formData
    question: string; // Question
    value: string | string[]; // Currently selected value (passed in from formData)
    className?: string; //classes for outer component
    onChange: (e: React.ChangeEvent<any> | EventSubmission) => void;
}


// RadioGroup interface for rendering radio button groups
// This is used for inclinationToChange, largestImpactChoice, and effortToBuyLocalFood
interface RadioGroupProps extends BasicQuestionProps {
    value: string;
    options: RadioOption[]; // Array of options for the radio buttons
}

interface InputQuestionProps extends BasicQuestionProps {
    size: string;
    value: string;
    type?: string;
    errorMessage?: string;
    step?: number | string;
}

interface SliderQuestionProps extends BasicQuestionProps {
    type: string;
    value: string;
    range?: [number | string, number | string];
    step?: number | string;
    disable?: string;
}

interface CheckboxGroupProps extends BasicQuestionProps {
    value: string[];
    options: CheckboxOption[]; // Array of options for the radio buttons
}


export const OpenQuestion = ({
    name,
    question,
    size,
    type,
    value,
    className,
    step,
    errorMessage,
    onChange
}: InputQuestionProps) => {
    return (
        <div className={className + " outer-box"}>
            <legend className="carbon-footprint-question font-bold">{question}</legend>
            <p className="text-red-500 text-sm">
                {errorMessage || "\u00A0"} { /* No-break-space character to maintain paragraph height for consistent formatting */}
            </p>
            {size === "large" ?
                (<textarea
                    className={`large-text-box input-base ${errorMessage ? "input-error" : "input-normal"}`}
                    name={name}
                    value={value ?? ""}
                    onChange={onChange}
                />)
                : (<input
                    className={`input-base ${errorMessage ? 'input-error' : 'input-normal'}`}
                    name={name}
                    type={type}
                    value={value ?? ""}
                    step={step}
                    onChange={onChange}
                />)}
        </div>
    );
};



// RadioGroup component for rendering radio button groups
export const RadioGroup = (props: RadioGroupProps) => {
    const [selected, setSelected] = useState(""); // State to manage user signature
    const [value, setValue] = useState<React.ChangeEvent>();

    // Manages the referral radio buttons
    useEffect(() => {
        if (typeof value !== "undefined") {
            props.onChange(value);
        }
    }, [selected, value]);
    
    return (
        <fieldset className={props.className + " outer-box"}>
            <p>
                <legend className="font-bold">{props.question}</legend>
            </p>
            {props.options.map((option) => (
                <label key={props.name + "-" + option.value}> {/* Label for each option from options */}
                    {/* Radio button for each option */}
                    <input
                        type="radio"
                        name={props.name} // Name of the radio group, matches the key in formData
                        value={option.value} // Value of a specific option
                        checked={selected === option.value} // Compares selected value with value of current option
                        onChange={e => {
                            setSelected(e.target.value);
                            if (!option.textValue) {
                                setValue(e);
                            }
                        }}
                    />
                    {option.label} {/* Label for the radio button */}
                    {option.textValue && <input
                        type="text"
                        name={props.name}
                        disabled={selected !== option.value}
                        onChange={e => setValue(e)}
                        className="border rounded-md p-2"
                        style={{
                            color: selected === option.value ? 'var(--text)' : 'gray',
                            borderColor: selected === option.value ? 'white' : 'gray',
                            background: selected === option.value ? 'var(--background)' : '#045656'
                        }} />}
                </label>
            ))}
        </fieldset>
    );
};

// SliderQuestion component for rendering sliders
export const SliderQuestion = (props: SliderQuestionProps) => {
    const [disabled, setDisabled] = useState<boolean>(false);

    return (
        <div className={props.className + " outer-box"}>
            <div className={`range-input ${!disabled ? '' : 'disabled-range-input'} flex flex-col items-start text-left`}>
                <legend className="text-left w-full">{props.question}</legend>
                <input
                    type="range"
                    name={props.name}
                    min={props.range?.[0]}
                    max={props.range?.[1]}
                    step={props.step}
                    value={disabled ? 0 : props.value ?? 0}
                    onChange={props.onChange}
                    disabled={disabled} />
                <span>{disabled ? 0 : props.value ?? 0}%</span>
            </div>
            {/* Checkbox for "I do not drive a car" */}
            {props.disable &&
                <label>
                    <input
                        type="checkbox"
                        name={props.name + "-enable"}
                        checked={disabled}
                        onChange={(e) => {
                            setDisabled(e.target.checked);
                            props.onChange(e);
                        }} />
                    {props.disable}
                </label>}

        </div>
    );
};

// CheckboxGroup component for rendering checkbox questions
export const CheckboxGroup = (props: CheckboxGroupProps) => {
    const [currGroups, setGroups] = useState<string[]>([]);
    const [selected, setSelected] = useState<[value: string, groups: string[] | undefined][]>([]);

    useEffect(() => {
        const output: EventSubmission = {
            target: { name: props.name, value: selected.map((entry) => entry[0]), type: "checkbox" }
        };
        props.onChange(output);
    }, [selected])

    // Multi-select mutual exclusivity logic for willingToEngageWith 
    const handleCheckboxChange = (input: string, checked: boolean, exclusion_groups: string[] | undefined) => {
        const current: [value: string, groups: string[] | undefined][] = [...selected];

        let updated: [value: string, groups: string[] | undefined][];

        if (checked) {
            updated = [...current]; // copy current into updated
            if (exclusion_groups?.length == 0) {
                exclusion_groups.push("default");
            } 
            updated.push([input, exclusion_groups]); // add the new value into 
        } else {
            updated = current.filter((value) => value[0] !== input);
        }

        if (updated.length == 0) {
            setGroups([]);
        } else {
            // find all common groups
            let commonGroups = new Set(updated[0][1]);

            for (let i = 1; i < updated.length; i++) {
                const currentGroups = new Set(updated[i][1]);
                // Keep only the groups that are in both sets
                commonGroups = new Set([...commonGroups].filter(group => currentGroups.has(group)));
                
            }
            // if there are no common groups found, it should mean that everything supports default as an option
            if (commonGroups.size == 0) {
                commonGroups.add("default");
            }

            setGroups([...commonGroups]);
        }
        setSelected(updated);
    };

    return (
        <div className={props.className + " outer-box"}>
            <legend> {props.question}</legend>
            {props.options.map((option) => (
                <label key={props.name + "-" + option.value}>
                    <input
                        type="checkbox"
                        name={props.name}
                        value={option.value}
                        disabled={ // disables the checkbox if it isn't part of any exclusion groups currently active
                            typeof option.exclusion_groups !== "undefined" ?
                                !(currGroups.some((value) => option.exclusion_groups!.includes(value)) || currGroups.length == 0) :
                                !(currGroups.includes("default") || currGroups.length == 0)
                        }
                        checked={selected.some((entry) => entry[0] == option.value)}
                        onChange={(e) => {
                            handleCheckboxChange(e.target.value, e.target.checked, option.exclusion_groups)
                        }} />
                    {option.label}
                </label>

            ))}
        </div>
    );
};


