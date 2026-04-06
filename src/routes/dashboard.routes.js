const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/rbac.middleware");

const router = express.Router();

router.get(
  "/summary",
  protect,
  authorizeRoles("Admin", "Analyst"),
  dashboardController.getSummary
);

module.exports = router;
