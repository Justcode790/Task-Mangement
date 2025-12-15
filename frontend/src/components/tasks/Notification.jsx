import React,{useState,useEffect} from 'react'
import "../Dashboard/employeeD.css"
import api from '../../api';
import { useUser } from "../../context/UserContext";

function Notification({setShownotification}) {
    const user = useUser();
    const [newtask, setnewtask] = useState([]);

    useEffect(() => {
      const fetchData = async()=>{
        try {
            const response = await api.get('/task/notification',{withCredentials:true});
            console.log(response.data);
            if(response.data){
                return setnewtask(response.data);
            }
        } catch (error) {
            console.log(error);
        }
      }
      fetchData();
    }, [])
    

    const handleStatusChange = async (id,status)=>{
        const response =await api.put(`/task/status/${id}`, {status: status}, {withCredentials:true});
        console.log(response.data);
        console.log(user);
        const updatedTask =newtask.filter(
            (task) => task._id !== id
        );
        setnewtask(updatedTask);
        
        
    }


  return (
    <div className='notification-popup'>
            
            <div className='notification-popup-header'>
                <h2>Notification</h2>
                <button onClick={()=>{setShownotification(false)}}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className='notification-popup-body'>

                {
                    newtask.length?
                    newtask.map((task,i)=>{
                    return (
                        <div className="notification-card" key={i}>
                        <div className="notification-content">
                            <h4>{task.title}</h4>
                            <p>{task.description || "Complete the sales report for Q3 and submit it by Friday."}</p>
                            <span className="date">Assigned on: {new Date(task.date).toString()}</span>
                        </div>
                        <span>
                             <button className='btn' style={{backgroundColor:"green"}}  onClick={()=>{handleStatusChange(task._id,"accept")}}>Accept</button>
                             <button className='btn' style={{backgroundColor:"red"}} onClick={()=>{handleStatusChange(task._id,"reject")}}>Reject</button>
                        </span>
                        </div>

                    )
                }) : <p>No Notification</p>
                }
            </div>
    </div>
  )
}

export default Notification