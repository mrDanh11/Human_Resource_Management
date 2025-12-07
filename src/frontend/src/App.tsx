import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import EmployeeList from './pages/profile/EmployeeList'
import CreateEmployee from './pages/profile/CreateEmployee'
import AdminDashboard from './pages/AdminDashboard'
import ProfilePage from './pages/profile/ProfilePage'
import LandingPage from "./pages/LandingPage/LandingPage";
import PointExchange from './pages/rewards/PointExchange';
import RewardDashboard from './pages/rewards/RewardDashboard'
import RewardPointHR from './pages/rewards/RewardPointHR'
import PointsAdmin from './pages/rewards/PointAdmin'
import Login from './pages/auth/Login'
import Forbidden from './pages/auth/Forbidden'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/employee/list" element={<EmployeeList />} />
        <Route path="/create/employee" element={<CreateEmployee />} />
        <Route path="/employee/profile/:id" element={<ProfilePage />} />
        <Route path="/rewards/points" element={<RewardDashboard />} />
        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/rewards/exchange" element={<PointExchange />} />
        <Route path="/rewards/hr-reward" element={<RewardPointHR />} />
        <Route path="/rewards" element={<PointsAdmin />} />
        <Route path="/forbidden" element={<Forbidden />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
