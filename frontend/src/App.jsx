import { BrowserRouter, Routes, Route } from "react-router-dom";

import TourismDesign from "./tourismDesign";
import LoginDesign from "./login";
import RegisterTouristDesign from "./tourist/register";
import AddHotelForm from "./hotel-owner/addhotelform";
import AdminDashboard from "./admin/admindashboard";
import GuideDashboardContainer from "./guide/guidedashboard";
import TouristDashboard from "./tourist/tourist_dashboard";
import GuideRegistrationForm from "./guide/guide_register";
import HotelOwnerDashboard from "./hotel-owner/hotel_ownerdashboard";
import { Toaster } from "react-hot-toast";
import TouristPersonalDetails from "./tourist/updateprofile";
import UserManagement from "./admin/usermanagement";
import AdminPage from "./admin/admindashboard";
import PendingApprovalsPage from "./admin/pending_approvels";
import AddGuideForm from "./guide/guide_register";
import VehicleRentalDashboard from "./vehicle-rental/vehiclerental_dashboard";
import VehicleOwnerRegistrationForm from "./vehicle-rental/addvehicleform";
import RequestedHotelDetails from "./admin/requested_hotels";
import RequestedGuideDetails from "./admin/requested_guides";
import TouristViewHotelDetails from "./tourist/tourist_view_hotel";
import TouristViewGuideDetails from "./tourist/tourist_view_guide";
import HotelBookingPage from "./tourist/hotel_booking_form";
import GuideBookingForm from "./tourist/guider_booking_form";
import AddVehicleForm from "./vehicle-rental/addvehicleform";
import VehicleDetailsView from "./vehicle-rental/vehicle_details_view";
import EditVehicle from "./vehicle-rental/edit_vehicle";
import ViewAllGuides from "./admin/view_all_guides";
import ViewAllHotels from "./admin/view_all_hotels";
import ViewAllHotelBookings from "./admin/view_all_hotel_bookings";
import ViewAllGuideBookings from "./admin/view_all_guide_booking";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<TourismDesign />} />
        <Route path="/login" element={<LoginDesign />} />
        <Route path="/register" element={<RegisterTouristDesign />} />

        <Route path="/addhotel" element={<AddHotelForm />}></Route>
        <Route path="/admin/dashboard" element={<AdminDashboard />}></Route>
        <Route
          path="/guide/dashboard"
          element={<GuideDashboardContainer />}
        ></Route>
        <Route path="/tourist/dashboard" element={<TouristDashboard />}></Route>
        <Route
          path="/hotelowner/dashboard"
          element={<HotelOwnerDashboard />}
        ></Route>

        <Route path="/guide/addguide" element={<AddGuideForm />}></Route>
        <Route
          path="/tourist/profile"
          element={<TouristPersonalDetails />}
        ></Route>
        <Route
          path="/admin/usermanagement"
          element={<UserManagement />}
        ></Route>

        <Route
          path="/admin/pendingapprovels"
          element={<PendingApprovalsPage />}
        ></Route>
        <Route
          path="/admin/pendingapprovels/:hotel_id"
          element={<RequestedHotelDetails />}
        ></Route>
        <Route
          path="/admin/pendingapprovels/guide/:guide_id"
          element={<RequestedGuideDetails />}
        ></Route>

        <Route
          path="/tourist/viewhotel/:hotel_id"
          element={<TouristViewHotelDetails />}
        ></Route>
        <Route
          path="/tourist/viewguide/:guide_id"
          element={<TouristViewGuideDetails />}
        ></Route>

        <Route
          path="/tourist/bookhotel/:hotel_id"
          element={<HotelBookingPage />}
        ></Route>
        <Route
          path="/tourist/bookguide/:guide_id"
          element={<GuideBookingForm />}
        ></Route>

        <Route
          path="/vehiclerental/dashboard"
          element={<VehicleRentalDashboard />}
        ></Route>
        <Route
          path="/vehiclerental/addvehicle"
          element={<AddVehicleForm />}
        ></Route>
        <Route
          path="/vehiclerental/vehicle/:vehicle_id"
          element={<VehicleDetailsView />}
        ></Route>
        <Route
          path="/vehiclerental/edit/:vehicle_id"
          element={<EditVehicle />}
        ></Route>

        <Route path="/admin/viewallguides" element={<ViewAllGuides />}></Route>
        <Route path="/admin/viewallhotels" element={<ViewAllHotels />}></Route>
        <Route
          path="/admin/viewallhotelbookings"
          element={<ViewAllHotelBookings />}
        ></Route>

        <Route
          path="/admin/viewallguidebookings"
          element={<ViewAllGuideBookings />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
