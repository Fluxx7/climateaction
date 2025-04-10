"use client";

const calcFunctions: {[name: string]: (input: number) => number} = {
    "elecUsage": (input) => yearlyEmissionsGeneric(input, 0.3978), 
    "transitUsage": (input) => yearlyEmissionsGeneric(input, 9.087),
    "shortFlights": (input) => input*100,
    "longFlights": (input) => input*300,
    "dietChoice": dietaryChoice,
};

export default function calculate(inputEmissionsTagArray: [number, string][]) {
    let total = 0;
    let result: [key: string, value: number][] = inputEmissionsTagArray.map((element) => {
        if (!(element[1] in calcFunctions)) {
            throw new Error("Undefined operation '" + element[1] + "' attempted");
        }
        let output = calcFunctions[element[1]](element[0]);
        total += output;
        return [element[1], output]
    });
    result.push(["TOTAL", total]);
    return result;
}

function yearlyEmissionsGeneric(inputMonthly:number, factor:number) : number {
    return inputMonthly*factor*12;
}

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