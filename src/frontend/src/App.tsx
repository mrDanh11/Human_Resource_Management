import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import EmployeeList from './pages/profile/EmployeeList'
import CreateEmployee from './pages/profile/CreateEmployee'
import ProfilePage from './pages/profile/ProfilePage'
import LandingPage from "./pages/LandingPage/LandingPage";
import PointExchange from './pages/rewards/PointExchange';
import RewardDashboard from './pages/rewards/RewardDashboard'
import RewardPointHR from './pages/rewards/RewardPointHR'
import PointsAdmin from './pages/rewards/PointAdmin'
import RewardHistory from './pages/rewards/RewardHistory'
import Login from './pages/auth/Login'
import Forbidden from './pages/auth/Forbidden'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import ActivityListPage from './pages/activities/ActivityListPage';
import AdminActivityListPage from './pages/activities/AdminActivityListPage';
import CreateActivityPage from './pages/activities/CreateActivityPage';
import CancelActivityPage from './pages/activities/CancelActivityPage';
import ActivityResultPage from './pages/activities/ActivityResultPage';
import HistoryActivitiesPage from './pages/activities/HistoryActivitiesPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/employee/profile/:id" element={<ProfilePage />} />
        <Route path="/rewards/points" element={<RewardDashboard />} />
        <Route path="/rewards/exchange" element={<PointExchange />} />
        <Route path="/rewards/history" element={<RewardHistory />} />
        <Route path="/rewards/hr-reward" element={<RewardPointHR />} />
        <Route path="/rewards" element={<PointsAdmin />} />
        <Route path="/activities" element={<ActivityListPage />} />
        <Route path="/activities/history" element={<HistoryActivitiesPage />} />
        <Route path="/activities/results" element={<ActivityResultPage />} />
        <Route path="activities/create" element={<CreateActivityPage />} />
        <Route path="activities/cancel" element={<CancelActivityPage />} />
        
        {/* Admin routes with layout */}
        <Route path="admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="point" element={<PointsAdmin />} />
          <Route path="activities" element={<AdminActivityListPage />} />
          <Route path="employee">
            <Route path="list" element={<EmployeeList />} />
            <Route path="create" element={<CreateEmployee />} />
          </Route>
        </Route>

        {/* Catch all - redirect to home for any unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
