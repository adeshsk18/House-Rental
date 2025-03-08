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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip
} from '@mui/material';
import { message } from 'antd';
import axios from 'axios';

const VerificationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8000/api/admin/verification-requests',
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      
      if (response.data.success) {
        setRequests(response.data.data);
      } else {
        message.error('Failed to fetch verification requests');
      }
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      message.error('Error loading verification requests');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setOpenDialog(true);
  };

  const handleVerification = async (userId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/admin/verify/${userId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      
      if (response.data.success) {
        message.success(`Verification ${status ? 'approved' : 'rejected'} successfully`);
        setOpenDialog(false);
        fetchRequests(); // Refresh the list
      } else {
        message.error('Failed to update verification status');
      }
    } catch (error) {
      console.error('Error updating verification:', error);
      message.error('Error updating verification status');
    }
  };

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
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Pending Verification Requests
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Registration Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>{request.phone}</TableCell>
                    <TableCell>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={request.isVerified ? 'Verified' : 'Pending'}
                        color={request.isVerified ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewDetails(request)}
                        sx={{ mr: 1 }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={requests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Verification Request Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <div className="verification-details">
              <Typography variant="subtitle1" gutterBottom>
                <strong>Name:</strong> {selectedRequest.name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Email:</strong> {selectedRequest.email}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Phone:</strong> {selectedRequest.phone}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Registration Date:</strong>{' '}
                {new Date(selectedRequest.createdAt).toLocaleString()}
              </Typography>
              {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Verification Documents:</strong>
                  </Typography>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    {selectedRequest.documents.map((doc, index) => (
                      <img
                        key={index}
                        src={`http://localhost:8000${doc.path}`}
                        alt={`Document ${index + 1}`}
                        style={{
                          maxWidth: '100%',
                          height: 'auto',
                          borderRadius: '8px'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => handleVerification(selectedRequest._id, false)}
            color="error"
          >
            Reject
          </Button>
          <Button
            onClick={() => handleVerification(selectedRequest._id, true)}
            color="success"
            variant="contained"
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VerificationRequests; 