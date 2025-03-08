import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import AllPropertiesCards from "../user/AllPropertiesCards";
import Hero from "../../components/Hero";
import CustomNavbar from "../../components/CustomNavbar";
import '../../styles/theme.css';

const Home = () => {
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    propertyType: '',
    priceRange: '',
    propertyAdType: ''
  });
  const [expanded, setExpanded] = useState(false);

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    document.querySelector('.property-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const navLinks = (
    <>
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/login" className="nav-link">Login</Link>
      <Link to="/register" className="nav-link">Register</Link>
    </>
  );

  return (
    <div className="fade-in">
      <CustomNavbar 
        expanded={expanded}
        handleToggle={handleToggle}
        navLinks={navLinks}
      />

      <Hero 
        userType="renter"
        onSearch={handleSearch}
        initialFilters={searchFilters}
      />

      <div className="property-content">
        <Container>
          <div className="text-center mb-5">
            <p className="lead mb-4" style={{ color: 'var(--text-secondary)' }}>
              Want to post your Property?{" "}
              <Link to="/register">
                <button
                  className="modern-button outline"
                  style={{ 
                    marginLeft: '10px',
                    backgroundColor: 'var(--secondary-color)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Register as Owner
                </button>
              </Link>
            </p>

            <h2 className="display-4 mb-4" style={{ color: 'var(--text-primary)' }}>
              Featured Properties
            </h2>
          </div>

          <AllPropertiesCards searchFilters={searchFilters} />
        </Container>
      </div>
    </div>
  );
};

export default Home;
