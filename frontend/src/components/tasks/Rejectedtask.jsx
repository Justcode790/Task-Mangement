import React,{useState,useEffect} from 'react'
import { useNavigate,Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import api from '../../api';


function Rejectedtask() {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();
    const user = useUser();

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await api.get("/task/rejected",{withCredentials: true });
          if(!res.data){
            return setTasks([]);
          }
          let data = res.data.filter(task=>user.id===task.assignedTo);
          setTasks(data);
        } catch (err) {
           if(err.response?.status===401){
            navigate("/");
          }
          console.error(err);
        }
      // };
    }
    fetchData();
  }, []);




  return (
    <div>
       <div>
        <h3>Rejected Tasks</h3>
            {tasks.length === 0 ? (
                <p>No rejected tasks assigned to you</p>
            ) : (
                tasks.map((task) => <div key={task._id}>{task.title}</div>)
            )}
        </div>
    </div>
  )
}

export default Rejectedtask