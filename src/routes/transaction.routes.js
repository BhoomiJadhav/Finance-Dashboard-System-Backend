const express = require("express");
const transactionController = require("../controllers/transaction.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/rbac.middleware");
const { validateRequest } = require("../middleware/validation.middleware");
const {
  createTransactionValidator,
  updateTransactionValidator,
  transactionIdValidator,
  transactionQueryValidator,
} = require("../utils/validators");

const router = express.Router();

router.use(protect);

router.get(
  "/",
  authorizeRoles("Admin", "Analyst", "Viewer"),
  transactionQueryValidator,
  validateRequest,
  transactionController.getTransactions
);

router.post(
  "/",
  authorizeRoles("Admin"),
  createTransactionValidator,
  validateRequest,
  transactionController.createTransaction
);

router.put(
  "/:id",
  authorizeRoles("Admin"),
  updateTransactionValidator,
  validateRequest,
  transactionController.updateTransaction
);

router.delete(
  "/:id",
  authorizeRoles("Admin"),
  transactionIdValidator,
  validateRequest,
  transactionController.deleteTransaction
);

module.exports = router;
