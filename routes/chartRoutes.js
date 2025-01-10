const express = require("express");
const { getChartData } = require("../controllers/chartController");

const router = express.Router();
router.get("/data", getChartData);

module.exports = router;
