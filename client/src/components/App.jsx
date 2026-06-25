import React from 'react'
import Register from './Register'
import Landing from './Landing'
import SignIn from './SignIn'
import Navbar from './Navbar'
import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
    </>
    
  )
}

export default App