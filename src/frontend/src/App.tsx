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
import AdminActivityListPage from './pages/activities/AnalysisActivityListPage';
import CreateActivityPage from './pages/activities/CreateActivityPage';
import CancelActivityPage from './pages/activities/CancelActivityPage';
import ActivityResultPage from './pages/activities/ActivityResultPage';
import HistoryActivitiesPage from './pages/activities/HistoryActivitiesPage';
import ActivityPrivateResultPage from './pages/activities/ActivityPrivateResultPage';
import EmployeeLayout from './layouts/EmployeeLayout';
import HRLayout from './layouts/HRLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AttendancePage from './pages/attendance/AttendancePage';
import AttendanceManagementPage from './pages/attendance/AttendanceManagementPage';
import RequestSelectionPage from './pages/requests/RequestSelectionPage';
import RequestFormPage from './pages/requests/RequestFormPage';
import MyRequestsPage from './pages/requests/MyRequestsPage';
import WfhRequestPage from './pages/wfh/WfhRequestPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forbidden" element={<Forbidden />} />

        {/* Protected Routes - Require Login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/activities/results" element={<ActivityResultPage />} />
          <Route path="/employee/profile/:id" element={<ProfilePage />} />          
          
          {/* Employee Layout Routes */}
          <Route element={<EmployeeLayout />}>
            <Route path="/rewards/exchange" element={<PointExchange />} />
            <Route path="/rewards/history" element={<RewardHistory />} />
            <Route path="/rewards/points" element={<RewardDashboard />} />
            <Route path="/rewards/hr-reward" element={<RewardPointHR />} />
            <Route path="/requests" element={<AttendancePage />} />
            <Route path="/requests/create" element={<RequestSelectionPage />} />
            <Route path="/requests/create/:type" element={<RequestFormPage />} />
            <Route path="/requests/create/wfh" element={<WfhRequestPage />} />
            <Route path="/requests/my-requests" element={<MyRequestsPage />} />
            <Route path="/timesheet/manage" element={<AttendanceManagementPage />} />
            <Route path="/rewards" element={<PointsAdmin />} />
            <Route path="/activities" element={<ActivityListPage />} />
            <Route path="/activities/history" element={<HistoryActivitiesPage />} />
            <Route path="/activities/result" element={<ActivityPrivateResultPage />} />
          </Route>
        </Route>

        {/* HR Routes */}
        <Route element={<ProtectedRoute allowedRoles={['HR']} />}>
          <Route element={<HRLayout />}>
            <Route path="/rewards/hr-reward" element={<RewardPointHR />} />
            <Route path="/activities" element={<AdminActivityListPage />} />
            <Route path="/employee">
              <Route path="list" element={<EmployeeList />} />
              <Route path="create" element={<CreateEmployee />} />
            </Route>
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="point" element={<PointsAdmin />} />
    
            <Route path="activities" element={<ActivityListPage />} />
            <Route path="activities">
              <Route path="statistics" element={<AdminActivityListPage />} />
              <Route path="create" element={<CreateActivityPage />} />
              <Route path="cancel" element={<CancelActivityPage />} />
            </Route>
          </Route>
        </Route>

        {/* Catch all - redirect to home for any unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
