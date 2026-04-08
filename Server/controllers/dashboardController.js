import * as dashboardService from "../services/dashboardService.js";

export const getAdminOverview = async (req, res) => {
  try {
    const data = await dashboardService.getDashboardStats();

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Dashboard data not found",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (err) {
    console.error("[DashboardController]", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
