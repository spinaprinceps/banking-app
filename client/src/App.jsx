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
import FDDashboard from '../pages/FDDashboard.jsx';
import SavingsGoalsDashboard from '../pages/SavingsGoalsDashboard.jsx';
import LoansDashboard from '../pages/LoansDashboard.jsx';
import BillsDashboard from '../pages/BillsDashboard.jsx';
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/userDashboard" element={<UserDashboard/>}/>
      <Route path="/payment" element={<Payment />} />
      <Route path="/fixed-deposits" element={<FDDashboard />} />
      <Route path="/savings-goals" element={<SavingsGoalsDashboard />} />
      <Route path="/loans" element={<LoansDashboard />} />
      <Route path="/bills" element={<BillsDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
