import React from "react"
import LandingPage from "./pages/common/Landing"
import { Route, Routes } from "react-router-dom"
import Register from "./pages/auth/Register"
import Login from "./pages/auth/Login"
import SpaceOwnerLanding from "./pages/owner/Dashboard"
import AddSpace from "./pages/owner/AddSpace"
import MySpace from "./pages/owner/MySpace"
import SpaceListing from "./pages/user/Spaces"
import Profile from "./pages/user/Profile"
import OwnerProfile from "./pages/owner/Profile"
import Wishlist from "./pages/user/Wishlist"
import Chat from "./pages/common/Chat"
import OwnerInbox from "./pages/owner/Inbox"
import AdvertiserInbox from "./pages/user/Inbox"
import PaymentPage from "./pages/user/Payment"
import MyBookings from "./pages/user/Bookings"
import OwnerBookings from "./pages/owner/Bookings"
import ForgotPassword from "./pages/auth/ForgotPassword"
import ResetPassword from "./pages/auth/ResetPassword"
import AdminDashboard from "./pages/admin/Dashboard"
import AdminUsers from "./pages/admin/Users"
import AdminSpaces from "./pages/admin/Spaces"
import AdminBookings from "./pages/admin/Bookings"

function App() {

  return (
    <Routes>

      {/* common routes */}
      
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/reset-password/:uid/:token' element={<ResetPassword />} />

      {/* owner routes */}

      <Route path='/ownerdashboard' element={<SpaceOwnerLanding />} />
      <Route path="/owner/addspace" element={<AddSpace />} />
      <Route path="/myspace" element={<MySpace />} />
      <Route path="/ownerprofile" element={<OwnerProfile />} />
      <Route path="/ownerinbox" element={<OwnerInbox />} />
      <Route path="/owner/booking/request/" element={<OwnerBookings />} />

      {/* Admin routes */}
      <Route path="/admindash" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/spaces" element={<AdminSpaces />} />
      <Route path="/admin/bookings" element={<AdminBookings />} />

      {/* Advertiser route */}
      <Route path='spaces/' element={<SpaceListing />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/chat/:roomId" element={<Chat />} />
      <Route path="/advertiser/inbox" element={<AdvertiserInbox />} />
      <Route path="/space/booking/:spaceId" element={<PaymentPage />} />
      <Route path="/advertiser/bookings/" element={<MyBookings />} />


    </Routes>


  )
}

export default App
