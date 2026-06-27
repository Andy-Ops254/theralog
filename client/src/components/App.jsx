import React from 'react'
import Register from './Register'
import Landing from './Landing'
import SignIn from './SignIn'
import Layout from './Layout'
import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/layout" element={<Layout />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
    </>
    
  )
}

export default App