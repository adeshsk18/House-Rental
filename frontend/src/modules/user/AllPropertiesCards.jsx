import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Carousel,
  Col,
  Container,
  Form,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";
import { message } from "antd";
import { Link } from "react-router-dom";

const AllPropertiesCards = ({ loggedIn, searchFilters }) => {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [allProperties, setAllProperties] = useState([]);
  const [propertyOpen, setPropertyOpen] = useState(null);
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    phone: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleClose = () => setShow(false);

  const handleShow = (propertyId) => {
    setPropertyOpen(propertyId);
    setShow(true);
  };

  const getAllProperties = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/user/getAllProperties"
      );
      setAllProperties(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBooking = async (status, propertyId, ownerId) => {
    try {
      await axios
        .post(
          `http://localhost:8000/api/user/bookinghandle/${propertyId}`,
          { userDetails, status, ownerId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          if (res.data.success) {
            message.success(res.data.message);
            handleClose();
          } else {
            message.error(res.data.message);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProperties();
  }, []);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const filterProperties = (properties) => {
    return properties.filter(property => {
      const matchesLocation = !searchFilters?.location || 
        property.propertyAddress.toLowerCase().includes(searchFilters.location.toLowerCase());
      
      const matchesType = !searchFilters?.propertyType || 
        searchFilters.propertyType === 'all' || 
        property.propertyType.toLowerCase() === searchFilters.propertyType.toLowerCase();
      
      const matchesAdType = !searchFilters?.propertyAdType || 
        searchFilters.propertyAdType === 'all' || 
        property.propertyAdType.toLowerCase() === searchFilters.propertyAdType.toLowerCase();
      
      const matchesPriceRange = !searchFilters?.priceRange || 
        searchFilters.priceRange === 'all' || 
        isPriceInRange(property.propertyAmt, searchFilters.priceRange);
      
      return matchesLocation && matchesType && matchesAdType && matchesPriceRange;
    });
  };

  const isPriceInRange = (price, range) => {
    if (range === 'all') return true;
    
    const [min, max] = range.split('-').map(Number);
    if (range.endsWith('+')) {
      return price >= min;
    }
    return price >= min && price <= max;
  };

  const filteredProperties = filterProperties(allProperties);

  return (
    <>
      <Container fluid style={{ padding: '0 60px', margin: '60px auto', maxWidth: '1800px' }}>
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredProperties && filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <Col 
                key={property._id}
                className="d-flex"
                style={{ marginBottom: '30px' }} // Increased bottom margin for more space
              >
                <Card 
                  style={{ 
                    width: '100%',
                    border: '1px solid #eaeaea',
                    borderRadius: '8px', 
                    backgroundColor: '#fff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    overflow: 'visible', // Changed from 'hidden' to prevent button cutoff
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease',
                    position: 'relative', // Added for proper sizing
                    minHeight: '400px' // Minimum height to ensure consistency
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Card.Img
                    variant="top"
                    src={`http://localhost:8000${property.propertyImage[0].path}`}
                    alt="Property"
                    style={{ 
                      height: '200px', 
                      objectFit: 'cover',
                      width: '100%'
                    }}
                  />
                  <Card.Body style={{ 
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    flex: '1 0 auto',
                    paddingBottom: '70px' // Add padding at bottom to make room for button
                  }}>
                    <div>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>Location:</p>
                      <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>{property.propertyAddress}</p>
                    </div>
                    <div>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>Property Type:</p>
                      <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>{property.propertyType}</p>
                    </div>
                    <div>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>Ad Type:</p>
                      <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>{property.propertyAdType}</p>
                    </div>
                    <div style={{ marginTop: '5px' }}>
                      <p style={{ margin: '0', fontSize: '14px', color: '#3498db' }}>
                        For more details, click on get info
                      </p>
                    </div>
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '20px', 
                      left: '20px',
                      width: 'calc(100% - 40px)'
                    }}>
                      {!loggedIn ? (
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                          <Button 
                            style={{
                              backgroundColor: '#3498db',
                              border: 'none',
                              padding: '8px 20px',
                              borderRadius: '4px',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                          >
                            Get Info
                          </Button>
                        </Link>
                      ) : (
                        property.isAvailable === "Available" && (
                          <Button
                            onClick={() => handleShow(property._id)}
                            style={{
                              backgroundColor: '#3498db',
                              border: 'none',
                              padding: '8px 20px',
                              borderRadius: '4px',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                          >
                            Get Info
                          </Button>
                        )
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <div className="text-center mt-5">
                <h3>No properties found matching your criteria</h3>
              </div>
            </Col>
          )}
        </Row>
      </Container>

      <Modal
        show={show && propertyOpen !== null}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Property Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {propertyOpen && allProperties.length > 0 && (
            <Carousel
              activeIndex={index}
              onSelect={handleSelect}
            >
              {allProperties.find(p => p._id === propertyOpen).propertyImage.map((image, idx) => (
                <Carousel.Item key={idx}>
                  <img
                    src={`http://localhost:8000${image.path}`}
                    alt={`Image ${idx + 1}`}
                    className="d-block w-100"
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          )}
          <div>
            <div className="d-flex my-3">
              <div>
                <p className="my-1">
                  <b>Owner Contact:</b>{" "}
                  {propertyOpen && allProperties.find(p => p._id === propertyOpen).ownerContact}
                </p>
                <p className="my-1">
                  <b>Availabilty:</b> {propertyOpen && allProperties.find(p => p._id === propertyOpen).isAvailable}
                </p>
                <p className="my-1">
                  <b>Property Amount: </b>Rs.
                  {propertyOpen && allProperties.find(p => p._id === propertyOpen).propertyAmt}
                </p>
              </div>
              <div className="mx-4">
                <p className="my-1">
                  <b>Location:</b> {propertyOpen && allProperties.find(p => p._id === propertyOpen).propertyAddress}
                </p>
                <p className="my-1">
                  <b>Property Type:</b>{" "}
                  {propertyOpen && allProperties.find(p => p._id === propertyOpen).propertyType}
                </p>
                <p className="my-1">
                  <b>Ad Type: </b>
                  {propertyOpen && allProperties.find(p => p._id === propertyOpen).propertyAdType}
                </p>
              </div>
            </div>
            <p className="my-1">
              <b>Additional Info: </b>
              {propertyOpen && allProperties.find(p => p._id === propertyOpen).additionalInfo}
            </p>
          </div>
          <hr />
          <div>
            <span className="w-100">
              <h4>
                <b>Your Details to confirm booking</b>
              </h4>
            </span>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleBooking(
                  "pending",
                  propertyOpen,
                  allProperties.find(p => p._id === propertyOpen).ownerId
                );
              }}
            >
              <Row className="mb-3">
                <Form.Group as={Col} md="6">
                  <Form.Label>Full Name</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="text"
                      placeholder="Full Name"
                      aria-describedby="inputGroupPrepend"
                      required
                      name="fullName"
                      value={userDetails.fullName}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>Phone Number</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="number"
                      placeholder="Phone Number"
                      aria-describedby="inputGroupPrepend"
                      required
                      name="phone"
                      value={userDetails.phone}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Form.Group>
              </Row>
              <Button type="submit" variant="secondary">
                Book Property
              </Button>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AllPropertiesCards;