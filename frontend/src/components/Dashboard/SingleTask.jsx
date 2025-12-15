import React, { useState, useEffect } from 'react';
import { useParams,useNavigate,useLocation,Link } from 'react-router-dom';
import api from '../../api';
import './SingleTask.css';

function SingleTask() {
  const { id } = useParams();
  const [taskDetail, setTaskDetail] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();


 

  useEffect(() => {
    const showTask = async () => {
      try {
        const res = await api.get(`/task/${id}`);
        console.log(res.data);
        setTaskDetail(res.data);
      } catch (err) {
        console.error(err);
        alert("There is a problem in fetching task data.");
      }
    };
    showTask();
  }, [id]);


   const handleDelete = async() =>{
       try{

          if(taskDetail.status==="new"){
            const res = await api.delete(`/task/delete/${id}`);;
            console.log(res.data);
            navigate("/admin");
          }else{
            alert("its late! Now you cannot delete");
          }
       }catch(err){
        console.log(err);
        
       }
  }




  return (
    <div className="task-detail-container">
      {taskDetail ? (
        
        <div className="task-card-expanded">
          <span className={`task-status status-${taskDetail.status}`}>
              {taskDetail.status.toUpperCase()}
            </span>
          <h2 className="task-title">{taskDetail.title}</h2>
          <p className="task-desc">{taskDetail.description}</p>
          <p><strong>Assigned To:</strong> {taskDetail.assignedTo?.name || "N/A"}</p>
          <div className="status-container">
            
          </div>

          <button className='updateBtn' disabled={taskDetail?.status !== "active"}>
            <Link to={`/admin/task/${taskDetail._id}/update`}>Update</Link>
          </button>
          <button className='deleteBtn' onClick={handleDelete} disabled={taskDetail?.status !== "new"}>delete</button>
        </div>
      ) : (
        <p className="no-task-message">No such task detail available.</p>
      )}

    </div>
  );
}

export default SingleTask;
