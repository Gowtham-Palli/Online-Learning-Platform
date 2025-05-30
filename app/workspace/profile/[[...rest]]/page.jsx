import { UserProfile } from '@clerk/nextjs'
import React from 'react'

const Profile = () => {
  return (
    <div>
      <h2 className='font-bold text-3xl mb-3 text-white'>Manage Your Account</h2>
      <UserProfile />
    </div>
  )
}

export default Profile
