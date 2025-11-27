import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import EmployeeList from './pages/profile/EmployeeList'
import CreateEmployee from './pages/profile/CreateEmployee'
import AdminDashboard from './pages/AdminDashboard'
import ProfilePage from './pages/profile/ProfilePage'
import LandingPage from "./pages/LandingPage/LandingPage";
import PointExchange from './pages/rewards/PointExchange';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/employee/list" element={<EmployeeList />} />
        <Route path="/create/employee" element={<CreateEmployee />} />
        <Route path="/employee/profile/:id" element={<ProfilePage />} />
        <Route path="/" element={<Navigate to="/employee/list" replace />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/rewards/exchange" element={<PointExchange />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
