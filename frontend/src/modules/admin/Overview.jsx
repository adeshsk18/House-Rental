import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Paper, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import axios from 'axios';
import { message } from 'antd';

const Overview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    pendingVerifications: 0,
    recentActivities: []
  });

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        message.error('Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      message.error('Error loading dashboard statistics');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const StatCard = ({ icon, title, value, color }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 'var(--border-radius)',
        backgroundColor: 'white',
        boxShadow: 'var(--card-shadow)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)'
        }
      }}
    >
      <div className="d-flex align-items-center mb-3">
        <div
          style={{
            backgroundColor: `${color}15`,
            borderRadius: '12px',
            padding: '12px',
            marginRight: '16px'
          }}
        >
          {icon}
        </div>
        <div>
          <Typography
            variant="subtitle2"
            sx={{ color: 'var(--text-secondary)', mb: 0.5 }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            sx={{ color: 'var(--text-primary)', fontWeight: 600 }}
          >
            {value}
          </Typography>
        </div>
      </div>
    </Paper>
  );

  return (
    <div className="fade-in">
      <Row className="g-4">
        <Col xs={12} md={6} lg={3}>
          <StatCard
            icon={<PeopleIcon sx={{ color: '#3498DB', fontSize: 24 }} />}
            title="Total Users"
            value={stats.totalUsers}
            color="#3498DB"
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <StatCard
            icon={<HomeWorkIcon sx={{ color: '#2ECC71', fontSize: 24 }} />}
            title="Total Properties"
            value={stats.totalProperties}
            color="#2ECC71"
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <StatCard
            icon={<BookOnlineIcon sx={{ color: '#E67E22', fontSize: 24 }} />}
            title="Total Bookings"
            value={stats.totalBookings}
            color="#E67E22"
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <StatCard
            icon={<VerifiedUserIcon sx={{ color: '#9B59B6', fontSize: 24 }} />}
            title="Pending Verifications"
            value={stats.pendingVerifications}
            color="#9B59B6"
          />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 'var(--border-radius)',
              backgroundColor: 'white',
              boxShadow: 'var(--card-shadow)'
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: 'var(--text-primary)', mb: 2, fontWeight: 600 }}
            >
              Recent Activities
            </Typography>
            <div className="recent-activities">
              {stats.recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="activity-item d-flex align-items-center py-2"
                >
                  <div
                    className="activity-indicator"
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--secondary-color)',
                      marginRight: '16px'
                    }}
                  />
                  <div>
                    <Typography variant="body2" sx={{ color: 'var(--text-primary)' }}>
                      {activity.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'var(--text-secondary)' }}
                    >
                      {new Date(activity.timestamp).toLocaleString()}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </Paper>
        </Col>
      </Row>
    </div>
  );
};

export default Overview; 