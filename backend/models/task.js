const mongoose = require('mongoose');
const User = require("../models/user");
const Employee = require("../models/employee");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }, 
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  
  status: {
        type: String, 
        enum: [ 'active', 'completed', 'overdue'],
        default: 'active'
    },
  isRead: {
    type: Boolean,
    default: false,
  },
  date: { 
        type: Date, 
        default: Date.now
    },
});

module.exports= mongoose.model('Task', taskSchema);
