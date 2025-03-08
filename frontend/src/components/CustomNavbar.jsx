import React, { useContext } from 'react';
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { UserContext } from "../App";
import '../styles/navbar.css';

const CustomNavbar = ({ expanded, handleToggle, navLinks, userData: propUserData }) => {
  const { userData, setUserData, setUserLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  // Use prop userData if provided, otherwise use context userData
  const currentUser = propUserData || userData;

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserData(null);
    setUserLoggedIn(false);
    navigate("/");
  };

  const handleLogoClick = () => {
    if (currentUser?.isAdmin) {
      navigate("/admin/dashboard");
    } else if (currentUser?.type === "Owner") {
      navigate("/ownerhome");
    } else if (currentUser?.type === "Renter") {
      navigate("/renterhome");
    } else {
      navigate("/");
    }
  };

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container fluid>
        <Navbar.Brand onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <h2>Space Easy</h2>
        </Navbar.Brand>
        <Navbar.Toggle 
          aria-controls="navbarScroll" 
          onClick={handleToggle}
          style={{ border: 'none' }}
        >
          {expanded ? <CloseIcon /> : <MenuIcon />}
        </Navbar.Toggle>
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            {navLinks}
          </Nav>
          {(currentUser?.type || currentUser?.isAdmin) && (
            <Nav>
              <span className="nav-link">Hi {currentUser.name}</span>
              <Link onClick={handleLogOut} to="/" className="nav-link">
                Log Out
              </Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar; 