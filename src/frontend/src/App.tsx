import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EmployeeList from "./pages/profile/EmployeeList";
import CreateEmployee from "./pages/profile/CreateEmployee";
import ProfilePage from "./pages/profile/ProfilePage";
import LandingPage from "./pages/LandingPage/LandingPage";
import PointExchange from "./pages/rewards/PointExchange";
import RewardDashboard from "./pages/rewards/RewardDashboard";
import RewardPointHR from "./pages/rewards/RewardPointHR";
import PointsAdmin from "./pages/rewards/PointAdmin";
import PointEmployees from "./pages/rewards/PointEmployees";
import PointConversion from "./pages/rewards/PointConversion";
import PointRequests from "./pages/rewards/PointRequests";
import PointConversionHistory from "./pages/rewards/PointConversionHistory";
import PointHistory from "./pages/rewards/PointHistory";
import RewardHistory from "./pages/rewards/RewardHistory";
import Login from "./pages/auth/Login";
import Forbidden from "./pages/auth/Forbidden";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ActivityListPage from "./pages/activities/ActivityListPage";
import AnalysisActivityListPage from "./pages/activities/AnalysisActivityListPage";
import CreateActivityPage from "./pages/activities/CreateActivityPage";
import CancelActivityPage from "./pages/activities/CancelActivityPage";
import ActivityResultPage from "./pages/activities/ActivityResultPage";
import HistoryActivitiesPage from "./pages/activities/HistoryActivitiesPage";
import ActivityPrivateResultPage from "./pages/activities/ActivityPrivateResultPage";
import RecordActivityResultPage from "./pages/activities/RecordActivityResultPage";
import Layout from "./layouts/Layout";
import ProtectedRoute from "./components/helper/ProtectedRoute";
import AttendancePage from "./pages/attendance/AttendancePage";
import AttendanceManagementPage from "./pages/attendance/AttendanceManagementPage";
import AttendanceActivityPage from "./pages/activities/AttendanceActivityPage";
import RequestSelectionPage from "./pages/requests/RequestSelectionPage";
import RequestFormPage from "./pages/requests/RequestFormPage";
import MyRequestsPage from "./pages/requests/MyRequestsPage";
import WfhRequestPage from "./pages/requests/WfhRequestPage";
import LeaveRequestPage from './pages/requests/OnLeaveRequestList';
import ManagerLayout from './layouts/ManagerLayout';
import CreateOnLeaveRequest from './pages/requests/CreateOnLeaveRequest';
import HRDashboard from "./pages/dashboard/HRDashboard";
import ActivityListPageManage from "./pages/activities/ActivityListPageManage";

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
          
          {/* Employee Layout Routes */}
          <Route element={<Layout />}>
            <Route path="/employee/profile/:id" element={<ProfilePage />} />

            
            <Route path="rewards">
              <Route path="exchange" element={<PointExchange />} />
              <Route path="history" element={<RewardHistory />} />
              <Route path="points" element={<RewardDashboard />} />
            </Route>
            
            <Route path="requests">
              <Route path="create">
                <Route path="" element={<RequestSelectionPage />} />
                <Route path=":type" element={<RequestFormPage />} />
                <Route path="wfh" element={<WfhRequestPage />} />
                <Route path="on-leave" element={<CreateOnLeaveRequest />} />
              </Route>
              <Route path="my-requests" element={<MyRequestsPage />} />
              <Route path="" element={<LeaveRequestPage />} />
            </Route>

            <Route path="activities">
              <Route path="" element={<ActivityListPage />} />
              <Route path="history" element={<HistoryActivitiesPage />} />
              <Route path="result" element={<ActivityPrivateResultPage />} />
            </Route>

            <Route path="/attendance" element={<AttendancePage />} />
          </Route>
        </Route>
          {/* Manager Routes */}
        <Route element={<ProtectedRoute allowedRoles={['MANAGER']} />}>
          <Route path="/employee/profile/:id" element={<ProfilePage />} />
          <Route path="/manager" element={<ManagerLayout />}>
            <Route path="requests" element={<LeaveRequestPage />} />
            <Route path="rewards">
              <Route path="exchange" element={<PointExchange />} />
              <Route path="history" element={<RewardHistory />} />
              <Route path="points" element={<RewardDashboard />} />
            </Route>
          </Route>

          {/* HR Routes */}
          <Route element={<ProtectedRoute allowedRoles={["HR"]} />}>
            <Route path="hr" element={<Layout />}>
              <Route path="dashboard" element={<HRDashboard />} />
              <Route path="employee/profile/:id" element={<ProfilePage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="activities" element={<ActivityListPage />} />
              
              <Route path="activities">
                <Route path="create" element={<CreateActivityPage />} />
                <Route path="cancel" element={<CancelActivityPage />} />
                <Route path="history" element={<HistoryActivitiesPage />} />
                <Route path="result" element={<ActivityPrivateResultPage />} />
                <Route path="manage" element={<ActivityListPageManage />} />
              </Route>
              
              <Route path="employee">
                <Route path="list" element={<EmployeeList />} />
                <Route path="create" element={<CreateEmployee />} />
              </Route>
              
              <Route path="rewards">             
                <Route path="points" element={<RewardDashboard />} />
                <Route path="hr-reward" element={<RewardPointHR />} />
                <Route path="history" element={<RewardHistory />} />
                <Route path="exchange" element={<PointExchange />} />
              </Route>

              <Route path="timesheet">
                <Route path="manage" element={<AttendanceManagementPage />} />
              </Route>
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="admin" element={<Layout />}>
              <Route path="employee/profile/:id" element={<ProfilePage />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              
              <Route path="point">
                <Route index element={<PointsAdmin />} />
                <Route path="roles" element={<PointsAdmin />} />
                <Route path="employees" element={<PointEmployees />} />
                <Route path="conversion" element={<PointConversion />} />
                <Route path="requests" element={<PointRequests />} />
                <Route path="conversion-history" element={<PointConversionHistory />} />
                <Route path="history" element={<PointHistory />} />
              </Route>

              <Route path="activities">
                <Route index element={<ActivityListPage />} />
                <Route path="statistics" element={<AnalysisActivityListPage />} />
                <Route path="create" element={<CreateActivityPage />} />
                <Route path="cancel" element={<CancelActivityPage />} />
                <Route path="record-result" element={<RecordActivityResultPage />} />
                <Route path="attendance" element={<AttendanceActivityPage />} />
              </Route>
            </Route>
          </Route>
        </Route>

        {/* Catch all - redirect to home for any unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
