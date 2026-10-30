export type Student = {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  course: string;
  semester: number;
  address: string;
  enrollmentDate: string;
};

export type Course = {
  id: string;
  code: string;
  name: string;
  credits: number;
  semester: number;
  instructor: string;
  department?: string;
  courseType?: "Theory" | "Simulator Lab" | "Flight Practical" | "Cabin Safety";
  totalHours?: number;
};

export type TrainingVenue = {
  id: string;
  code: string;
  name: string;
  type: "Lecture Hall" | "Flight Simulator Bay" | "Apron / Flight Line" | "Cabin Mockup Hall" | "Avionics Lab";
  capacity: number;
  building: string;
  status: "Active" | "Maintenance" | "Reserved";
  equippedDevice?: string;
};

export type AcademicProgram = {
  id: string;
  code: string;
  name: string;
  cadre: string;
  durationSemesters: number;
  dgcaApproved: boolean;
  intakeCapacity: number;
};

export type FeeCategoryHead = {
  id: string;
  code: string;
  name: string;
  applicableProgram: string;
  defaultAmount: number;
  frequency: "Per Semester" | "One-Time" | "Per Flying Hour" | "Annual";
  refundable: boolean;
};

export type Enrollment = {
  id: string;
  studentId: string;
  courseId: string;
  grade?: string;
  marks?: number;
  semester: number;
};

export type Fee = {
  id: string;
  studentId: string;
  amount: number;
  feeType: string;
  dueDate: string;
  paidDate?: string;
  status: "pending" | "paid" | "overdue";
  semester: number;
};

export type Faculty = {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  qualification: string;
  joiningDate: string;
  designation?: string;
  dgcaLicenseNo?: string;
  flightHours?: number;
  typeRating?: string;
  specialization?: string;
  status?: "Active" | "Flight Line" | "Simulator Shift" | "On Leave";
  assignedCourses?: string[];
  rating?: number;
};

export type Admission = {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  gender?: "Male" | "Female" | "Other";
  dob?: string;
  appliedCourse: string;
  appliedDate: string;
  status: "pending" | "approved" | "rejected" | "under_review" | "medical_verified";
  marks?: number; // Entrance / Merit percentage
  twelfthPhysicsMaths?: boolean;
  medicalFitnessStatus?: "Class 1 Cleared" | "Class 2 Cleared" | "Pending" | "Failed" | "Not Applicable";
  documentsSubmitted?: {
    marksheet10th?: boolean;
    marksheet12th?: boolean;
    medicalCertificate?: boolean;
    passportOrAadhaar?: boolean;
  };
  notes?: string;
  counselor?: string;
};

export type LibraryBook = {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  publicationYear: number;
};

export type BookIssue = {
  id: string;
  studentId: string;
  bookId: string;
  issueDate: string;
  returnDate?: string;
  dueDate: string;
  status: "issued" | "returned" | "overdue";
};

export type Attendance = {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
  status: "present" | "absent" | "late";
  semester: number;
};

export type Timetable = {
  id: string;
  courseId: string;
  program: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  classroom: string;
  instructor: string;
  semester: number;
};

export type HostelRoom = {
  id: string;
  roomNumber: string;
  capacity: number;
  occupancy: number;
  type: "single" | "double" | "triple";
  floorNumber: number;
  charges: number;
};

export type RoomAllocation = {
  id: string;
  roomId: string;
  studentId: string;
  allocationDate: string;
  releaseDate?: string;
  status: "active" | "released";
  semester: number;
};

export type UserRole = "admin" | "faculty" | "student" | "staff" | "parent";

export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
  avatar?: string;
};

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
};

// HR & Payroll (Irik.md 4.7)
export type Payroll = {
  id: string;
  staffId: string;
  staffName: string;
  month: string;
  year: number;
  basicPay: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: "pending" | "paid";
  paidDate?: string;
};

export type LeaveRequest = {
  id: string;
  staffId: string;
  staffName: string;
  leaveType: "Casual Leave" | "Sick Leave" | "Earned Leave" | "Flight Medical Leave";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
};

// Finance & Accounting (Irik.md 4.8)
export type FinanceTransaction = {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod: "bank_transfer" | "upi" | "cheque" | "cash";
  department: string;
};

export type Budget = {
  id: string;
  department: string;
  allocatedAmount: number;
  spentAmount: number;
  fiscalYear: string;
};

// Assets & Compliance (Irik.md 4.9)
export type Asset = {
  id: string;
  name: string;
  type: "aircraft" | "simulator" | "equipment" | "facility";
  registrationNumber: string;
  status: "active" | "maintenance" | "grounded" | "retired";
  totalHours: number;
  lastMaintenanceDate: string;
  nextMaintenanceDue: string;
  dgcaComplianceStatus: "compliant" | "inspection_due" | "non_compliant";
};

export type MaintenanceLog = {
  id: string;
  assetId: string;
  assetName: string;
  description: string;
  performedBy: string;
  date: string;
  cost: number;
  complianceDocUrl?: string;
  nextDueDate: string;
};

// LMS / E-Learning (Irik.md 4.10)
export type LMSContent = {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  type: "manual" | "notes" | "video" | "checklist";
  fileUrl: string;
  uploadedBy: string;
  uploadDate: string;
  size?: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
};

export type Quiz = {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  totalMarks: number;
  durationMinutes: number;
  questions: QuizQuestion[];
};

export type QuizSubmission = {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  score: number;
  totalMarks: number;
  submittedAt: string;
  passed: boolean;
};

// ID Card (Irik.md 4.11)
export type IDCard = {
  id: string;
  ownerType: "student" | "staff";
  ownerId: string;
  name: string;
  rollOrEmpNo: string;
  departmentOrCourse: string;
  bloodGroup: string;
  emergencyContact: string;
  issuedDate: string;
  validUntil: string;
  qrPayload: string;
  status: "active" | "reissued" | "expired";
};

// Feedback & Complaint (Irik.md 4.12)
export type FeedbackTicket = {
  id: string;
  raisedBy: string;
  raisedByRole: string;
  category: "facility" | "flight_training" | "simulator" | "academics" | "hostel" | "other";
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved";
  priority: "low" | "medium" | "high";
  rating?: number;
  resolutionNotes?: string;
  createdAt: string;
};

// Alumni & Placement (Irik.md 4.13)
export type AlumniRecord = {
  id: string;
  name: string;
  rollNo: string;
  course: string;
  graduationYear: number;
  currentCompany: string;
  designation: string;
  location: string;
  referralOptIn: boolean;
  email: string;
  phone: string;
};

// Instructor Performance Evaluation (Irik.md 4.15)
export type InstructorEvaluation = {
  id: string;
  instructorId: string;
  instructorName: string;
  studentId: string;
  courseId: string;
  courseName: string;
  ratings: {
    teaching: number;
    communication: number;
    punctuality: number;
    practicalTraining: number;
  };
  comments: string;
  submittedAt: string;
};

// Document E-Signature (Irik.md 4.16)
export type SignedDocument = {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerType: "student" | "staff" | "parent";
  documentType: "admission_contract" | "flight_medical_clearance" | "indemnity_consent" | "fee_agreement";
  title: string;
  signedDate: string;
  signerIp: string;
  verificationHash: string;
  status: "signed" | "pending_signature";
};

// Visitor & Gate Management (Irik.md 4.17)
export type VisitorLog = {
  id: string;
  visitorName: string;
  phone: string;
  purpose: string;
  hostStaffName: string;
  areaAccessed: "General Campus" | "Flight Hangar" | "Apron Zone" | "Simulator Complex" | "Admin Office";
  entryTime: string;
  exitTime?: string;
  badgeNumber: string;
  status: "inside" | "checked_out";
};

// Roles & Permissions (Irik.md 4.18)
export type CustomRole = {
  id: string;
  name: string;
  tier: "super_admin" | "manager" | "staff" | "self_service";
  department?: string;
  isCustom: boolean;
};

export type RolePermission = {
  roleId: string;
  module: string;
  actions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    approve: boolean;
  };
};

// Settings (Irik.md 4.19)
export type InstituteSettings = {
  instituteName: string;
  tagLine: string;
  address: string;
  email: string;
  phone: string;
  dgcaApprovalNumber: string;
  academicYear: string;
  currency: string;
  paymentGatewayEnabled: boolean;
  upiId: string;
  smsEnabled: boolean;
  emailNotifEnabled: boolean;
  whatsappEnabled: boolean;
};

export type AuditLog = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  details: string;
};
