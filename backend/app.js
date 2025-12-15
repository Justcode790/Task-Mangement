const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const port = 8080;
const Task = require("./models/task");
const User = require("./models/user");
const Employee = require("./models/employee");
const AuthRoute = require("./routes/auth");
const {isLoggedIn,verifyJWT} = require("./middleware");

// const {isLoggedIn,verifyJWT} = require("./middleware");


app.use(cors());


app.use(express.json());
app.use(express.urlencoded({extended:true}));





main().then(()=>{
    console.log("connected to database")
}).catch((err)=>{
    console.log(err);
})
async function main() {
    await mongoose.connect('mongodb+srv://justcode790:Ankit790@cluster0forproject1.iz7lot1.mongodb.net/taskmangement');
}



app.use("/tm/auth",AuthRoute);

app.get("/tm/admin/task",async(req,res)=>{
    try{
        console.log(req.user);
        const sampleTasks = [
    {
      _id: "6719f92b21b9c45a6f2a1111",
      name: "Build Landing Page",
      employee: "Aarav",
      status: "ongoing",
      dueDate: "2025-10-30T00:00:00.000Z",
    },
    {
      _id: "6719f92b21b9c45a6f2a2222",
      name: "API Integration",
      employee: "Meera",
      status: "completed",
      dueDate: "2025-10-20T00:00:00.000Z",
    },
    {
      _id: "6719f92b21b9c45a6f2a3333",
      name: "Fix Login Bugs",
      employee: "Rohan",
      status: "rejected",
      dueDate: "2025-10-15T00:00:00.000Z",
    },
    {
      _id: "6719f92b21b9c45a6f2a4444",
      name: "UI Polish",
      employee: "Sneha",
      status: "ongoing",
      dueDate: "2025-11-01T00:00:00.000Z",
    },
  ];
        res.json(sampleTasks);

    }catch(e){
        res.json({message:e});
    }
})


app.get("/tm/selectEmployee",async(req,res)=>{
    try {
        const employees = await Employee.find({});
        res.json(employees);
    } catch (error) {
        res.status(500).json({message:"Unable to fetch employees"});
    }
})



app.get("/tm/admin/dashboard-stats", verifyJWT, async (req, res) => {
  try {
    const adminId = req.user.id;

    const totalProjects = await Task.countDocuments({
      createdBy: adminId,
    });

    const totalUsers = await Employee.countDocuments({
      createdBy: adminId,
    });

    const pendingTasks = await Task.countDocuments({
      createdBy: adminId,
      status: "active",
    });

    console.log(
      "dashboard stats:",
      totalProjects,
      totalUsers,
      pendingTasks
    );

    res.json({
      totalProjects,
      totalUsers,
      pendingTasks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



app.post("/tm/task",verifyJWT,async (req,res)=>{
    // console.log("User:",req.user);
    try {
        const { title, description, assignedTo, dueDate } = req.body;
        console.log("Request body from post request app.js:", req.body);
        
        // Use dueDate if provided, otherwise use current date
        const taskDate = dueDate ? new Date(dueDate) : new Date();
        
        const task = new Task({ 
            title, 
            description, 
            assignedTo, 
            createdBy: req.user._id,
            date: taskDate
        });
        
        await task.save();
        console.log("Task created:", task);
        res.status(201).json(task);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
})


app.get("/tm/admin/task/:id",verifyJWT, async (req, res) => {
    // console.log("egetting the task from app.js: ",req.params.id)
    const task = await Task.findById(req.params.id).populate("assignedTo");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
});


app.put("/tm/admin/task/:id", verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    console.log(req.body);

    const task = await Task.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    ).populate("assignedTo");

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "backend issue" });
  }
});


// employee notification section get request
app.get("/tm/task/notification", isLoggedIn, async (req, res) => {
  

    const tasks = await Task.find(
        {
            assignedTo: req.user._id,
            status: "new"
        }
    ).populate("createdBy assignedTo");

    console.log("👉 Tasks found:", tasks);

    res.json(tasks);
  
});







app.put("/tm/admin/task/:id",verifyJWT,async (req,res)=>{
    try{
        const {id} = req.params;
        const {title,description} = req.body;
        const task = await Task.findByIdAndUpdate(id, { title, description }, { new: true }).populate("assignedTo");
        res.status(200).json(task);
    }catch(err){
        res.json({message:"backend issue"})
    }
});

app.get("/tm/task",verifyJWT,async (req,res)=>{
    console.log(req.user);
    
   
    let filter = {};
    if (req.user.role === "admin") {
        filter = { createdBy: req.user.id };
    } else if (req.user.role === "employee") {
        filter = { assignedTo: req.user.id };
    }
    try{
        const tasks = await Task.find(filter).populate("createdBy assignedTo");
        // console.log(tasks);
        res.json(tasks);

    }catch(err){
        res.status(500).json({ message: "Server error" });
    }
});







app.get("/tm/admin/task/:id/update",isLoggedIn, async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


app.delete("/tm/admin/task/delete/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.assignedTo) {
      await Employee.findByIdAndUpdate(task.assignedTo, {
        $pull: { tasks: id },
      });
    }

    if (task.createdBy) {
      await User.findByIdAndUpdate(task.createdBy, {
        $pull: { tasks: id },
      });
    }

    await Task.findByIdAndDelete(id);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error in deletion" });
  }
});


// for employee status acceptance



app.put("/tm/task/status/:id",async(req,res)=>{
    try {
        console.log(req.user);
        const {id} = req.params;
        const {status} = req.body;
        const task = await Task.findByIdAndUpdate(id,{$set:{status}}, {new:true});
        res.json({message:"updated successfully"});
        
    } catch (error) {
        res.json(error);
    }
})


app.get("/",(req,res)=>{
    res.send("working");

})



app.use((err,req,res,next)=>{
    let {status = 500, message = "something went wrong"} = err;
    res.status(status).json(message);
});

app.listen(port,()=>{
    console.log(`app is listining on ${port}`);
})