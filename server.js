const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const supplyShockRoutes = require("./routes/supplyShockRoutes");
const emissionsRoutes = require("./routes/emissionsRoutes");
const chartRoutes = require("./routes/chartRoutes");
const widgetRoutes = require("./routes/widgetRoutes");
const configRoutes = require("./routes/configRoutes");
const monthsRoutes = require("./routes/months"); // Import months routes

const app = express();
const PORT = 5001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api/supply-shock", supplyShockRoutes);
app.use("/api/emissions", emissionsRoutes);
app.use("/api/chart", chartRoutes);
app.use("/api/widgets", widgetRoutes);
app.use("/api/config", configRoutes);
app.use("/api/months", monthsRoutes); // Use months routes

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
