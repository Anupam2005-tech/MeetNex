import {SignUp} from '@clerk/clerk-react'
import Loader from '../ui/Loader'
function RegisterForm() {
  return (
    <>
    <SignUp oauthFlow='popup' fallback={<Loader/>} fallbackRedirectUrl={'/home'}/>
    </>
  )
}

export default RegisterForm