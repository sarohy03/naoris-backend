// Function to create emissions chart
function createEmissionsChart(emissionsData, databaseData, sellingPressureSource, sellingPressure) {
    // Process database data to get selected pools based on the selling pressure source
    const selectedPools = (() => {
        if (sellingPressureSource === "Circulation") {
            return databaseData
                .filter(row => row.circulation === 'TRUE')
                .map(row => row.data_input);
        } else if (sellingPressureSource === "Investors") {
            return databaseData
                .filter(row => row.is_investor === 'TRUE')
                .map(row => row.data_input);
        } else {
            return Object.keys(emissionsData[0]).filter(key => key !== 'Month'); // Exclude 'Month' column
        }
    })();

    // Filter emissions data to include only selected pools
    const filteredEmissionsData = emissionsData.map(row => {
        const filteredRow = { Month: row.Month };
        selectedPools.forEach(pool => {
            if (row.hasOwnProperty(pool)) {
                filteredRow[pool] = row[pool];
            }
        });
        return filteredRow;
    });

    // Process filtered emissions data to apply selling pressure and sum emissions
    const monthlySum = processEmissionsData(filteredEmissionsData, sellingPressure);

    // Convert grouped data back to array format
    const result = Object.entries(monthlySum).map(([month, values]) => ({
        Month: parseFloat(month),
        ...values
    }));

    return result;
}

function processEmissionsData(data, sellingPressurePercentage) {
    const sellingPressureFactor = sellingPressurePercentage / 100;

    // Ensure all data columns are numeric and apply selling pressure
    const processedData = data.map(row => {
        const newRow = { Month: parseFloat(row.Month) || 0 };
        Object.keys(row).forEach(key => {
            if (key !== 'Month') {
                newRow[key] = (parseFloat(row[key]) || 0) * sellingPressureFactor;
            }
        });
        return newRow;
    });

    // Sum emissions for each month
    const monthlySum = processedData.reduce((acc, row) => {
        const month = row.Month;
        if (!acc[month]) {
            acc[month] = {};
        }
        Object.keys(row).forEach(key => {
            if (key !== 'Month') {
                acc[month][key] = (acc[month][key] || 0) + row[key];
            }
        });
        return acc;
    }, {});

    return monthlySum;
}

module.exports = { createEmissionsChart };
