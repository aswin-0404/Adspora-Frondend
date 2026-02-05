import React from "react"
import LandingPage from "./user/landing"
import { Route, Routes } from "react-router-dom"
import Register from "./Accounts/Register"
import Login from "./Accounts/Login"
import SpaceOwnerLanding from "./owner/OwnerLandingpage"
import AddSpace from "./owner/SpaceAdding"
import MySpace from "./owner/Myspace"
import SpaceListing from "./user/Spaces"
import Profile from "./user/Profile"
import OwnerProfile from "./owner/OwnerProfile"
import Wishlist from "./user/Wishlist"
import Chat from "./chat"
import OwnerInbox from "./owner/OwnerInbox"
import AdvertiserInbox from "./user/AdvertiserInbox"
import PaymentPage from "./user/payment"
import MyBookings from "./user/Bookedspaces"
import OwnerBookings from "./owner/BookingRequest"
import ForgotPassword from "./Accounts/Forgotpass"
import ResetPassword from "./Accounts/Resetpassword"

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path='/forgot-password' element={<ForgotPassword/>}/>
      <Route path='/reset-password/:uid/:token' element={<ResetPassword/>}/>

      {/* owner urls */}

      <Route path='/ownerdashboard' element={<SpaceOwnerLanding/>}/>
      <Route path="/owner/addspace" element={<AddSpace/>}/>
      <Route path="/myspace" element={<MySpace/>}/>
      <Route path="/ownerprofile" element={<OwnerProfile/>}/>
      <Route path="/ownerinbox" element={<OwnerInbox/>}/>
      <Route path="/owner/booking/request/" element={<OwnerBookings/>}/>

      {/* Advertiser Routes */}
      <Route path='spaces/' element={<SpaceListing/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/chat/:roomId" element={<Chat/>}/>
      <Route path="/advertiser/inbox" element={<AdvertiserInbox/>}/>
      <Route path="/space/booking/:spaceId" element={<PaymentPage/>}/>
      <Route path="/advertiser/bookings/" element={<MyBookings/>}/>


    </Routes>

    
  )
}

export default App
