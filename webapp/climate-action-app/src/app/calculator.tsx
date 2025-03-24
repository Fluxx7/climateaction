"use client";

export default function calculate(electricityUsageKWh : number, transportationUsageGallonsPerMonth : number, shortFlight : number, longFlight : number, dietaryChoice : number, ) {
  
      // Constants for emission factors and conversion factors
      const electricityFactor = 0.3978; 
      const transportationFactor = 9.087; 
      const shortFlightFactor = 100; 
      const longFlightFactor = 300; 
      const dietaryFactors = [200, 400, 800]; // vegan, vegetarian, non-vegetarian

      const year = 12
  
      // Calculate CO2 emissions for electricity and transportation
      const electricityEmissions = electricityUsageKWh * electricityFactor;
      const transportationEmissions = transportationUsageGallonsPerMonth * transportationFactor;

      // Calculate air travel emissions for each type of flight
      const airTravelEmissionsShortHaul = shortFlight * shortFlightFactor;
      const airTravelEmissionsLongHaul = longFlight * longFlightFactor;

      // Calculate dietary choice emissions
      const dietaryChoiceEmissions = dietaryFactors[dietaryChoice] || 0; 

      // Calculate total air travel emissions
      const totalAirTravelEmissions =
            airTravelEmissionsShortHaul + airTravelEmissionsLongHaul;
  
      // Calculate yearly totals based on monthly inputs
      const yearlyElectricityEmissions = electricityEmissions * year;
      const yearlyTransportationEmissions = transportationEmissions * year;
  
      // Calculate total yearly CO2 emissions
      const totalYearlyEmissions = 
          yearlyElectricityEmissions + 
          yearlyTransportationEmissions +
          totalAirTravelEmissions +
          dietaryChoiceEmissions;


      const result = {
        totalYearlyEmissions: { value: totalYearlyEmissions, unit: 'kgCO2e/year' },
        yearlyTransportationEmissions: { value: yearlyTransportationEmissions, unit: 'kgCO2e/year' },
        yearlyElectricityEmissions: { value: yearlyElectricityEmissions, unit: 'kgCO2e/year' },
        totalAirTravelEmissions: { value: totalAirTravelEmissions, unit: 'kgCO2e/year' },
        dietaryChoiceEmissions: { value: dietaryChoiceEmissions, unit: 'kgCO2e/year' },
      };

      return result;
}