require("dotenv").config();
// const path = require("path");
const express = require("express");
const methodOverride = require("method-override");
const app = express();

// var MONGODB_URI = "mongodb+srv://g00nd0:Slowlywerot-(1989)!@sei26-project4.dxhyr.mongodb.net/beatit?retryWrites=true&w=majority";

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());

const session = require("express-session");
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const TxController = require("./controllers/TxController");
app.use("/api/tx", TxController);

const UserController = require("./controllers/UserController");
app.use("/api/user", UserController);

const jwtController = require("./controllers/JwtController");
app.use("/api/session", jwtController);

app.get("/", (req, res) => {
  res.send("test");
});

const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log("Server is listening on port" + port);
});