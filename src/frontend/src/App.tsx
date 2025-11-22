import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import EmployeeList from './pages/profile/EmployeeList'
import CreateEmployee from './pages/profile/CreateEmployee'
import AdminDashboard from './pages/AdminDashboard'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/employee/list" element={<EmployeeList />} />
        <Route path="/create/employee" element={<CreateEmployee />} />
        <Route path="/" element={<Navigate to="/employee/list" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
