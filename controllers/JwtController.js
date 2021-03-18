const bcrypt = require("bcrypt");
const express = require("express");
const jwtSession = express.Router();
const createJWTToken = require("../config/jwt");
const User = require("../models/user.js");
const { StatusCodes } = require("http-status-codes");

//TO ADD ON, if user is inactive/deleted, should not be able to log in
// POST on log-in /session

//login
jwtSession.post("/", async (req, res, next) => {
  User.findOne({ username: req.body.username }, (err, foundUser) => {
    if (err) {
      console.log(err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: "Oops there's a problem with the server database" });
    } else if (!foundUser) {
      res.status(StatusCodes.UNAUTHORIZED).send({ error: `sorry, no user found.` });
    } else {
      //no error with server database and found user in database
      // check User status
        if (bcrypt.compareSync(req.body.password, foundUser.password)) {
          //password match
          const token = createJWTToken(foundUser);
          const oneDay = 24 * 60 * 60 * 1000;
          const oneWeek = oneDay * 7;
          const expiryDate = new Date(Date.now() + oneWeek);
          res.cookie("token", token, {
            expires: expiryDate,
            httpOnly: true, // client-side js cannot access cookie info
            secure: true, // use HTTPS
          });
          // res.status(200).send("You are now logged in!");
          res.status(StatusCodes.OK).json({ token });
        } else {
          res.status(StatusCodes.UNAUTHORIZED).send({ error: `incorrect password.` });
        }
       
    }
  });
});

//logout
jwtSession.post("/logout", (req, res) => {
  res.clearCookie("token").status(StatusCodes.OK).send("You are now logged out!");
});

module.exports = jwtSession;
