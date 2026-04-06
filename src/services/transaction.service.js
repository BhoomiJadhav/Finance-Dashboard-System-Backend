const Transaction = require("../models/Transaction.model");
const ApiError = require("../utils/ApiError");

const createTransaction = async (payload, userId) => {
  const transaction = await Transaction.create({
    ...payload,
    createdBy: userId,
  });
  return transaction;
};

const getTransactions = async (query, userId) => {
  const {
    type,
    category,
    dateFrom,
    dateTo,
    amountMin,
    amountMax,
    search,
    sortBy = "date",
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = query;

  const filters = {
    createdBy: userId,
    isDeleted: false,
  };

  if (type) filters.type = type;
  if (category) filters.category = new RegExp(`^${category}$`, "i");
  if (dateFrom || dateTo) {
    filters.date = {};
    if (dateFrom) filters.date.$gte = new Date(dateFrom);
    if (dateTo) filters.date.$lte = new Date(dateTo);
  }
  if (amountMin !== undefined || amountMax !== undefined) {
    filters.amount = {};
    if (amountMin !== undefined) filters.amount.$gte = Number(amountMin);
    if (amountMax !== undefined) filters.amount.$lte = Number(amountMax);
  }
  if (search) filters.$text = { $search: search };

  const pageNumber = Number(page);
  const pageSize = Number(limit);
  const skip = (pageNumber - 1) * pageSize;
  const sortDirection = sortOrder === "asc" ? 1 : -1;
  const sort = { [sortBy]: sortDirection };
  if (sortBy !== "date") {
    sort.date = -1;
  }

  const [data, total] = await Promise.all([
    Transaction.find(filters).sort(sort).skip(skip).limit(pageSize),
    Transaction.countDocuments(filters),
  ]);

  return {
    data,
    meta: {
      total,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

const updateTransaction = async (id, payload, userId) => {
  const transaction = await Transaction.findOne({
    _id: id,
    createdBy: userId,
    isDeleted: false,
  });
  if (!transaction) throw new ApiError(404, "Transaction not found");

  Object.assign(transaction, payload);
  await transaction.save();
  return transaction;
};

const softDeleteTransaction = async (id, userId) => {
  const transaction = await Transaction.findOne({
    _id: id,
    createdBy: userId,
    isDeleted: false,
  });
  if (!transaction) throw new ApiError(404, "Transaction not found");

  transaction.isDeleted = true;
  transaction.deletedAt = new Date();
  await transaction.save();
};

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  softDeleteTransaction,
};
