import React, { useContext } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import FullscreenOutlinedIcon from "@mui/icons-material/FullscreenOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import Switch from "@mui/material/Switch";
import { jwtDecode } from "jwt-decode";
import "../Style/navbar.scss";
import { DarkModeContext } from "../Context/darkModeContext";
const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const accessToken = localStorage.getItem("accessToken");
  // const decodedToken = jwtDecode(accessToken);
  // const image = decodedToken.avatar;
  const image = "../../assets/user.png";
  return (
    <div className="navbar">
      <div className="navbarContainer">
        <div className="search">
          <input type="text" placeholder="search" />
          <SearchOutlinedIcon />
        </div>
        <div className="items">
          <div className="item">
            <LanguageOutlinedIcon className="icon" />
            <span>English</span>
          </div>
          <div className="item">
            <Switch
              style={{ color: "#210876" }}
              className="icon"
              onChange={() => dispatch({ type: "TOGGLE" })}
            />
          </div>
          <div className="item">
            <FullscreenOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <NotificationsActiveOutlinedIcon className="icon" />
            {/* <div className="counter">3</div> */}
          </div>
          <div className="item">
            <ChatBubbleOutlineOutlinedIcon className="icon" />
            {/* <div className="counter">5</div> */}
          </div>
          <div className="item">
            <ListOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <img
              src={image ? image : "../../assets/user.png"}
              alt=""
              className="profileImg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
