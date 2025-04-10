import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from "./page/signup/SignUp.jsx"
import Login from "./page/login/Login.jsx"
import SOSButton from "./page/home/SOSButton.jsx"
import Home from './page/home/Home.jsx'

const UserRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<Home/>}/>
        {/* <Route path='/home' element={<SOSButton/>}/> */}
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>
    </Routes>
  )
}

export default UserRoutes