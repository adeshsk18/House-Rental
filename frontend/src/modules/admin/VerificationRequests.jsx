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
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
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
        'http://localhost:8000/api/admin/users?verification=pending',
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      
      if (response.data.success) {
        setRequests(response.data.data.filter(user => 
          user.type === 'owner' && !user.isVerified
        ));
      } else {
        message.error('Failed to fetch verification requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
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

  const handleVerify = async (userId, action) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/admin/users/${userId}/verify`,
        { status: action === 'approve' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (response.data.success) {
        message.success(`Owner ${action === 'approve' ? 'verified' : 'rejected'} successfully`);
        fetchRequests();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating verification status:', error);
      message.error('Failed to update verification status');
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setOpenDialog(true);
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
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
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
                        label="Pending Verification"
                        size="small"
                        color="warning"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleViewDetails(request)}
                        color="primary"
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleVerify(request._id, 'approve')}
                        color="success"
                        size="small"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleVerify(request._id, 'reject')}
                        color="error"
                        size="small"
                      >
                        <CancelIcon />
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
        <DialogTitle>Verification Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <div className="verification-details">
              <p><strong>Name:</strong> {selectedRequest.name}</p>
              <p><strong>Email:</strong> {selectedRequest.email}</p>
              <p><strong>Phone:</strong> {selectedRequest.phone}</p>
              <p><strong>Registration Date:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}</p>
              {selectedRequest.documents && (
                <div>
                  <p><strong>Verification Documents:</strong></p>
                  {selectedRequest.documents.map((doc, index) => (
                    <div key={index} className="document-preview">
                      <img
                        src={`http://localhost:8000${doc.path}`}
                        alt={`Document ${index + 1}`}
                        style={{ maxWidth: '100%', marginBottom: '1rem' }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          {selectedRequest && (
            <>
              <Button
                onClick={() => {
                  handleVerify(selectedRequest._id, 'approve');
                  setOpenDialog(false);
                }}
                color="success"
                variant="contained"
              >
                Approve
              </Button>
              <Button
                onClick={() => {
                  handleVerify(selectedRequest._id, 'reject');
                  setOpenDialog(false);
                }}
                color="error"
                variant="contained"
              >
                Reject
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VerificationRequests; 