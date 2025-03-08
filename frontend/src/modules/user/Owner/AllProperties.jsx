import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  FloatingLabel,
  Form,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";
import '../../../styles/theme.css';

const AllProperties = () => {
  const [image, setImage] = useState(null);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [editingPropertyData, setEditingPropertyData] = useState({
    propertyType: "",
    propertyAdType: "",
    propertyAddress: "",
    ownerContact: "",
    propertyAmt: 0,
    additionalInfo: "",
  });
  const [allProperties, setAllProperties] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = (propertyId) => {
    const propertyToEdit = allProperties.find(
      (property) => property._id === propertyId
    );
    if (propertyToEdit) {
      setEditingPropertyId(propertyId);
      setEditingPropertyData(propertyToEdit);
      setShow(true);
    }
  };

  const getAllProperty = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/owner/getallproperties",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.success) {
        setAllProperties(response.data.data);
      } else {
        message.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProperty();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingPropertyData({ ...editingPropertyData, [name]: value });
  };

  useEffect(() => {
    setEditingPropertyData((prevDetails) => ({
      ...prevDetails,
      propertyImage: image,
    }));
  }, [image]);

  const handleDelete = async (propertyId) => {
    let assure = window.confirm("are you sure to delete");
    if (assure) {
      try {
        const response = await axios.delete(
          `http://localhost:8001/api/owner/deleteproperty/${propertyId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          message.success(response.data.message);
          getAllProperty();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("propertyType", editingPropertyData.propertyType);
      formData.append("propertyAdType", editingPropertyData.propertyAdType);
      formData.append("propertyAddress", editingPropertyData.propertyAddress);
      formData.append("ownerContact", editingPropertyData.ownerContact);
      formData.append("propertyAmt", editingPropertyData.propertyAmt);
      formData.append("additionalInfo", editingPropertyData.additionalInfo);
      if (image) {
        formData.append("propertyImage", image);
      }

      const response = await axios.patch(
        `http://localhost:8001/api/owner/updateproperty/${editingPropertyId}`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      if (response.data.success) {
        message.success(response.data.message);
        handleClose();
        getAllProperty(); // Refresh the property list
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating property:", error);
      message.error(error.response?.data?.message || "Failed to update property");
    }
  };

  return (
    <div className="modern-card">
      <TableContainer component={Paper} sx={{ 
        boxShadow: 'none',
        borderRadius: 'var(--border-radius)',
        overflow: 'hidden'
      }}>
        <Table
          className="modern-table"
          sx={{ 
            minWidth: 650,
            '& .MuiTableCell-head': {
              backgroundColor: 'var(--background-color)',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.95rem',
              padding: '16px',
              borderBottom: '2px solid var(--border-color)'
            },
            '& .MuiTableCell-body': {
              color: 'var(--text-secondary)',
              padding: '16px',
              fontSize: '0.9rem'
            },
            '& .MuiTableRow-root:hover': {
              backgroundColor: 'var(--background-color)',
              transition: 'background-color 0.3s ease'
            }
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Property ID</TableCell>
              <TableCell align="center">Property Type</TableCell>
              <TableCell align="center">Property Ad Type</TableCell>
              <TableCell align="center">Property Address</TableCell>
              <TableCell align="center">Owner Contact</TableCell>
              <TableCell align="center">Property Amount</TableCell>
              <TableCell align="center">Availability</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allProperties.map((property) => (
              <TableRow
                key={property._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{property._id}</TableCell>
                <TableCell align="center">{property.propertyType}</TableCell>
                <TableCell align="center">{property.propertyAdType}</TableCell>
                <TableCell align="center">{property.propertyAddress}</TableCell>
                <TableCell align="center">{property.ownerContact}</TableCell>
                <TableCell align="center">₹{property.propertyAmt}</TableCell>
                <TableCell align="center">
                  <span className={`modern-badge ${property.isAvailable === 'Available' ? 'success' : 'warning'}`}>
                    {property.isAvailable}
                  </span>
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outline-primary"
                    className="modern-button outline me-2"
                    onClick={() => handleShow(property._id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="modern-button outline-danger"
                    onClick={() => handleDelete(property._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        show={show && editingPropertyId}
        onHide={handleClose}
        className="modern-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <FloatingLabel label="Property Type">
                  <Form.Select
                    name="propertyType"
                    value={editingPropertyData.propertyType}
                    onChange={handleChange}
                    className="modern-input"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="land/plot">Land/Plot</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>
              <Col md={6}>
                <FloatingLabel label="Ad Type">
                  <Form.Select
                    name="propertyAdType"
                    value={editingPropertyData.propertyAdType}
                    onChange={handleChange}
                    className="modern-input"
                  >
                    <option value="sale">Sale</option>
                    <option value="rent">Rent</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>
              <Col md={12}>
                <FloatingLabel label="Property Address">
                  <Form.Control
                    type="text"
                    name="propertyAddress"
                    value={editingPropertyData.propertyAddress}
                    onChange={handleChange}
                    className="modern-input"
                  />
                </FloatingLabel>
              </Col>
              <Col md={6}>
                <FloatingLabel label="Contact Number">
                  <Form.Control
                    type="text"
                    name="ownerContact"
                    value={editingPropertyData.ownerContact}
                    onChange={handleChange}
                    className="modern-input"
                  />
                </FloatingLabel>
              </Col>
              <Col md={6}>
                <FloatingLabel label="Property Amount">
                  <Form.Control
                    type="number"
                    name="propertyAmt"
                    value={editingPropertyData.propertyAmt}
                    onChange={handleChange}
                    className="modern-input"
                  />
                </FloatingLabel>
              </Col>
              <Col md={12}>
                <FloatingLabel label="Additional Information">
                  <Form.Control
                    as="textarea"
                    name="additionalInfo"
                    value={editingPropertyData.additionalInfo}
                    onChange={handleChange}
                    className="modern-input"
                    style={{ height: '100px' }}
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="modern-button outline me-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="modern-button"
              >
                Update Property
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AllProperties;
