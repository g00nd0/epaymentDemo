const e = require("express");
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
      txHistory: [{sender: "e.ripley", recipient: "t.wellick", txAmount: 600},{sender: "t.wellick", recipient: "jcdenton451", txAmount: 200}],
    },
    {
        firstName: "Ellen",
        lastName: "Ripley",
        contactNum: 90010426,
        username: "e.ripley",
        password: "Password1234",
        currentBalance: 426,
        txHistory: [{ sender: "jcdenton451", recipient: "e.ripley", txAmount: 1200},{ sender: "e.ripley", recipient: "g00nd01234", txAmount: 200 }],
    },
    {
        firstName: "J.C.",
        lastName: "Denton",
        contactNum: 90451010,
        username: "jcdenton451",
        password: "smashthestate",
        currentBalance: 4510,
        txHistory: [{ sender: "g00nd01234", recipient: "jcdenton451", txAmount: 1200},{ sender: "e.jcdenton451", recipient: "t.wellick", txAmount: 200 }],
    },
    {
        firstName: "Mitch",
        lastName: "Goon",
        contactNum: 90000666,
        username: "g00nd01234",
        password: "hailsatan666",
        currentBalance: 666666,
        txHistory: [{ sender: "jcdenton451", recipient: "g00nd01234", txAmount: 1200},{ sender: "g00nd01234", recipient: "e.ripley", txAmount: 200 }],
    },
  ];

  
  module.exports = userSeed;