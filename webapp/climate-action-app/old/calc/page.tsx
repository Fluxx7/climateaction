"use client";

// import Image from "next/image";
import { useState} from "react";
import calculate from "./calculator";

export default function Home() {

  const [activeLang, setActiveLang] = useState("en"); // Active language
  const [totalEmissions, setTotalEmissions] = useState(0); // This displays the value from the calculator

  /** Helper function to create a new button on the calculator 
   * label is the label it will have on the webpage
   * tag is the id of the calculation function in the calculator file
   * required marks whether the field is required or not
  */
  function formNumberInput(label: string, tag: string, required: boolean = false) {
    return <div className="flex">
        <label htmlFor={tag} className="px-4 py-2 bg-blue-400 text-white">{label}</label>
        {required ? 
        <input required name={tag} type="number" className="px-4 py-2 bg-gray-500 text-white hover:bg-gray-300 justify-self-end"></input> : 
        <input name={tag} type="number" className="px-4 py-2 bg-gray-500 text-white hover:bg-gray-300 justify-self-end"></input>
        }
    </div>
        
  }

//   function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     console.log(event.currentTarget)
    

//   }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <a href="..">
            <button className="calc-btn" >Embedded Calculator</button>
        </a>
        <main>
            {/* Language toggle buttons and restart button */}
            <div className="flex gap-4 mb-4">
            <button
                className="calc-btn"
                onClick={() => setActiveLang("en")}
            >
                English
            </button>
            <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => setActiveLang("de")}
            >
                Deutsche
            </button>
            </div>
            <form onSubmit={(event) => {
                // I haven't figured out how to submit the form properly yet, the code to do so will presumably go here 
                event.preventDefault();
                console.log("curse of ra");
            }}>
                {formNumberInput("Electricity Usage (kWh)", "elecUsage", true)} <br/>
                {formNumberInput("Transit Usage (Bald Eagles per Football Field)", "transitUsage", true)} <br/>
                <input type="submit" className="calc-btn mt-5" value="Calculate Result"/>
            </form>
            <div>
                Your total emissions: {totalEmissions.toFixed(0)} kgCO2e/year 
            </div>
        </main>      
    </div>
  );
}
