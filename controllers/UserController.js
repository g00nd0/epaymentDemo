const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const userSeed = require("../defaults/seed")
const omit = require("just-omit");

router.get("/", (req, res) => {
    if (req.query.username) { //if there is a query, check if it exist
        console.log("req.query.username", req.query.username);
        User.find({ username: req.query.username }, (error, oneUser) => {
            if (error) {
                res.status(StatusCodes.BAD_REQUEST).send(error);
            } else { //user exist
                res.status(StatusCodes.OK).send(oneUser);
            }
        })
    } else { //return all users
        User.find({}, (error, users) => {
            if (error) {
                res.send(error);
            } else {
                res.send(users);
            }
        });
    }
});

router.get("/seed", (req, res) => {
    console.log("seeding");
    User.create(userSeed,
        (error, user) => {
            if (error) {
                console.log(error);
                return res.send({ ...error, message: "likely user already exist" });
            }
            console.log("users", user);
            res.redirect("/user");
        }
    );
});

// SHOW /user/:id (user account details)
router.get("/:id", (req, res) => {
    User.findById(req.params.id, (error, user) => {
        if (error) {
            res.status(StatusCodes.BAD_REQUEST).send({
                ...error,
                reason: `ERROR ${StatusCodes.BAD_REQUEST}, not valid id`,
            }); //trying to add reason in to reason {}
        } else {
            console.log("user", user);
            const usernopw = { ...user, password: "" }; //return user account without password for security reasons
            res.status(StatusCodes.OK).send(usernopw);
        }
    }).lean(); //returns response.data instead of mongoose collection
});

//POST new user creation to /user
router.post(
    "/",
    body("firstName", "Please enter your first name.").trim().notEmpty(),
    body("lastName", "Please enter your last name.").trim().notEmpty(),
    body("contactNum", "Please enter a valid 8-digit contact number.").isNumeric().isInt({ gt: 10000000, lt: 99999999 }),
    body("username", "Username has to be at least 8 alphanumeric characters long.").trim().isLength({ min: 8 }),
    body("password", "Password has to be at least 8 alphanumeric characters long.").trim().isLength({ min: 8 }).isAlphanumeric(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Errors returned in an array `errors.array()`.
            const locals = { UserInput: req.body, errors: errors.array() };
            res.status(StatusCodes.BAD_REQUEST).send(locals);
        } else {
            //Data is valid
            console.log(req.body);
            //overwrite the user password with the hashed password, then pass that in to our database
            req.body.password = bcrypt.hashSync(
                req.body.password,
                bcrypt.genSaltSync()
            );
            User.create(req.body, (err, createdUser) => {
                if (err) {
                    res.status(StatusCodes.BAD_REQUEST).send(err);
                } else {
                    console.log("user is created");
                    req.session.currentUser = createdUser;
                    //req.session creates a session, we are also creating a field called currentUser = createdUser
                    res.status(StatusCodes.CREATED).send(createdUser);
                }
            });

        }
    }
);

router.put("/:id", //add money
        body("newAmount", "Please enter an amount greater than 0.").trim().isNumeric().isInt({ gt: 0 }),
        (req, res) => {
            const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Errors returned in an array `errors.array()`.
            const locals = { UserInput: req.body, errors: errors.array() };
            res.status(StatusCodes.BAD_REQUEST).send(locals);
        } else {
            const txAmt = parseInt(req.body.newAmount)
            
            User.findById(req.params.id, (error, sender) => { // check if sender's userid is exists
              if (error) {
                res.status(StatusCodes.BAD_REQUEST).send({
                    ...error,
                    reason: `ERROR ${StatusCodes.BAD_REQUEST}, not valid id`,
                }); //trying to add reason in to reason {}
              } else {
                User.findByIdAndUpdate(req.params.id,
                    {'currentBalance': sender.currentBalance + txAmt },
                    { new: true },
                    (err, updatedUser) => {
                        if (err) {
                            res.status(StatusCodes.BAD_REQUEST).send({
                                ...err,
                                reason: `ERROR ${StatusCodes.BAD_REQUEST}, an error has occurred`,
                                });
                        } else {
                            res.status(StatusCodes.OK).send("Transaction Success!");
                        }
                    }
                    )
              }
                     
        })
        }}



);


module.exports = router;