// const mongoose = require("mongoose");
// const User = require('../models/user');
// const Task = require('../models/task');
// // import Task from '../models/task';

// main().then(console.log("connected to database"))
// .catch((err)=>{
//     console.log(err);
// })
// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/task_mangement');
// }

// const init = async ()=>{
//     // await User.deleteMany({});
//     const data1 = {
//         name:"anshu",
//         email:"an@gmail.com",
//         username:"a6",
//         role:"admin"
//     }
//     const data2 = {
//         name:"ankit",
//         email:"a@gmail.com",
//         username:"a7",
//         role:"employee"
//     }

//     const newUser1 = new User(data1);
//     const newUser2 = new User(data2);
//     await newUser1.save();
//     await newUser2.save();
//     const user = await User.find({});
//     console.log(user);

// }

// const inittask = async ()=>{
//     await Task.deleteMany({});
//     const data = {
//         title:"learn react",
//         description:"as soon as possible",
//         assignedTo:'6883ae007c02b1adc418a01f',
//         createdBy:'6883ae007c02b1adc418a01e',
//     }

//     const newUser = new Task(data);
//     await newUser.save();
//     const task = await Task.find({}).populate("assignedTo createdBy");
//     console.log(task);
// }

// // init();
// inittask();



// seedEmployee.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/task_mangement", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// -------------------- MODEL --------------------

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    department: { type: String, required: true },
    password: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    role: {
      type: String,
      enum: ["employee"],
      default: "employee",
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);

// -------------------- SAMPLE DATA --------------------

const sampleEmployees = [
  {
    name: "Anshu Kumar",
    email: "anshu@gmail.com",
    username: "anshu",
    department: "Frontend Development",
    password: "123",
    createdBy: "68fb1fe30b10ea4631027fa4",
    tasks: [],
  },
  {
    name: "Meera Sharma",
    email: "meera@example.com",
    username: "meerash",
    department: "Backend Development",
    password: "meera123",
    createdBy: "68fb1fe30b10ea4631027fa4",
    tasks: [],
  },
  {
    name: "Rohan Singh",
    email: "rohan@example.com",
    username: "rohan123",
    department: "UI/UX Design",
    password: "rohan123",
    createdBy: "68fb1fe30b10ea4631027fa4",
    tasks: [],
  },
  {
    name: "Sneha Patel",
    email: "sneha@example.com",
    username: "snehap",
    department: "Database Management",
    password: "sneha123",
    createdBy: "68fb1fe30b10ea4631027fa4",
    tasks: [],
  },
];

// -------------------- INSERT FUNCTION --------------------

const insertData = async () => {
  try {
    // ✅ Clear old data
    await Employee.deleteMany();

    // ✅ Hash all passwords before inserting
    const employeesWithHashedPasswords = await Promise.all(
      sampleEmployees.map(async (emp) => {
        const hashedPassword = await bcrypt.hash(emp.password, 10);
        return { ...emp, password: hashedPassword };
      })
    );

    // ✅ Insert hashed records
    const employees = await Employee.insertMany(employeesWithHashedPasswords);

    console.log("✅ Sample employees inserted successfully!");
    console.table(
      employees.map((e) => ({
        name: e.name,
        email: e.email,
        username: e.username,
        role: e.role,
      }))
    );
  } catch (err) {
    console.error("❌ Error inserting employees:", err);
  } finally {
    mongoose.connection.close();
  }
};

insertData();
