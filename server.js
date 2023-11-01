const express = require("express");
const app = express();
require("dotenv").config();
// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET);
// console.log(process.env.STRIPE_SECRET);
const endpointSecret =
  "whsec_e8763f94295b80b9769d0a8f761e426020de4e3c98016bf8f47ccf2a04330cc0";

app.use(express.static("public"));
app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // replace with your domain or * to allow all origins
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
const calculateOrderAmount = (totalPrice) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return totalPrice;
};

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

// app.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   (request, response) => {
//     const sig = request.headers["stripe-signature"];

//     let event;

//     try {
//       event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//     } catch (err) {
//       response.status(400).send(`Webhook Error: ${err.message}`);
//       return;
//     }

//     // Handle the event
//     switch (event.type) {
//       case "payment_intent.succeeded":
//         const paymentIntentSucceeded = event.data.object;
//         console.log(paymentIntentSucceeded);
//         // Then define and call a function to handle the event payment_intent.succeeded
//         break;
//       // ... handle other event types
//       default:
//         console.log(`Unhandled event type ${event.type}`);
//     }

//     // Return a 200 response to acknowledge receipt of the event
//     response.send();
//   }
// );

// app.listen(4242, () => console.log("Node server listening on port 4242!"));

module.exports = app;
