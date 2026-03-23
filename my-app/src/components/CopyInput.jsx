import React,{useState} from 'react'

const CopyInput = () => {
    const [inputValue,setInputValue]=useState("")
    const [copied,setCopied]=useState(false)
    const handlerCopy=()=>{
        navigator.clipboard.writeText(inputValue).then(()=>{
            setCopied(true);
            setTimeout(()=>setCopied(false),2000)
            setInputValue("")
        })
    }
  return (
    <div>
     <input type="text" value={inputValue} onChange={(e)=>setInputValue(e.target.value)}/>
     <button onClick={handlerCopy}>Copy</button>
    {copied && (
  <Portal>
    <div className="toast">Copied!</div>
  </Portal>
)}
    </div>
  )
}

export default CopyInput
