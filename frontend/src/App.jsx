import { useState } from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import AdminRoutes from './components/Routes/AdminRoutes'
import EmployeeRoutes from './components/Routes/EmployeeRoutes'
// import Newtask from './components/Newtask'
import Signup from './components/Routes/Signup'
import Loginadmin from './components/Routes/Loginadmin'
import Forgetpassword from './components/Routes/Forgetpassword'
import Forgetpasswordadmin from './components/Routes/Forgetpasswordadmin'
import Newtask from './components/tasks/Newtask'
import Alltask from './components/tasks/Alltask'
import SingleTask from './components/Dashboard/singleTask'
import EditTask from './components/tasks/EditTask'
import Notification from './components/tasks/Notification'
import Rejectedtask from './components/tasks/Rejectedtask'
import LoginEmployee from './components/Routes/LoginEmployee'

function App() {

  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginEmployee />} />
      <Route path="/login-admin" element={<Loginadmin />} />
      <Route path="/forgot-password" element={<Forgetpassword/>} />
      <Route path="/forgot-password-admin" element={<Forgetpasswordadmin/>} />
      <Route path='/signup' element={<Signup/>}/>
      <Route path="/admin" element={<AdminRoutes />} >
        <Route path="newtask" element={<Newtask />} />
        <Route path="alltask" element={<Alltask />} />
        <Route path="task/:id" element={<SingleTask />} />
        <Route path="task/edit/:id" element={<EditTask />} />
        
      </Route>
      <Route path="/employee" element={<EmployeeRoutes />} >
        <Route path='newtask' />
        <Route path='notification' element ={<Notification/>} />
        <Route path='rejected' element ={<Rejectedtask/>} />
      
      </Route>

    </Routes>
  </BrowserRouter>

  )
}

export default App
