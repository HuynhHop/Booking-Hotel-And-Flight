export const userColumns = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "user",
    headerName: "Username",
    width: 250,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.avatar} alt="avatar" />
          {params.row.username}
        </div>
      );
    },
  },
  { field: "email", headerName: "Email", width: 190 },
  {
    field: "phone",
    headerName: "Phone",
    type: "number",
    width: 130,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "fullname",
    headerName: "Fullname",
    width: 130,
  },
  {
    field: "provider",
    headerName: "Provider",
    width: 100,
  },
  {
    field: "role",
    headerName: "Role",
    width: 70,
  },
];
