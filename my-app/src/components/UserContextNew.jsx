
import React, {createContext,useState} from 'react'

const UserContextInstance = createContext()
const UserProvider = () => {
  const [user,setUser] = useState({name:"Kishore"})
  const updateName = (newName) => {
    setUser({name:newName})
  }
  return (
    <div>
      <UserContextInstance.Provider value={{user, updateName}}>
        
      </UserContextInstance.Provider>
    </div>
  )
}

export default {UserContextInstance, UserProvider}  
