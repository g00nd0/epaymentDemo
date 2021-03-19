import { Redirect } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
require("dotenv").config();
const jwt = require("jsonwebtoken");

const Logout = (props) => {

    console.log(process.env.REACT_APP_JWT_SECRET_KEY)
    const token = localStorage.getItem("token");
    const decoded = jwt.verify(token, "grab");//cant read secret :/
    const user = { userId: decoded.user._id, username: decoded.user.username }

    const loggedIn = user.userId === undefined ? false : true

    axios.post('api/session/logout')
        .then((response) => {
            localStorage.clear(); //trigger loggIn
            console.log(response)
        }).then(() => {
            // props.setLoggedIn(false)
            props.setUser({ username: "" })
        })
        .catch((error) => {
            console.log(error)
        })

    return (
        <>
            {loggedIn ? <Redirect to={'/'} /> : <h1>Logging out...</h1>}
        </>
    );
};

export default Logout;
