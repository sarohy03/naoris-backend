const { loadDataFromFile } = require("../utils/dataLoader");

exports.processEmissionsData = (req, res) => {
  try {
    const { sellingPressurePercentage } = req.body;
    const data = loadDataFromFile("streamlit_emissions.json");

    if (!data || !sellingPressurePercentage) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const sellingPressureFactor = sellingPressurePercentage / 100;

    const processedData = data.map((row) => {
      const processedRow = { month: row.Month };
      Object.keys(row).forEach((key) => {
        if (key !== "Month") {
          processedRow[key] = row[key] * sellingPressureFactor;
        }
      });
      return processedRow;
    });

    res.status(200).json({ processedData });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
