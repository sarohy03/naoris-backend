// Function to sum monthly emissions
function sumMonthlyEmissions(data, sellingPressurePercentage, selectedMonth, databaseData) {
    const sellingPressureFactor = sellingPressurePercentage / 100;
    selectedMonth = parseInt(selectedMonth, 10); // Ensure it is a number

    // Prepare data frames with calculated emissions
    const df = Object.entries(data).map(([key, row]) => {
        const months = parseInt(key, 10);
        const emissions = Object.fromEntries(
            Object.entries(row).map(([col, val]) => [col, (parseFloat(val) * sellingPressureFactor) || 0])
        );
        return { Months: months, ...emissions };
    });

    const df100SP = Object.entries(data).map(([key, row]) => {
        const months = parseInt(key, 10);
        const emissions = Object.fromEntries(
            Object.entries(row).map(([col, val]) => [col, parseFloat(val) || 0])
        );
        return { Months: months, ...emissions };
    });

    // Sum emissions for each month
    const sumEmissions = (df) => {
        return df.reduce((acc, row) => {
            const totalEmissions = Object.values(row).reduce((sum, val) => (typeof val === 'number' ? sum + val : sum), 0);
            acc[row.Months] = (acc[row.Months] || 0) + totalEmissions;
            return acc;
        }, {});
    };

    const monthlyEmissionsSum = sumEmissions(df);
    const monthlyEmissionsSum100SP = sumEmissions(df100SP);

    // Safe extraction function
    const safeExtractEmission = (month, emissionsData) => {
        const parsedMonth = parseInt(month, 10); // Ensure correct parsing
        if (!(parsedMonth in emissionsData)) {
            console.log(`Month ${parsedMonth} not found in emissions data. Available keys:`, Object.keys(emissionsData));
        }
        return emissionsData[parsedMonth] || 0;
    };
    
    
    const selectedMonthEmissionsSum = safeExtractEmission(selectedMonth, monthlyEmissionsSum);
    const previousMonthEmissionsSum = safeExtractEmission(selectedMonth - 1, monthlyEmissionsSum);
    const futureMonthEmissionsSum = safeExtractEmission(selectedMonth + 1, monthlyEmissionsSum);

    const selectedMonthEmissionsSum100SP = safeExtractEmission(selectedMonth, monthlyEmissionsSum100SP);
    const previousMonthEmissionsSum100SP = safeExtractEmission(selectedMonth - 1, monthlyEmissionsSum100SP);
    const futureMonthEmissionsSum100SP = safeExtractEmission(selectedMonth + 1, monthlyEmissionsSum100SP);

    // Process database data to extract investor pools
    const investorPools = databaseData
        .filter(row => row.is_investor === 'TRUE')
        .map(row => row.data_input);

    const investorEmissionsSum = df.reduce((acc, row) => {
        const investorSum = investorPools.reduce((sum, pool) => sum + (row[pool] || 0), 0);
        acc[row.Months] = (acc[row.Months] || 0) + investorSum;
        return acc;
    }, {});

    const safeExtractInvestor = (month) => investorEmissionsSum[month] || 0;

    const selectedMonthInvestorSum = safeExtractInvestor(selectedMonth);
    const previousMonthInvestorSum = safeExtractInvestor(selectedMonth - 1);
    const futureMonthInvestorSum = safeExtractInvestor(selectedMonth + 1);

    // Calculate percentages safely
    const safePercentage = (numerator, denominator) => (denominator !== 0 ? (numerator / denominator) * 100 : 0);

    const selectedMonthInvestorPercent = safePercentage(selectedMonthInvestorSum, selectedMonthEmissionsSum);
    const previousMonthInvestorPercent = safePercentage(previousMonthInvestorSum, previousMonthEmissionsSum);
    const futureMonthInvestorPercent = safePercentage(futureMonthInvestorSum, futureMonthEmissionsSum);

    return [
        selectedMonthEmissionsSum,
        previousMonthEmissionsSum,
        futureMonthEmissionsSum,
        selectedMonthInvestorPercent,
        previousMonthInvestorPercent,
        futureMonthInvestorPercent,
        selectedMonthEmissionsSum100SP,
        previousMonthEmissionsSum100SP,
        futureMonthEmissionsSum100SP
    ];
}

module.exports = { sumMonthlyEmissions };
