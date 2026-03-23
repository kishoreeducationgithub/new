import React,{useState} from 'react'

const Profile = () => {
  const [profile,setProfile]=useState({
    name:"",
    age:"",
  })

  const handleChange=(event)=>{
      const {name,value}=event.target

      setProfile((prec)=>(
        {...prec,[name]:value}
      ))
    }
  
  return (
    <div>
      <h1>My Profile</h1>
      <div>
        <labal>Name :
          <input type="text" name="name" value={profile.name} onChange={handleChange} />
        </labal>
      </div>
      <div>
          <label >Age :
            <input type="number" name="age" value={profile.age} onChange={handleChange}/>
          </label>
        </div>
      <h1>Profile details</h1>
      <ul>
          <p>{profile.name}</p>
          <p>{profile.age}</p>
      </ul>

    </div>
  )
}

export default Profile
