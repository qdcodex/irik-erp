import mongoose from "mongoose";

// User Model
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

// Student Model
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

// Course Model
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

// Enrollment Model
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

// Fee Model
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

// Faculty Model
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

// Admission Model
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

// Library Book Model
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

// Book Issue Model
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

// Attendance Model
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

// Timetable Model
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

// Hostel Room Model
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

// Room Allocation Model
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

// Notification Model (Phase 4)
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
    data: mongoose.Schema.Types.Mixed, // Additional metadata
    channels: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
    },
    status: {
      inApp: { type: String, enum: ["pending", "sent", "read", "failed"], default: "pending" },
      email: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
      sms: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
      push: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
    },
    sentAt: Date,
    readAt: Date,
  },
  { timestamps: true }
);

// Notification Preferences Model
const notificationPreferenceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    channels: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
    },
    notifications: {
      classReminder: { type: Boolean, default: true },
      feeAlert: { type: Boolean, default: true },
      attendanceAlert: { type: Boolean, default: true },
      timetableChange: { type: Boolean, default: true },
      examResult: { type: Boolean, default: true },
      admissionStatus: { type: Boolean, default: true },
    },
    quietHours: {
      enabled: { type: Boolean, default: false },
      startTime: String, // HH:MM format
      endTime: String, // HH:MM format
    },
  },
  { timestamps: true }
);

// Notification Template Model
const notificationTemplateSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, unique: true },
    subject: String,
    emailTemplate: String,
    smsTemplate: String,
    pushTemplate: String,
    inAppTemplate: String,
    variables: [String], // e.g., ["studentName", "className", "time"]
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Payroll Model (Irik.md 4.7)
const payrollSchema = new mongoose.Schema(
  {
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
    staffName: String,
    month: String,
    year: Number,
    basicPay: Number,
    allowances: Number,
    deductions: Number,
    netPay: Number,
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
    paidDate: Date,
  },
  { timestamps: true }
);

// Leave Request Model
const leaveRequestSchema = new mongoose.Schema(
  {
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
    staffName: String,
    leaveType: { type: String, enum: ["Casual Leave", "Sick Leave", "Earned Leave", "Flight Medical Leave"] },
    startDate: Date,
    endDate: Date,
    days: Number,
    reason: String,
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

// Finance Transaction Model (Irik.md 4.8)
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

// Budget Model
const budgetSchema = new mongoose.Schema(
  {
    department: String,
    allocatedAmount: Number,
    spentAmount: Number,
    fiscalYear: String,
  },
  { timestamps: true }
);

// Asset Model (Irik.md 4.9)
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

// Maintenance Log Model
const maintenanceLogSchema = new mongoose.Schema(
  {
    assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset" },
    assetName: String,
    description: String,
    performedBy: String,
    date: Date,
    cost: Number,
    complianceDocUrl: String,
    nextDueDate: Date,
  },
  { timestamps: true }
);

// LMS Content Model (Irik.md 4.10)
const lmsContentSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    courseName: String,
    title: { type: String, required: true },
    type: { type: String, enum: ["manual", "notes", "video", "checklist"], default: "notes" },
    fileUrl: String,
    uploadedBy: String,
    uploadDate: Date,
    size: String,
  },
  { timestamps: true }
);

// Quiz Model
const quizSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    courseName: String,
    title: { type: String, required: true },
    totalMarks: Number,
    durationMinutes: Number,
    questions: [
      {
        question: String,
        options: [String],
        correctIndex: Number,
      },
    ],
  },
  { timestamps: true }
);

// Quiz Submission Model
const quizSubmissionSchema = new mongoose.Schema(
  {
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    studentName: String,
    score: Number,
    totalMarks: Number,
    submittedAt: Date,
    passed: Boolean,
  },
  { timestamps: true }
);

// ID Card Model (Irik.md 4.11)
const idCardSchema = new mongoose.Schema(
  {
    ownerType: { type: String, enum: ["student", "staff"], required: true },
    ownerId: String,
    name: String,
    rollOrEmpNo: String,
    departmentOrCourse: String,
    bloodGroup: String,
    emergencyContact: String,
    issuedDate: Date,
    validUntil: Date,
    qrPayload: String,
    status: { type: String, enum: ["active", "reissued", "expired"], default: "active" },
  },
  { timestamps: true }
);

// Feedback Ticket Model (Irik.md 4.12)
const feedbackSchema = new mongoose.Schema(
  {
    raisedBy: String,
    raisedByRole: String,
    category: { type: String, enum: ["facility", "flight_training", "simulator", "academics", "hostel", "other"] },
    subject: String,
    description: String,
    status: { type: String, enum: ["open", "in_progress", "resolved"], default: "open" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    rating: Number,
    resolutionNotes: String,
  },
  { timestamps: true }
);

// Alumni Record Model (Irik.md 4.13)
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

// Instructor Evaluation Model (Irik.md 4.15)
const instructorEvaluationSchema = new mongoose.Schema(
  {
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
    instructorName: String,
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    courseName: String,
    ratings: {
      teaching: Number,
      communication: Number,
      punctuality: Number,
      practicalTraining: Number,
    },
    comments: String,
    submittedAt: Date,
  },
  { timestamps: true }
);

// Signed Document Model (Irik.md 4.16)
const signedDocumentSchema = new mongoose.Schema(
  {
    ownerId: String,
    ownerName: String,
    ownerType: { type: String, enum: ["student", "staff", "parent"] },
    documentType: { type: String, enum: ["admission_contract", "flight_medical_clearance", "indemnity_consent", "fee_agreement"] },
    title: String,
    signedDate: Date,
    signerIp: String,
    verificationHash: String,
    status: { type: String, enum: ["signed", "pending_signature"], default: "signed" },
  },
  { timestamps: true }
);

// Visitor Log Model (Irik.md 4.17)
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

// Custom Role Model (Irik.md 4.18)
const roleSchema = new mongoose.Schema(
  {
    name: String,
    tier: { type: String, enum: ["super_admin", "manager", "staff", "self_service"] },
    department: String,
    isCustom: Boolean,
  },
  { timestamps: true }
);

// Role Permission Model
const rolePermissionSchema = new mongoose.Schema(
  {
    roleId: String,
    module: String,
    actions: {
      view: Boolean,
      create: Boolean,
      edit: Boolean,
      delete: Boolean,
      approve: Boolean,
    },
  },
  { timestamps: true }
);

// Audit Log Model
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

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
export const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);
export const Enrollment = mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);
export const Fee = mongoose.models.Fee || mongoose.model("Fee", feeSchema);
export const Faculty = mongoose.models.Faculty || mongoose.model("Faculty", facultySchema);
export const Admission = mongoose.models.Admission || mongoose.model("Admission", admissionSchema);
export const LibraryBook = mongoose.models.LibraryBook || mongoose.model("LibraryBook", libraryBookSchema);
export const BookIssue = mongoose.models.BookIssue || mongoose.model("BookIssue", bookIssueSchema);
export const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
export const Timetable = mongoose.models.Timetable || mongoose.model("Timetable", timetableSchema);
export const HostelRoom = mongoose.models.HostelRoom || mongoose.model("HostelRoom", hostelRoomSchema);
export const RoomAllocation = mongoose.models.RoomAllocation || mongoose.model("RoomAllocation", roomAllocationSchema);
export const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
export const NotificationPreference =
  mongoose.models.NotificationPreference || mongoose.model("NotificationPreference", notificationPreferenceSchema);
export const NotificationTemplate =
  mongoose.models.NotificationTemplate || mongoose.model("NotificationTemplate", notificationTemplateSchema);
export const Payroll = mongoose.models.Payroll || mongoose.model("Payroll", payrollSchema);
export const LeaveRequest = mongoose.models.LeaveRequest || mongoose.model("LeaveRequest", leaveRequestSchema);
export const FinanceTransaction = mongoose.models.FinanceTransaction || mongoose.model("FinanceTransaction", financeTransactionSchema);
export const Budget = mongoose.models.Budget || mongoose.model("Budget", budgetSchema);
export const Asset = mongoose.models.Asset || mongoose.model("Asset", assetSchema);
export const MaintenanceLog = mongoose.models.MaintenanceLog || mongoose.model("MaintenanceLog", maintenanceLogSchema);
export const LMSContent = mongoose.models.LMSContent || mongoose.model("LMSContent", lmsContentSchema);
export const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);
export const QuizSubmission = mongoose.models.QuizSubmission || mongoose.model("QuizSubmission", quizSubmissionSchema);
export const IDCard = mongoose.models.IDCard || mongoose.model("IDCard", idCardSchema);
export const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);
export const Alumni = mongoose.models.Alumni || mongoose.model("Alumni", alumniSchema);
export const InstructorEvaluation = mongoose.models.InstructorEvaluation || mongoose.model("InstructorEvaluation", instructorEvaluationSchema);
export const SignedDocument = mongoose.models.SignedDocument || mongoose.model("SignedDocument", signedDocumentSchema);
export const VisitorLog = mongoose.models.VisitorLog || mongoose.model("VisitorLog", visitorLogSchema);
export const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);
export const RolePermission = mongoose.models.RolePermission || mongoose.model("RolePermission", rolePermissionSchema);
export const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
