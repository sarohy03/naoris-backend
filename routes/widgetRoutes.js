const express = require("express");
const { getWidgetData } = require("../controllers/widgetControllers");

const router = express.Router();
router.get("/", getWidgetData);

module.exports = router;
