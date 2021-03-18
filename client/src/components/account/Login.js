import { useState } from "react";
import axios from "axios";
import {
  Form,
  Button,
  FormLabel,
  FormControl,
  FormGroup,
  FormText,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
// import 'bootstrap/dist/css/bootstrap.min.css';
import { Redirect } from "react-router-dom";
const jwt = require("jsonwebtoken");

const Login = (props) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [loginStatus, setLoginStatus] = useState(false); //to redirect to /beatseq
  const [status, setStatus] = useState(""); //inform user that logging in

  // const secret = process.env.JWT_SECRET_KEY;

  const handleLogin = (event) => {
    event.preventDefault();
    setErrorMsg("")
    axios
      .post("/api/session", formData, { withCredentials: true }) //get token
      .then((response) => {
        console.log("response.data", response.data);
        if (response.data.token) {
          //set token to localStorage
          const token = response.data.token;
          localStorage.setItem("token", token);
          const decoded = jwt.verify(token, "sei-26"); //cant read secret :/
          const user = {
            userId: decoded.user._id,
            username: decoded.user.username,
          }; //useState or if statement?
          setStatus("logging in"); //re-render
          props.setUser(user);
          console.log("logging in");
          setTimeout(() => {
            setLoginStatus(true);
          }, 800);
        }
      })
      .catch((error) => {
        //handling error not working
        setStatus("");
        // setErrorMsg(error.error);
        if (error.response.data.error === undefined) {
          setErrorMsg(error.response.statusText)
        } else {
          setErrorMsg(error.response.statusText + ", " + error.response.data.error);
        } // custom message from backend
        console.log("error from posting session error.response", error.response);
      });
  };

  if (loginStatus === true) {
    //redirect to /beatseq{
    return <Redirect to={"/beatseq"} />;
  }

  const keyWidth = 2;
  const valueWidth = 6;
  const buffer = 2;

  const message = () => {
    if (errorMsg) {
      console.log(errorMsg)
      return < Alert variant="danger" > <span class="font-weight-bold">Oh no! </span>{errorMsg}</Alert >
    } else if (status === "logging in") {
      return <Alert variant="success"><span class="font-weight-bold">Success : </span>Get ready to dope!</Alert>
    } else {
      return <span />
    }
  }


  return (
    <div className="form-box">
      <div class="form-h1">
        <h1>Log In</h1>
      </div>

      <div class="detailform-cont">

        <Form onSubmit={handleLogin}>
          <FormGroup as={Row} controlId="username">
            <Col sm={buffer} />
            <FormLabel column sm={keyWidth}>
              <span class="font-weight-bold">Username : </span>
            </FormLabel>
            <Col sm={valueWidth}>
              <FormControl
                type="text"
                value={formData.username}
                onChange={(event) => {
                  // console.log(event.target)
                  setFormData((state) => {
                    return { ...state, username: event.target.value };
                  });
                }}
              />
            </Col>
          </FormGroup>

          <FormGroup as={Row} controlId="password">
            <Col sm={buffer} />
            <FormLabel column sm={keyWidth}>
              <span class="font-weight-bold">Password : </span>
            </FormLabel>
            <Col sm={valueWidth}>
              <FormControl
                type="Password"
                value={formData.password}
                onChange={(event) => {
                  setFormData((state) => {
                    return { ...state, password: event.target.value };
                  });
                }}
              />
            </Col>
          </FormGroup>
          <Row>

            <Col sm={buffer} />
            <Col sm={valueWidth + 1}>{message()}</Col>
            <Col sm={keyWidth - 1}>
              <Button variant="primary" type="submit">
                Log In
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default Login;
