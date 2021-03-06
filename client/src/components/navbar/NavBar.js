import {react} from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AccountCircle, ExitToApp } from "@material-ui/icons";
import "../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const NavBar = ({ user }) => {

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
          src="https://www.grab.com/sg/wp-content/uploads/sites/4/2018/02/cropped-GRAB-Vector-Logo-720x340-1-e1519119683340.png"
          width="60"
          height="60"
          className="d-inline-block align-top"
          alt=""
        />{" "}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Nav className="mr-auto" id="navBar-left">
      <Nav.Link as={Link} to="/sendmoney">
            Send Money
          </Nav.Link>
        {loggedIn ? (<>
          <Nav.Link as={Link} to="/addmoney">
            Add Money
          </Nav.Link>
          <Nav.Link as={Link} to="/txHistory">
          Transaction History
        </Nav.Link>
        </>
        ) : (
          <></>
        )}
        
      </Nav>
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
            <NavDropdown.Item as={Link} to={`/user`}>
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
          <Nav.Link as={Link} to="/signup">
            Sign Up!
          </Nav.Link>
          <Nav.Link as={Link} to="/login">
            Login
          </Nav.Link>
        </Nav>
      )}
    </Navbar>
  );
};

export default NavBar;
