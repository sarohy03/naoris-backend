const { loadDataFromFile } = require("../utils/dataLoader");

exports.calculateSupplyShock = (req, res) => {
  try {
    const { processedEmissionsData } = req.body;

    if (!processedEmissionsData || !Array.isArray(processedEmissionsData)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Calculate supply shock
    const cumulativeTokens = [];
    const data = processedEmissionsData.map((item, index) => {
      const totalReleased = Object.values(item).reduce((a, b) => a + b, 0);
      cumulativeTokens[index] =
        index === 0 ? totalReleased : cumulativeTokens[index - 1] + totalReleased;
      const supplyShock = index === 0 ? 0 : totalReleased / cumulativeTokens[index - 1];

      return {
        month: item.month,
        supplyShock,
      };
    });

    res.status(200).json({ supplyShockData: data });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
