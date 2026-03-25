import React,{useContext} from 'react'
import { UserContextInstance } from './UserContextNew'
const UserProfile = () => {
  const {user, updateName} = useContext(UserContextInstance)
  return (
    <div>
      <p>Name: {user.name}</p>
      <button onClick={() => updateName("John Doe")}>Update Name</button>   
    </div>
  )
}

export default UserProfile
