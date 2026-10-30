import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    credits: Number,
    semester: Number,
    instructor: String,
  },
  { timestamps: true }
);

export const Course =
  mongoose.models.Course || mongoose.model("Course", courseSchema);
