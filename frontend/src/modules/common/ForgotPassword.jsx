import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockResetIcon from "@mui/icons-material/LockReset";
import Typography from "@mui/material/Typography";
import CustomNavbar from "../../components/CustomNavbar";
import '../../styles/theme.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState({
    email: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.email || !data.newPassword) {
      return message.error("Please fill all fields");
    }

    axios
      .post("http://localhost:8000/api/user/forgotpassword", data)
      .then((res) => {
        if (res.data.success) {
          message.success(res.data.message);
          navigate("/login");
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        console.error("Password reset error:", err);
        message.error(err.response?.data?.message || "Password reset failed");
      });
  };

  const navLinks = (
    <>
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/login" className="nav-link">Login</Link>
      <Link to="/register" className="nav-link">Register</Link>
    </>
  );

  return (
    <div className="fade-in">
      <CustomNavbar 
        expanded={expanded}
        handleToggle={handleToggle}
        navLinks={navLinks}
      />

      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "var(--secondary-color)" }}>
            <LockResetIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={data.email}
                  onChange={handleChange}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="newPassword"
                  label="New Password"
                  type="password"
                  id="newPassword"
                  autoComplete="new-password"
                  value={data.newPassword}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                bgcolor: "var(--secondary-color)",
                "&:hover": {
                  bgcolor: "var(--primary-color)",
                }
              }}
            >
              Reset Password
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/login" className="nav-link">
                  Remember your password? Sign in
                </Link>
              </Grid>
              <Grid item>
                <Link to="/register" className="nav-link">
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default ForgotPassword;
