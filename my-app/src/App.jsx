import React, {useState,useEffect } from 'react'
// import Counter from './components/Counter'
// import Todo from './components/Todo'
// import Profile from './components/Profile'
// import ShopingList from './components/ShopingList'
// import CopyInput from './components/CopyInput'
// import Switch from './components/Switch'


const App = () => {
  const [data,setData]=useState([])
  useEffect(()=>{
    async function getData() {
      const response=await fetch("https://jsonplaceholder.typicode.com/todos")
      const data=await response.json()
      if (data&&data.length) setData(data)
    }
    getData()

  },[])

  return (
    <div>
      <ul>{
        data.map((d)=>(
          <li key={d.id}>{d.title}</li>
        ))
      }
      </ul>
      app

    </div>
  )
}

export default App
