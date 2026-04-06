const catchAsync = require("../utils/catchAsync");
const dashboardService = require("../services/dashboard.service");

const getSummary = catchAsync(async (req, res) => {
  const data = await dashboardService.getDashboardSummary(req.user._id);
  res.status(200).json({
    success: true,
    message: "Dashboard summary fetched successfully",
    data,
  });
});

module.exports = { getSummary };
