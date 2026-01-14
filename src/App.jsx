import React from "react"
import LandingPage from "./user/home/landing"
import { Route, Routes } from "react-router-dom"
import Register from "./Accounts/Register"
import Login from "./Accounts/Login"
import SpaceOwnerLanding from "./owner/OwnerLandingpage"
import AddSpace from "./owner/SpaceAdding"

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>

      {/* owner urls */}

      <Route path='/ownerdashboard' element={<SpaceOwnerLanding/>}/>
      <Route path="/owner/addspace" element={<AddSpace/>}/>
    </Routes>

    
  )
}

export default App
