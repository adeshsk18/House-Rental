import { message } from "antd";
import axios from "../../../config/axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";

function AddProperty() {
  const [image, setImage] = useState(null);
  const [propertyDetails, setPropertyDetails] = useState({
    propertyType: "residential",
    propertyAdType: "rent",
    propertyAddress: "",
    ownerContact: "",
    propertyAmt: 0,
    additionalInfo: "",
  });

  const handleImageChange = (e) => {
    const files = e.target.files;
    setImage(files);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  useEffect(() => {
    setPropertyDetails((prevDetails) => ({
      ...prevDetails,
      propertyImages: image,
    }));
  }, [image]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("propertyType", propertyDetails.propertyType);
    formData.append("propertyAdType", propertyDetails.propertyAdType);
    formData.append("propertyAddress", propertyDetails.propertyAddress);
    formData.append("ownerContact", propertyDetails.ownerContact);
    formData.append("propertyAmt", propertyDetails.propertyAmt);
    formData.append("additionalInfo", propertyDetails.additionalInfo);

    if (image) {
      for (let i = 0; i < image.length; i++) {
        formData.append("propertyImages", image[i]);
      }
    }

    axios
      .post("/api/owner/postproperty", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success) {
          message.success(res.data.message);
          // Clear form after successful submission
          setPropertyDetails({
            propertyType: "residential",
            propertyAdType: "rent",
            propertyAddress: "",
            ownerContact: "",
            propertyAmt: 0,
            additionalInfo: "",
          });
          setImage(null);
        } else {
          message.error(res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error adding property:", error);
        message.error(error.response?.data?.message || "Failed to add property");
      });
  };

  const formStyle = {
    backgroundColor: 'white',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--card-shadow)',
    padding: '2rem',
  };

  const inputStyle = {
    backgroundColor: 'white',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    color: 'var(--text-primary)',
    '&:focus': {
      borderColor: 'var(--secondary-color)',
      boxShadow: '0 0 0 0.2rem rgba(var(--secondary-color-rgb), 0.25)',
    }
  };

  const labelStyle = {
    color: 'var(--text-primary)',
    fontWeight: '500',
    marginBottom: '0.5rem'
  };

  return (
    <Container className="mt-4">
      <Form onSubmit={handleSubmit} style={formStyle}>
        <h4 className="mb-4" style={{ color: 'var(--text-primary)' }}>Add New Property</h4>
        <Row className="mb-4">
          <Form.Group as={Col} md="4">
            <Form.Label style={labelStyle}>Property Type</Form.Label>
            <Form.Select
              name="propertyType"
              value={propertyDetails.propertyType}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="land/plot">Land/Plot</option>
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label style={labelStyle}>Property Ad Type</Form.Label>
            <Form.Select
              name="propertyAdType"
              value={propertyDetails.propertyAdType}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label style={labelStyle}>Property Full Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter complete address"
              name="propertyAddress"
              value={propertyDetails.propertyAddress}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col} md="6">
            <Form.Label style={labelStyle}>Property Images</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              name="images"
              multiple
              onChange={handleImageChange}
              style={inputStyle}
              required
            />
          </Form.Group>
          <Form.Group as={Col} md="3">
            <Form.Label style={labelStyle}>Owner Contact</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter contact number"
              name="ownerContact"
              value={propertyDetails.ownerContact}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </Form.Group>
          <Form.Group as={Col} md="3">
            <Form.Label style={labelStyle}>Property Amount</Form.Label>
            <InputGroup>
              <InputGroup.Text style={inputStyle}>₹</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                name="propertyAmt"
                value={propertyDetails.propertyAmt}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </InputGroup>
          </Form.Group>
        </Row>
        <Form.Group className="mb-4">
          <Form.Label style={labelStyle}>Additional Details</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="additionalInfo"
            value={propertyDetails.additionalInfo}
            onChange={handleChange}
            placeholder="Enter additional details about the property"
            style={inputStyle}
          />
        </Form.Group>
        <div className="d-flex justify-content-end">
          <Button
            type="submit"
            style={{
              backgroundColor: 'var(--secondary-color)',
              border: 'none',
              padding: '0.5rem 2rem',
              fontWeight: '500'
            }}
          >
            Add Property
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default AddProperty;
