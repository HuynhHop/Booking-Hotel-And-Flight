import React, { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../Context/darkModeContext";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import "../Style/lessontable.scss";

const Hoteltable = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(`${apiUrl}/hotels`);
        const data = await response.json();
        if (data.success) {
          const formattedData = data.data.map((hotel) => ({
            id: hotel._id,
            ...hotel,
          }));
          setData(formattedData);
        } else {
          console.error("Failed to fetch hotels", data.message);
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [apiUrl]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/hotels/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setData((prevData) => prevData.filter((hotel) => hotel.id !== id));
      }
    } catch (error) {
      console.error("Error deleting hotel:", error);
    }
  };

  // Cấu hình cột cho DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Hotel Name", width: 200 },
    {
      field: "address",
      headerName: "Address",
      width: 250,
      renderCell: (params) => {
        return <div className="cellScroll">{params.row.address}</div>;
      },
    },
    {
      field: "amenities",
      headerName: "Amenities",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellScroll">
            {params.row.amenities?.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
        );
      },
    },
    { field: "pricePerNight", headerName: "Price", width: 150 },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={`/admin/hotels/${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">View</div>
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
        {loading ? (
          <p>Loading...</p>
        ) : (
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
        )}
      </Paper>
    </div>
  );
};

export default Hoteltable;
