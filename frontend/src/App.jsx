import { BrowserRouter, Routes, Route } from 'react-router-dom';

import TourismDesign from './tourismDesign';
import LoginDesign from './login';
import RegisterTouristDesign from './tourist/register';
import AddHotelForm from './hotel-owner/addhotelform';
import AdminDashboard from './admin/admindashboard';
import GuideDashboardContainer from './guide/guidedashboard';
import TouristDashboard from './tourist/tourist_dashboard';
import GuideRegistrationForm from './guide/guide_register';
import HotelOwnerMultipleHotelsContainer from './hotel-owner/hotel_ownerdashboard';
import { Toaster } from 'react-hot-toast';
import TouristPersonalDetails from './tourist/updateprofile';
import AddGuideForm from './guide/guide_register';
import GuideBookingForm from './tourist/guider_booking_form';
import RequestedGuideDetails from './admin/requested_guides';


function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<TourismDesign />} />
        <Route path="/login" element={<LoginDesign />} />
        <Route path="/register" element={<RegisterTouristDesign />} />
        {/* <Route path="/hotelowner-register" element={<RegisterHotelOwner />}></Route> */}
        {/* <Route path="/guide-register" element={<RegisterGuide />}></Route> */}
        {/* <Route path="/vehicle-register" element={<RegisterVehicleRentalOwner />}></Route> */}
        <Route path="/addhotel" element={<AddHotelForm />}></Route>
        <Route path="/admin/dashboard" element={<AdminDashboard />}></Route>
        <Route path="/guide/dashboard" element={<GuideDashboardContainer />}></Route>
        <Route path="/tourist/dashboard" element={<TouristDashboard />}></Route>
        <Route path="/hotelowner/dashboard" element={<HotelOwnerMultipleHotelsContainer />}></Route>
        <Route path="/guide/addguide" element={<GuideRegistrationForm />}></Route>
        <Route path="/tourist/profile" element={<TouristPersonalDetails />}></Route>
        <Route path="/guide/dashboard" element={<GuideDashboardContainer />}></Route>
        <Route path="/guide/addguide" element={<AddGuideForm />}></Route>

        <Route path="/admin/usermanagement" element={<UserManagement />}></Route>
        <Route path="/admin/pendingapprovels" element={<PendingApprovalsPage />}></Route>
        <Route path="/admin/pendingapprovels/:hotel_id" element={<RequestedHotelDetails />}></Route>
        <Route path="/tourist/guider_booking_form" element={<GuideBookingForm />}></Route>
        <Route path="/admin/pendingapprovels/guide/:guide_id" element={<RequestedGuideDetails />}></Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;


