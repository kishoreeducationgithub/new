import React,{useState} from 'react'

const Todo = () => {
    const [inputValue,setInputValue]=useState("")
    const [todos,setTodos]=useState([])

    const handleSubmit=(event)=>{
        event.preventDefault()
        if (inputValue.trim()){
            setTodos([...todos,inputValue])
            setInputValue("")
        }

    }


    const handleChange=(event)=>{
        setInputValue(event.target.value)
    }

  return (
    <div>
      <h1>Todo list</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder='Add todo' value={inputValue} onChange={handleChange}/>
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo,index)=>(
            <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  )
}

export default Todo
