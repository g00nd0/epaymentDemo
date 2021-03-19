import { useState, useEffect } from "react";
import axios from "axios";
import "../../css/accountform.css";
import { Form, Button, FormLabel, FormControl, FormGroup, FormText, FormCheck, Row, Col, Alert } from "react-bootstrap";
import { useParams, Link, Redirect } from "react-router-dom";
const jwt = require("jsonwebtoken");

const AddMoney = (props) => {//received user={userId, userName} from AccountEdit
    const [formData, setFormData] = useState({})
    const [currentBalance, setCurrentBalance] = useState()
    const [errorMsg, setErrorMsg] = useState()
    const [sent, setSent] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [loginMsg, setLoginMsg] = useState(false)

    const token = localStorage.getItem("token");
    const decoded = jwt.verify(token, "grab");//cant read secret 
    const user = { userId: decoded.user._id, username: decoded.user.username }
    

    useEffect(() => {//get user is there is userId in params
       
            setIsLoading(true)
            axios.get(`/api/tx/${user.userId}`)
                .then((response) => {
                    setCurrentBalance(response.data)
                    setIsLoading(false)
                })
                .catch((error) => {
                    console.log('error', error)
                })
        
    }, [sent])

    const handleSubmit = (event) => {
        event.preventDefault();
        const updatedInfo = {
            newAmount: formData.newAmount,
        };
        axios
                .put(`/api/user/${user.userId}`, updatedInfo)
                .then((response) => {
                    setTimeout(() => {
                        setSent(true);
                    }, 1000);
                })
                .catch((error) => {
                    if (error.response.data.errors === undefined) {
                        setErrorMsg([{ msg: error.response.statusText }])
                    } else {
                        setErrorMsg(error.response.data.errors); // array of objects
                    }
                });

       
    };

    if (sent) {
        return <Redirect to={"/"} />;
      }

    const showErrors = () => {
        let errors = [];
        if (errorMsg) {
            errors.push(<p class="mb-1 font-weight-bold">Oh no! </p>);
            for (let i = 0; i < errorMsg.length; i++) {
                errors.push(<p class="mb-1">{errorMsg[i].msg}</p>);
            }
        }
        return errors;
    };

    const showMessage = () => {
        if (errorMsg) {
            return <Alert variant="danger">{showErrors()}</Alert>
        } else if (loginMsg) {
            return <Alert variant="success"><span class="font-weight-bold">Success : </span>Get ready to dope!</Alert>
        } else if (isLoading) {
            <Alert variant="info">Loading your data...</Alert>
        } else {
            return <span />
        }
    }

    const handleBlur = (event) => {
        setErrorMsg("");
        axios.get('/api/user', {  // /user?username=formData.username
            params: { username: formData.username }
        })
            .then((response) => {// either receive the existing one user else or all users when username ===""
                console.log("handle blur axios then response", response.data)
                if (([response.data]).length === 1) { //returns only one
                    if ([response.data][0].username !== undefined) {
                        if (formData.username === [response.data][0].username) {
                            setErrorMsg([{ msg: "Sorry, username already taken." }])
                        }
                    }
                } else {
                    return
                }
            })
    }
    const keyWidth = 2;
    const valueWidth = 6;
    const buffer = 2;

    return (
        <div class="detailform-cont">
            <Form onSubmit={handleSubmit}>

                <FormGroup as={Row} controlId="username">
                    <Col sm={buffer} />
                    <FormLabel column sm={keyWidth}><span class="font-weight-bold">Current Balance : </span> </FormLabel>
                    <Col sm={valueWidth}>

                        <p style={{ padding: "7px 15px" }}>{currentBalance}</p>

                    </Col>
                </FormGroup>

                <FormGroup as={Row} controlId="newAmount">
                    <Col sm={buffer} />
                    <FormLabel column sm={keyWidth}><span class="font-weight-bold">Amount to Add : </span> </FormLabel>
                    <Col sm={valueWidth}>
                        <FormControl
                            type="number"
                            onChange={(event) => {
                                setFormData((state) => {
                                    return { ...state, newAmount: event.target.value }
                                })
                            }}
                            onBlur={(event) => handleBlur(event)}
                        />
                        <FormText className="text">
                            Amount must be more than $0.00.
                            </FormText>
                    </Col>
                </FormGroup>

                <Row>
                    <Col sm={buffer} />
                    <Col sm={valueWidth}>
                        {showMessage()}
                    </Col>
                    <Col sm={keyWidth - 1} >
                        <Button
                            variant="primary"
                            style={{
                                borderRadius: "4px",
                                fontWeight: "bold",
                                display: "flex",
                                justifyContent: "right"
                            }}
                            type="submit"
                            disabled={isLoading}
                        >
                            {"Add Money"}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default AddMoney;
