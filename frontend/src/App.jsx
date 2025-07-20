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


function App() {
  return (
    <BrowserRouter>
      <Toaster position = "top-center" />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;


