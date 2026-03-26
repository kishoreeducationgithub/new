import React, { useContext, useEffect } from 'react'
import { UserContextInstance } from './UserContextNew'
import UserUpdate from './UserUpdate'

const UserProfile = () => {
  const { user, updateName } = useContext(UserContextInstance)



  useEffect(()=>{
    

  },[])

  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {user.name}</p>
      <UserUpdate/>
    </div>
  )
}

export default UserProfile
