const express = require("express");
const { getConfig } = require("../controllers/configControllers");

const router = express.Router();
router.get("/", getConfig);

module.exports = router;
