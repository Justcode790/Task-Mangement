import React,{useState} from 'react'
import { useNavigate,Link } from 'react-router-dom'
import api from '../../api'
import "./signup.css";

function Signup() {
  const [formData, setformData] = useState({username:"",password:"",email:"",name:"",role:""});
  const navigate = useNavigate();
  const handleChange = (e)=>{
    setformData({...formData,[e.target.name] : e.target.value});
  }
  

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try{

      const res = await api.post("/auth/signup", formData);
      console.log(res.data);
      navigate("/")


    }catch(err){
        console.log(err);
    }

  }


  return (
   <div className="signup-page">
      <div className="signup-card">
        <h3 className="signup-heading">Create an Account</h3>

        <form onSubmit={handleSubmit} className="signup-form">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Role --</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        <p className="login-text">
          Already have an account? <Link to="/login-admin">Login here</Link>
        </p>
      </div>
    </div>

  )
}

export default Signup;