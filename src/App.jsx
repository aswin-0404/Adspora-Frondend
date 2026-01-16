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

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>

      {/* owner urls */}

      <Route path='/ownerdashboard' element={<SpaceOwnerLanding/>}/>
      <Route path="/owner/addspace" element={<AddSpace/>}/>
      <Route path="/myspace" element={<MySpace/>}/>
      <Route path="/ownerprofile" element={<OwnerProfile/>}/>

      {/* Advertiser Routes */}
      <Route path='spaces/' element={<SpaceListing/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/wishlist" element={<Wishlist />} />

    </Routes>

    
  )
}

export default App
