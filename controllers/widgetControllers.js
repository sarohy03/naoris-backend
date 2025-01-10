const { loadDataFromFile } = require("../utils/dataLoader");

exports.getWidgetData = (req, res) => {
  try {
    const sellingPressurePercentage = parseInt(req.query.sellingPressure, 10);
    const selectedMonth = parseInt(req.query.selectedMonth, 10);

    if (!sellingPressurePercentage || selectedMonth === undefined) {
      return res.status(400).json({ error: "Missing query parameters" });
    }

    const emissionsData = loadDataFromFile("streamlit_emissions.json");
    const databaseData = loadDataFromFile("database.json");

    if (!emissionsData || !databaseData) {
      return res.status(500).json({ error: "Data files are missing or invalid." });
    }

    const supplyShock = emissionsData[selectedMonth]?.SupplyShock || 0;
    const unlockValueSP =
      emissionsData[selectedMonth]?.UnlockValue * (sellingPressurePercentage / 100) || 0;
    const unlockValueMax = emissionsData[selectedMonth]?.UnlockValue || 0;

    const investorPools = databaseData.filter((pool) => pool.is_investor === "TRUE");
    const investorUnlockSP = unlockValueSP * (investorPools.length / emissionsData.length);
    const investorUnlockMax = unlockValueMax * (investorPools.length / emissionsData.length);

    res.status(200).json({
      month: selectedMonth,
      supplyShock,
      unlockValueSP,
      unlockValueMax,
      investorUnlockSP,
      investorUnlockMax,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};
