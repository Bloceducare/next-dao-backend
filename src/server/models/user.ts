// const { Schema, model } = require("../db/connection"); // import Schema & model

import mongoose from 'mongoose';
const Schema = mongoose.Schema;


// User Schema
const UserSchema = new Schema({
  fullName: { type: String },
  email: { type: String },
  phoneNumber: { type: String },
  walletAddress: { type: String, unique: true },
  amount: { type: Number },
  transactionId: {
    type: [
      {
        txnId: {
          type: String,
          unique: true, // Ensure uniqueness of txnId
        },
        user: {
          type: String,
        },
        amount: { type: Number },
        date: { type: Date },
      },
    ],
    default: [],
  },
});

// // User model
// const userScheme = new Schema({ ...UserSchema}, { timestamps: true });
// const users = mongoose.models.user || mongoose.model('user', userScheme, 'user');
// export default users;

// mongoose.models = {};

// var User = mongoose.model('user', UserSchema);


export const UserModel = mongoose.models.user || mongoose.model('user', UserSchema);
export default UserModel;


// export default User;
