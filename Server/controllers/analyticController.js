import * as analyticsService from "../services/analyticService.js";
// controllers/analytics.controller.js
export const getAdminAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getFinancialAnalytics();

    // Now 'data' contains profitability, funnel, riskDistribution, etc. directly
    const profitability = data.profitability?.[0] || {
      totalPremium: 0,
      policyCount: 0,
    };

    // Calculate total payout from claimsTrend
    const totalPayout =
      data.claimsTrend?.reduce((acc, curr) => acc + curr.payout, 0) || 0;

    // Loss Ratio Calculation
    const lossRatio =
      profitability.totalPremium > 0
        ? ((totalPayout / profitability.totalPremium) * 100).toFixed(1)
        : 0;

    // Construct the final enterprise response
    res.status(200).json({
      success: true,
      data: {
        ...data,
        profitability: {
          ...profitability,
          lossRatio: parseFloat(lossRatio),
        },
        totalPayout, // Helpful for the frontend
      },
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
