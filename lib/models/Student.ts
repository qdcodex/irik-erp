import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    rollNo: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: String,
    dob: Date,
    gender: String,
    course: String,
    semester: Number,
    address: String,
    enrollmentDate: Date,
  },
  { timestamps: true }
);

export const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);
