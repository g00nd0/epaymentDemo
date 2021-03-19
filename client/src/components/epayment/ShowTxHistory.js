import { useState, useEffect } from "react";
import axios from "axios";
import "../../css/accountform.css";
import { Form, Button, FormLabel, FormControl, FormGroup, FormText, FormCheck, Row, Col, Alert } from "react-bootstrap";
import { Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
const jwt = require("jsonwebtoken");

const ShowTxHistory = () => {
    const token = localStorage.getItem("token");
    const decoded = jwt.verify(token, "grab");//cant read secret
    const user = { userId: decoded.user._id, username: decoded.user.username }

    const [errorMsg, setErrorMsg] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [loginMsg, setLoginMsg] = useState(false)

    const [dateRange, setDateRange] = useState({startDate: "2021-03-17" , endDate: "2021-03-19"})
    const [txRange, setTxRange] = useState([])

    useEffect(() => {//get latest transactions
        axios
            .get(`/api/tx/${user.userId}/date_range?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`)
            .then((response) => {
                setTxRange(response.data);
            })
            .catch((error) => {
                console.log("error", error);
            });
    }, [dateRange]);

    const handleSubmit = (event) => {
        event.preventDefault();
        axios
                .get(`/api/tx/${user.userId}/date_range?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`)
                .then((response) => {

                    setTxRange(response.data)

                })
                .catch((error) => {
                    if (error.response.data.errors === undefined) {
                        setErrorMsg([{ msg: error.response.statusText }])
                    } else {
                        setErrorMsg(error.response.data.errors); // array of objects
                    }
                });

       
    };

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

    const keyWidth = 2;
    const valueWidth = 6;
    const buffer = 2;

    return (<>
        <h1>Transaction History</h1>
        <Form onSubmit={handleSubmit}>

        <FormGroup as={Row} controlId="startDate">
            <Col sm={buffer} />
            <FormLabel column sm={keyWidth}><span class="font-weight-bold">Start Date : </span> </FormLabel>
            <Col sm={valueWidth}>
                <FormControl
                    type="text"
                    value={dateRange.startDate}                   
                    onChange={(event) => {
                        setDateRange((state) => {
                            return { ...state, startDate: event.target.value }
                        })
                    }}

                />
            </Col>
        </FormGroup>

        <FormGroup as={Row} controlId="endDate">
            <Col sm={buffer} />
            <FormLabel column sm={keyWidth}><span class="font-weight-bold">End Date : </span> </FormLabel>
            <Col sm={valueWidth}>
                <FormControl
                    type="text"
                    value={dateRange.endDate}

                    onChange={(event) => {
                        setDateRange((state) => {
                            return { ...state, endDate: event.target.value }
                        })
                    }}
      
                />
                <FormText className="text">
                    Dates must be in the format "YYYY-MM-DD"
                    </FormText>
            </Col>
        </FormGroup>

    </Form>

    <Table
        striped
        bordered
        hover
        variant="light"
        style={{
          width: "90%",
          margin: "10px auto",
          boxShadow: "5px 5px 15px #cdeac0",
        }} >
            <thead>
          <tr>
            <th style={{ width: "20%" }}>Transaction Date</th>
            <th style={{ width: "10%" }}>Sender</th>
            <th style={{ width: "10%" }}>Recipient</th>
            <th style={{ width: "40%" }}>Description</th>
            <th style={{ width: "20%" }}>Amount</th>
          </tr>
        </thead>
            <tbody>
            {txRange.map((tx) => { 
            return (<tr>
                <td>{tx.createdAt}</td>
                <td>{tx.sender}</td>
                <td>{tx.recipient}</td>
                <td>{tx.description}</td>
                <td>{tx.txAmount}</td>

            </tr>);

        })}

            </tbody>
        </Table>


        
    
    </>)
}

export default ShowTxHistory;