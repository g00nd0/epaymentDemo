import { useState, useEffect } from "react";
import axios from "axios";
import "../../css/accountform.css";
import { Form, Button, FormLabel, FormControl, FormGroup, FormText, FormCheck, Row, Col, Alert } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, Link, Redirect } from "react-router-dom";
const jwt = require("jsonwebtoken");

const AccountDetailsForm = (props) => {//received user={userId, userName} from AccountEdit
    const [formData, setFormData] = useState({})
    const [currentUsername, setCurrentUsername] = useState()
    const [errorMsg, setErrorMsg] = useState()
    const [sent, setSent] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [loginMsg, setLoginMsg] = useState(false)
    const userId = useParams().id

    useEffect(() => {//get user is there is userId in params
        if (userId) {
            setIsLoading(true)
            console.log("before axios")
            axios.get(`/api/user/${userId}`)
                .then((response) => {
                    setFormData(response.data)
                    setCurrentUsername(response.data.username)
                    setIsLoading(false)
                })
                .catch((error) => {
                    console.log('error', error)
                })
        } else {
            console.log("new user. no set data")
        }
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        const updatedInfo = {
            username: formData.username,
            firstName: formData.firstName,
            lastName: formData.firstName,
            email: formData.email,
        };
        if (!userId) { //new user => POST
            axios
                .post("/api/user", formData)
                .then((response) => {
                    console.log("user created, response", response, "time to axios post session");
                    //axios a session and get token
                    axios
                        .post("/api/session", formData, { withCredentials: true })
                        .then((response) => {
                            console.log("response.data from post api session", response.data);
                            if (response.data.token) {//get token
                                //set token to localStorage
                                const token = response.data.token;
                                localStorage.setItem("token", token);
                                const decoded = jwt.verify(token, "grab"); //cant read secret :/
                                const user = {
                                    userId: decoded.user._id,
                                    username: decoded.user.username,
                                };
                                console.log("logging in");
                                props.setUser(user);
                         
                                setLoginMsg(true)
                        
                                setTimeout(() => {
                                    setSent(true)
                                }, 1000);
                                
                            }
                        })
                        .catch((error) => {

                            if (error.response.data.error === undefined) {
                                setErrorMsg(error.response.statusText)
                            } else {
                                setErrorMsg([{ msg: (error.response.statusText) + ", " + (error.response.data.error) }]);
                            }
    
                        });
                })
                .catch((error) => {// catch post error, validation of signup form
                    console.log("error from posting user S", error.response.data.errors);
                    console.log("error from posting user", error.response.data.error);
                    console.log("error from posting user error.response", error.response);
                    if (error.response.data.errors === undefined) {
                        setErrorMsg([{ msg: error.response.statusText }])
                    } else {
                        setErrorMsg(error.response.data.errors);
                    }
                });

        } else if (userId) {//existing user => PUT
            axios
                .put(`/api/user/${userId}`, updatedInfo)
                .then((response) => {
           
                    console.log("put user response", response)
      
                    console.log("response.data after put user", response.data)
                    setTimeout(() => {
                        setSent(true);
                    }, 2000);
                })
                .catch((error) => {
                    console.log("error", error.response.data.errors);
                    if (error.response.data.errors === undefined) {
                        setErrorMsg([{ msg: error.response.statusText }])
                    } else {
                        setErrorMsg(error.response.data.errors); // array of objects
                    }
                });
        }
    };

    if (sent && userId) { //editing profile
        return <Redirect to={`/user/${userId}`} />
    }
    else if (sent && !userId) { //signing up
        return <Redirect to={'/'} />
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
                    <FormLabel column sm={keyWidth}><span class="font-weight-bold">Username : </span> </FormLabel>
                    <Col sm={valueWidth}>
                        <FormControl
                            type="text"
                            value={userId ? "" : formData.username}
                            disabled={userId}
                            onChange={(event) => {
                                setFormData((state) => {
                                    return { ...state, username: event.target.value }
                                })
                            }}
                            onBlur={(event) => handleBlur(event)}
                        />
                        <FormText className="text">
                            Username must be at least 6 characters long
                            </FormText>
                    </Col>
                </FormGroup>

                <FormGroup as={Row} controlId="password">
                    <Col sm={buffer} />
                    <FormLabel column sm={keyWidth}> <span class="font-weight-bold">Password : </span>{" "}</FormLabel>

                    <Col sm={valueWidth}>
                        <FormControl
                            type="Password"
                            value={userId ? "" : formData.password}
                            onChange={(event) => {
                                setFormData((state) => {
                                    return { ...state, password: event.target.value };
                                });
                            }}
                            disabled={userId}
                        />
                        <FormText className="text">
                            Password must be at least 8 alphanumeric characters long
                            </FormText>
                    </Col>
                </FormGroup>

                <FormGroup as={Row} controlId="firstName">
                    <Col sm={buffer} />
                    <FormLabel column sm={keyWidth}><span class="font-weight-bold">First Name: </span></FormLabel>
                    <Col sm={valueWidth}>
                        <FormControl type="text"
                            value={formData.firstName}
                            disabled={isLoading}
                            onChange={(event) => {
                                setFormData((state) => {
                                    return { ...state, firstName: event.target.value }
                                })
                            }} />
                    </Col>
                </FormGroup>

                <FormGroup as={Row} controlId="lastName">
                    <Col sm={buffer} />
                    <FormLabel column sm={keyWidth}><span class="font-weight-bold">Last Name: </span> </FormLabel>
                    <Col sm={valueWidth}>
                        <FormControl type="text"
                            value={formData.lastName}
                            disabled={isLoading}
                            onChange={(event) => {
                                setFormData((state) => {
                                    return { ...state, lastName: event.target.value }
                                })
                            }} />
                    </Col>
                </FormGroup>

                <FormGroup as={Row} controlId="contactNum">
                    <Col sm={buffer} />
                    <FormLabel column sm={keyWidth}><span class="font-weight-bold">Mobile #: </span> </FormLabel>
                    <Col sm={valueWidth}>
                        <FormControl type="number"
                            value={formData.contactNum}
                            disabled={isLoading}
                            onChange={(event) => {
                                setFormData((state) => {
                                    return { ...state, contactNum: event.target.value }
                                })
                            }} />
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
                            {userId ? "Save" : "Create"}
                        </Button>
                    </Col>
                    {userId ? (

                        <Col>
                            <Link to={`/user/${userId}`}>
                                <Button class="btn btn-secondary"> Back
                            </Button>
                            </Link>
                        </Col>

                    ) : (
                            ""
                        )}
                </Row>
            </Form>
        </div>
    );
};

export default AccountDetailsForm;
