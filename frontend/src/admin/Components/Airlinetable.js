import React, { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../Context/darkModeContext";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import "../Style/lessontable.scss";

const Airlinetable = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch(`${apiUrl}/flights`);
        const data = await response.json();
        if (data) {
          const formattedData = data.map((filght) => ({
            id: filght._id,
            ...filght,
          }));
          setData(formattedData);
        } else {
          console.error("Failed to fetch flights", data.message);
        }
      } catch (error) {
        console.error("Error fetching flights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [apiUrl]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/flights/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result) {
        setData((prevData) => prevData.filter((filght) => filght.id !== id));
      }
    } catch (error) {
      console.error("Error deleting filght:", error);
    }
  };

  // Cấu hình cột cho DataGrid
  const columns = [
    { field: "airline", headerName: "Airline", width: 120 },
    {
      field: "flightNumber",
      headerName: "Flight No.",
      width: 70,
    },
    {
      field: "departureTime",
      headerName: "Departure Time",
      width: 150,
      renderCell: (params) => {
        const date = new Date(params.row.departureTime).toLocaleString(
          "en-US",
          { timeZone: "Asia/Ho_Chi_Minh", hour12: false }
        );
        return <div>{date}</div>;
      },
    },
    {
      field: "arrivalTime",
      headerName: "Arrival Time",
      width: 150,
      renderCell: (params) => {
        const date = new Date(params.row.arrivalTime).toLocaleString("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
          hour12: false,
        });
        return <div>{date}</div>;
      },
    },
    { field: "departure", headerName: "Departure", width: 100 },
    { field: "destination", headerName: "Destination", width: 100 },
    { field: "originalPrice", headerName: "Price", width: 100 },
    { field: "seatsAvailable", headerName: "Seats", width: 70 },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={`/admin/airlines/${params.row.id}/edit`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">Edit</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="productable">
      <Paper className="productContainer">
        <DataGrid
          className="datagrid"
          rows={data}
          columns={columns.concat(actionColumn)}
          pageSize={8}
          rowsPerPageOptions={[5]}
          checkboxSelection
          sx={{
            "& .MuiTablePagination-root": {
              color: darkMode ? "white" : "black",
            },
          }}
        />
      </Paper>
    </div>
  );
};

export default Airlinetable;
