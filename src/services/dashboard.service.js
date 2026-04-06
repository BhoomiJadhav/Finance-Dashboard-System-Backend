const Transaction = require("../models/Transaction.model");

const getDashboardSummary = async (userId) => {
  const baseMatch = {
    createdBy: userId,
    isDeleted: false,
  };

  const [totals, categoryWiseTotals, recentTransactions, monthlyTrends] =
    await Promise.all([
      Transaction.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: "$type",
            total: { $sum: "$amount" },
          },
        },
      ]),
      Transaction.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" },
          },
        },
        { $sort: { total: -1 } },
      ]),
      Transaction.find(baseMatch)
        .sort({ date: -1, createdAt: -1 })
        .limit(5)
        .select("amount type category date note"),
      Transaction.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
              type: "$type",
            },
            total: { $sum: "$amount" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

  const totalIncome =
    totals.find((entry) => entry._id === "income")?.total || 0;
  const totalExpense =
    totals.find((entry) => entry._id === "expense")?.total || 0;

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    categoryWiseTotals: categoryWiseTotals.map((item) => ({
      category: item._id,
      total: item.total,
    })),
    recentTransactions,
    monthlyTrends: monthlyTrends.map((item) => ({
      year: item._id.year,
      month: item._id.month,
      type: item._id.type,
      total: item.total,
    })),
  };
};

module.exports = { getDashboardSummary };
