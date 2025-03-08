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

const AllProperty = () => {
  const [allProperties, setAllProperties] = useState([]);

  const getAllProperty = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/getallproperties",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        setAllProperties(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProperty();
  }, []);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table
          className="table-custom"
          sx={{ minWidth: 650 }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Property ID</TableCell>
              <TableCell align="center">Owner ID</TableCell>
              <TableCell align="center">Property Type</TableCell>
              <TableCell align="center">Property Ad Type</TableCell>
              <TableCell align="center">Property Address</TableCell>
              <TableCell align="center">Owner Contact</TableCell>
              <TableCell align="center">Property Amt</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allProperties.map((property) => (
              <TableRow
                key={property._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {property._id}
                </TableCell>
                <TableCell align="center">{property.ownerId}</TableCell>
                <TableCell align="center">{property.propertyType}</TableCell>
                <TableCell align="center">{property.propertyType}</TableCell>
                <TableCell align="center">{property.propertyAddress}</TableCell>
                <TableCell align="center">{property.ownerContact}</TableCell>
                <TableCell align="center">{property.propertyAmt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AllProperty;
