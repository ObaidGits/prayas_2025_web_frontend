import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from './page/signup/SignUp.jsx'
import PoliceLogin from './page/login/Login.jsx'
import AdminPanel from './page/AdminPanel/AdminPanel.jsx'

const AdminRoutes = () => {
  return (
    <Routes>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/login' element={<PoliceLogin/>}/>
        <Route path='/home' element={<AdminPanel/>}/>
        <Route path='/' element={<AdminPanel/>}/>
    </Routes>
  )
}

export default AdminRoutes