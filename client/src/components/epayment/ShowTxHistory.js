import { useState, useEffect } from "react";
import axios from "axios";
import "../../css/accountform.css";
import { Form, Button, FormLabel, FormControl, FormGroup, FormText, FormCheck, Row, Col, Alert } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, Link, Redirect } from "react-router-dom";
const jwt = require("jsonwebtoken");

const ShowTxHistory = () => {
    return <h1>Transaction History</h1>
}

export default ShowTxHistory;