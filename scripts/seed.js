const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
}

// Model Schemas
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "faculty", "student", "staff", "parent"], default: "student" },
    fullName: { type: String, required: true },
    avatar: String,
  },
  { timestamps: true }
);

const studentSchema = new mongoose.Schema(
  {
    rollNo: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
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

const courseSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    credits: Number,
    semester: Number,
    instructor: String,
  },
  { timestamps: true }
);

const facultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    department: String,
    qualification: String,
    joiningDate: Date,
  },
  { timestamps: true }
);

const enrollmentSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    grade: String,
    marks: Number,
    semester: Number,
  },
  { timestamps: true }
);

const feeSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    amount: Number,
    feeType: String,
    dueDate: Date,
    paidDate: Date,
    status: { type: String, enum: ["pending", "paid", "overdue"], default: "pending" },
    semester: Number,
  },
  { timestamps: true }
);

const admissionSchema = new mongoose.Schema(
  {
    applicantName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    appliedCourse: String,
    appliedDate: Date,
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    marks: Number,
  },
  { timestamps: true }
);

const libraryBookSchema = new mongoose.Schema(
  {
    isbn: String,
    title: { type: String, required: true },
    author: String,
    category: String,
    totalCopies: Number,
    availableCopies: Number,
    publicationYear: Number,
  },
  { timestamps: true }
);

const bookIssueSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "LibraryBook" },
    issueDate: Date,
    returnDate: Date,
    dueDate: Date,
    status: { type: String, enum: ["issued", "returned", "overdue"], default: "issued" },
  },
  { timestamps: true }
);

const attendanceSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    date: Date,
    status: { type: String, enum: ["present", "absent", "late"] },
    semester: Number,
  },
  { timestamps: true }
);

const timetableSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    dayOfWeek: String,
    startTime: String,
    endTime: String,
    classroom: String,
    instructor: String,
    semester: Number,
  },
  { timestamps: true }
);

const hostelRoomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    capacity: Number,
    occupancy: Number,
    type: { type: String, enum: ["single", "double", "triple"] },
    floorNumber: Number,
    charges: Number,
  },
  { timestamps: true }
);

const roomAllocationSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "HostelRoom" },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    allocationDate: Date,
    releaseDate: Date,
    status: { type: String, enum: ["active", "released"], default: "active" },
    semester: Number,
  },
  { timestamps: true }
);

const assetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["aircraft", "simulator", "equipment", "facility"], required: true },
    registrationNumber: { type: String, required: true, unique: true },
    status: { type: String, enum: ["active", "maintenance", "grounded", "retired"], default: "active" },
    totalHours: { type: Number, default: 0 },
    lastMaintenanceDate: Date,
    nextMaintenanceDue: Date,
    dgcaComplianceStatus: { type: String, enum: ["compliant", "inspection_due", "non_compliant"], default: "compliant" },
  },
  { timestamps: true }
);

const financeTransactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["income", "expense"], required: true },
    category: String,
    amount: Number,
    date: Date,
    description: String,
    paymentMethod: { type: String, enum: ["bank_transfer", "upi", "cheque", "cash"] },
    department: String,
  },
  { timestamps: true }
);

const budgetSchema = new mongoose.Schema(
  {
    department: String,
    allocatedAmount: Number,
    spentAmount: Number,
    fiscalYear: String,
  },
  { timestamps: true }
);

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["class_reminder", "fee_alert", "attendance_alert", "timetable_change", "exam_result", "admission_status"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    channels: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
    },
    status: {
      inApp: { type: String, enum: ["pending", "sent", "read", "failed"], default: "sent" },
      email: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
      sms: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
      push: { type: String, enum: ["pending", "sent", "failed"], default: "sent" },
    },
    sentAt: Date,
  },
  { timestamps: true }
);

const alumniSchema = new mongoose.Schema(
  {
    name: String,
    rollNo: String,
    course: String,
    graduationYear: Number,
    currentCompany: String,
    designation: String,
    location: String,
    referralOptIn: Boolean,
    email: String,
    phone: String,
  },
  { timestamps: true }
);

const visitorLogSchema = new mongoose.Schema(
  {
    visitorName: String,
    phone: String,
    purpose: String,
    hostStaffName: String,
    areaAccessed: { type: String, enum: ["General Campus", "Flight Hangar", "Apron Zone", "Simulator Complex", "Admin Office"] },
    entryTime: Date,
    exitTime: Date,
    badgeNumber: String,
    status: { type: String, enum: ["inside", "checked_out"], default: "inside" },
  },
  { timestamps: true }
);

const auditLogSchema = new mongoose.Schema(
  {
    timestamp: Date,
    user: String,
    action: String,
    module: String,
    details: String,
  },
  { timestamps: true }
);

// Models
const User = mongoose.models.User || mongoose.model("User", userSchema);
const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);
const Faculty = mongoose.models.Faculty || mongoose.model("Faculty", facultySchema);
const Enrollment = mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);
const Fee = mongoose.models.Fee || mongoose.model("Fee", feeSchema);
const Admission = mongoose.models.Admission || mongoose.model("Admission", admissionSchema);
const LibraryBook = mongoose.models.LibraryBook || mongoose.model("LibraryBook", libraryBookSchema);
const BookIssue = mongoose.models.BookIssue || mongoose.model("BookIssue", bookIssueSchema);
const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
const Timetable = mongoose.models.Timetable || mongoose.model("Timetable", timetableSchema);
const HostelRoom = mongoose.models.HostelRoom || mongoose.model("HostelRoom", hostelRoomSchema);
const RoomAllocation = mongoose.models.RoomAllocation || mongoose.model("RoomAllocation", roomAllocationSchema);
const Asset = mongoose.models.Asset || mongoose.model("Asset", assetSchema);
const FinanceTransaction = mongoose.models.FinanceTransaction || mongoose.model("FinanceTransaction", financeTransactionSchema);
const Budget = mongoose.models.Budget || mongoose.model("Budget", budgetSchema);
const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
const Alumni = mongoose.models.Alumni || mongoose.model("Alumni", alumniSchema);
const VisitorLog = mongoose.models.VisitorLog || mongoose.model("VisitorLog", visitorLogSchema);
const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set in environment");
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected successfully!");

  console.log("Clearing previous sample collections...");
  await Promise.all([
    User.deleteMany({}),
    Student.deleteMany({}),
    Course.deleteMany({}),
    Faculty.deleteMany({}),
    Enrollment.deleteMany({}),
    Fee.deleteMany({}),
    Admission.deleteMany({}),
    LibraryBook.deleteMany({}),
    BookIssue.deleteMany({}),
    Attendance.deleteMany({}),
    Timetable.deleteMany({}),
    HostelRoom.deleteMany({}),
    RoomAllocation.deleteMany({}),
    Asset.deleteMany({}),
    FinanceTransaction.deleteMany({}),
    Budget.deleteMany({}),
    Notification.deleteMany({}),
    Alumni.deleteMany({}),
    VisitorLog.deleteMany({}),
    AuditLog.deleteMany({}),
  ]);

  const adminEmail = process.env.ADMIN_EMAIL || "irikinternationalacademy@gmail.com";

  // 1. Users
  console.log("Seeding Users...");
  const users = await User.insertMany([
    {
      username: "admin",
      email: adminEmail,
      password: "admin123",
      role: "admin",
      fullName: "IRIK Administrator",
    },
    {
      username: "capt_vikram",
      email: "vikram.malhotra@irik.edu",
      password: "faculty123",
      role: "faculty",
      fullName: "Capt. Vikram Malhotra",
    },
    {
      username: "dr_amit",
      email: "amit.patel@irik.edu",
      password: "faculty123",
      role: "faculty",
      fullName: "Dr. Amit Patel",
    },
    {
      username: "ms_kavya",
      email: "kavya.shah@irik.edu",
      password: "faculty123",
      role: "faculty",
      fullName: "Ms. Kavya Shah",
    },
    {
      username: "dr_neha",
      email: "neha.sharma@irik.edu",
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
      username: "rohan",
      email: "rohan.varma@college.edu",
      password: "student123",
      role: "student",
      fullName: "Rohan Varma",
    },
    {
      username: "staff",
      email: "staff@college.edu",
      password: "staff123",
      role: "staff",
      fullName: "IRIK Operations Staff",
    },
    {
      username: "parent",
      email: "parent.kumar@gmail.com",
      password: "parent123",
      role: "parent",
      fullName: "Mr. Suresh Kumar (Parent)",
    },
  ]);

  // 2. Students
  console.log("Seeding Students...");
  const students = await Student.insertMany([
    {
      rollNo: "AVN-2026-001",
      name: "Rajesh Kumar",
      email: "rajesh@college.edu",
      phone: "+91 9876543210",
      dob: new Date("2003-05-15"),
      gender: "Male",
      course: "BBA Aviation",
      semester: 4,
      address: "123 Main St, City",
      enrollmentDate: new Date("2024-08-01"),
    },
    {
      rollNo: "AVN-2026-002",
      name: "Priya Singh",
      email: "priya@college.edu",
      phone: "+91 9876543211",
      dob: new Date("2003-08-20"),
      gender: "Female",
      course: "BBA Aviation",
      semester: 4,
      address: "456 Oak Ave, City",
      enrollmentDate: new Date("2024-08-01"),
    },
    {
      rollNo: "PLT-2026-003",
      name: "Rohan Varma",
      email: "rohan.varma@college.edu",
      phone: "+91 9876543212",
      dob: new Date("2002-11-12"),
      gender: "Male",
      course: "Pilot Training",
      semester: 2,
      address: "Aero Enclave 402, Mumbai",
      enrollmentDate: new Date("2025-01-10"),
    },
    {
      rollNo: "CC-2026-004",
      name: "Ananya Deshmukh",
      email: "ananya.d@college.edu",
      phone: "+91 9876543213",
      dob: new Date("2004-03-25"),
      gender: "Female",
      course: "Cabin Crew",
      semester: 1,
      address: "Skyview Heights, Bangalore",
      enrollmentDate: new Date("2025-07-15"),
    },
    {
      rollNo: "AVN-2026-005",
      name: "Aman Kapoor",
      email: "aman.kapoor@college.edu",
      phone: "+91 9876543214",
      dob: new Date("2003-09-08"),
      gender: "Male",
      course: "BBA Aviation",
      semester: 4,
      address: "78 Runway Rd, Delhi",
      enrollmentDate: new Date("2024-08-01"),
    },
    {
      rollNo: "PLT-2026-006",
      name: "Tanvi Saxena",
      email: "tanvi.saxena@college.edu",
      phone: "+91 9876543215",
      dob: new Date("2003-01-30"),
      gender: "Female",
      course: "Pilot Training",
      semester: 2,
      address: "Wing Tower, Hyderabad",
      enrollmentDate: new Date("2025-01-10"),
    },
  ]);

  // 3. Courses
  console.log("Seeding Courses...");
  const courses = await Course.insertMany([
    {
      code: "BBA-AVN",
      name: "BBA Aviation",
      credits: 12,
      semester: 1,
      instructor: "Aviation Department",
    },
    {
      code: "BBA-MGMT",
      name: "Aviation Management",
      credits: 4,
      semester: 2,
      instructor: "Prof. Rajesh Kumar",
    },
    {
      code: "BBA-OPER",
      name: "Airport Operations",
      credits: 4,
      semester: 3,
      instructor: "Dr. Amit Patel",
    },
    {
      code: "BSC-AVN",
      name: "BSc Aviation",
      credits: 12,
      semester: 1,
      instructor: "Aviation Department",
    },
    {
      code: "BSC-TECH",
      name: "Aviation Technology",
      credits: 4,
      semester: 2,
      instructor: "Dr. Neha Sharma",
    },
    {
      code: "PILOT-1",
      name: "Commercial Pilot Training",
      credits: 18,
      semester: 1,
      instructor: "Capt. Vikram Malhotra",
    },
    {
      code: "CC-TRAIN",
      name: "Cabin Crew & In-Flight Safety",
      credits: 3,
      semester: 1,
      instructor: "Ms. Kavya Shah",
    },
    {
      code: "DIP-AI-AVN",
      name: "AI in Aviation Operations",
      credits: 3,
      semester: 1,
      instructor: "Dr. Raj Singh",
    },
  ]);

  // 4. Faculty
  console.log("Seeding Faculty...");
  const faculties = await Faculty.insertMany([
    {
      name: "Capt. Vikram Malhotra",
      email: "vikram.malhotra@irik.edu",
      phone: "+91 98450 44211",
      department: "Flight Operations & Training",
      qualification: "ATPL / DGCA Chief Flight Instructor (CFI)",
      joiningDate: new Date("2018-04-10"),
    },
    {
      name: "Dr. Amit Patel",
      email: "amit.patel@irik.edu",
      phone: "+91 98765 43220",
      department: "Aviation Management",
      qualification: "Ph.D. in Air Transport Economics & IATA Fellow",
      joiningDate: new Date("2015-07-01"),
    },
    {
      name: "Ms. Kavya Shah",
      email: "kavya.shah@irik.edu",
      phone: "+91 98112 55667",
      department: "Cabin Safety & In-Flight Services",
      qualification: "Ex-Senior Purser & Lead DGCA Cabin Safety Auditor",
      joiningDate: new Date("2020-01-15"),
    },
    {
      name: "Dr. Neha Sharma",
      email: "neha.sharma@irik.edu",
      phone: "+91 98765 43221",
      department: "Aeronautics & Avionics",
      qualification: "Ph.D. in Aerospace Engineering (IIT Bombay)",
      joiningDate: new Date("2018-08-01"),
    },
    {
      name: "Prof. Rajesh Kumar",
      email: "rajesh.kumar@irik.edu",
      phone: "+91 98401 77889",
      department: "Air Traffic Management & Law",
      qualification: "M.Tech in Airspace Navigation & ICAO Air Law",
      joiningDate: new Date("2016-11-20"),
    },
  ]);

  // 5. Enrollments
  console.log("Seeding Enrollments...");
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
    {
      studentId: students[2]._id,
      courseId: courses[5]._id,
      grade: "A",
      marks: 90,
      semester: 2,
    },
    {
      studentId: students[3]._id,
      courseId: courses[6]._id,
      grade: "A+",
      marks: 95,
      semester: 1,
    },
  ]);

  // 6. Fees
  console.log("Seeding Fees...");
  await Fee.insertMany([
    {
      studentId: students[0]._id,
      amount: 125000,
      feeType: "Tuition",
      dueDate: new Date("2026-09-01"),
      paidDate: new Date("2026-08-25"),
      status: "paid",
      semester: 4,
    },
    {
      studentId: students[1]._id,
      amount: 125000,
      feeType: "Tuition",
      dueDate: new Date("2026-09-01"),
      status: "pending",
      semester: 4,
    },
    {
      studentId: students[2]._id,
      amount: 450000,
      feeType: "Flight Training Fee",
      dueDate: new Date("2026-10-15"),
      paidDate: new Date("2026-10-01"),
      status: "paid",
      semester: 2,
    },
    {
      studentId: students[3]._id,
      amount: 85000,
      feeType: "Uniform & Grooming Kit",
      dueDate: new Date("2026-09-10"),
      paidDate: new Date("2026-09-05"),
      status: "paid",
      semester: 1,
    },
    {
      studentId: students[4]._id,
      amount: 125000,
      feeType: "Tuition",
      dueDate: new Date("2026-08-15"),
      status: "overdue",
      semester: 4,
    },
  ]);

  // 7. Admissions
  console.log("Seeding Admissions...");
  await Admission.insertMany([
    {
      applicantName: "Rohan Varma",
      email: "rohan.varma@gmail.com",
      phone: "+91 98450 12345",
      appliedCourse: "Commercial Pilot License (CPL)",
      appliedDate: new Date("2026-08-20"),
      status: "approved",
      marks: 88,
    },
    {
      applicantName: "Ananya Deshmukh",
      email: "ananya.d@gmail.com",
      phone: "+91 98765 99881",
      appliedCourse: "Cabin Crew Training",
      appliedDate: new Date("2026-08-22"),
      status: "approved",
      marks: 92,
    },
    {
      applicantName: "Karan Johar Patel",
      email: "karan.patel@outlook.com",
      phone: "+91 97123 45678",
      appliedCourse: "Commercial Pilot License (CPL)",
      appliedDate: new Date("2026-08-24"),
      status: "pending",
      marks: 79,
    },
    {
      applicantName: "Divya Nambiar",
      email: "divya.nambiar@yahoo.com",
      phone: "+91 99887 76655",
      appliedCourse: "BBA Aviation",
      appliedDate: new Date("2026-08-25"),
      status: "pending",
      marks: 84,
    },
  ]);

  // 8. Library Books
  console.log("Seeding Library Books...");
  const books = await LibraryBook.insertMany([
    {
      isbn: "978-0071793865",
      title: "Stick and Rudder: An Explanation of the Art of Flying",
      author: "Wolfgang Langewiesche",
      category: "Aviation & Flight Training",
      totalCopies: 8,
      availableCopies: 6,
      publicationYear: 1990,
    },
    {
      isbn: "978-0134685991",
      title: "Airport Systems: Planning, Design and Management",
      author: "Richard de Neufville & Amedeo Odoni",
      category: "Aviation Management",
      totalCopies: 5,
      availableCopies: 3,
      publicationYear: 2013,
    },
    {
      isbn: "978-0596007126",
      title: "Aviation Weather and Weather Services Handbook",
      author: "Federal Aviation Administration (FAA)",
      category: "Meteorology",
      totalCopies: 6,
      availableCopies: 4,
      publicationYear: 2020,
    },
    {
      isbn: "978-0201633610",
      title: "Air Transportation: A Management Perspective",
      author: "John Wensveen",
      category: "Air Transport",
      totalCopies: 4,
      availableCopies: 2,
      publicationYear: 2018,
    },
  ]);

  // 9. Book Issues
  console.log("Seeding Book Issues...");
  await BookIssue.insertMany([
    {
      studentId: students[0]._id,
      bookId: books[0]._id,
      issueDate: new Date("2026-08-05"),
      dueDate: new Date("2026-08-19"),
      status: "issued",
    },
    {
      studentId: students[1]._id,
      bookId: books[1]._id,
      issueDate: new Date("2026-08-10"),
      dueDate: new Date("2026-08-24"),
      status: "issued",
    },
    {
      studentId: students[2]._id,
      bookId: books[2]._id,
      issueDate: new Date("2026-07-15"),
      returnDate: new Date("2026-07-28"),
      dueDate: new Date("2026-07-29"),
      status: "returned",
    },
  ]);

  // 10. Attendance
  console.log("Seeding Attendance...");
  await Attendance.insertMany([
    {
      studentId: students[0]._id,
      courseId: courses[1]._id,
      date: new Date("2026-08-10"),
      status: "present",
      semester: 4,
    },
    {
      studentId: students[1]._id,
      courseId: courses[1]._id,
      date: new Date("2026-08-10"),
      status: "present",
      semester: 4,
    },
    {
      studentId: students[2]._id,
      courseId: courses[5]._id,
      date: new Date("2026-08-10"),
      status: "present",
      semester: 2,
    },
    {
      studentId: students[3]._id,
      courseId: courses[6]._id,
      date: new Date("2026-08-10"),
      status: "present",
      semester: 1,
    },
    {
      studentId: students[4]._id,
      courseId: courses[1]._id,
      date: new Date("2026-08-10"),
      status: "absent",
      semester: 4,
    },
  ]);

  // 11. Timetables
  console.log("Seeding Timetables...");
  await Timetable.insertMany([
    {
      courseId: courses[1]._id,
      dayOfWeek: "Monday",
      startTime: "09:00",
      endTime: "10:30",
      classroom: "Aero Hall 101",
      instructor: "Prof. Rajesh Kumar",
      semester: 2,
    },
    {
      courseId: courses[2]._id,
      dayOfWeek: "Tuesday",
      startTime: "10:45",
      endTime: "12:15",
      classroom: "Aero Hall 102",
      instructor: "Dr. Amit Patel",
      semester: 3,
    },
    {
      courseId: courses[5]._id,
      dayOfWeek: "Wednesday",
      startTime: "08:00",
      endTime: "11:00",
      classroom: "SIM-Bay 01 (Redbird FMX)",
      instructor: "Capt. Vikram Malhotra",
      semester: 1,
    },
    {
      courseId: courses[6]._id,
      dayOfWeek: "Thursday",
      startTime: "11:30",
      endTime: "13:00",
      classroom: "Cabin Mockup Bay A",
      instructor: "Ms. Kavya Shah",
      semester: 1,
    },
  ]);

  // 12. Hostel Rooms
  console.log("Seeding Hostel Rooms...");
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
    {
      roomNumber: "201",
      capacity: 3,
      occupancy: 2,
      type: "triple",
      floorNumber: 2,
      charges: 60000,
    },
    {
      roomNumber: "301",
      capacity: 1,
      occupancy: 1,
      type: "single",
      floorNumber: 3,
      charges: 75000,
    },
  ]);

  // 13. Room Allocations
  console.log("Seeding Room Allocations...");
  await RoomAllocation.insertMany([
    {
      roomId: rooms[0]._id,
      studentId: students[0]._id,
      allocationDate: new Date("2026-08-01"),
      status: "active",
      semester: 4,
    },
    {
      roomId: rooms[0]._id,
      studentId: students[4]._id,
      allocationDate: new Date("2026-08-01"),
      status: "active",
      semester: 4,
    },
    {
      roomId: rooms[1]._id,
      studentId: students[1]._id,
      allocationDate: new Date("2026-08-01"),
      status: "active",
      semester: 4,
    },
    {
      roomId: rooms[2]._id,
      studentId: students[2]._id,
      allocationDate: new Date("2026-08-01"),
      status: "active",
      semester: 2,
    },
  ]);

  // 14. Assets (Aircraft & Simulators)
  console.log("Seeding Assets...");
  await Asset.insertMany([
    {
      name: "Cessna 172 Skyhawk",
      type: "aircraft",
      registrationNumber: "VT-IRK",
      status: "active",
      totalHours: 1420,
      lastMaintenanceDate: new Date("2026-07-20"),
      nextMaintenanceDue: new Date("2026-09-20"),
      dgcaComplianceStatus: "compliant",
    },
    {
      name: "Piper PA-28 Archer",
      type: "aircraft",
      registrationNumber: "VT-IRA",
      status: "active",
      totalHours: 980,
      lastMaintenanceDate: new Date("2026-08-01"),
      nextMaintenanceDue: new Date("2026-10-01"),
      dgcaComplianceStatus: "compliant",
    },
    {
      name: "Redbird FMX Multi-Engine Simulator",
      type: "simulator",
      registrationNumber: "SIM-01",
      status: "active",
      totalHours: 2840,
      lastMaintenanceDate: new Date("2026-07-15"),
      nextMaintenanceDue: new Date("2026-09-15"),
      dgcaComplianceStatus: "compliant",
    },
    {
      name: "ALSIM ALX FNPT II Simulator",
      type: "simulator",
      registrationNumber: "SIM-02",
      status: "maintenance",
      totalHours: 3120,
      lastMaintenanceDate: new Date("2026-06-10"),
      nextMaintenanceDue: new Date("2026-08-30"),
      dgcaComplianceStatus: "inspection_due",
    },
  ]);

  // 15. Finance Transactions & Budgets
  console.log("Seeding Finance...");
  await FinanceTransaction.insertMany([
    {
      type: "income",
      category: "Tuition Fees",
      amount: 1850000,
      date: new Date("2026-08-10"),
      description: "Term 1 Tuition Fee Collection Batch 2026",
      paymentMethod: "bank_transfer",
      department: "Academic",
    },
    {
      type: "income",
      category: "Simulator Training Fees",
      amount: 420000,
      date: new Date("2026-08-12"),
      description: "Multi-Engine Simulator Slot Bookings",
      paymentMethod: "upi",
      department: "Flight Operations",
    },
    {
      type: "expense",
      category: "Aviation Fuel",
      amount: 680000,
      date: new Date("2026-08-14"),
      description: "Avgas 100LL Bulk Refueling for Cessna & Piper Fleet",
      paymentMethod: "bank_transfer",
      department: "Flight Operations",
    },
    {
      type: "expense",
      category: "Aircraft Maintenance",
      amount: 215000,
      date: new Date("2026-08-18"),
      description: "DGCA 100-Hour Mandatory Airframe & Avionics Inspection",
      paymentMethod: "bank_transfer",
      department: "Maintenance",
    },
    {
      type: "expense",
      category: "Staff Payroll",
      amount: 850000,
      date: new Date("2026-08-01"),
      description: "Monthly Faculty & Operations Staff Salaries",
      paymentMethod: "bank_transfer",
      department: "Administration",
    },
  ]);

  await Budget.insertMany([
    {
      department: "Flight Training Operations",
      allocatedAmount: 4500000,
      spentAmount: 2850000,
      fiscalYear: "2026-2027",
    },
    {
      department: "Simulator Complex",
      allocatedAmount: 2000000,
      spentAmount: 1120000,
      fiscalYear: "2026-2027",
    },
    {
      department: "Academic & LMS",
      allocatedAmount: 1500000,
      spentAmount: 840000,
      fiscalYear: "2026-2027",
    },
    {
      department: "Maintenance & Compliance",
      allocatedAmount: 2500000,
      spentAmount: 1450000,
      fiscalYear: "2026-2027",
    },
  ]);

  // 16. Notifications
  console.log("Seeding Notifications...");
  await Notification.insertMany([
    {
      userId: users[0]._id, // Admin
      type: "admission_status",
      title: "New Admission Application Received",
      message: "Applicant Rohan Varma submitted CPL ground application.",
      channels: { inApp: true, email: true, sms: false, push: true },
      status: { inApp: "sent", email: "sent", sms: "pending", push: "sent" },
      sentAt: new Date("2026-08-20T10:00:00Z"),
    },
    {
      userId: users[5]._id, // Rajesh
      type: "class_reminder",
      title: "Airport Operations Lecture Tomorrow",
      message: "Class scheduled at 09:00 AM in Aero Hall 101 with Prof. Rajesh Kumar.",
      channels: { inApp: true, email: false, sms: false, push: true },
      status: { inApp: "sent", email: "pending", sms: "pending", push: "sent" },
      sentAt: new Date("2026-08-21T18:00:00Z"),
    },
    {
      userId: users[6]._id, // Priya
      type: "fee_alert",
      title: "Tuition Fee Due Reminder",
      message: "Semester 4 tuition fee of Rs 1,25,000 is due by 01 September 2026.",
      channels: { inApp: true, email: true, sms: true, push: true },
      status: { inApp: "sent", email: "sent", sms: "sent", push: "sent" },
      sentAt: new Date("2026-08-22T09:30:00Z"),
    },
  ]);

  // 17. Alumni
  console.log("Seeding Alumni...");
  await Alumni.insertMany([
    {
      name: "Siddharth Mehra",
      rollNo: "PLT-2023-012",
      course: "Commercial Pilot License",
      graduationYear: 2024,
      currentCompany: "IndiGo Airlines",
      designation: "First Officer (A320)",
      location: "New Delhi",
      referralOptIn: true,
      email: "siddharth.m@alumni.irik.edu",
      phone: "+91 98111 22334",
    },
    {
      name: "Zara Qureshi",
      rollNo: "CC-2024-008",
      course: "Cabin Crew & Safety",
      graduationYear: 2025,
      currentCompany: "Air India",
      designation: "Senior Cabin Crew (B777/B787)",
      location: "Mumbai",
      referralOptIn: true,
      email: "zara.q@alumni.irik.edu",
      phone: "+91 98222 33445",
    },
    {
      name: "Kunal Shah",
      rollNo: "AVN-2022-045",
      course: "BBA Aviation",
      graduationYear: 2025,
      currentCompany: "GMR Hyderabad International Airport",
      designation: "Airside Operations Officer",
      location: "Hyderabad",
      referralOptIn: true,
      email: "kunal.shah@alumni.irik.edu",
      phone: "+91 98333 44556",
    },
  ]);

  // 18. Visitor Logs
  console.log("Seeding Visitor Logs...");
  await VisitorLog.insertMany([
    {
      visitorName: "Sunil Grover",
      phone: "+91 98991 12233",
      purpose: "DGCA Audit & Safety Check",
      hostStaffName: "Capt. Vikram Malhotra",
      areaAccessed: "Flight Hangar",
      entryTime: new Date("2026-08-28T09:15:00Z"),
      exitTime: new Date("2026-08-28T14:30:00Z"),
      badgeNumber: "VIS-DGCA-01",
      status: "checked_out",
    },
    {
      visitorName: "Meenakshi Sundaram",
      phone: "+91 98770 09988",
      purpose: "Campus Tour & CPL Admission Counseling",
      hostStaffName: "Dr. Amit Patel",
      areaAccessed: "Admin Office",
      entryTime: new Date("2026-08-29T11:00:00Z"),
      badgeNumber: "VIS-ADM-04",
      status: "inside",
    },
  ]);

  // 19. Audit Logs
  console.log("Seeding Audit Logs...");
  await AuditLog.insertMany([
    {
      timestamp: new Date("2026-08-20T10:00:00Z"),
      user: "admin",
      action: "INIT_DATABASE",
      module: "System",
      details: "Database initialized and seeded with IRIK ERP master data",
    },
    {
      timestamp: new Date("2026-08-25T11:30:00Z"),
      user: "capt_vikram",
      action: "UPDATE_LOGBOOK",
      module: "Flight Operations",
      details: "VT-IRK Cessna 172 flight hours updated to 1420 hrs",
    },
  ]);

  console.log("\n=================================");
  console.log("Database Seed Summary:");
  console.log(`- Users: ${users.length}`);
  console.log(`- Students: ${students.length}`);
  console.log(`- Courses: ${courses.length}`);
  console.log(`- Faculty: ${faculties.length}`);
  console.log(`- Enrollments: 6`);
  console.log(`- Fees: 5`);
  console.log(`- Admissions: 4`);
  console.log(`- Library Books: ${books.length}`);
  console.log(`- Book Issues: 3`);
  console.log(`- Attendance: 5`);
  console.log(`- Timetable Slots: 4`);
  console.log(`- Hostel Rooms: ${rooms.length}`);
  console.log(`- Room Allocations: 4`);
  console.log(`- Assets: 4`);
  console.log(`- Finance Transactions: 5`);
  console.log(`- Budgets: 4`);
  console.log(`- Notifications: 3`);
  console.log(`- Alumni: 3`);
  console.log(`- Visitor Logs: 2`);
  console.log(`- Audit Logs: 2`);
  console.log("=================================");
  console.log("Database seeded successfully!");

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB.");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
