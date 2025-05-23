import { CheckboxOption, RadioOption } from "../components/minorComponents";


// Referral options for the "Who referred you to this survey?" question
export const referralOptions: RadioOption[] = [
    { value: "family", label: "Family" },
    { value: "friends", label: "Friends" },
    { value: "supervisorOrCoworker", label: "Supervisor/Coworkers" },
    { value: "other", label: "Other: ", textValue: true},
    { value: "prefNot", label: "Prefer not to say"}
];

export const inclinationOptions: RadioOption[] = [
    { value: "notInclined", label: "Not Inclined" },
    { value: "slightlyInclined", label: "Slightly Inclined" },
    { value: "moderatelyInclined", label: "Moderately Inclined" },
    { value: "veryInclined", label: "Very Inclined" }
];

// Used for largestImpactChoice, willingToChange, and rankedWillingToChange
export const carbonFootprintCategories: RadioOption[] = [
    { value: "home", label: "Home" },
    { value: "electricity", label: "Electricity" },
    { value: "diet", label: "Diet" },
    { value: "groundTransportation", label: "Ground Transportation" },
    { value: "airTravel", label: "Air Travel" },
    { value: "otherConsumption", label: "Other Consumption (Example: buying clothes or furniture)" }
];

export const effortToBuyLocalFoodOptions: RadioOption[] = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "occasionally", label: "Occasionally" }
];

export const willingToEngageOptions: CheckboxOption[] = [
    { value: "friends", label: "I would engage with friends" },
    { value: "family", label: "I would engage with family" },
    { value: "coworkers", label: "I would engage with coworkers" },
    { value: "otherCommunities", label: "I would engage with other communities" },
    { value: "notOpen", label: "I would not be open to engaging in a community", exclusion_groups: ["notOpen"] }
];