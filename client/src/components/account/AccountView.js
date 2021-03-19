import { useState, useEffect } from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import axios from "axios";
// import { Row, Col, Container, Button } from "react-bootstrap";
import { Form, Button, Container, FormLabel, FormControl, FormGroup, FormText, FormCheck, Row, Col, Alert } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
const jwt = require("jsonwebtoken");

const AccountView = () => {//user={userId, username}
    const [formData, setFormData] = useState({});
    const userIdParam = useParams().id;
    const token = localStorage.getItem("token");
    const decoded = jwt.verify(token, "grab");//cant read secret
    const user = { userId: decoded.user._id, username: decoded.user.username }

    useEffect(() => {//get the user
        axios
            .get(`/api/user/${user.userId}`)
            .then((response) => {
                setFormData(response.data);
            })
            .catch((error) => {
                console.log("error", error);
            });
    }, [userIdParam]);

    const buffer = 2;
    const keyWidth = 2;
    const valueWidth = 6;

    return (
        <div>
            {user.userId  ? ( //prevent people from manipulating with userId in params
                <div className="form-box">
                    <div class="form-h1">
                        <h1>Account Details</h1>
                    </div>
                    <div class="detailform-cont">

                        <FormGroup as={Row} controlId="username">
                            <Col sm={buffer} />
                            <FormLabel column sm={keyWidth}><span class="font-weight-bold">Username : </span> </FormLabel>
                            <Col sm={valueWidth}>

                                <p style={{ padding: "7px 15px" }}>{formData.username}</p>

                            </Col>
                        </FormGroup>

                        <FormGroup as={Row} controlId="name">
                            <Col sm={buffer} />
                            <FormLabel column sm={keyWidth}><span class="font-weight-bold">Name : </span></FormLabel>
                            <Col sm={valueWidth}>
                                <p style={{ padding: "7px 15px" }}>{`${formData.firstName} ${formData.lastName}`}</p>
                            </Col>
                        </FormGroup>

                        <FormGroup as={Row} controlId="contactNum">
                            <Col sm={buffer} />
                            <FormLabel column sm={keyWidth}><span class="font-weight-bold">Mobile # : </span> </FormLabel>
                            <Col sm={valueWidth}>
                                <p style={{ padding: "7px 15px" }}>{formData.contactNum}</p>
                            </Col>
                        </FormGroup>

                        <FormGroup as={Row} controlId="currentBalance">
                            <Col sm={buffer} />
                            <FormLabel column sm={keyWidth}><span class="font-weight-bold">Current Balance : </span> </FormLabel>
                            <Col sm={valueWidth}>
                                <p style={{ padding: "7px 15px" }}>{`SGD $${formData.currentBalance}`}</p>
                            </Col>
                        </FormGroup>

                        <div id="" class="pt-1">
                            
                        </div>
                    </div>
                </div>)
                : (<>
                    <Redirect to={"/restricted"} />
                    </>
                )
            }
        </div >
    );
};

export default AccountView;