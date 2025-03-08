import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../App";
import CustomNavbar from "../../../components/CustomNavbar";
import Hero from "../../../components/Hero";
import AddProperty from "./AddProperty";
import AllBookings from "./AllBookings";
import AllProperties from "./AllProperties";
import '../../../styles/navbar.css';
import '../../../styles/theme.css';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className={value === index ? 'slide-up' : ''}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div className="modern-card">
            {children}
          </div>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const OwnerHome = () => {
  const user = useContext(UserContext);
  const [value, setValue] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [searchFilters, setSearchFilters] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    setValue(1); // Switch to All Properties tab
  };

  const handleAddProperty = () => {
    setValue(0); // Switch to Add Property tab
  };

  if (!user) {
    return null;
  }

  const navLinks = (
    <>
      <Link to="/ownerhome" className="nav-link">Home</Link>
      <Link to="#" className="nav-link" onClick={() => setValue(1)}>All Properties</Link>
      <Link to="#" className="nav-link" onClick={() => setValue(2)}>All Bookings</Link>
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
        userType="owner" 
        onSearch={handleSearch} 
        onAddProperty={handleAddProperty}
      />

      <Box sx={{ 
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto 2rem",
        padding: "0 1rem"
      }}>
        <Box sx={{ 
          borderRadius: 'var(--border-radius)',
          overflow: 'hidden',
          backgroundColor: 'white',
          boxShadow: 'var(--card-shadow)',
          marginBottom: '2rem'
        }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="owner tabs"
            variant="fullWidth"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'var(--secondary-color)',
                height: '3px',
              },
              '& .MuiTab-root': {
                color: 'var(--text-secondary)',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: 'var(--secondary-color)',
                  opacity: 0.8,
                },
                '&.Mui-selected': {
                  color: 'var(--secondary-color)',
                },
              },
              padding: '0.5rem',
            }}
          >
            <Tab label="Add Property" {...a11yProps(0)} />
            <Tab label="All Properties" {...a11yProps(1)} />
            <Tab label="All Bookings" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <AddProperty />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <AllProperties searchFilters={searchFilters} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <AllBookings />
        </CustomTabPanel>
      </Box>
    </div>
  );
};

export default OwnerHome;
