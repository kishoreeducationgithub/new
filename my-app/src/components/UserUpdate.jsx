import React,{ useState,useContext } from "react";

import { UserContextInstance } from "./UserContextNew";



const UserUpdate = () => {
    const {updateName}=useContext(UserContextInstance)
  return (
    <div>
      <from type="onSubmit">
        <input type="text"></input>
        <button>update</button>
      </from>
    </div>
  )
}

export default UserUpdate
