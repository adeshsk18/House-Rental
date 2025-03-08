import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import SellIcon from '@mui/icons-material/Sell';
import '../styles/theme.css';

const Hero = ({ userType, onSearch, onAddProperty, initialFilters }) => {
  const [searchParams, setSearchParams] = useState({
    location: '',
    propertyType: 'all',
    priceRange: 'all',
    propertyAdType: 'all'
  });

  useEffect(() => {
    if (initialFilters) {
      setSearchParams(initialFilters);
    }
  }, [initialFilters]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div 
      className="hero-section"
      style={{
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
        padding: '4rem 0',
        marginBottom: '2rem',
        color: 'white',
      }}
    >
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <h1 className="display-4 mb-3 fade-in" style={{ fontWeight: '600' }}>
              {userType === 'owner' 
                ? 'List Your Property Today'
                : 'Find Your Perfect Home'}
            </h1>
            <p className="lead mb-4 slide-up" style={{ opacity: '0.9' }}>
              {userType === 'owner'
                ? 'Join thousands of property owners who trust us with their properties'
                : 'Discover the perfect property that matches your lifestyle and preferences'}
            </p>
            {userType === 'owner' && (
              <button 
                className="modern-button"
                onClick={onAddProperty}
                style={{
                  backgroundColor: 'white',
                  color: 'var(--primary-color)',
                  padding: '12px 24px',
                  fontSize: '1.1rem',
                  border: 'none',
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                Add New Property
              </button>
            )}
          </Col>
          <Col lg={6}>
            <div 
              className="search-card modern-card slide-up"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '2rem',
                borderRadius: 'var(--border-radius)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Form onSubmit={handleSearch}>
                <InputGroup className="mb-3">
                  <InputGroup.Text className="bg-white">
                    <LocationOnIcon style={{ color: 'var(--secondary-color)' }} />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Enter location..."
                    className="modern-input border-start-0"
                    value={searchParams.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </InputGroup>
                
                <Row className="g-3 mb-3">
                  <Col md={6}>
                    <InputGroup>
                      <InputGroup.Text className="bg-white">
                        <HomeIcon style={{ color: 'var(--secondary-color)' }} />
                      </InputGroup.Text>
                      <Form.Select 
                        className="modern-input border-start-0"
                        value={searchParams.propertyType}
                        onChange={(e) => handleInputChange('propertyType', e.target.value)}
                      >
                        <option value="all">All Property Types</option>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="land/plot">Land/Plot</option>
                      </Form.Select>
                    </InputGroup>
                  </Col>
                  <Col md={6}>
                    <InputGroup>
                      <InputGroup.Text className="bg-white">
                        <SellIcon style={{ color: 'var(--secondary-color)' }} />
                      </InputGroup.Text>
                      <Form.Select 
                        className="modern-input border-start-0"
                        value={searchParams.propertyAdType}
                        onChange={(e) => handleInputChange('propertyAdType', e.target.value)}
                      >
                        <option value="all">All Ad Types</option>
                        <option value="rent">For Rent</option>
                        <option value="sale">For Sale</option>
                      </Form.Select>
                    </InputGroup>
                  </Col>
                </Row>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="bg-white">
                    <CurrencyRupeeIcon style={{ color: 'var(--secondary-color)' }} />
                  </InputGroup.Text>
                  <Form.Select 
                    className="modern-input border-start-0"
                    value={searchParams.priceRange}
                    onChange={(e) => handleInputChange('priceRange', e.target.value)}
                  >
                    <option value="all">All Price Ranges</option>
                    <option value="0-10000">₹0 - ₹10,000</option>
                    <option value="10000-20000">₹10,000 - ₹20,000</option>
                    <option value="20000-30000">₹20,000 - ₹30,000</option>
                    <option value="30000-50000">₹30,000 - ₹50,000</option>
                    <option value="50000+">₹50,000+</option>
                  </Form.Select>
                </InputGroup>

                <button 
                  type="submit" 
                  className="modern-button w-100"
                  style={{
                    padding: '12px',
                    border: 'none',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <SearchIcon />
                  Search Properties
                </button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Hero; 