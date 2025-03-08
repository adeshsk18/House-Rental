import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Box, Tab, Tabs } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CustomNavbar from '../../components/CustomNavbar';
import AllUsers from './AllUsers';
import AllProperties from './AllProperties';
import AllBookings from './AllBookings';
import VerificationRequests from './VerificationRequests';
import Overview from './Overview';
import '../../styles/theme.css';

const AdminDashboard = () => {
  const [value, setValue] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    pendingVerifications: 0
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  // Get admin data from localStorage
  const adminData = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="fade-in">
      <CustomNavbar
        expanded={expanded}
        handleToggle={handleToggle}
        navLinks={<></>}
        userData={adminData} // Pass admin data to show logout button
      />

      <Container fluid className="mt-4">
        <Row>
          <Col>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                backgroundColor: 'white',
                borderRadius: 'var(--border-radius)',
                boxShadow: 'var(--card-shadow)',
                mb: 3
              }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    '& .MuiTab-root': {
                      minHeight: 64,
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      '&.Mui-selected': {
                        color: 'var(--secondary-color)',
                      },
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: 'var(--secondary-color)',
                    },
                  }}
                >
                  <Tab 
                    icon={<DashboardIcon />} 
                    label="Overview" 
                    iconPosition="start"
                  />
                  <Tab 
                    icon={<PeopleIcon />} 
                    label="Users" 
                    iconPosition="start"
                  />
                  <Tab 
                    icon={<HomeWorkIcon />} 
                    label="Properties" 
                    iconPosition="start"
                  />
                  <Tab 
                    icon={<BookOnlineIcon />} 
                    label="Bookings" 
                    iconPosition="start"
                  />
                  <Tab 
                    icon={<VerifiedUserIcon />} 
                    label="Verifications" 
                    iconPosition="start"
                  />
                </Tabs>
              </Box>

              <div className="admin-content">
                {value === 0 && <Overview stats={stats} />}
                {value === 1 && <AllUsers />}
                {value === 2 && <AllProperties />}
                {value === 3 && <AllBookings />}
                {value === 4 && <VerificationRequests />}
              </div>
            </Box>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard; 