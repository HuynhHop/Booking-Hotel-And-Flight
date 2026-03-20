import React, { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../Context/darkModeContext";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import "../Style/lessontable.scss";

const Ordertable = () => {
  const { darkMode } = useContext(DarkModeContext);

  const apiUrl = process.env.REACT_APP_API_URL;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/orders`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.success) {
          const formattedData = data.data.map((order) => ({
            id: order._id,
            ...order,
          }));
          setData(formattedData);
        } else {
          console.error("Failed to fetch Order", data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/orders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const datas = await response.json();

      if (response.ok && datas.success) {
        setData(data.filter((item) => item.id !== id));
        alert("Order Deleted successfully!");
      } else {
        alert(datas.message || "Failed to delete the course.");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("An error occurred while trying to delete the course.");
    }
  };

  // Cấu hình cột cho DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 120 },
    { field: "serviceType", headerName: "ServiceType", width: 120 },
    { field: "hotelName", headerName: "Hotel", width: 200 },
    { field: "roomName", headerName: "Room", width: 200 },
    { field: "totalPrice", headerName: "Price", width: 150 },
    // { field: "contactInfo", headerName: "Contact Info", width: 150 },
    // { field: "guestInfo", headerName: "Guest Info", width: 150 },
    { field: "status", headerName: "Status", width: 120 },
    // { field: "note", headerName: "Note", width: 200 },
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
              to={`/admin/orders/${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="addButton">Detail</div>
            </Link>
            {/* <Link
              to={`/admin/orders/${params.row.id}/edit`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">Edit</div>
            </Link> */}
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
          pageSize={6}
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

export default Ordertable;
