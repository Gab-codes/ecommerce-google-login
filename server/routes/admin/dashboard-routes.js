const express = require("express");

const { getAdminDashboardMetrics } = require("../../controllers/admin/dashboard-controller");

const router = express.Router();

router.get("/metrics", getAdminDashboardMetrics);

module.exports = router;