const express = require("express");
const app = express();
require("dotenv").config();
// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET);
// console.log(process.env.STRIPE_SECRET);

app.use(express.static("public"));
app.use(express.json());
app.use(function (req, res, next) {
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // replace with your domain or * to allow all origins

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  // res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.post("/create-payment-intent", async (req, res) => {
  // const { items } = req.body;
  const totalPrice = parseInt(req.body.totalPrice);
  console.log(totalPrice);

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    // amount: calculateOrderAmount(items),
    amount: totalPrice * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

module.exports = app;
