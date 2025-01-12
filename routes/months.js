const express = require("express");

const router = express.Router();

// Corrected import paths
const { getSheetData } = require("../utils/dataLoader");
const { sumMonthlyEmissions } = require("../utils/sumMonthlyEmissions");
const { createEmissionsChart } = require("../utils/createEmissionsChart");
const { plotSupplyShock } = require("../utils/supplyShock");

// Endpoint 1: Data for Plot Values and Supply Shocks
router.post("/plot-values", async (req, res) => {
  try {
    const { sellingPressure, sellingPressureSource, selectedMonth } = req.body;

    // Step 1: Fetch data
    const data = await getSheetData(["Database", "streamlit_emissions"]);
    if (!data.Database || !data.streamlit_emissions) {
      return res.status(400).json({ error: "Required data not found" });
    }

    // Step 2: Process emissions data
    const processedEmissions = createEmissionsChart(
      data.streamlit_emissions,
      data.Database,
      sellingPressureSource,
      sellingPressure
    );
    // console.log("processedEmissions:", processedEmissions);
    // // Step 3: Plot supply shock and extract supply shock values
    const [
      selectedSupplyShock,
      previousSupplyShock,
      futureSupplyShock,
     ] = plotSupplyShock(processedEmissions, selectedMonth);

    res.status(200).json({
        plotData:processedEmissions,
        supplyShocks: {
          selected: selectedSupplyShock,
          previous: previousSupplyShock,
          future: futureSupplyShock,
        },
    });
  } catch (error) {
    console.error("Error in /plot-values:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint 2: Data for 3 Months
router.post("/", async (req, res) => {
  try {
    const { sellingPressure, selectedMonth, startingPrice } = req.body;

    // Step 1: Fetch data
    const data = await getSheetData(["Database", "streamlit_emissions"]);
    if (!data.Database || !data.streamlit_emissions) {
      return res.status(400).json({ error: "Required data not found" });
    }
    // console.log("Data type of data.Database:", typeof data.Database);
    // console.log("Data type of data.streamlit_emissions:", typeof data.streamlit_emissions);

    const [
        selectedMonthEmissionsSum,
        previousMonthEmissionsSum,
        futureMonthEmissionsSum,
        selectedMonthInvestorPercent,
        previousMonthInvestorPercent,
        futureMonthInvestorPercent,
        selectedMonthEmissionsSum100SP,
        previousMonthEmissionsSum100SP,
        futureMonthEmissionsSum100SP
      ] = sumMonthlyEmissions(
        data.streamlit_emissions,
        sellingPressure,
        selectedMonth,
        data.Database
      );
    console.log("selectedMonthEmissionsSum:", selectedMonthEmissionsSum);
    console.log("previousMonthEmissionsSum:", previousMonthEmissionsSum);
    console.log("futureMonthEmissionsSum:", futureMonthEmissionsSum);
    console.log("selectedMonthInvestorPercent:", selectedMonthInvestorPercent);
    console.log("previousMonthInvestorPercent:", previousMonthInvestorPercent);
    console.log("futureMonthInvestorPercent:", futureMonthInvestorPercent);
    console.log("selectedMonthEmissionsSum100SP:", selectedMonthEmissionsSum100SP);
    console.log("previousMonthEmissionsSum100SP:", previousMonthEmissionsSum100SP);
    console.log("futureMonthEmissionsSum100SP:", futureMonthEmissionsSum100SP);

      
      // Step 3: Helper function for value calculation
    const calculateValues = (emissionsSum, investorPercent) => {
      const emissionsValue = emissionsSum * startingPrice;
      const investorValue = (emissionsValue * investorPercent) / 100;
      return { emissionsValue, investorValue };
    };

    // Step 4: Calculate values for all months
    const selectedValues = calculateValues(selectedMonthEmissionsSum, selectedMonthInvestorPercent);
    const previousValues = calculateValues(previousMonthEmissionsSum, previousMonthInvestorPercent);
    const futureValues = calculateValues(futureMonthEmissionsSum, futureMonthInvestorPercent);

    const selected100SP = calculateValues(selectedMonthEmissionsSum100SP, selectedMonthInvestorPercent);
    const previous100SP = calculateValues(previousMonthEmissionsSum100SP, previousMonthInvestorPercent);
    const future100SP = calculateValues(futureMonthEmissionsSum100SP, futureMonthInvestorPercent);
    // console.log(selectedValues)
    // Step 5: Return the calculated data
    res.status(200).json({
      selectedMonth: {
        unlock_value_sp: Math.round(selectedValues.emissionsValue),
        Value_for_Investors_Max: Math.round(selected100SP.investorValue),
        Value_for_Investors_SP: Math.round(selectedValues.investorValue),
        unlock_value_max: Math.round(selected100SP.emissionsValue),
      },
      previousMonth: {
        unlock_value_sp: Math.round(previousValues.emissionsValue),
        Value_for_Investors_Max: Math.round(previous100SP.investorValue),
        Value_for_Investors_SP: Math.round(previousValues.investorValue),
        unlock_value_max: Math.round(previous100SP.emissionsValue),
      },
      futureMonth: {
        unlock_value_sp: Math.round(futureValues.emissionsValue),
        Value_for_Investors_Max: Math.round(future100SP.investorValue),
        Value_for_Investors_SP: Math.round(futureValues.investorValue),
        unlock_value_max: Math.round(future100SP.emissionsValue),
      },
    });
    
  } catch (error) {
    console.error("Error in /three-months-data:", error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
