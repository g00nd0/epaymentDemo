const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const Tx = require("../models/tx");
const omit = require("just-omit");

router.get("/:id", (req, res) => { //get user tx history and balance
    try {
      const data = User.findById(req.params.id);
      console.log(data)
      res.status(StatusCodes.OK).json(data.txHistory);
    } catch (err) {
      res.status(StatusCodes.BAD_REQUEST).json(err);
    }
  });

router.get("/:id/date_range", (req, res) => { //get user tx history by specified period

  User.findById(req.params.id, (error, data) => {
    if (error) {
        res.status(StatusCodes.BAD_REQUEST).send({
            ...error,
            reason: `ERROR ${StatusCodes.BAD_REQUEST}, not valid id`,
        }); //trying to add reason in to reason {}
    } else {
      const startDate = new Date(new Date("2021-03-18").setHours(14, 30, 00))
      const endDate = new Date(new Date("2021-03-18").setHours(23, 59, 59))
      const txRange = data.txHistory.filter((tx)=> {
        return tx.createdAt >= startDate && tx.createdAt <= endDate
      })
      console.log(txRange.length)
      console.log(startDate.toLocaleDateString('en-SG'))
      console.log(endDate.toLocaleDateString('en-SG'))
      res.status(StatusCodes.OK).send(txRange);
    }
  }).lean(); //returns response.data instead of mongoose collection
}

);

router.put("/:id",
    body("sender", "Sender cannot be empty").trim().notEmpty(),
    body("recipient", "Recipient cannot be empty").trim().notEmpty(),
    body("txAmount", "Please enter an amount greater than $0").isNumeric().isInt({ gt: 0 }),
    body("description", "Please enter a description for this transaction").trim().isLength({ min: 1, max: 30 }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {  // Errors returned in an array `errors.array()`.
            const locals = { newTx: req.body, errors: errors.array() };
            res.status(StatusCodes.BAD_REQUEST).send(locals);
        } else {
            User.findById(req.params.id, (error, sender) => { // check if sender's userid is exists
              if (error) {
                res.status(StatusCodes.BAD_REQUEST).send({
                    ...error,
                    reason: `ERROR ${StatusCodes.BAD_REQUEST}, not valid id`,
                }); //trying to add reason in to reason {}
                
              } else {

                User.exists({username: req.body.recipient}, (err, rcvUserExists) => {
                  if (err || !rcvUserExists) {
                            console.log("does not exist")
                            res.status(StatusCodes.BAD_REQUEST).send({
                                ...err,
                                reason: `ERROR ${StatusCodes.BAD_REQUEST}, recipient not found`,
                            }); 
                          } else {
                            
                            User.find({username: req.body.recipient}, (err, rcvUser) => { //check if recipient user exists
                              if (err) {
                                res.status(StatusCodes.BAD_REQUEST).send({
                                    ...err,
                                    reason: `ERROR ${StatusCodes.BAD_REQUEST}, unknown error at recipient`,
                                }); 
                              } else {
                                const txAmt = parseInt(req.body.txAmount)
            
                                User.findByIdAndUpdate( // update sender's 
                                  req.params.id, // id
                                  {'currentBalance': sender.currentBalance - txAmt , $push: {'txHistory': {...req.body, sender: sender.username}}}, // what to update
                                  { new: true },
                                  (er, updatedUser) => {
                                    if (er) {
                                      res.status(StatusCodes.BAD_REQUEST).send({
                                        ...er,
                                        reason: `ERROR ${StatusCodes.BAD_REQUEST}, an error has occurred`,
                                      });
                                    } else {
                                      User.findByIdAndUpdate( // update recipient's
                                        rcvUser[0]._id, // id
                                        {'currentBalance': rcvUser[0].currentBalance + txAmt , $push: {'txHistory': {...req.body, sender: sender.username}}}, // what to update
                                        { new: true },
                                        (er, updatedUser) => {
                                          if (er) {
                                            res.status(StatusCodes.BAD_REQUEST).send({
                                            ...er,
                                            reason: `ERROR ${StatusCodes.BAD_REQUEST}, an error has occurred`,
                                            });
              
                                          } else {
                                            res.status(StatusCodes.OK).send("Transaction Success!");
                                            }
                                        } ); }
            
                                }
                              );     
            
                          }
                        })





                            
                          }
                })

                


            }
            })

            
      } 
})



  module.exports = router;