import './App.css';
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useState, useEffect } from "react";
// import Home from "./pages/Home";
import AddMoney from "./components/epayment/AddMoney";
import Login from "./components/account/Login";
import SignUp from "./components/account/SignUp";
import AccountView from "./components/account/AccountView";
import Logout from "./components/account/Logout";
import NavBar from "./components/navbar/NavBar";
const jwt = require("jsonwebtoken");

function App() {
  const [user, setUser] = useState({});
  console.log("user at App", user);

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token !== null) {
      const decoded = jwt.verify(token, "grab"); //cant read secret?
      setUser({ userId: decoded.user._id, username: decoded.user.username })
    }
  }, [user.userId])

  return (
    <div>
      <Router>
        <NavBar user={user}/>
        <Switch>
          <Route exact path="/">
            {/* <Home /> */}
            <h1>Home</h1>
          </Route>
          <Route exact path="/restricted">
            <h1>You are not authorised to visit this page.</h1>
          </Route>
          <Route exact path="/sendmoney">
            {/* {user.userId === undefined ? <Redirect to={"/login"} /> : <SendMoney />}   */}
            <h1>Send Money</h1>
          </Route>
          <Route path="/user/:id">
            {user.userId === undefined ? <Redirect to={"/login"} /> : <AccountView />}
          </Route>
          <Route exact path="/addmoney">
            {user.userId === undefined ? <Redirect to={"/login"} /> : <AddMoney />}
          {/* <h1>Add Money</h1> */}
          </Route>
          <Route exact path="/signup">
            {user.userId === undefined ? <SignUp setUser={setUser} /> : <Redirect to={`/user/${user.userId}`} />}
          </Route>
          <Route exact path="/login">
            {user.userId === undefined ? <Login setUser={setUser} /> : <Redirect to={"/"} />}
          </Route>
          <Route exact path="/logout">
            {user.userId === undefined ? <Redirect to={"/login"} /> : <Logout user={user} setUser={setUser} />}
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
export default App;
