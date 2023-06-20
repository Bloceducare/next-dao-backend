// const { Schema, model } = require("../db/connection"); // import Schema & model
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Transaction Schema
const TransactionSchema = new Schema({
  user: { type: String },
  txnId: {
    type: String,
    unique: true, // Ensure uniqueness of txnId
  },
  amount: { type: Number },
  date: { type: Date },
});

// Transaction model
export const transactionModel = mongoose.models.user || mongoose.model('transaction', TransactionSchema);
export default transactionModel;
