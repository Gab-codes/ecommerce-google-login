require("dotenv").config();
const axios = require("axios");

// Paystack configuration
const paystack = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: process.env.PAYSTACK_AUTHORIZATION,
    "Content-Type": "application/json",
  },
});

module.exports = paystack;
