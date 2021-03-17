const express = require("express");
const router = express.Router();

const userSeed = [
    {
      firstName: "Tyrell",
      lastName: "Wellick",
      contactNum: 91234567,
      username: "t.wellick",
      password: "Password1234",
      currentBalance: 666000,
      txHistory: [],
    },
    {
        firstName: "Ellen",
        lastName: "Ripley",
        contactNum: 90010426,
        username: "e.ripley",
        password: "Password1234",
        currentBalance: 426,
        txHistory: [],
    },
    {
        firstName: "J.C.",
        lastName: "Denton",
        contactNum: 90451010,
        username: "jc451",
        password: "smashthestate",
        currentBalance: 4510,
        txHistory: [],
    },
    {
        firstName: "Mitch",
        lastName: "Goon",
        contactNum: 90000666,
        username: "g00nd0",
        password: "hailsatan666",
        currentBalance: 666666,
        txHistory: [],
    },
  ];

  
  module.exports = userSeed;