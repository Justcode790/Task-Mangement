const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/user");
const Employee = require("./models/employee");
const Task = require("./models/task");

// ----------------------------------------
// 📌 Mongo Connection
// ----------------------------------------
mongoose
  .connect("mongodb+srv://justcode790:Ankit790@cluster0forproject1.iz7lot1.mongodb.net/taskmangement")
  .then(() => console.log("🌿 MongoDB Connected"))
  .catch((err) => console.log(err));

// ----------------------------------------
// 🔐 Common Password
// ----------------------------------------
const COMMON_PASSWORD = "123456";

async function seed() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Employee.deleteMany({});
    await Task.deleteMany({});

    console.log("🧹 Old data cleared.");

    const hashedPassword = await bcrypt.hash(COMMON_PASSWORD, 10);

    // ----------------------------------------
    // 👨‍💼 Create Admin (name = username)
    // ----------------------------------------
    const adminUsername = "ankit";

    const admin = await User.create({
      name: adminUsername,
      username: adminUsername,
      email: `${adminUsername}@gmail.com`,
      password: hashedPassword,
      role: "admin",
    });

    console.log("👨‍💼 Admin created:", admin.username);

    // ----------------------------------------
    // 👨‍🔧 Create Employees (name = username)
    // ----------------------------------------
    const employeeUsernames = ["amit01", "neha02", "rohit03", "pooja04"];

    let employeeIds = [];

    for (let username of employeeUsernames) {
      const emp = await Employee.create({
        name: username,
        username: username,
        email: `${username}@gmail.com`,
        department: "General",
        password: hashedPassword,
        createdBy: admin._id,
      });

      employeeIds.push(emp._id);
    }

    console.log("👨‍🔧 Employees created:", employeeIds.length);

    // Update admin with employees
    admin.employees = employeeIds;
    await admin.save();

    // ----------------------------------------
    // 📌 Create Tasks
    // ----------------------------------------
    const taskData = [
      {
        title: "Prepare Monthly Sales Report",
        description: "Prepare the report for the monthly sales statistics.",
        assignedTo: employeeIds[0],
      },
      {
        title: "Social Media Scheduling",
        description: "Schedule posts for next week's campaigns.",
        assignedTo: employeeIds[1],
      },
      {
        title: "Fix Login Bug",
        description: "Resolve the login authentication failure issue.",
        assignedTo: employeeIds[2],
      },
      {
        title: "Update Financial Ledger",
        description: "Update the company ledger entries for last quarter.",
        assignedTo: employeeIds[3],
      },
    ];

    let taskIds = [];

    for (let t of taskData) {
      const task = await Task.create({
        ...t,
        createdBy: admin._id,
      });

      // Add task to employee
      await Employee.findByIdAndUpdate(task.assignedTo, {
        $push: { tasks: task._id },
      });

      taskIds.push(task._id);
    }

    // Add tasks to admin
    admin.tasks = taskIds;
    await admin.save();

    console.log("📌 Tasks created:", taskIds.length);

    console.log("\n🎉 SEEDING COMPLETE!");
    process.exit();
    
  } catch (err) {
    console.error("❌ Error during seeding:", err);
    process.exit(1);
  }
}

seed();
