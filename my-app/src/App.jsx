import React from 'react'
import { UserProvider } from './components/UserContextNew'
import UserProfile from './components/UserProfile'

const App = () => {
  const 
  return (
    <UserProvider>
      <div>
        <UserProfile />
      </div>
    </UserProvider>
  )
}

export default App
