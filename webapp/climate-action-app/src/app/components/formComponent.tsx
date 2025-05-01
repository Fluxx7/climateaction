import React, { useEffect, useState } from "react";
import * as options from "../survey/options";
import { EventSubmission, useFormState } from "../survey/useFormState";
import { RadioGroup, OpenQuestion, SliderQuestion, CheckboxGroup } from "./minorComponents";
import { useSearchParams } from "next/navigation";
import Link from "next/link";


const SurveyForm = ({
    consent: userConsent
}: { consent: boolean }) => {
    const { formData, errorMessages, handleChange } = useFormState();
    const [userTag, setUserTag] = useState("");
    const searchParams = useSearchParams();
    const [copied, setCopied] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const [submitted, setSubmitted] = useState(false); // State to manage form submission

    const referrerTag = searchParams?.get('rftg') ?? "0";

    let bestAirTravelFootprint;
    let bestGroundTransportationFootprint;
    let bestDietFootprint;
    let bestTotalCarbonFootprint;


    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form reloading on submit

        const submissionData: { [key: string]: any; } = { ...formData }; // Copy of formData


        // Converts empty willingToEngageWith selection to "notOpen"
        if (submissionData.willingToEngageWith?.length === 0)
            submissionData.willingToEngageWith = ["notOpen"];


        if (!submissionData.drivesCar)
            submissionData.replaceableDrivingByTransitPercentage = 0; // If user does not drive, set replaceableDrivingByTransitPercentage to 0

        const response = await fetch('/api/submitForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: submissionData, consent: userConsent, referrerTag: referrerTag }),
        });

        if (response.ok) {
            console.log('Form submitted successfully');
            
            // Calculate theoretical best values
            formData.airTravelFootprint * (1 - formData.airTravelLeisurePercentage)
            setSubmitted(true); // Set submitted to true to indicate form submission
            const data = await response.json();
            setUserTag(data.tag);

        } else {
            console.error('Error submitting form');
        }
    };

    const handleCopyClick = () => {
        const link = `${window.location.origin}/?rftg=${userTag}`;

        // Use the Clipboard API to copy the text
        navigator.clipboard.writeText(link)
            .then(() => {
                setCopied(true);
                // Optionally, reset "Copied!" message after a few seconds
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    };

    const nextPage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        // Make sure all fields are answered
        if (false) {
            alert("Please answer all questions before continuing.");
            return; // Stop execution if the response is empty
        }

        setPageNum(pageNum + 1);
    };

    return !submitted ? (
        <form onSubmit={handleSubmit}>
            {pageNum == 0 ?
                <FirstPage callback={nextPage} update={handleChange} data={formData} /> :
                (pageNum == 1 ?
                    <SecondPage callback={nextPage} update={handleChange} data={formData} errorMessages={errorMessages} /> :
                    <>



                        {/* Air Travel Leisure Percentage */}

                        {formData.airTravelFootprint !== 0 && (
                            <SliderQuestion
                                name="airTravelLeisurePercentage"
                                type="number"
                                value={formData.airTravelLeisurePercentage}
                                question="What percentage of your air travel is for leisure?"
                                range={["0", "100"]}
                                step="5"
                                onChange={handleChange} />
                        )}


                        {/* Goal to Reduce Air Travel */}
                        <OpenQuestion
                            name="goalToReduceAirTravel"
                            question="If possible, write a goal you can pursue to reduce your air travel:"
                            size="large"
                            value={formData.goalToReduceAirTravel}
                            onChange={handleChange} />

                        {/* Replaceable Driving by Transit Percentage */}
                        <SliderQuestion
                            name="replaceableDrivingByTransitPercentage"
                            type="number"
                            value={formData.replaceableDrivingByTransitPercentage}
                            question="What percentage of your driving can be replaced by public transit?"
                            range={["0", "100"]}
                            step="5"
                            onChange={handleChange}
                            disable="I do not drive a car." />

                        {/* Ideas to Improve Diet */}
                        <OpenQuestion
                            name="ideasToImproveDiet"
                            question="Do you have any ideas to improve your diet's sustainability for the future?"
                            size="large"
                            value={formData.ideasToImproveDiet}
                            onChange={handleChange} />

                        {/* Effort to Buy Local Food */}
                        <RadioGroup
                            name="effortToBuyLocalFood"
                            question="Do you make an effort to buy local food?"
                            options={options.effortToBuyLocalFoodOptions}
                            value={formData.effortToBuyLocalFood}
                            onChange={handleChange} />

                        {/* Willing to Give Up */}
                        <OpenQuestion
                            name="willingToGiveUp"
                            question="What are you willing to give up to reduce your carbon footprint?"
                            size="small"
                            type="text"
                            value={formData.willingToGiveUp}
                            onChange={handleChange} />

                        {/* Not Willing to Give Up */}
                        <OpenQuestion
                            name="notWillingToGiveUp"
                            question="What are you NOT willing to give up to reduce your carbon footprint?"
                            size="small"
                            type="text"
                            value={formData.notWillingToGiveUp}
                            onChange={handleChange} />

                        {/* Willing to Engage With */}
                        <CheckboxGroup
                            value={formData.willingToEngageOptions}
                            options={options.willingToEngageOptions}
                            name={"willingToEngageWith"}
                            question={"Would you be willing to engage with friends, family, or coworkers to reduce your climate impact?"}
                            onChange={handleChange}
                        />

                        {/* Group Goals */}
                        <OpenQuestion
                            name="groupGoals"
                            question={`Write 1-2 goals that you could pursue in a group or community to
                reduce your collective carbon footprints. (Example: "We will all
                take the S-Bahn to commute to work at least once a week" or
                "We won't fly on airplanes when we go on vacations together.`}
                            size="large"
                            type="text"
                            value={formData.groupGoals}
                            onChange={handleChange} />

                        {/* Submit Button */}
                        <div>
                            <button type="submit" className="calc-btn">Submit</button>
                        </div>
                    </>)}
        </form>) : (
        <div className="text-center flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4" style={{ marginBottom: "5px" }}>Thank you for your submission!</h2>
            <p>Your responses have been recorded.</p>
            <p> Theoretical Best Air Travel Footprint: {}</p>
            <p> Theoretical Best Ground Transit Footprint: {formData.groundTransportationFootprint * (1 - formData.replaceableDrivingByTransitPercentage)}</p>
            <p> Theoretical Best Diet Footprint: {formData.effortToBuyLocalFood == "yes" ? formData.dietFootprint * .94 : formData.dietFootprint}</p>
            <p> Theoretical Best Total Carbon Footprint:
                {

                }
            </p>
            <p> Theoretical Best Air Travel Footprint: </p>
            <p style={{ marginBottom: "10px" }}>Want to share this survey? Use this link:</p>
            <div className="flex items-center justify-center align-middle space-x-2"> {/* Updated flex settings */}
                <input
                    className="outer-box justify-center font-bold"
                    style={{ width: "400px", marginTop: "0px" }}
                    readOnly
                    value={`${window.location.origin}/?rftg=${userTag}`}
                />
                <button
                    className="p-2 bg-blue-500 text-white rounded"
                    onClick={handleCopyClick}
                >
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
        </div>
    );
};

// Renders the first page of the survey
// callback is the function for changing the page
// update is the function for updating the form values
// data is the current form values
const FirstPage = ({ callback, update, data }: { callback: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void, update: (e: React.ChangeEvent<any> | EventSubmission) => void, data: { [key: string]: any } }) => {
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        if (data.referredBy !== '' && data.referredBy &&
            data.inclinationToChange !== '' && data.inclinationToChange
            &&
            data.largestImpactChoice !== '' && data.largestImpactChoice) {
            setCompleted(true);
        } else if (completed) {
            setCompleted(false);
        }
    }, [data.referredBy, data.inclinationToChange, data.largestImpactChoice]);

    return (<>
        {/* Referred By */}
        <RadioGroup
            name="referredBy"
            question="Who referred you to this survey?"
            options={options.referralOptions}
            value={String(data.referredBy)}
            onChange={update} />


        {/* Willing to Change */}
        {/* Inclination to Change */}
        <RadioGroup
            name="inclinationToChange"
            question="How inclined do you feel to change your lifestyle choices to be more sustainable?"
            options={options.inclinationOptions}
            value={String(data.inclinationToChange)}
            onChange={update} />

        {/*Largest Impact Choice */}
        <RadioGroup
            name="largestImpactChoice"
            question="Which of your lifestyle choices do you think has the largest impact on the environment?"
            options={options.carbonFootprintCategories}
            value={String(data.largestImpactChoice)}
            onChange={update} />
        <div>
            <button type="button" className={`${completed ? "calc-btn" : "px-4 py-2 bg-gray-600 text-white rounded"}`} onClick={callback} disabled={!completed}>{completed ? "Next" : "Fill out all Fields"}</button>
        </div>
    </>)


}

// Renders the first page of the survey
// callback is the function for changing the page
// update is the function for updating the form values
// data is the current form values
const SecondPage = ({ callback, update, data, errorMessages }: { callback: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void, update: (e: React.ChangeEvent<any> | EventSubmission) => void, data: { [key: string]: any }, errorMessages: { [key: string]: any } }) => {

    return (<>
        <p className="outer-box">Go to this site and fill out the questions, then enter your results into the text boxes below:
            <Link className="font-bold inner-box box-content w-[270px]! text-blue-700!" href={"https://uba.co2-rechner.de/de_DE/quickcheck/"} rel="noopener noreferrer" target="_blank">Umwelt Bundesamt CO2 Rechner</Link>
        </p>
        {/* Total Carbon Footprint */}
        <OpenQuestion
            name="totalCarbonFootprint"
            question="What is your total carbon footprint in tons?"
            size="small"
            type="number"
            value={data.totalCarbonFootprint}
            step="0.01"
            errorMessage={errorMessages.totalCarbonFootprint}
            onChange={update} />


        {/* Air Travel Footprint */}
        <OpenQuestion
            name="airTravelFootprint"
            question="What is your carbon footprint for air travel in tons?"
            size="small"
            type="number"
            value={data.airTravelFootprint}
            step="0.01"
            errorMessage={errorMessages.airTravelFootprint}
            onChange={update} />

        {/* Home Footprint */}
        <OpenQuestion
            name="homeFootprint"
            question="What is your carbon footprint for home in tons?"
            size="small"
            type="number"
            value={data.homeFootprint}
            step="0.01"
            errorMessage={errorMessages.homeFootprint}
            onChange={update} />

        {/* Ground Transportation Footprint */}
        <OpenQuestion
            name="groundTransportationFootprint"
            question="What is your carbon footprint for ground transportation in tons?"
            size="small"
            type="number"
            value={data.groundTransportationFootprint}
            step="0.01"
            errorMessage={errorMessages.groundTransportationFootprint}
            onChange={update} />

        {/* Diet Footprint */}
        <OpenQuestion
            name="dietFootprint"
            question="What is your carbon footprint for diet in tons?"
            size="small"
            type="number"
            value={data.dietFootprint}
            step="0.01"
            errorMessage={errorMessages.dietFootprint}
            onChange={update} />

        {/* Electricity Footprint */}
        <OpenQuestion
            name="electricityFootprint"
            question="What is your carbon footprint for electricity in tons?"
            size="small"
            type="number"
            value={data.electricityFootprint}
            step="0.01"
            errorMessage={errorMessages.electricityFootprint}
            onChange={update} />

        {/* Other Consumption Footprint */}
        <OpenQuestion
            name="otherConsumptionFootprint"
            question="What is your carbon footprint for other consumption in tons?"
            size="small"
            type="number"
            value={data.otherConsumptionFootprint}
            step="0.01"
            errorMessage={errorMessages.otherConsumptionFootprint}
            onChange={update} />
        <div>
            <button type="button" className="calc-btn" onClick={callback}>{"Next"}</button>
            {/* <button type="button" className={`${completed ? "calc-btn" : "px-4 py-2 bg-gray-600 text-white rounded"}`} onClick={callback} disabled={!completed}>{completed ? "Next" : "Fill out all Fields"}</button> */}
        </div>
    </>)


}

export default SurveyForm;