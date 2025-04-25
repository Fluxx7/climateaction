"use client";

/**
 * A map of valid form input tags to the function to be used for that tag. 
 * Each function takes a single number as an input, and outputs a number.
 * This allows for easily customizable input fields, with the functions coverting the input into the requisite CO2 emissions
 */
const emissionsFunctions: {[name: string]: (input: number) => number} = {
    "elecUsage": (input) => yearlyEmissionsGeneric(input, 0.3978), 
    "transitUsage": (input) => yearlyEmissionsGeneric(input, 9.087),
    "shortFlights": (input) => input*100,
    "longFlights": (input) => input*300,
    "dietChoice": dietaryChoice,
};

/**
 * 
 * @param inputEmissionsTagArray An array of [number, string] tuples, where each string is a valid "tag" key in emissionsFunctions
 * @returns 
 */
export default function calculate(inputEmissionsTagArray: [number, string][]) {
    let total = 0;
    /*
    This goes through each tuple in the array, and runs the function at the provided key in the emissionsFunctions map using the provided input
    If the key isn't in emissionsFunctions, it throws an error.
    Each output is stored in an array of [string, number] tuples where the string is the tag, and the number is the emissions for that tag
    The total emissions are also summed and put into the last position in the array
    */
    let result: [key: string, value: number][] = inputEmissionsTagArray.map((element) => {
        if (!(element[1] in emissionsFunctions)) {
            throw new Error("Undefined operation '" + element[1] + "' attempted");
        }
        let output = emissionsFunctions[element[1]](element[0]);
        total += output;
        return [element[1], output]
    });

    result.push(["TOTAL", total]);
    return result;
}

/**
 * A helper function that I might delete later, the idea was to make code more readable
 * @param inputMonthly the input in units per month
 * @param factor the factor to multiply it by
 * @returns inputMonthly * factor * 12
 */
function yearlyEmissionsGeneric(inputMonthly:number, factor:number) : number {
    return inputMonthly*factor*12;
}

// 0 is vegan, 1 is vegetarian, 2 is non-vegetarian

function dietaryChoice(index:number) : number {
    switch (index) {
        case 0:
            return 200;
        case 1:
            return 400;
        case 2:
            return 800;
        default:
            break;
    }
    return 0;
}