import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { message } from 'antd';
import axios from 'axios';

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProperties = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8000/api/admin/properties',
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      
      if (response.data.success) {
        setProperties(response.data.data);
      } else {
        message.error('Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      message.error('Error loading properties');
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setOpenDialog(true);
  };

  const handleDeleteProperty = async (propertyId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/admin/properties/${propertyId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      if (response.data.success) {
        message.success('Property deleted successfully');
        fetchProperties();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      message.error('Failed to delete property');
    }
  };

  const filteredProperties = properties.filter(property =>
    property.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.propertyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.ownerId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in">
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 'var(--border-radius)',
          backgroundColor: 'white',
          boxShadow: 'var(--card-shadow)'
        }}
      >
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by address, type, or owner name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
          />
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Address</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProperties
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((property) => (
                  <TableRow key={property._id}>
                    <TableCell>{property.propertyAddress}</TableCell>
                    <TableCell>{property.propertyType}</TableCell>
                    <TableCell>{property.ownerId?.name || 'N/A'}</TableCell>
                    <TableCell>${property.propertyAmt}</TableCell>
                    <TableCell>
                      <Chip
                        label={property.isAvailable ? 'Available' : 'Not Available'}
                        size="small"
                        color={property.isAvailable ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleViewDetails(property)}
                        color="primary"
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteProperty(property._id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredProperties.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Property Details</DialogTitle>
        <DialogContent>
          {selectedProperty && (
            <div className="property-details">
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr', my: 2 }}>
                <div>
                  <p><strong>Address:</strong> {selectedProperty.propertyAddress}</p>
                  <p><strong>Type:</strong> {selectedProperty.propertyType}</p>
                  <p><strong>Price:</strong> ${selectedProperty.propertyAmt}</p>
                  <p><strong>Status:</strong> {selectedProperty.isAvailable ? 'Available' : 'Not Available'}</p>
                  <p><strong>Owner:</strong> {selectedProperty.ownerId?.name}</p>
                  <p><strong>Owner Email:</strong> {selectedProperty.ownerId?.email}</p>
                </div>
                <div>
                  <p><strong>Bedrooms:</strong> {selectedProperty.bedrooms}</p>
                  <p><strong>Bathrooms:</strong> {selectedProperty.bathrooms}</p>
                  <p><strong>Area:</strong> {selectedProperty.area} sq ft</p>
                  <p><strong>Furnishing:</strong> {selectedProperty.furnishing}</p>
                  <p><strong>Listed Date:</strong> {new Date(selectedProperty.createdAt).toLocaleDateString()}</p>
                </div>
              </Box>
              {selectedProperty.images && (
                <div>
                  <p><strong>Property Images:</strong></p>
                  <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', mt: 2 }}>
                    {selectedProperty.images.map((image, index) => (
                      <img
                        key={index}
                        src={`http://localhost:8000${image}`}
                        alt={`Property ${index + 1}`}
                        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    ))}
                  </Box>
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          {selectedProperty && (
            <Button
              onClick={() => {
                handleDeleteProperty(selectedProperty._id);
                setOpenDialog(false);
              }}
              color="error"
              variant="contained"
            >
              Delete Property
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllProperties; 