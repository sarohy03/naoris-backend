const express = require("express");
const { processEmissionsData } = require("../controllers/emissionsController");

const router = express.Router();
router.post("/process", processEmissionsData);

module.exports = router;
