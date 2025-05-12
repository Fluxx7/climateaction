import { CheckboxOption, RadioOption } from "../components/minorComponents";
import { referralOptions } from "./options";

type component = {
    setting: FormEntryType;
    name: string;
    question: string;
    className?: string;
};

type FormEntryType = ["radio", RadioOption[]] | ["checkbox", CheckboxOption[]] | "slider" | "small-text" | "large-text";

const structure: (component | "page-break")[] = [
    {
        setting: ["radio", [
            { value: "family", label: "Family" },
            { value: "friends", label: "Friends" },
            { value: "supervisorOrCoworker", label: "Supervisor/Coworkers" },
            { value: "other", label: "Other: ", textValue: true },
            { value: "prefNot", label: "Prefer not to say" }
        ]],
        name: "referredBy",
        question: "Who referred you to this survey?"
    },

    {
        setting: ["radio", [
            { value: "notInclined", label: "Not Inclined" },
            { value: "slightlyInclined", label: "Slightly Inclined" },
            { value: "moderatelyInclined", label: "Moderately Inclined" },
            { value: "veryInclined", label: "Very Inclined" }
        ]], 
        name: "inclinationToChange", 
        question: "How inclined do you feel to change your lifestyle choices to be more sustainable?"
    },

    {
        setting: ["radio", [
            { value: "home", label: "Home" },
            { value: "electricity", label: "Electricity" },
            { value: "diet", label: "Diet" },
            { value: "groundTransportation", label: "Ground Transportation" },
            { value: "airTravel", label: "Air Travel" },
            { value: "otherConsumption", label: "Other Consumption (Example: buying clothes or furniture)" }
        ]], 
        name: "largestImpactChoice", 
        question: "Which of your lifestyle choices do you think has the largest impact on the environment?"
    },

    "page-break",


];


export default structure;