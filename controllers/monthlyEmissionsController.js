exports.sumMonthlyEmissions = (req, res) => {
    try {
      const { data, sellingPressurePercentage, selectedMonth } = req.body;
  
      if (!data || !sellingPressurePercentage || selectedMonth === undefined) {
        return res.status(400).json({ error: "Invalid input data" });
      }
  
      const sellingPressureFactor = sellingPressurePercentage / 100;
  
      const monthlySum = data.reduce((acc, row) => {
        const month = row.month;
        if (!acc[month]) acc[month] = 0;
        Object.keys(row).forEach((key) => {
          if (key !== "month") {
            acc[month] += row[key] * sellingPressureFactor;
          }
        });
        return acc;
      }, {});
  
      res.status(200).json({ monthlySum });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
  