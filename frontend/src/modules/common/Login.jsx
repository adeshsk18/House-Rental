import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { message } from "antd";
import axios from "axios";
import React, { useContext, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import CustomNavbar from "../../components/CustomNavbar";

const Login = () => {
  const navigate = useNavigate();
  const { setUserData, setUserLoggedIn } = useContext(UserContext);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data?.email || !data?.password) {
      return message.error("Please fill all fields");
    }

    axios
      .post("http://localhost:8000/api/user/login", data)
      .then((res) => {
        if (res.data.success) {
          message.success(res.data.message);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          
          setUserData(res.data.user);
          setUserLoggedIn(true);

          switch (res.data.user.type) {
            case "Renter":
              navigate("/renterhome");
              break;
            case "Owner":
              navigate("/ownerhome");
              break;
            default:
              navigate("/login");
              break;
          }
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        message.error(err.response?.data?.message || "Login failed");
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
        expanded={false}
        handleToggle={() => {}}
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={data.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={data.password}
              onChange={handleChange}
            />
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
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/forgotpassword" className="nav-link">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/register" className="nav-link">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link 
                to="/admin/login" 
                className="nav-link"
                style={{ 
                  color: 'var(--secondary-color)',
                  fontWeight: 500,
                  textDecoration: 'none'
                }}
              >
                Admin Login
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
