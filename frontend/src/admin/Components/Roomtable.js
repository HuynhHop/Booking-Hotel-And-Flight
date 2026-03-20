import React, { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../Context/darkModeContext";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import "../Style/lessontable.scss";

const Roomtable = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${apiUrl}/rooms`);
        const data = await response.json();
        if (data.success) {
          const formattedData = data.data.map((room) => ({
            id: room._id,
            ...room,
          }));
          setData(formattedData);
        } else {
          console.error("Failed to fetch rooms", data.message);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [apiUrl]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/rooms/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setData((prevData) => prevData.filter((room) => room.id !== id));
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  // Cấu hình cột cho DataGrid
  const columns = [
    {
      field: "hotel",
      headerName: "Hotel Name",
      width: 200,
      renderCell: (params) => {
        return <div>{params.row.hotel?.name || "N/A"}</div>;
      },
    },
    { field: "name", headerName: "Room Name", width: 200 },
    { field: "people", headerName: "People", width: 80 },
    { field: "beds", headerName: "Bed", width: 150 },
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
    { field: "price", headerName: "Price", width: 80 },
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
              to={`/admin/rooms/${params.row.id}/edit`}
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

export default Roomtable;
