
import React, { createContext, useState } from 'react'

export const UserContextInstance = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ name: 'Kishore' })

  const updateName = (newName) => {
    setUser({ name: newName })
  }

  return (
    <UserContextInstance.Provider value={{ user, updateName }}>
      {children}
    </UserContextInstance.Provider>
  )
}
