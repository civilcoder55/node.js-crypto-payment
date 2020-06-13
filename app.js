// packages imports
const express = require("express");
const path = require("path");
const app = express();
const Coinpayments = require("coinpayments");
CoinpaymentsCredentials = {
  key: "your public key ",
  secret: "your secret key",
};
const client = new Coinpayments(CoinpaymentsCredentials);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
//render cart or buying page
app.get("/", async (req, res) => {

    res.render("index");
  });
//make transaction process
app.post("/", async (req, res) => {
    CoinpaymentsCreateTransactionOpts = {
      currency1: "USD",
      currency2: "BTC", //your favourite crypto
      amount: req.body.amount,
      buyer_email: req.body.email,
      ipn_url: "IPN Link", // this work like a webhook triggered when payment complete
    };
    try {
      TX = await client.createTransaction(CoinpaymentsCreateTransactionOpts);
      res.redirect(TX.checkout_url);
    } catch (err) {
      res.send(err.message);
    }
  });

//validate payment then do some opertaions
app.post("/ipn", async (req, res) => {
  const { verify } = require("coinpayments-ipn");

  if (!req.get(`HMAC`) || !req.body || !req.body.ipn_mode || req.body.ipn_mode !== `hmac` || MERCHANT_ID !== req.body.merchant) {
    return res.send("error");
  }
  const hmac = req.get(`hmac`);
  const ipnSecret = "your ipn secret";
  const payload = req.body;
  let isValid;
  try {
    isValid = verify(hmac, ipnSecret, payload);
  } catch (e) {
    return res.send("error");
  }

  if (isValid) {
    console.log("success");
    //some operation
  } else {
    console.log("error");
  }
});
app.listen(4000, () => {
  console.log("app is running on port 4000");
});
