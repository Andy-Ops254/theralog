import React from 'react'
import Register from './Register'
import Landing from './Landing'
import SignIn from './SignIn'
import Layout from './Layout'
import ProtectedRoute from './ProtectedRoute'
import Dashboard from '../pages/Dashboard'
import Sessions from '../pages/Sessions'
// import Psychologists from '../pages/Psychologists'
import Patients from '../pages/Patients'
import Referrals from '../pages/Referrals'
import Settings from '../pages/Settings'
import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signin" element={<SignIn />} />

{/* layoy is the parent route and the protect routes are its children */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sessions" element={<Sessions />} />
        {/* <Route path="/psychologists" element={<Psychologists />} /> */}
        <Route path="/patients" element={<Patients />} />
        <Route path="/referrals" element={<Referrals />} />
        <Route path="/settings" element={<Settings />} />
        {/* <Route index element={<Navigate replace to="/dashboard" />} /> */}
      </Route>

      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}

export default App