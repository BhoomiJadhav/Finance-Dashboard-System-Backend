const { body, query, param } = require("express-validator");

const registerValidator = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["Admin", "Analyst", "Viewer"])
    .withMessage("Role must be Admin, Analyst, or Viewer"),
];

const loginValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const createTransactionValidator = [
  body("amount").isFloat({ gt: 0 }).withMessage("Amount must be > 0"),
  body("type").isIn(["income", "expense"]).withMessage("Invalid type"),
  body("category")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Category must be 2-100 characters"),
  body("date").isISO8601().withMessage("Date must be a valid ISO date"),
  body("note")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Note must be <= 500 characters"),
];

const updateTransactionValidator = [
  param("id").isMongoId().withMessage("Invalid transaction id"),
  body("amount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Amount must be > 0"),
  body("type")
    .optional()
    .isIn(["income", "expense"])
    .withMessage("Type must be income or expense"),
  body("category")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Category must be 2-100 characters"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO date"),
  body("note")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Note must be <= 500 characters"),
];

const transactionIdValidator = [
  param("id").isMongoId().withMessage("Invalid transaction id"),
];

const transactionQueryValidator = [
  query("type")
    .optional()
    .isIn(["income", "expense"])
    .withMessage("Type must be income or expense"),
  query("category")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Category must be 2-100 characters"),
  query("dateFrom")
    .optional()
    .isISO8601()
    .withMessage("dateFrom must be a valid ISO date"),
  query("dateTo")
    .optional()
    .isISO8601()
    .withMessage("dateTo must be a valid ISO date"),
  query("amountMin")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("amountMin must be >= 0"),
  query("amountMax")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("amountMax must be >= 0"),
  query("sortBy")
    .optional()
    .isIn(["date", "amount", "createdAt"])
    .withMessage("sortBy must be date, amount, or createdAt"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("sortOrder must be asc or desc"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100"),
  query().custom((_, { req }) => {
    const { dateFrom, dateTo, amountMin, amountMax } = req.query;
    if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
      throw new Error("dateFrom cannot be greater than dateTo");
    }
    if (
      amountMin !== undefined &&
      amountMax !== undefined &&
      Number(amountMin) > Number(amountMax)
    ) {
      throw new Error("amountMin cannot be greater than amountMax");
    }
    return true;
  }),
];

module.exports = {
  registerValidator,
  loginValidator,
  createTransactionValidator,
  updateTransactionValidator,
  transactionIdValidator,
  transactionQueryValidator,
};
