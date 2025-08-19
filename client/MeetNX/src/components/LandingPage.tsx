import React from 'react'
import { SpotlightText } from '../reuseable Components/SpotlightText'
import { Login } from './Login'
import { Register } from './Register'
import UserDashboard from './UserDashboard'





const LandingPage = () => {
  return (
  <>
    <div>
      <SpotlightText/>
    </div>
    <Login/>
    <Register/>
    <UserDashboard/>
  </>
  )
}

export default LandingPage
