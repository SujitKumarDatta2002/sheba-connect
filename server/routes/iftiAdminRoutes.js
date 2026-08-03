const express = require("express");
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getServices,
  createService,
  updateService,
  deleteService,
  getHelplines,
  createHelpline,
  updateHelpline,
  deleteHelpline,
} = require("../controllers/iftiAdminController");

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/services", getServices);
router.post("/services", createService);
router.put("/services/:id", updateService);
router.delete("/services/:id", deleteService);

router.get("/helplines", getHelplines);
router.post("/helplines", createHelpline);
router.put("/helplines/:id", updateHelpline);
router.delete("/helplines/:id", deleteHelpline);

module.exports = router;
