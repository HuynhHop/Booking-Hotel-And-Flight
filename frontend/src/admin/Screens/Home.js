import React, { useEffect, useState } from "react";
import Chart from "../Config/Chart.js";
import Featured from "../Components/Featured";
import List from "../Components/List";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import Widget from "../Config/Widget.js";
import "../Style/home.scss";
import { io } from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [notification, setNotification] = useState(null);
  const apiUrl = process.env.REACT_APP_SOCKET_URL || "http://localhost:8080";

  useEffect(() => {
    const socket = io(apiUrl, {
      // transports: ['websocket'],  
      withCredentials: true
    });

      console.log('Socket connected:', socket.connected);
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });
    socket.on('orderStatusChanged', (data) => {
      if (data.newStatus === 'Processing') {
        toast.info(`🆘 Yêu cầu hủy đơn: ${data.message}`, {
          position: "top-right",
          autoClose: 8000,  // Longer display time
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          icon: "⚠️"
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [apiUrl]);

  return (
    <div className="home">
      <>
        <Sidebar />
        <div className="homeContainer">
          <Navbar />
          <ToastContainer />
          <div className="widgets">
            <Widget type="customer" />
            <Widget type="orders" />
            <Widget type="earnings" />
          </div>
          <div className="charts">
            <Featured />
            <Chart title="Last 6 months (Revenue)" aspect={2 / 1} />
          </div>
          <div className="listContainer">
            <div className="listTitle">Latest Transactions</div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Home;