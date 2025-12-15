const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    department: { type: String, required: true },
    password:{type:String,required:true},
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


module.exports  = mongoose.model("Employee", employeeSchema);
