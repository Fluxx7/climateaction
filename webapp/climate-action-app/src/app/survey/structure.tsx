import { ReactElement } from "react";
import { CheckboxGroupFields, CheckboxOption, InputQuestionFields, RadioGroupFields, RadioOption, SliderQuestionFields } from "../components/minorComponents";
import Link from "next/link";



export type FormPageComponents =
    // question types
    ["radio", RadioGroupFields] |
    ["checkbox", CheckboxGroupFields] |
    ["slider", Omit<SliderQuestionFields, "value">] |
    ["text", Omit<InputQuestionFields, "value"> & { error?: boolean }] |
    // page components
    "page-break" | 
    ["label", string | ReactElement] |
    ["cond-start", name: string, dependsOn: string] | 
    ["cond-end", name: string];

const structure: FormPageComponents[] = [
    // Referred by
    ["radio",
        {
            name: "referredBy",
            question: "Who referred you to this survey?",
            options: [
                { value: "family", label: "Family" },
                { value: "friends", label: "Friends" },
                { value: "supervisorOrCoworker", label: "Supervisor/Coworkers" },
                { value: "other", label: "Other: ", textValue: true },
                { value: "prefNot", label: "Prefer not to say" }
            ]
            ,
        }
    ],

    // Willing to change
    ["radio",
        {
            name: "inclinationToChange",
            question: "How inclined do you feel to change your lifestyle choices to be more sustainable?",
            options: [
                { value: "notInclined", label: "Not Inclined" },
                { value: "slightlyInclined", label: "Slightly Inclined" },
                { value: "moderatelyInclined", label: "Moderately Inclined" },
                { value: "veryInclined", label: "Very Inclined" }
            ],
        }
    ],

    // Largest impact choice
    ["radio",
        {
            name: "largestImpactChoice",
            question: "Which of your lifestyle choices do you think has the largest impact on the environment?",
            options: [
                { value: "home", label: "Home" },
                { value: "electricity", label: "Electricity" },
                { value: "diet", label: "Diet" },
                { value: "groundTransportation", label: "Ground Transportation" },
                { value: "airTravel", label: "Air Travel" },
                { value: "otherConsumption", label: "Other Consumption (Example: buying clothes or furniture)" }
            ],
        }
    ],

    "page-break",

    // Link to Uba CO2 calc
    ["label",
        <p className="outer-box">Go to this site and fill out the questions, then enter your results into the text boxes below:
            <Link className="font-bold inner-box box-content w-[270px]! text-blue-700!" href={"https://uba.co2-rechner.de/de_DE/quickcheck/"} rel="noopener noreferrer" target="_blank">Umwelt Bundesamt CO2 Rechner</Link>
        </p>
    ],

    // Total Carbon Footprint
    ["text",
        {
            name: "totalCarbonFootprint",
            question: "What is your total carbon footprint in tons?",
            size: "small",
            type: "number",
            step: "0.01"
        }
    ],

    // Air Travel Footprint
    ["text",
        {
            name: "airTravelFootprint",
            question: "What is your carbon footprint for air travel in tons?",
            size: "small",
            type: "number",
            step: "0.01"
        }
    ],


    // Home Footprint
    ["text",
        {
            name: "homeFootprint",
            question: "What is your carbon footprint for home in tons?",
            size: "small",
            type: "number",
            step: "0.01"
        }
    ],

    // Ground Transportation Footprint
    ["text",
        {
            name: "groundTransportationFootprint",
            question: "What is your carbon footprint for ground transportation in tons?",
            size: "small",
            type: "number",
            step: "0.01"
        }
    ],



    // Diet Footprint
    ["text",
        {
            name: "dietFootprint",
            question: "What is your carbon footprint for diet in tons?",
            size: "small",
            type: "number",
            step: "0.01"
        }
    ],

    // Electricity Footprint
    ["text",
        {
            name: "electricityFootprint",
            question: "What is your carbon footprint for electricity in tons?",
            size: "small",
            type: "number",
            step: "0.01"
        }
    ],

    // Other Consumption Footprint
    ["text",
        {
            name: "otherConsumptionFootprint",
            question: "What is your carbon footprint for other consumption in tons?",
            size: "small",
            type: "number",
            step: "0.01"
        }
    ],

    "page-break",

    // next two questions only appear if airTravelFootprint is above 0
    ["cond-start", "airTravelCond", "airTravelFootprint"],

    // Air Travel Leisure Percentage
    ["slider",
        {
            name: "airTravelLeisurePercentage",
            type: "number",
            question: "What percentage of your air travel is for leisure?",
            range: ["0", "100"],
            step: "5",
        }

    ],

    // Goal to Reduce Air Travel
    ["text",
        {
            name: "goalToReduceAirTravel",
            question: "If possible, write a goal you can pursue to reduce your air travel:",
            size: "large"
        }
    ],

    ["cond-end", "airTravelCond"],

    // Replaceable Driving by Transit Percentage
    ["slider",
        {
            name: "replaceableDrivingByTransitPercentage",
            type: "number",
            question: "What percentage of your driving can be replaced by public transit?",
            range: ["0", "100"],
            step: "5",
            disable: "I do not drive a car."
        }

    ],

    // Ideas to Improve Diet
    ["text",
        {
            name: "ideasToImproveDiet",
            question: "Do you have any ideas to improve your diet's sustainability for the future?",
            size: "large"
        }
    ],

    // Effort to Buy Local Food
    ["radio",
        {
            name: "effortToBuyLocalFood",
            question: "Do you make an effort to buy local food?",
            options: [
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "occasionally", label: "Occasionally" }
            ],
        }
    ],

    // Willing to Give Up
    ["text",
        {
            name: "willingToGiveUp",
            question: "What are you willing to give up to reduce your carbon footprint?",
            size: "small",
            type: "text"
        }
    ],

    // Not Willing to Give Up
    ["text",
        {
            name: "notWillingToGiveUp",
            question: "What are you NOT willing to give up to reduce your carbon footprint?",
            size: "small",
            type: "text"
        }
    ],

    // Willing to Engage With
    ["checkbox",
        {
            name: "willingToEngageWith",
            question: "Would you be willing to engage with friends, family, or coworkers to reduce your climate impact?",
            options: [
                { value: "friends", label: "I would engage with friends" },
                { value: "family", label: "I would engage with family" },
                { value: "coworkers", label: "I would engage with coworkers" },
                { value: "otherCommunities", label: "I would engage with other communities" },
                { value: "notOpen", label: "I would not be open to engaging in a community", exclusion_groups: ["notOpen"] }
            ]
        }
    ],

    // Group Goals
    ["text",
        {
            name: "groupGoals",
            question: `Write 1-2 goals that you could pursue in a group or community to reduce your collective carbon footprints. (Example: "We will all 
            take the S-Bahn to commute to work at least once a week" or "We won't fly on airplanes when we go on vacations together.`,
            size: "large"
        }
    ],
];


export default structure;