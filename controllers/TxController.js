const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const userSeed = require("../defaults/seed")
const omit = require("just-omit");

// router.get("/", (req, res) => {
//     if (req.query.username) { //if there is a query, check if it exist
//         console.log("req.query.username", req.query.username);
//         User.find({ username: req.query.username }, (error, oneUser) => {
//             if (error) {
//                 res.status(StatusCodes.BAD_REQUEST).send(error);
//             } else { //user exist
//                 res.status(StatusCodes.OK).send(oneUser);
//             }
//         })
//     } else { //return all users
//         User.find({}, (error, users) => {
//             if (error) {
//                 res.send(error);
//             } else {
//                 res.send(users);
//             }
//         });
//     }
// });