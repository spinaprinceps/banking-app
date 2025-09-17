import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from '../pages/Home.jsx'
import Login from '../pages/Loginpage.jsx'
import Signup from '../pages/Signup.jsx'
import UserDashboard from '../pages/UserDashboard.jsx';
import Payment from '../pages/payment.jsx'
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/userDashboard" element={<UserDashboard/>}/>
      <Route path="/payment" element={<Payment />} />
      </Routes>
    </Router>
  )
}

export default App
