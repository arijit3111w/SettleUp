import React from 'react'
// taking the children component which is the main page
const AuthLayout = ({children}) => {
  return (
    <div className='flex justify-center pt-40 '>{children}</div>
  )
}

export default AuthLayout