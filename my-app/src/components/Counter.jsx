import React from 'react'
import { useState } from 'react'

const Counter = () => {
    const [count,setCount]=useState(0)

    const onIncrement=()=>setCount(count+1)
    const onDecrement=()=>setCount(count-1)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={onIncrement}>Increment</button>
      <button onClick={onDecrement}>decrement</button>
    </div>
  )
}

export default Counter
