const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const Tx = require("../models/tx");
const userSeed = require("../defaults/seed")
const omit = require("just-omit");

router.get("/:id", async (req, res) => { //get user tx history
    try {
      const data = await User.findById(req.params.id);
      res.status(200).json(data.txHistory);
    } catch (err) {
      res.status(400).json(err);
    }
  });

router.post("/:id",
    body("sender", "Sender cannot be empty").trim().notEmpty(),
    body("recipient", "Recipient cannot be empty").trim().notEmpty(),
    body("txAmount", "Please enter an amount greater than $0").isNumeric().isInt({ gt: 0 }),
    body("description", "Please enter a description for this transaction").trim().isLength({ min: 1, max: 30 }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Errors returned in an array `errors.array()`.
            const locals = { newTx: req.body, errors: errors.array() };
            res.status(StatusCodes.BAD_REQUEST).send(locals);
        } else {
            //Data is valid
            const newTx = req.body;
            console.log(newTx);
            Tx.create(newTx, (error, data) => {
            res.status(StatusCodes.CREATED).send(data);
      });
        }

})



  module.exports = router;