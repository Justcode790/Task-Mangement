import React,{useState,useEffect} from 'react'
import { Link,useNavigate } from "react-router-dom";
import "./navEmp.css"
import { useUser } from "../context/UserContext";
import api from '../api';


function NavbarEmployee({onClickNotification,onClickActive,onClickCompleted,onClickRejected}) {
  const {user} = useUser();
  const [count, setcount] = useState(0);
  const [profileClick, setprofileClick] = useState(false);
  const navigate = useNavigate();
  // console.log(user);


  useEffect(() => {
      const fetchData = async()=>{
        try {
            const response = await api.get('/task/notification',{withCredentials:true});
            console.log(response.data.length);
            if(response.data){
                return setcount(response.data.length);
            }
        } catch (error) {
            console.log(error);
        }
      }
      fetchData();
    }, []);

    const handleProfileOption = ()=>{
      console.log("working");
      setprofileClick(prev =>!prev);
    }

    const handleLogout = async()=>{
    try {
      const res = await api.post("/auth/logout");
      console.log(res.data);
      alert(res.data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className='NavContainer'>
        <div className="nav-upper">
            <div className="h2_div">
              <h2>Employee Dashboard</h2>
            </div>
            <div className="right_content">
              <button className="img_div" style={{cursor:"pointer"}} onClick={handleProfileOption}>
                <img src="/employee.png" alt=""/>
              </button>
              {
                (profileClick ? <div className='Employee_profile'>
                  <button className="logout-btn" onClick={handleLogout} style={{marginBottom:"0"}}>Logout</button>
                </div>:"")
              }
              <div className="img_div_name_content">
                <h4>{user? String(user.name.toUpperCase()) : "guest"}</h4>
                
              </div>
              <div style={{width:"1px",border:"px solid white",height:"45px"}}></div>
              <div className="fa-solid fa-bell notification" to={"/employee/notification"} onClick={onClickNotification}>
                <div className="noti_counter">
                  {count}
                </div>
              </div>
            </div>
            
        </div>

        <div className="nav-menus">
          <div className="menu-options">
            <button onClick={onClickActive}>Dashboard</button>
            <button onClick={onClickCompleted}>Completed Project</button>
            <button onClick={onClickRejected}>Rejected Project</button>
          </div>
        </div>
    </div>
  )
}

export default NavbarEmployee