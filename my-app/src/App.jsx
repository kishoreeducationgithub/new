import { createContext } from 'react'

import React from 'react'


export const Data=createContext()

import ComponentA from './components/ComponetA'
const App = () => {
  const name=["Rohit","Satyarth","Shivam","Satyarth"]
  return (
    <div>
      <Data.Provider value={name}>
        <ComponentA/>
      </Data.Provider>
    </div>
  )
}

export default App
