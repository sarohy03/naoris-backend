const express = require("express");
const { calculateSupplyShock } = require("../controllers/supplyShockController");

const router = express.Router();
router.post("/", calculateSupplyShock);

module.exports = router;
