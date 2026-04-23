const express = require("express");
const {
  getPublicData,
  getGeo,
  getInsights,
  getByDate,
} = require("../controllers/analytics.controller");

const router = express.Router();

router.get("/public-data", getPublicData);
router.get("/geo", getGeo);
router.get("/insights", getInsights);
router.get("/by-date", getByDate);

module.exports = router;
