import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { Dashboard } from './pages/Dashboard'
import { Employees } from './pages/Employees'
import { EmployeeDetail } from './pages/EmployeeDetail'
import { Vacations } from './pages/Vacations'
import { Skills } from './pages/Skills'
import { Teams } from './pages/Teams'
import { Projects } from './pages/Projects'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="employees/:id" element={<EmployeeDetail />} />
        <Route path="vacations" element={<Vacations />} />
        <Route path="skills" element={<Skills />} />
        <Route path="teams" element={<Teams />} />
        <Route path="projects" element={<Projects />} />
      </Route>
    </Routes>
  )
}

export default App

