const catchAsync = require("../utils/catchAsync");
const transactionService = require("../services/transaction.service");

const createTransaction = catchAsync(async (req, res) => {
  const data = await transactionService.createTransaction(req.body, req.user._id);
  res.status(201).json({
    success: true,
    message: "Transaction created successfully",
    data,
  });
});

const getTransactions = catchAsync(async (req, res) => {
  const data = await transactionService.getTransactions(req.query, req.user._id);
  res.status(200).json({
    success: true,
    message: "Transactions fetched successfully",
    ...data,
  });
});

const updateTransaction = catchAsync(async (req, res) => {
  const data = await transactionService.updateTransaction(
    req.params.id,
    req.body,
    req.user._id
  );
  res.status(200).json({
    success: true,
    message: "Transaction updated successfully",
    data,
  });
});

const deleteTransaction = catchAsync(async (req, res) => {
  await transactionService.softDeleteTransaction(req.params.id, req.user._id);
  res.status(200).json({
    success: true,
    message: "Transaction deleted successfully",
  });
});

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
};
