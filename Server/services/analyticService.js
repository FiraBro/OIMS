import policy from "../models/policy.js";
import claim from "../models/claim.js";
import User from "../models/user.js";
export const getFinancialAnalytics = async () => {
  const results = await policy.aggregate([
    { $match: { isDeleted: false } },
    {
      $facet: {
        // 1. FINANCIAL PERFORMANCE (Loss Ratio Basis)
        profitability: [
          {
            $group: {
              _id: null,
              totalPremium: { $sum: "$premium" },
              policyCount: { $sum: 1 },
            },
          },
        ],

        // 2. RISK DISTRIBUTION (Enterprise Risk layer)
        riskDistribution: [
          {
            $group: {
              _id: { $ifNull: ["$planSnapshot.planType", "Uncategorized"] },
              premiumVolume: { $sum: "$premium" },
              policyCount: { $sum: 1 },
            },
          },
          {
            $project: {
              category: "$_id",
              premiumVolume: 1,
              policyCount: 1,
              _id: 0,
            },
          },
        ],

        // 3. COHORT RETENTION (Checking renewals/loyalty)
        retentionMetrics: [
          {
            $group: {
              _id: { $month: "$createdAt" },
              newPolicies: { $sum: 1 },
              renewals: {
                $sum: { $cond: [{ $gt: ["$renewalCount", 0] }, 1, 0] },
              },
            },
          },
          { $sort: { _id: 1 } },
        ],

        // 4. CLAIMS TREND (Your existing logic)
        claimsTrend: [
          {
            $lookup: {
              from: claim.collection.name,
              localField: "_id",
              foreignField: "policyId",
              as: "claimsData",
            },
          },
          { $unwind: "$claimsData" },
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: [{ $toLower: "$claimsData.status" }, "approved"] },
                  { $eq: ["$claimsData.isDeleted", false] },
                ],
              },
            },
          },
          {
            $group: {
              _id: { $month: { $toDate: "$claimsData.submittedAt" } },
              payout: { $sum: "$claimsData.amount" },
            },
          },
          { $sort: { _id: 1 } },
        ],
      },
    },
  ]);

  // 5. CONVERSION FUNNEL (Separate query as it starts from Users, not Policies)
  const totalUsers = await User.countDocuments();
  const usersWithPolicies = await policy.distinct("user");

  const funnel = {
    totalUsers,
    interested: usersWithPolicies.length,
    activePaid: results[0].profitability[0]?.policyCount || 0,
  };

  return {
    ...results[0],
    funnel,
  };
};
