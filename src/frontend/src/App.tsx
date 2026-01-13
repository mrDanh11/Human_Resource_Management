import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage/LandingPage";
import Login from "./pages/auth/Login";
import Forbidden from "./pages/auth/Forbidden";

import ProtectedRoute from "./components/ProtectedRoute";

import EmployeeLayout from "./layouts/EmployeeLayout";
import ManagerLayout from "./layouts/ManagerLayout";
import HRLayout from "./layouts/HRLayout";
import AdminLayout from "./layouts/AdminLayout";

/* Employee pages */
import ProfilePage from "./pages/profile/ProfilePage";
import PointExchange from "./pages/rewards/PointExchange";
import RewardDashboard from "./pages/rewards/RewardDashboard";
import RewardHistory from "./pages/rewards/RewardHistory";
import PointsAdmin from "./pages/rewards/PointAdmin";
import AttendancePage from "./pages/attendance/AttendancePage";
import AttendanceManagementPage from "./pages/attendance/AttendanceManagementPage";
import ActivityListPage from "./pages/activities/ActivityListPage";
import HistoryActivitiesPage from "./pages/activities/HistoryActivitiesPage";
import ActivityPrivateResultPage from "./pages/activities/ActivityPrivateResultPage";
import MyRequestsPage from "./pages/requests/MyRequestsPage";
import RequestSelectionPage from "./pages/requests/RequestSelectionPage";
import RequestFormPage from "./pages/requests/RequestFormPage";
import WfhRequestPage from "./pages/wfh/WfhRequestPage";
import LeaveRequestPage from "./pages/requests/OnLeaveRequestList";
import CreateOnLeaveRequest from "./pages/requests/CreateOnLeaveRequest";

/* Manager */
import RewardPointHR from "./pages/rewards/RewardPointHR";

/* HR */
import EmployeeList from "./pages/profile/EmployeeList";
import CreateEmployee from "./pages/profile/CreateEmployee";
import AdminActivityListPage from "./pages/activities/AnalysisActivityListPage";
import RecordActivityResultPage from "./pages/activities/RecordActivityResultPage";

/* Admin */
import AdminDashboard from "./pages/AdminDashboard";
import CreateActivityPage from "./pages/activities/CreateActivityPage";
import CancelActivityPage from "./pages/activities/CancelActivityPage";
import AttendanceActivityPage from "./pages/activities/AttendanceActivityPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forbidden" element={<Forbidden />} />

        {/* ================= AUTH REQUIRED ================= */}
        <Route element={<ProtectedRoute />}>

          {/* ===== EMPLOYEE ===== */}
          <Route element={<EmployeeLayout />}>
            <Route path="employee/profile/:id" element={<ProfilePage />} />

            {/* Rewards */}
            <Route path="rewards/exchange" element={<PointExchange />} />
            <Route path="rewards/history" element={<RewardHistory />} />
            <Route path="rewards/points" element={<RewardDashboard />} />

            {/* Requests */}
            <Route path="requests" element={<LeaveRequestPage />} />
            <Route path="requests/create" element={<RequestSelectionPage />} />
            <Route path="requests/create/:type" element={<RequestFormPage />} />
            <Route path="requests/create/wfh" element={<WfhRequestPage />} />
            <Route path="requests/my-requests" element={<MyRequestsPage />} />
            <Route path="requests/create/on-leave" element={<CreateOnLeaveRequest />} />

            {/* Attendance */}
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="timesheet/manage" element={<AttendanceManagementPage />} />

            {/* Activities */}
            <Route path="activities" element={<ActivityListPage />} />
            <Route path="activities/history" element={<HistoryActivitiesPage />} />
            <Route path="activities/result" element={<ActivityPrivateResultPage />} />
          </Route>

          {/* ===== MANAGER ===== */}
          <Route element={<ProtectedRoute allowedRoles={["MANAGER"]} />}>
            <Route element={<ManagerLayout />}>
              <Route path="manager/on-leave-requests" element={<LeaveRequestPage />} />
              <Route path="manager/rewards/exchange" element={<PointExchange />} />
              <Route path="manager/rewards/history" element={<RewardHistory />} />
              <Route path="manager/rewards/points" element={<RewardDashboard />} />
            </Route>
          </Route>

          {/* ===== HR ===== */}
          <Route element={<ProtectedRoute allowedRoles={["HR"]} />}>
            <Route element={<HRLayout />}>
              <Route path="hr/employee/list" element={<EmployeeList />} />
              <Route path="hr/employee/create" element={<CreateEmployee />} />
              <Route path="hr/activities" element={<AdminActivityListPage />} />
              <Route path="hr/activities/record-result" element={<RecordActivityResultPage />} />
              <Route path="rewards/hr-reward" element={<RewardPointHR />} />
            </Route>
          </Route>

          {/* ===== ADMIN ===== */}
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="admin/dashboard" element={<AdminDashboard />} />
              <Route path="admin/rewards" element={<PointsAdmin />} />

              <Route path="admin/activities" element={<ActivityListPage />} />
              <Route path="admin/activities/statistics" element={<AdminActivityListPage />} />
              <Route path="admin/activities/create" element={<CreateActivityPage />} />
              <Route path="admin/activities/cancel" element={<CancelActivityPage />} />
              <Route path="admin/activities/record-result" element={<RecordActivityResultPage />} />
              <Route path="admin/activities/attendance" element={<AttendanceActivityPage />} />
            </Route>
          </Route>

        </Route>

        {/* ================= 404 ================= */}
        <Route path="*" element={<Navigate to="/landing" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
