import React, { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../Context/darkModeContext";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import "../Style/lessontable.scss";

const Vouchertable = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch(`${apiUrl}/vouchers`);
        const data = await response.json();
        if (data) {
          const formattedData = data.map((voucher) => ({
            id: voucher._id,
            ...voucher,
          }));
          setData(formattedData);
        } else {
          console.error("Failed to fetch vouchers", data.message);
        }
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [apiUrl]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/vouchers/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result) {
        setData((prevData) => prevData.filter((voucher) => voucher.id !== id));
      }
    } catch (error) {
      console.error("Error deleting voucher:", error);
    }
  };

  // Cấu hình cột cho DataGrid
  const columns = [
    { field: "code", headerName: "Voucher", width: 150 },
    { field: "discountType", headerName: "Discount Type", width: 150 },
    { field: "discountValue", headerName: "Discount Value", width: 150 },
    { field: "applyTo", headerName: "Apply To", width: 200 },
    {
      field: "expiresAt",
      headerName: "Time Expires",
      width: 200,
      renderCell: (params) => {
        const date = new Date(params.row.expiresAt).toLocaleDateString("en-US");
        return <div>{date}</div>;
      },
    },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={`/admin/vouchers/${params.row.id}/edit`}
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

export default Vouchertable;
