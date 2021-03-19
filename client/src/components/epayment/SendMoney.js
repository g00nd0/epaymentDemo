import { useState, useEffect } from "react";
import axios from "axios";
import "../../css/accountform.css";
import { Form, Button, FormLabel, FormControl, FormGroup, FormText, FormCheck, Row, Col, Alert } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, Link, Redirect } from "react-router-dom";
const jwt = require("jsonwebtoken");

const SendMoney = () => {
    const token = localStorage.getItem("token");
    const decoded = jwt.verify(token, "grab");//cant read secret
    const user = { userId: decoded.user._id, username: decoded.user.username }

    const [formData, setFormData] = useState({
        sender: user.username,
        recipient: "",
        txAmount: 0,
        description: "",
    })
    const [errorMsg, setErrorMsg] = useState()
    const [sent, setSent] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [loginMsg, setLoginMsg] = useState(false)

    const handleSubmit = (event) => {
        event.preventDefault();
        // setFormData({...formData, sender: user.username})
        axios
                .put(`/api/tx/${user.userId}`, formData)
                .then((response) => {
                    //need to let navbar know so it can re-render itself
                    console.log("put user response", response)
                    //trigger Navbar change
                    // props.changeName(response.data.username)
                    console.log("response.data after put user", response.data)
                    // return <Redirect to={"/addmoney"} />;
                    // setSent(true);
                    setTimeout(() => {
                        setSent(true);
                    }, 1000);
                })
                .catch((error) => {
                    console.log("error", error.response.data.errors);
                    if (error.response.data.errors === undefined) {
                        setErrorMsg([{ msg: error.response.statusText }])
                    } else {
                        setErrorMsg(error.response.data.errors); // array of objects
                    }
                });

       
    };

    if (sent) {
        return <Redirect to={`/user`} /> //change to txhistory when ready
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


    return (<div class="detailform-cont">
    <Form onSubmit={handleSubmit}>

        <FormGroup as={Row} controlId="recipient">
            <Col sm={buffer} />
            <FormLabel column sm={keyWidth}><span class="font-weight-bold">Recipient : </span> </FormLabel>
            <Col sm={valueWidth}>
                <FormControl
                    type="text"
                    value={formData.recipient}
                    // value={0}
                    // disabled={ isLoading }
                    
                    onChange={(event) => {
                        setFormData((state) => {
                            return { ...state, recipient: event.target.value }
                        })
                    }}
                    onBlur={(event) => handleBlur(event)}
                />
                <FormText className="text">
                    Enter the recipient's username
                    </FormText>
            </Col>
        </FormGroup>

        <FormGroup as={Row} controlId="txAmount">
            <Col sm={buffer} />
            <FormLabel column sm={keyWidth}><span class="font-weight-bold">Amount to Send : </span> </FormLabel>
            <Col sm={valueWidth}>
                <FormControl
                    type="number"
                    value={formData.txAmount}
                    // value={0}
                    // disabled={ isLoading }
                    
                    onChange={(event) => {
                        setFormData((state) => {
                            return { ...state, txAmount: event.target.value }
                        })
                    }}
                    onBlur={(event) => handleBlur(event)}
                />
                <FormText className="text">
                    Amount must be more than $0.00.
                    </FormText>
            </Col>
        </FormGroup>

        <FormGroup as={Row} controlId="description">
            <Col sm={buffer} />
            <FormLabel column sm={keyWidth}><span class="font-weight-bold">Description : </span> </FormLabel>
            <Col sm={valueWidth}>
                <FormControl
                    type="text"
                    value={formData.description}
                    // value={0}
                    // disabled={ isLoading }
                    
                    onChange={(event) => {
                        setFormData((state) => {
                            return { ...state, description: event.target.value }
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
                        // width: "150px",
                        // padding: "0 5px 0 5px",
                        // border: "3px solid",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "right"
                    }}
                    type="submit"
                    disabled={isLoading}
                >
                    {"Send Money"}
                </Button>
            </Col>
        </Row>
    </Form>
</div>)
}

export default SendMoney;