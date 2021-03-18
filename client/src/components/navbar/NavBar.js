import React, { useState, useEffect } from "react";
import { Navbar, Nav, Button, Col, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AccountCircle, ExitToApp } from "@material-ui/icons";
import "../../App.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { StatusProvider, useUser, useDispatch } from "./context/Context";

const NavBar = ({ user }) => {
  // {userId, userName}

  const loggedIn = user.userId === undefined ? false : true;

  return (
    <Navbar
      bg="dark"
      variant="dark"
      fixed="top"
      style={{ position: "sticky", fontWeight: "bold" }}
    >
      <Navbar.Brand as={Link} to="/">
        <img
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt=""
        />{" "}
        GrabPay
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      {/* <Navbar.Collapse id="basic-navbar-nav"> */}
      <Nav className="mr-auto" id="navBar-left">
        {loggedIn ? (
          <Nav.Link as={Link} to="/addmoney">
            Add Money
          </Nav.Link>
        ) : (
          // <Nav.Link onTouchCancel="/teaser">Teaser</Nav.Link>
          <Nav.Link as={Link} to="/sendmoney">
            Send Money
          </Nav.Link>
        )}
      </Nav>

      {/* {loggedIn ? (<Navbar.Text><span id="welcome-name">Welcome {user.username}</span></Navbar.Text>) : ""} */}

      {loggedIn ? (
        <Nav className="ml-auto" id="navBar-right-account">
          <Navbar.Text>
            <span id="welcome-name">Welcome {user.username}</span>
          </Navbar.Text>

          <NavDropdown
            alignRight
            title={<AccountCircle />}
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item as={Link} to={`/user/${user.userId}`}>
              View Profile
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item as={Link} to="/logout">
              Logout{" "}
              <span class="align-middle">
                <ExitToApp />
              </span>
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      ) : (
        <Nav className="ml-auto" id="navBar-right-account">
          <Nav.Link as={Link} to="/user/new">
            Sign Up!
          </Nav.Link>
          <Nav.Link as={Link} to="/login">
            Login
          </Nav.Link>
        </Nav>
      )}

      {/* </Navbar.Collapse> */}
    </Navbar>
  );
};

export default NavBar;
