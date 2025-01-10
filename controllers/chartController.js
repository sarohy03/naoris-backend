exports.getChartData = (req, res) => {
    try {
      const sellingPressurePercentage = parseInt(req.query.sellingPressure, 10);
  
      if (!sellingPressurePercentage) {
        return res.status(400).json({ error: "Missing query parameter: sellingPressure" });
      }
  
      const emissionsData = loadDataFromFile("streamlit_emissions.json");
  
      const chartData = emissionsData.map((row) => ({
        month: row.Month,
        supplyShock: row.SupplyShock * (sellingPressurePercentage / 100),
      }));
  
      res.status(200).json({ chartData });
    } catch (error) {
      res.status(500).json({ error: "Internal server error", details: error.message });
    }
  };
  