import React, { useEffect, useState } from "react";
import { EventSubmission, useFormState } from "../survey/useFormState";
import { RadioGroup, OpenQuestion, SliderQuestion, CheckboxGroup, FormRendererProps } from "./minorComponents";
import { useSearchParams } from "next/navigation";
import structure, { FormQuestionComponent, FormRenderComponent, isFormQuestionComponent } from "../survey/structure";


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

    const [bestAirTravelFootprint, setBestAirTravelFootprint] = useState(0);
    const [bestGroundTransportationFootprint, setBestGroundTransportationFootprint] = useState(0);
    const [bestDietFootprint, setBestDietFootprint] = useState(0);
    const [bestTotalCarbonFootprint, setBestTotalCarbonFootprint] = useState(0);


    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form reloading on submit

        const submissionData: { [key: string]: any; } = { ...formData }; // Copy of formData


        // Converts empty willingToEngageWith selection to "notOpen"
        if (!(submissionData.willingToEngageWith?.length !== 0))
            submissionData.willingToEngageWith = ["notOpen"];

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
            let bestTotalCarbonFootprint = submissionData.totalCarbonFootprint - submissionData.airTravelFootprint - submissionData.groundTransportationFootprint - submissionData.dietFootprint;
            const bestAirTravelFootprint = submissionData.airTravelFootprint * (1 - submissionData.airTravelLeisurePercentage / 100);
            const bestGroundTransportationFootprint = submissionData.groundTransportationFootprint * (1 - submissionData.replaceableDrivingByTransitPercentage / 100);
            const bestDietFootprint = submissionData.effortToBuyLocalFood == "yes" ? submissionData.dietFootprint * .94 : submissionData.dietFootprint;
            bestTotalCarbonFootprint += bestAirTravelFootprint + bestGroundTransportationFootprint + bestDietFootprint;

            // Set best values in state
            setBestAirTravelFootprint(bestAirTravelFootprint);
            setBestGroundTransportationFootprint(bestGroundTransportationFootprint);
            setBestDietFootprint(bestDietFootprint);
            setBestTotalCarbonFootprint(bestTotalCarbonFootprint);
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

    return !submitted ? (<form onSubmit={handleSubmit}>
        <RenderPage structure={structure} errorMessages={errorMessages} data={formData} onChange={handleChange} />
    </form>) : (
        <div className="text-center flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4" style={{ marginBottom: "5px" }}>Thank you for your submission!</h2>
            <p>Your responses have been recorded.</p>
            <div className="outer-box grid! grid-cols-3 grid-rows-7 col-span-1">
                <p className="row-start-1 row-span-1 col-start-1 col-span-3 font-bold"> Carbon Footprint Results </p>
                {/* Grid Column 1 */}
                <div className="col-start-1 row-start-2 row-span-5" >
                    <p className="font-bold"> Footprint Categories</p>
                    <p> Air Travel:</p>
                    <p> Ground Transit:</p>
                    <p> Diet:</p>
                    <p> Total Footprint:</p>
                </div>

                {/* Grid Column 3 */}
                <div className="col-start-2 row-start-2 row-span-5" >
                    <p className="font-bold"> Current:</p>
                    <p> {formData.airTravelFootprint} tons</p>
                    <p> {formData.groundTransportationFootprint} tons</p>
                    <p> {formData.dietFootprint} tons</p>
                    <p> {formData.totalCarbonFootprint} tons</p>
                </div>

                {/* Grid Column 3 */}
                <div className="col-start-3 row-start-2 row-span-5" >
                    <p className="font-bold"> Theoretical Best:</p>
                    <p> {bestAirTravelFootprint} tons</p>
                    <p> {bestGroundTransportationFootprint} tons</p>
                    <p> {bestDietFootprint} tons</p>
                    <p> {bestTotalCarbonFootprint} tons</p>
                </div>

                <div className="col-start-1 col-span-3 row-start-7 row-span-1">
                    <p className="font-bold"> Theoretical Reduction: {formData.totalCarbonFootprint - bestTotalCarbonFootprint} tons</p>
                </div>
            </div>
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

const RenderPage = ({ structure, errorMessages, onChange, data }: FormRendererProps<{ structure: FormRenderComponent[] } & { errorMessages: { [key: string]: any }, data: { [key: string]: any } }>) => {
    const [pageNum, setPageNum] = useState(0);
    const [currentPage, setCurrentPage] = useState<FormRenderComponent[]>([]);
    const [completed, setCompleted] = useState(false);


    // sets currentPage to contain the components defined between the appropriate page-start and the page-start after that within structure
    useEffect(() => {
        let newCurrentPage: FormRenderComponent[] = []

        // find the index of the correct page-start
        let scanNum = 0;
        const i = structure.findIndex((element) => {
            if (element[0] === "page-start") {
                if (scanNum == pageNum) {
                    return true;
                }
                scanNum++;
            }
            return false;
        })

        if (i === -1) {
            console.error("No page-start found in structure!");
            return;
        }

        // push every component after the located page-start and before the next page-start into currentPage
        let index = i + 1;
        while (index < structure.length && structure[index][0] != "page-start") {
            newCurrentPage.push(structure[index]);
            index++;


        }

        //if the end of structure has been reached, add a submit button
        if (index >= structure.length) {
            newCurrentPage.push(["end-button"]);
        } else {
            // if there are more components (ie. more pages) in structure, add a next page button
            newCurrentPage.push(["next-button"]);
        }
        setCurrentPage(newCurrentPage);
    }, [pageNum, structure]);


    useEffect(() => {
        const allFilled = currentPage.filter(isFormQuestionComponent).map((curr) => {
            return curr[1].name;
        }).every(name => {
            const value = data[name];
            return value !== undefined && value !== null && value !== "" && !(Array.isArray(value) && value.length === 0);
        });

        setCompleted(allFilled);
    }, [currentPage, data]);


    return (<>{currentPage.map(([component, fields]: FormRenderComponent, index) => {
        switch (component) {
            case "radio":
                return <RadioGroup
                    name={fields.name}
                    value={data[fields.name]}
                    question={fields.question}
                    key={fields.name + index}
                    options={fields.options}
                    onChange={onChange} />

            case "text":
                return <OpenQuestion
                    name={fields.name}
                    question={fields.question}
                    size={fields.size}
                    key={fields.name + index + pageNum}
                    type={fields.type}
                    value={data[fields.name]}
                    step={fields.step}
                    errorMessage={errorMessages[fields.name]}
                    onChange={onChange} />

            case "slider":
                return <SliderQuestion
                    name={fields.name}
                    type={fields.type}
                    key={fields.name + index + pageNum}
                    value={data[fields.name]}
                    question={fields.question}
                    range={fields.range}
                    step={fields.step}
                    onChange={onChange}
                    disable={fields.disable} />

            case "checkbox":
                return <CheckboxGroup
                    options={fields.options}
                    name={fields.name}
                    value={data[fields.name]}
                    key={fields.name + index + pageNum}
                    question={fields.question}
                    onChange={onChange}
                />

            case "next-button":
                return <div key={"next_button" + pageNum} className="flex gap-4 page-button-div">
                    {pageNum > 0 && <button type="button" className="calc-btn" onClick={() => setPageNum((currNum) => currNum - 1)}>Back</button>}
                    <button type="button" className={`${completed ? "calc-btn" : "px-4 py-2 bg-gray-600 text-white rounded"}`} onClick={() => setPageNum((currNum) => currNum + 1)} disabled={!completed}>{completed ? "Next" : "Fill out all Fields"}</button>
                </div>

            case "end-button":
                return <div key={"submit_button" + pageNum} className="flex gap-4 page-button-div">
                    <button type="button" className="calc-btn" onClick={() => setPageNum((currNum) => currNum - 1)}>Back</button>
                    <button type="submit" className={`${completed ? "calc-btn" : "px-4 py-2 bg-gray-600 text-white rounded"}`}>{completed ? "Submit" : "Fill out all Fields"}</button>
                </div>

            case "label":
                if (typeof fields.label === "string") {
                    return <p className="outer-box" key={"label-string" + pageNum}>{fields.label}</p>
                } else {
                    return React.cloneElement(fields.label, { key: "label-reactelement" + pageNum });
                }

            case "cond-start":

                break;

            case "cond-end":

                break;

            default:
                break;


        }
    })}
    </>)

};

export default SurveyForm;

//  !submitted ? (
//         <form onSubmit={handleSubmit}>
//             {pageNum == 0 ?
//                 <FirstPage callback={nextPage} update={handleChange} data={formData} /> :
//                 (pageNum == 1 ?
//                     <SecondPage callback={nextPage} update={handleChange} data={formData} errorMessages={errorMessages} /> :
//                     <>



//                         {/* Air Travel Leisure Percentage */}

//                         {formData.airTravelFootprint !== 0 && (
//                             <SliderQuestion
//                                 name="airTravelLeisurePercentage"
//                                 type="number"
//                                 value={formData.airTravelLeisurePercentage}
//                                 question="What percentage of your air travel is for leisure?"
//                                 range={["0", "100"]}
//                                 step="5"
//                                 onChange={handleChange} />
//                         )}


//                         {/* Goal to Reduce Air Travel */}
//                         <OpenQuestion
//                             name="goalToReduceAirTravel"
//                             question="If possible, write a goal you can pursue to reduce your air travel:"
//                             size="large"
//                             value={formData.goalToReduceAirTravel}
//                             onChange={handleChange} />

//                         {/* Replaceable Driving by Transit Percentage */}
//                         <SliderQuestion
//                             name="replaceableDrivingByTransitPercentage"
//                             type="number"
//                             value={formData.replaceableDrivingByTransitPercentage}
//                             question="What percentage of your driving can be replaced by public transit?"
//                             range={["0", "100"]}
//                             step="5"
//                             onChange={handleChange}
//                             disable="I do not drive a car." />

//                         {/* Ideas to Improve Diet */}
//                         <OpenQuestion
//                             name="ideasToImproveDiet"
//                             question="Do you have any ideas to improve your diet's sustainability for the future?"
//                             size="large"
//                             value={formData.ideasToImproveDiet}
//                             onChange={handleChange} />

//                         {/* Effort to Buy Local Food */}
//                         <RadioGroup
//                             name="effortToBuyLocalFood"
//                             question="Do you make an effort to buy local food?"
//                             options={options.effortToBuyLocalFoodOptions}
//                             onChange={handleChange} />

//                         {/* Willing to Give Up */}
//                         <OpenQuestion
//                             name="willingToGiveUp"
//                             question="What are you willing to give up to reduce your carbon footprint?"
//                             size="small"
//                             type="text"
//                             value={formData.willingToGiveUp}
//                             onChange={handleChange} />

//                         {/* Not Willing to Give Up */}
//                         <OpenQuestion
//                             name="notWillingToGiveUp"
//                             question="What are you NOT willing to give up to reduce your carbon footprint?"
//                             size="small"
//                             type="text"
//                             value={formData.notWillingToGiveUp}
//                             onChange={handleChange} />

//                         {/* Willing to Engage With */}
//                         <CheckboxGroup
//                             options={options.willingToEngageOptions}
//                             name={"willingToEngageWith"}
//                             question={"Would you be willing to engage with friends, family, or coworkers to reduce your climate impact?"}
//                             onChange={handleChange}
//                         />

//                         {/* Group Goals */}
//                         <OpenQuestion
//                             name="groupGoals"
//                             question={`Write 1-2 goals that you could pursue in a group or community to
//                 reduce your collective carbon footprints. (Example: "We will all
//                 take the S-Bahn to commute to work at least once a week" or
//                 "We won't fly on airplanes when we go on vacations together.`}
//                             size="large"
//                             type="text"
//                             value={formData.groupGoals}
//                             onChange={handleChange} />

//                         {/* Submit Button */}
//                         <div>
//                             <button type="submit" className="calc-btn">Submit</button>
//                         </div>
//                     </>)}
//         </form>) : (
//         <div className="text-center flex flex-col items-center">
//             <h2 className="text-2xl font-bold mb-4" style={{ marginBottom: "5px" }}>Thank you for your submission!</h2>
//             <p>Your responses have been recorded.</p>
//             <div className="outer-box grid! grid-cols-3 grid-rows-7 col-span-1">
//                 <p className="row-start-1 row-span-1 col-start-1 col-span-3 font-bold"> Carbon Footprint Results </p>
//                 {/* Grid Column 1 */}
//                 <div className="col-start-1 row-start-2 row-span-5" >
//                     <p className="font-bold"> Footprint Categories</p>
//                     <p> Air Travel:</p>
//                     <p> Ground Transit:</p>
//                     <p> Diet:</p>
//                     <p> Total Footprint:</p>
//                 </div>

//                 {/* Grid Column 3 */}
//                 <div className="col-start-2 row-start-2 row-span-5" >
//                     <p className="font-bold"> Current:</p>
//                     <p> {formData.airTravelFootprint} tons</p>
//                     <p> {formData.groundTransportationFootprint} tons</p>
//                     <p> {formData.dietFootprint} tons</p>
//                     <p> {formData.totalCarbonFootprint} tons</p>
//                 </div>

//                 {/* Grid Column 3 */}
//                 <div className="col-start-3 row-start-2 row-span-5" >
//                     <p className="font-bold"> Theoretical Best:</p>
//                     <p> {bestAirTravelFootprint} tons</p>
//                     <p> {bestGroundTransportationFootprint} tons</p>
//                     <p> {bestDietFootprint} tons</p>
//                     <p> {bestTotalCarbonFootprint} tons</p>
//                 </div>

//                 <div className="col-start-1 col-span-3 row-start-7 row-span-1">
//                     <p className="font-bold"> Theoretical Reduction: {formData.totalCarbonFootprint - bestTotalCarbonFootprint} tons</p>
//                 </div>
//             </div>
//             <p style={{ marginBottom: "10px" }}>Want to share this survey? Use this link:</p>
//             <div className="flex items-center justify-center align-middle space-x-2"> {/* Updated flex settings */}
//                 <input
//                     className="outer-box justify-center font-bold"
//                     style={{ width: "400px", marginTop: "0px" }}
//                     readOnly
//                     value={`${window.location.origin}/?rftg=${userTag}`}
//                 />
//                 <button
//                     className="p-2 bg-blue-500 text-white rounded"
//                     onClick={handleCopyClick}
//                 >
//                     {copied ? 'Copied!' : 'Copy'}
//                 </button>
//             </div>
//         </div>
//     );
// };

// // Renders the first page of the survey
// // callback is the function for changing the page
// // update is the function for updating the form values
// // data is the current form values
// const FirstPage = ({ callback, update, data }: { callback: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void, update: (e: React.ChangeEvent<any> | EventSubmission) => void, data: { [key: string]: any } }) => {
//     const [completed, setCompleted] = useState(false);

//     useEffect(() => {
//         if (data.referredBy !== '' && data.referredBy &&
//             data.inclinationToChange !== '' && data.inclinationToChange
//             &&
//             data.largestImpactChoice !== '' && data.largestImpactChoice) {
//             setCompleted(true);
//         } else if (completed) {
//             setCompleted(false);
//         }
//     }, [data.referredBy, data.inclinationToChange, data.largestImpactChoice]);

//     return (<>
//         {/* Referred By */}
//         <RadioGroup
//             name="referredBy"
//             question="Who referred you to this survey?"
//             options={options.referralOptions}
//             onChange={update} />


//         {/* Willing to Change */}
//         {/* Inclination to Change */}
//         <RadioGroup
//             name="inclinationToChange"
//             question="How inclined do you feel to change your lifestyle choices to be more sustainable?"
//             options={options.inclinationOptions}
//             onChange={update} />

//         {/*Largest Impact Choice */}
//         <RadioGroup
//             name="largestImpactChoice"
//             question="Which of your lifestyle choices do you think has the largest impact on the environment?"
//             options={options.carbonFootprintCategories}
//             onChange={update} />
//         <div>
//             <button type="button" className={`${completed ? "calc-btn" : "px-4 py-2 bg-gray-600 text-white rounded"}`} onClick={callback} disabled={!completed}>{completed ? "Next" : "Fill out all Fields"}</button>
//         </div>
//     </>)


// }

// // Renders the first page of the survey
// // callback is the function for changing the page
// // update is the function for updating the form values
// // data is the current form values
// const SecondPage = ({ callback, update, data, errorMessages }: { callback: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void, update: (e: React.ChangeEvent<any> | EventSubmission) => void, data: { [key: string]: any }, errorMessages: { [key: string]: any } }) => {

//     return (<>
//         <p className="outer-box">Go to this site and fill out the questions, then enter your results into the text boxes below:
//             <Link className="font-bold inner-box box-content w-[270px]! text-blue-700!" href={"https://uba.co2-rechner.de/de_DE/quickcheck/"} rel="noopener noreferrer" target="_blank">Umwelt Bundesamt CO2 Rechner</Link>
//         </p>
//         {/* Total Carbon Footprint */}
//         <OpenQuestion
//             name="totalCarbonFootprint"
//             question="What is your total carbon footprint in tons?"
//             size="small"
//             type="number"
//             value={data.totalCarbonFootprint}
//             step="0.01"
//             errorMessage={errorMessages.totalCarbonFootprint}
//             onChange={update} />


//         {/* Air Travel Footprint */}
//         <OpenQuestion
//             name="airTravelFootprint"
//             question="What is your carbon footprint for air travel in tons?"
//             size="small"
//             type="number"
//             value={data.airTravelFootprint}
//             step="0.01"
//             errorMessage={errorMessages.airTravelFootprint}
//             onChange={update} />

//         {/* Home Footprint */}
//         <OpenQuestion
//             name="homeFootprint"
//             question="What is your carbon footprint for home in tons?"
//             size="small"
//             type="number"
//             value={data.homeFootprint}
//             step="0.01"
//             errorMessage={errorMessages.homeFootprint}
//             onChange={update} />

//         {/* Ground Transportation Footprint */}
//         <OpenQuestion
//             name="groundTransportationFootprint"
//             question="What is your carbon footprint for ground transportation in tons?"
//             size="small"
//             type="number"
//             value={data.groundTransportationFootprint}
//             step="0.01"
//             errorMessage={errorMessages.groundTransportationFootprint}
//             onChange={update} />

//         {/* Diet Footprint */}
//         <OpenQuestion
//             name="dietFootprint"
//             question="What is your carbon footprint for diet in tons?"
//             size="small"
//             type="number"
//             value={data.dietFootprint}
//             step="0.01"
//             errorMessage={errorMessages.dietFootprint}
//             onChange={update} />

//         {/* Electricity Footprint */}
//         <OpenQuestion
//             name="electricityFootprint"
//             question="What is your carbon footprint for electricity in tons?"
//             size="small"
//             type="number"
//             value={data.electricityFootprint}
//             step="0.01"
//             errorMessage={errorMessages.electricityFootprint}
//             onChange={update} />

//         {/* Other Consumption Footprint */}
//         <OpenQuestion
//             name="otherConsumptionFootprint"
//             question="What is your carbon footprint for other consumption in tons?"
//             size="small"
//             type="number"
//             value={data.otherConsumptionFootprint}
//             step="0.01"
//             errorMessage={errorMessages.otherConsumptionFootprint}
//             onChange={update} />
//         <div>
//             <button type="button" className="calc-btn" onClick={callback}>{"Next"}</button>
//             {/* <button type="button" className={`${completed ? "calc-btn" : "px-4 py-2 bg-gray-600 text-white rounded"}`} onClick={callback} disabled={!completed}>{completed ? "Next" : "Fill out all Fields"}</button> */}
//         </div>
//     </>)

//     }