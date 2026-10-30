import { connectDB } from "@/lib/db";
import {
  User,
  Student,
  Course,
  Faculty,
  Enrollment,
  Fee,
  Admission,
  LibraryBook,
  Attendance,
  Timetable,
  HostelRoom,
  RoomAllocation,
} from "@/lib/models";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      Course.deleteMany({}),
      Faculty.deleteMany({}),
      Enrollment.deleteMany({}),
      Fee.deleteMany({}),
      Admission.deleteMany({}),
      LibraryBook.deleteMany({}),
      Attendance.deleteMany({}),
      Timetable.deleteMany({}),
      HostelRoom.deleteMany({}),
      RoomAllocation.deleteMany({}),
    ]);

    // Seed Users
    const users = await User.insertMany([
      {
        username: "admin",
        email: "admin@college.edu",
        password: "admin123",
        role: "admin",
        fullName: "System Administrator",
      },
      {
        username: "dr_amit",
        email: "amit@college.edu",
        password: "faculty123",
        role: "faculty",
        fullName: "Dr. Amit Patel",
      },
      {
        username: "dr_neha",
        email: "neha@college.edu",
        password: "faculty123",
        role: "faculty",
        fullName: "Dr. Neha Sharma",
      },
      {
        username: "rajesh",
        email: "rajesh@college.edu",
        password: "student123",
        role: "student",
        fullName: "Rajesh Kumar",
      },
      {
        username: "priya",
        email: "priya@college.edu",
        password: "student123",
        role: "student",
        fullName: "Priya Singh",
      },
      {
        username: "staff",
        email: "staff@college.edu",
        password: "staff123",
        role: "staff",
        fullName: "College Staff",
      },
    ]);

    // Seed Students
    const students = await Student.insertMany([
      {
        rollNo: "CS001",
        name: "Rajesh Kumar",
        email: "rajesh@college.edu",
        phone: "9876543210",
        dob: new Date("2003-05-15"),
        gender: "Male",
        course: "B.Tech CS",
        semester: 4,
        address: "123 Main St, City",
        enrollmentDate: new Date("2022-08-01"),
      },
      {
        rollNo: "CS002",
        name: "Priya Singh",
        email: "priya@college.edu",
        phone: "9876543211",
        dob: new Date("2003-08-20"),
        gender: "Female",
        course: "B.Tech CS",
        semester: 4,
        address: "456 Oak Ave, City",
        enrollmentDate: new Date("2022-08-01"),
      },
    ]);

    // Seed Courses
    const courses = await Course.insertMany([
      {
        code: "CS201",
        name: "Data Structures",
        credits: 4,
        semester: 3,
        instructor: "Dr. Amit Patel",
      },
      {
        code: "CS202",
        name: "Database Management",
        credits: 4,
        semester: 4,
        instructor: "Dr. Neha Sharma",
      },
      {
        code: "CS203",
        name: "Web Development",
        credits: 3,
        semester: 4,
        instructor: "Prof. John Doe",
      },
    ]);

    // Seed Faculty
    await Faculty.insertMany([
      {
        name: "Dr. Amit Patel",
        email: "amit@college.edu",
        phone: "9876543220",
        department: "Computer Science",
        qualification: "PhD",
        joiningDate: new Date("2015-07-01"),
      },
      {
        name: "Dr. Neha Sharma",
        email: "neha@college.edu",
        phone: "9876543221",
        department: "Computer Science",
        qualification: "PhD",
        joiningDate: new Date("2018-08-01"),
      },
    ]);

    // Seed Enrollments
    await Enrollment.insertMany([
      {
        studentId: students[0]._id,
        courseId: courses[1]._id,
        grade: "A",
        marks: 85,
        semester: 4,
      },
      {
        studentId: students[0]._id,
        courseId: courses[2]._id,
        grade: "B+",
        marks: 78,
        semester: 4,
      },
      {
        studentId: students[1]._id,
        courseId: courses[1]._id,
        grade: "A+",
        marks: 92,
        semester: 4,
      },
      {
        studentId: students[1]._id,
        courseId: courses[2]._id,
        grade: "A",
        marks: 88,
        semester: 4,
      },
    ]);

    // Seed Fees
    await Fee.insertMany([
      {
        studentId: students[0]._id,
        amount: 100000,
        feeType: "Tuition",
        dueDate: new Date("2024-09-01"),
        paidDate: new Date("2024-08-25"),
        status: "paid",
        semester: 4,
      },
      {
        studentId: students[1]._id,
        amount: 100000,
        feeType: "Tuition",
        dueDate: new Date("2024-09-01"),
        status: "pending",
        semester: 4,
      },
    ]);

    // Seed Library Books
    const books = await LibraryBook.insertMany([
      {
        isbn: "978-0134685991",
        title: "Effective Java",
        author: "Joshua Bloch",
        category: "Programming",
        totalCopies: 5,
        availableCopies: 3,
        publicationYear: 2018,
      },
      {
        isbn: "978-0596007126",
        title: "Head First Design Patterns",
        author: "Freeman & Freeman",
        category: "Design Patterns",
        totalCopies: 4,
        availableCopies: 2,
        publicationYear: 2004,
      },
    ]);

    // Seed Attendance
    await Attendance.insertMany([
      {
        studentId: students[0]._id,
        courseId: courses[1]._id,
        date: new Date("2024-08-10"),
        status: "present",
        semester: 4,
      },
      {
        studentId: students[1]._id,
        courseId: courses[1]._id,
        date: new Date("2024-08-10"),
        status: "present",
        semester: 4,
      },
    ]);

    // Seed Timetables
    await Timetable.insertMany([
      {
        courseId: courses[1]._id,
        dayOfWeek: "Monday",
        startTime: "09:00",
        endTime: "10:30",
        classroom: "A101",
        instructor: "Dr. Neha Sharma",
        semester: 4,
      },
      {
        courseId: courses[2]._id,
        dayOfWeek: "Tuesday",
        startTime: "10:45",
        endTime: "12:15",
        classroom: "B205",
        instructor: "Prof. John Doe",
        semester: 4,
      },
    ]);

    // Seed Hostel Rooms
    const rooms = await HostelRoom.insertMany([
      {
        roomNumber: "101",
        capacity: 2,
        occupancy: 2,
        type: "double",
        floorNumber: 1,
        charges: 50000,
      },
      {
        roomNumber: "102",
        capacity: 2,
        occupancy: 1,
        type: "double",
        floorNumber: 1,
        charges: 50000,
      },
    ]);

    // Seed Room Allocations
    await RoomAllocation.insertMany([
      {
        roomId: rooms[0]._id,
        studentId: students[0]._id,
        allocationDate: new Date("2024-08-01"),
        status: "active",
        semester: 4,
      },
      {
        roomId: rooms[1]._id,
        studentId: students[1]._id,
        allocationDate: new Date("2024-08-01"),
        status: "active",
        semester: 4,
      },
    ]);

    // Seed Admissions
    await Admission.insertMany([
      {
        applicantName: "Vikram Singh",
        email: "vikram.app@email.com",
        phone: "9999888877",
        appliedCourse: "B.Tech CS",
        appliedDate: new Date("2024-06-15"),
        status: "pending",
        marks: 85,
      },
      {
        applicantName: "Sneha Gupta",
        email: "sneha.app@email.com",
        phone: "9999888878",
        appliedCourse: "B.Tech CS",
        appliedDate: new Date("2024-06-10"),
        status: "approved",
        marks: 92,
      },
    ]);

    return NextResponse.json(
      { message: "Database initialized successfully with sample data" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database initialization error:", error);
    return NextResponse.json(
      { error: "Failed to initialize database" },
      { status: 500 }
    );
  }
}
