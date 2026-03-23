import React ,{useState}from 'react'

const Switch = () => {
    const [sw,setSw]=useState(false)
    const handleClick=()=>setSw((sw)=>!sw)
  return (
    <div>
    {sw?(
        <span>Dark</span>
      ):(
        <span>Light</span>
      )}
      <input text="text" />
      <button onClick={handleClick}>Switch</button>
    </div>
  )
}

export default Switch
