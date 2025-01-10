const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const monthsRoutes = require("./routes/months"); // Import months routes

const app = express();
const PORT = 5001;

// Middleware
app.use(bodyParser.json());
app.use(cors());


app.use("/", monthsRoutes); 

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
