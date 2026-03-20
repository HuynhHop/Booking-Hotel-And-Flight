import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Screens/Home";
import ManagerUser from "../Screens/ManagerUser";
import DetailUser from "../Screens/DetailUser";
import New from "../Screens/New";
import { DarkModeContext } from "../Context/darkModeContext";
import {
  userInputs,
  hotelInputs,
  airlineInputs,
  voucherInputs,
  notificationInputs,
  homesInputs,
  roomInputs,
} from "../Components/formData";
import "../Style/dark.scss";
import { useContext } from "react";
import ManagerHomeStay from "../Screens/ManagerHomeStay";
import ManagerOrder from "../Screens/ManagerOrder";
import ManagerHotel from "../Screens/ManagerHotel";
import ManagerAirline from "../Screens/ManagerAirline";
import ManagerVouchers from "../Screens/ManagerVouchers";
import DetailHomeStay from "../Screens/DetailHomeStay";
import DetailOrder from "../Screens/DetailOrder";
import DetailHotel from "../Screens/DetailHotel";
import ManagerReview from "../Screens/ManagerReview";
import ManagerNotification from "../Screens/ManagerNotification";
import EditlOrder from "../Screens/EditOrder";
import ManagerRoom from "../Screens/ManagerRoom";
import Edit from "../Screens/Edit";

const AdminLayout = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="users" element={<ManagerUser />} />
        <Route path="users/:userId" element={<DetailUser />} />
        <Route
          path="users/:userId/new"
          element={<New inputs={userInputs} title={"Add New User"} />}
        />

        <Route path="homes" element={<ManagerHomeStay />} />
        <Route path="homes/:homesId" element={<DetailHomeStay />} />
        <Route
          path="homes/:homesId/edit"
          element={<Edit inputs={homesInputs} title={"Edit HomeStay"} />}
        />
        <Route
          path="homes/:homesId/new"
          element={<New inputs={homesInputs} title={"Add New HomeStay"} />}
        />

        <Route path="orders" element={<ManagerOrder />} />
        <Route path="orders/:orderId/edit" element={<EditlOrder />} />
        {/* <Route
          path="orders/:orderId/new"
          element={<New inputs={orderInputs} title={"Add New Order"} />}
        /> */}
        <Route path="orders/:orderId" element={<DetailOrder />} />

        <Route path="hotels" element={<ManagerHotel />} />
        <Route path="hotels/:hotelId" element={<DetailHotel />} />
        <Route
          path="hotels/:hotelId/edit"
          element={<Edit inputs={hotelInputs} title={"Edit Hotel"} />}
        />
        <Route
          path="hotels/:hotelId/new"
          element={
            <New inputs={hotelInputs} title={"Add New Hotel & Service"} />
          }
        />

        <Route path="rooms" element={<ManagerRoom />} />
        <Route path="rooms/:roomId" element={<DetailHotel />} />
        <Route
          path="rooms/:roomId/edit"
          element={<Edit inputs={roomInputs} title={"Edit Room"} />}
        />
        <Route
          path="rooms/:roomId/new"
          element={<New inputs={roomInputs} title={"Add New Room For Hotel"} />}
        />

        <Route path="airlines" element={<ManagerAirline />} />
        <Route
          path="airlines/:airlineId/edit"
          element={
            <Edit inputs={airlineInputs} title={"Edit Airline Ticket"} />
          }
        />
        <Route
          path="airlines/:airlineId/new"
          element={
            <New inputs={airlineInputs} title={"Add New Airline Ticket"} />
          }
        />

        <Route path="reviews" element={<ManagerReview />} />
        {/* <Route
          path="reviews/:reviewId/new"
          element={<New inputs={reviewInputs} title={"Add New Review"} />}
        /> */}

        <Route path="vouchers" element={<ManagerVouchers />} />
        <Route
          path="vouchers/:voucherId/edit"
          element={<Edit inputs={voucherInputs} title={"Edit Voucher"} />}
        />
        <Route
          path="vouchers/:voucherId/new"
          element={<New inputs={voucherInputs} title={"Add New Vouchers"} />}
        />

        <Route path="notifications" element={<ManagerNotification />} />
        <Route
          path="notifications/:notificationsId/new"
          element={
            <New inputs={notificationInputs} title={"Add New notifications"} />
          }
        />
      </Routes>
    </div>
  );
};

export default AdminLayout;
