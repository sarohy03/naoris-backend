const e = require("express");
function plotSupplyShock(processedEmissionsData, selectedMonth) {
    selectedMonth = parseInt(selectedMonth, 10); // Ensure it is a number

    const df = calculateSupplyShock(processedEmissionsData);
    
    // Convert Supply Shock to percentage for display
    df.forEach(row => {
        row.SupplyShock *= 100; // Convert to percentage
    });
    
    console.log(df);
    // Helper function to get the supply shock value for a given month
    function getSupplyShockValue(month) {
        const row = df.find(entry => entry.Month === month);
        return row ? row.SupplyShock : null;
    }

    // Retrieve data safely
    let selectedSupplyShock = getSupplyShockValue(selectedMonth);
    let previousSupplyShock = getSupplyShockValue(selectedMonth - 1);
    let futureSupplyShock = getSupplyShockValue(selectedMonth + 1);
// Assuming selectedSupplyShock, previousSupplyShock, and futureSupplyShock are numbers
if (selectedSupplyShock !== null) selectedSupplyShock = parseFloat(selectedSupplyShock.toFixed(2));
if (previousSupplyShock !== null) previousSupplyShock = parseFloat(previousSupplyShock.toFixed(2));
if (futureSupplyShock !== null) futureSupplyShock = parseFloat(futureSupplyShock.toFixed(2));

console.log(selectedSupplyShock, previousSupplyShock, futureSupplyShock);

    // console.log(selectedSupplyShock, previousSupplyShoc, futureSupplyShock);

    return [selectedSupplyShock, previousSupplyShock, futureSupplyShock];
}
function calculateSupplyShock(processedEmissionsData) {
    let cumulativeTokens = 0; // Running total of cumulative tokens

    return processedEmissionsData.map((data, index) => {
        // Calculate total released this month
        const totalReleasedThisMonth = Object.keys(data)
            .filter(key => key !== "Month") // Exclude the "Month" field
            .reduce((sum, key) => sum + data[key], 0);

        // Calculate supply shock
        const supplyShock = index > 0
            ? totalReleasedThisMonth / cumulativeTokens
            : 0; // Supply Shock is 0 for the first month (no previous data)

        // Update cumulative tokens
        cumulativeTokens += totalReleasedThisMonth;

        // Return processed data
        return {
            Month: data.Month,
            SupplyShock: supplyShock,
            TotalReleasedThisMonth: totalReleasedThisMonth,
            CumulativeTokens: cumulativeTokens
        };
    });
}




module.exports = { plotSupplyShock};