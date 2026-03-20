import React, { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../Context/darkModeContext";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import "../Style/lessontable.scss";

const Reviewtable = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${apiUrl}/comments`);
        const data = await response.json();
        if (data.success) {
          const formattedData = data.data.map((comment) => ({
            id: comment._id,
            ...comment,
          }));
          setData(formattedData);
        } else {
          console.error("Failed to fetch comments", data.message);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [apiUrl]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/comments/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setData((prevData) => prevData.filter((comment) => comment.id !== id));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Cấu hình cột cho DataGrid
  const columns = [
    {
      field: "hotelId",
      headerName: "Hotel Name",
      width: 200,
      renderCell: (params) => {
        return <div>{params.row.hotelId?.name || "N/A"}</div>;
      },
    },
    { field: "name", headerName: "Customer", width: 150 },
    { field: "rating", headerName: "Rating", width: 80 },
    {
      field: "content",
      headerName: "Comment",
      width: 200,
      renderCell: (params) => {
        return <div className="cellScroll">{params.row.content}</div>;
      },
    },
    { field: "groupType", headerName: "Group Type", width: 100 },
    { field: "roomType", headerName: "Room Type", width: 100 },
    { field: "nights", headerName: "Nights", width: 100 },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {/* <Link
              to={`/admin/lessons/${params.row.id}/edit`}
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

export default Reviewtable;
