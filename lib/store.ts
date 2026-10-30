import {
  Student,
  Course,
  Enrollment,
  Fee,
  Faculty,
  Admission,
  LibraryBook,
  BookIssue,
  Attendance,
  Timetable,
  HostelRoom,
  RoomAllocation,
  Payroll,
  LeaveRequest,
  FinanceTransaction,
  Budget,
  Asset,
  MaintenanceLog,
  LMSContent,
  Quiz,
  QuizSubmission,
  IDCard,
  FeedbackTicket,
  AlumniRecord,
  InstructorEvaluation,
  SignedDocument,
  VisitorLog,
  CustomRole,
  RolePermission,
  InstituteSettings,
  AuditLog,
  TrainingVenue,
  AcademicProgram,
  FeeCategoryHead,
} from "./types";

let students: Student[] = [
  {
    id: "1",
    rollNo: "AVN-2026-001",
    name: "Rajesh Kumar",
    email: "rajesh@college.edu",
    phone: "9876543210",
    dob: "2003-05-15",
    gender: "Male",
    course: "BBA Aviation",
    semester: 4,
    address: "123 Main St, City",
    enrollmentDate: "2024-08-01",
  },
  {
    id: "2",
    rollNo: "AVN-2026-002",
    name: "Priya Singh",
    email: "priya@college.edu",
    phone: "9876543211",
    dob: "2003-08-20",
    gender: "Female",
    course: "BBA Aviation",
    semester: 4,
    address: "456 Oak Ave, City",
    enrollmentDate: "2024-08-01",
  },
  {
    id: "3",
    rollNo: "PLT-2026-003",
    name: "Rohan Varma",
    email: "rohan.varma@college.edu",
    phone: "9876543212",
    dob: "2002-11-12",
    gender: "Male",
    course: "Pilot Training",
    semester: 2,
    address: "Aero Enclave 402, Mumbai",
    enrollmentDate: "2025-01-10",
  },
  {
    id: "4",
    rollNo: "CC-2026-004",
    name: "Ananya Deshmukh",
    email: "ananya.d@college.edu",
    phone: "9876543213",
    dob: "2004-03-25",
    gender: "Female",
    course: "Cabin Crew",
    semester: 1,
    address: "Skyview Heights, Bangalore",
    enrollmentDate: "2025-07-15",
  },
  {
    id: "5",
    rollNo: "AVN-2026-005",
    name: "Aman Kapoor",
    email: "aman.kapoor@college.edu",
    phone: "9876543214",
    dob: "2003-09-08",
    gender: "Male",
    course: "BBA Aviation",
    semester: 4,
    address: "78 Runway Rd, Delhi",
    enrollmentDate: "2024-08-01",
  },
  {
    id: "6",
    rollNo: "PLT-2026-006",
    name: "Tanvi Saxena",
    email: "tanvi.saxena@college.edu",
    phone: "9876543215",
    dob: "2003-01-30",
    gender: "Female",
    course: "Pilot Training",
    semester: 2,
    address: "Wing Tower, Hyderabad",
    enrollmentDate: "2025-01-10",
  },
];

let courses: Course[] = [
  // Degree Courses - BBA
  { id: "1", code: "BBA-AVN", name: "BBA Aviation", credits: 12, semester: 1, instructor: "Aviation Department" },
  { id: "2", code: "BBA-MGMT", name: "Aviation Management", credits: 4, semester: 2, instructor: "Prof. Rajesh Kumar" },
  { id: "3", code: "BBA-OPER", name: "Airport Operations", credits: 4, semester: 3, instructor: "Dr. Amit Patel" },

  // Degree Courses - BSc
  { id: "4", code: "BSC-AVN", name: "BSc Aviation", credits: 12, semester: 1, instructor: "Aviation Department" },
  { id: "5", code: "BSC-TECH", name: "Aviation Technology", credits: 4, semester: 2, instructor: "Dr. Neha Sharma" },
  { id: "6", code: "BSC-AERO", name: "Aeronautics", credits: 4, semester: 3, instructor: "Prof. John Doe" },

  // Pilot Training
  { id: "7", code: "PILOT-1", name: "Pilot Training", credits: 18, semester: 1, instructor: "Flight Instructors" },

  // Diplomas - Aviation
  { id: "8", code: "DIP-ATT", name: "Airline Travel & Tourism", credits: 4, semester: 1, instructor: "Ms. Priya Verma" },
  { id: "9", code: "DIP-AI-AVN", name: "AI in Aviation Operation", credits: 3, semester: 1, instructor: "Dr. Raj Singh" },
  { id: "10", code: "DIP-AHS", name: "Airhostess Training", credits: 3, semester: 1, instructor: "Ms. Kavya Shah" },
  { id: "11", code: "DIP-AHM", name: "Aviation & Hotel Mgmt", credits: 4, semester: 1, instructor: "Prof. Vikram Kumar" },
  { id: "12", code: "DIP-ATM", name: "Air Ticketing & Airport Mgmt", credits: 3, semester: 1, instructor: "Mr. Suresh Iyer" },

  // Cabin Crew
  { id: "13", code: "CC-TRAIN", name: "Cabin Crew", credits: 3, semester: 1, instructor: "Ms. Kavya Shah" },

  // General
  { id: "14", code: "FT-CERT", name: "Fast Track Certification", credits: 1, semester: 1, instructor: "Career Services" },

  // Paramedical
  { id: "15", code: "DIP-GDA", name: "General Duty Assistant", credits: 4, semester: 1, instructor: "Dr. Anjali Menon" },
  { id: "16", code: "DIP-HOS", name: "Hospital Management", credits: 4, semester: 1, instructor: "Dr. Karthik Nair" },
  { id: "17", code: "ADV-HOS", name: "Advance Hospital Mgmt", credits: 8, semester: 1, instructor: "Dr. Karthik Nair" },
  { id: "18", code: "ADV-GDA", name: "Advance General Duty Asst", credits: 8, semester: 1, instructor: "Dr. Anjali Menon" },
  { id: "19", code: "ADV-GDA-PC", name: "Advance GDA & Patient Care", credits: 8, semester: 1, instructor: "Dr. Anjali Menon" },

  // Hospitality
  { id: "20", code: "HM-DIPL", name: "Hotel Management", credits: 8, semester: 1, instructor: "Mr. Pradeep Singh" },

  // Professional
  { id: "21", code: "FD-CERT", name: "Fashion Designing", credits: 3, semester: 1, instructor: "Ms. Deepika Roy" },
  { id: "22", code: "ID-CERT", name: "Interior Designing", credits: 3, semester: 1, instructor: "Ms. Deepika Roy" },

  // Safety
  { id: "23", code: "FS-CERT", name: "Fire and Safety", credits: 2, semester: 1, instructor: "Mr. Ravi Shankar" },

  // Technology
  { id: "24", code: "DM-CERT", name: "Digital Marketing", credits: 2, semester: 1, instructor: "Mr. Arjun Verma" },
  { id: "25", code: "AI-CERT", name: "Artificial Intelligence", credits: 3, semester: 1, instructor: "Dr. Vivek Sharma" },
];

let trainingVenues: TrainingVenue[] = [
  {
    id: "1",
    code: "ALH-101",
    name: "Aero Lecture Hall 101",
    type: "Lecture Hall",
    capacity: 60,
    building: "Academic Block A",
    status: "Active",
    equippedDevice: "Smart AV & Aerodynamics Wind Tunnel Model",
  },
  {
    id: "2",
    code: "ALH-102",
    name: "Aero Lecture Hall 102",
    type: "Lecture Hall",
    capacity: 60,
    building: "Academic Block A",
    status: "Active",
    equippedDevice: "Cockpit Navigation Chart Projector",
  },
  {
    id: "3",
    code: "SIM-BAY-01",
    name: "Flight Simulator SIM-01 (Redbird FMX)",
    type: "Flight Simulator Bay",
    capacity: 4,
    building: "Simulator Complex Hangar",
    status: "Active",
    equippedDevice: "Redbird FMX Full Motion Single/Multi Engine Trainer",
  },
  {
    id: "4",
    code: "SIM-BAY-02",
    name: "Flight Simulator SIM-02 (ALSIM ALX)",
    type: "Flight Simulator Bay",
    capacity: 6,
    building: "Simulator Complex Hangar",
    status: "Active",
    equippedDevice: "ALSIM ALX Medium Jet / Turboprop FNPT II MCC Trainer",
  },
  {
    id: "5",
    code: "APRON-04",
    name: "Apron Flight Line Bay 04",
    type: "Apron / Flight Line",
    capacity: 12,
    building: "Airside Apron Area",
    status: "Active",
    equippedDevice: "Cessna 172R & Diamond DA42 Pre-Flight Walkaround Staging",
  },
  {
    id: "6",
    code: "MOCKUP-301",
    name: "Cabin Mockup Hall 301",
    type: "Cabin Mockup Hall",
    capacity: 40,
    building: "Aviation Safety Wing",
    status: "Active",
    equippedDevice: "A320 Fuselage Mockup, Evacuation Slide & Smoke Demo Chamber",
  },
  {
    id: "7",
    code: "AVN-LAB-202",
    name: "Terminal Operations & Avionics Lab 202",
    type: "Avionics Lab",
    capacity: 35,
    building: "Academic Block B",
    status: "Active",
    equippedDevice: "Radar ATC Simulation Desks & Glass Cockpit Avionics Racks",
  },
];

let academicPrograms: AcademicProgram[] = [
  {
    id: "1",
    code: "CPL-GROUND-FLIGHT",
    name: "Commercial Pilot License (CPL Ground & Flight)",
    cadre: "Flight Operations",
    durationSemesters: 4,
    dgcaApproved: true,
    intakeCapacity: 40,
  },
  {
    id: "2",
    code: "BBA-AVN-MGMT",
    name: "BBA Aviation",
    cadre: "Aviation Management",
    durationSemesters: 6,
    dgcaApproved: true,
    intakeCapacity: 60,
  },
  {
    id: "3",
    code: "CABIN-CREW-DIPL",
    name: "Cabin Crew & In-flight Services",
    cadre: "In-Flight Hospitality",
    durationSemesters: 2,
    dgcaApproved: true,
    intakeCapacity: 50,
  },
  {
    id: "4",
    code: "BSC-AERO-SCI",
    name: "BSc Aeronautical Science",
    cadre: "Aeronautics & Technology",
    durationSemesters: 6,
    dgcaApproved: true,
    intakeCapacity: 45,
  },
  {
    id: "5",
    code: "AIRPORT-GROUND-OPS",
    name: "Airport Ground Handling & Ramp Safety",
    cadre: "Airport Operations",
    durationSemesters: 2,
    dgcaApproved: true,
    intakeCapacity: 50,
  },
];

let feeCategoryHeads: FeeCategoryHead[] = [
  {
    id: "1",
    code: "FEE-TUIT-SEM",
    name: "Tuition & Ground School Fee",
    applicableProgram: "All Programs",
    defaultAmount: 100000,
    frequency: "Per Semester",
    refundable: false,
  },
  {
    id: "2",
    code: "FEE-SIM-TRAIN",
    name: "Multi-Engine Simulator Training (Redbird/ALSIM)",
    applicableProgram: "Pilot Training",
    defaultAmount: 75000,
    frequency: "Per Semester",
    refundable: false,
  },
  {
    id: "3",
    code: "FEE-FLY-HOURS",
    name: "Solo & Dual Aircraft Flying Hours (Avgas/Airframe)",
    applicableProgram: "Pilot Training",
    defaultAmount: 250000,
    frequency: "Per Semester",
    refundable: false,
  },
  {
    id: "4",
    code: "FEE-HOSTEL-ACCOM",
    name: "Campus Hostel Accommodation & Mess",
    applicableProgram: "Residential Cadets",
    defaultAmount: 50000,
    frequency: "Per Semester",
    refundable: false,
  },
  {
    id: "5",
    code: "FEE-DGCA-EXAM",
    name: "DGCA License Examination & Medical Fee",
    applicableProgram: "Pilot & Cabin Crew",
    defaultAmount: 15000,
    frequency: "One-Time",
    refundable: false,
  },
  {
    id: "6",
    code: "FEE-UNIFORM-KIT",
    name: "Aviation Pilot/Cabin Crew Uniform & Headset Kit",
    applicableProgram: "All Programs",
    defaultAmount: 25000,
    frequency: "One-Time",
    refundable: false,
  },
];

let enrollments: Enrollment[] = [
  { id: "1", studentId: "1", courseId: "2", grade: "A", marks: 85, semester: 4 },
  { id: "2", studentId: "1", courseId: "3", grade: "B+", marks: 78, semester: 4 },
  { id: "3", studentId: "2", courseId: "2", grade: "A+", marks: 92, semester: 4 },
  { id: "4", studentId: "2", courseId: "3", grade: "A", marks: 88, semester: 4 },
];

let fees: Fee[] = [
  {
    id: "1",
    studentId: "1",
    amount: 100000,
    feeType: "Tuition",
    dueDate: "2024-09-01",
    paidDate: "2024-08-25",
    status: "paid",
    semester: 4,
  },
  {
    id: "2",
    studentId: "2",
    amount: 100000,
    feeType: "Tuition",
    dueDate: "2024-09-01",
    status: "pending",
    semester: 4,
  },
];

let faculties: Faculty[] = [
  {
    id: "1",
    name: "Capt. Vikram Malhotra",
    email: "vikram.malhotra@irik.edu",
    phone: "+91 98450 44211",
    department: "Flight Operations & Training",
    qualification: "ATPL / DGCA Chief Flight Instructor (CFI)",
    designation: "Chief Flight Instructor & Head of Flight Training",
    dgcaLicenseNo: "DGCA-CFI-4029",
    flightHours: 6400,
    typeRating: "Airbus A320, Cessna 172R, Piper Seneca V",
    specialization: "Multi-Engine Instrument Rating & Simulator Checks",
    status: "Active",
    rating: 4.9,
    assignedCourses: ["Pilot Training", "Multi-Engine Simulator Rating"],
    joiningDate: "2018-04-10",
  },
  {
    id: "2",
    name: "Dr. Amit Patel",
    email: "amit.patel@irik.edu",
    phone: "+91 98765 43220",
    department: "Aviation Management",
    qualification: "Ph.D. in Air Transport Economics & IATA Fellow",
    designation: "Dean of Aviation Studies & Professor",
    dgcaLicenseNo: "IATA-ADM-8812",
    flightHours: 850,
    typeRating: "Aviation Operations Management",
    specialization: "Airport Slot Allocation & Airline Revenue Management",
    status: "Active",
    rating: 4.8,
    assignedCourses: ["BBA Aviation", "Airport Operations"],
    joiningDate: "2015-07-01",
  },
  {
    id: "3",
    name: "Ms. Kavya Shah",
    email: "kavya.shah@irik.edu",
    phone: "+91 98112 55667",
    department: "Cabin Safety & In-Flight Services",
    qualification: "Ex-Senior Purser & Lead DGCA Cabin Safety Auditor",
    designation: "Lead Cabin Crew Instructor",
    dgcaLicenseNo: "DGCA-CC-9901",
    flightHours: 5200,
    typeRating: "Boeing 777-300ER, A320 Family",
    specialization: "Aviation First Aid, Ditching & Emergency Evacuation",
    status: "Flight Line",
    rating: 4.9,
    assignedCourses: ["Cabin Crew", "In-flight Grooming & Safety"],
    joiningDate: "2020-01-15",
  },
  {
    id: "4",
    name: "Dr. Neha Sharma",
    email: "neha.sharma@irik.edu",
    phone: "+91 98765 43221",
    department: "Aeronautics & Avionics",
    qualification: "Ph.D. in Aerospace Engineering (IIT Bombay)",
    designation: "Associate Professor - Aerodynamics",
    dgcaLicenseNo: "AME-AVN-5542",
    flightHours: 320,
    typeRating: "Flight Mechanics & Modern Glass Cockpit Avionics",
    specialization: "Computational Fluid Dynamics & Turbine Propulsion",
    status: "Active",
    rating: 4.7,
    assignedCourses: ["BSc Aviation", "Aviation Technology"],
    joiningDate: "2018-08-01",
  },
  {
    id: "5",
    name: "Prof. Rajesh Kumar",
    email: "rajesh.kumar@irik.edu",
    phone: "+91 98401 77889",
    department: "Air Traffic Management & Law",
    qualification: "M.Tech in Airspace Navigation & ICAO Air Law",
    designation: "Assistant Professor - ATC & Airspace",
    dgcaLicenseNo: "ATC-SURV-3310",
    flightHours: 600,
    typeRating: "ICAO Air Traffic Control & Radar Separation",
    specialization: "Air Traffic Flow Management & International Air Law",
    status: "Simulator Shift",
    rating: 4.8,
    assignedCourses: ["Aviation Management", "Air Law & Regulations"],
    joiningDate: "2021-03-01",
  },
  {
    id: "6",
    name: "Capt. Arvind Rao",
    email: "arvind.rao@irik.edu",
    phone: "+91 97110 33445",
    department: "Flight Operations & Training",
    qualification: "Senior Flight Instructor (SFI) & Instrument Rating Examiner",
    designation: "Senior Simulator Training Captain",
    dgcaLicenseNo: "DGCA-SFI-7721",
    flightHours: 4900,
    typeRating: "ALSIM ALX, Redbird FMX, Diamond DA42",
    specialization: "IFR Cockpit Resource Management & Adverse Weather",
    status: "Active",
    rating: 4.9,
    assignedCourses: ["Pilot Training", "Simulator Instrument Procedures"],
    joiningDate: "2019-11-20",
  },
];

let admissions: Admission[] = [
  {
    id: "1",
    applicantName: "Rohan Varma",
    email: "rohan.varma@gmail.com",
    phone: "+91 98450 12345",
    gender: "Male",
    dob: "2006-03-12",
    appliedCourse: "Commercial Pilot License (CPL Ground & Flight)",
    appliedDate: "2026-08-20",
    status: "medical_verified",
    marks: 88,
    twelfthPhysicsMaths: true,
    medicalFitnessStatus: "Class 1 Cleared",
    documentsSubmitted: {
      marksheet10th: true,
      marksheet12th: true,
      medicalCertificate: true,
      passportOrAadhaar: true,
    },
    counselor: "Capt. Vikram Malhotra",
    notes: "Passed Class 1 DGCA medical assessment at IAM Bangalore. Physics: 89%, Maths: 87%. Highly eligible for Commercial Pilot batch.",
  },
  {
    id: "2",
    applicantName: "Ananya Deshmukh",
    email: "ananya.d@gmail.com",
    phone: "+91 98765 99881",
    gender: "Female",
    dob: "2005-11-04",
    appliedCourse: "BBA Aviation",
    appliedDate: "2026-08-22",
    status: "approved",
    marks: 92,
    twelfthPhysicsMaths: true,
    medicalFitnessStatus: "Class 2 Cleared",
    documentsSubmitted: {
      marksheet10th: true,
      marksheet12th: true,
      medicalCertificate: true,
      passportOrAadhaar: true,
    },
    counselor: "Ms. Kavya Shah",
    notes: "Merit scholarship eligible. All academic documents verified.",
  },
  {
    id: "3",
    applicantName: "Karan Johar Patel",
    email: "karan.patel@outlook.com",
    phone: "+91 97123 45678",
    gender: "Male",
    dob: "2006-07-19",
    appliedCourse: "Commercial Pilot License (CPL Ground & Flight)",
    appliedDate: "2026-08-24",
    status: "pending",
    marks: 79,
    twelfthPhysicsMaths: true,
    medicalFitnessStatus: "Pending",
    documentsSubmitted: {
      marksheet10th: true,
      marksheet12th: true,
      medicalCertificate: false,
      passportOrAadhaar: true,
    },
    counselor: "Dr. Amit Patel",
    notes: "Awaiting DGCA Class 2 medical appointment certificate from AFCME New Delhi.",
  },
  {
    id: "4",
    applicantName: "Divya Nambiar",
    email: "divya.nambiar@yahoo.com",
    phone: "+91 99441 22334",
    gender: "Female",
    dob: "2005-09-15",
    appliedCourse: "Cabin Crew & In-flight Services",
    appliedDate: "2026-08-25",
    status: "under_review",
    marks: 84,
    twelfthPhysicsMaths: false,
    medicalFitnessStatus: "Class 2 Cleared",
    documentsSubmitted: {
      marksheet10th: true,
      marksheet12th: true,
      medicalCertificate: true,
      passportOrAadhaar: true,
    },
    counselor: "Ms. Kavya Shah",
    notes: "Height: 168 cm, clear eyesight, grooming assessment cleared in round 1.",
  },
  {
    id: "5",
    applicantName: "Aditya Roy",
    email: "aditya.roy@gmail.com",
    phone: "+91 98300 77665",
    gender: "Male",
    dob: "2006-01-28",
    appliedCourse: "BSc Aeronautical Science",
    appliedDate: "2026-08-18",
    status: "approved",
    marks: 95,
    twelfthPhysicsMaths: true,
    medicalFitnessStatus: "Not Applicable",
    documentsSubmitted: {
      marksheet10th: true,
      marksheet12th: true,
      medicalCertificate: false,
      passportOrAadhaar: true,
    },
    counselor: "Dr. Neha Sharma",
    notes: "Exceptional physics score (98%). Direct admission approved.",
  },
  {
    id: "6",
    applicantName: "Sameer Sheikh",
    email: "sameer.s@gmail.com",
    phone: "+91 91234 56780",
    gender: "Male",
    dob: "2006-05-10",
    appliedCourse: "Commercial Pilot License (CPL Ground & Flight)",
    appliedDate: "2026-08-15",
    status: "rejected",
    marks: 52,
    twelfthPhysicsMaths: false,
    medicalFitnessStatus: "Failed",
    documentsSubmitted: {
      marksheet10th: true,
      marksheet12th: false,
      medicalCertificate: false,
      passportOrAadhaar: true,
    },
    counselor: "Capt. Vikram Malhotra",
    notes: "Ineligible for CPL: Did not have 10+2 Physics & Mathematics, and failed initial DGCA vision requirement.",
  },
];

let libraryBooks: LibraryBook[] = [
  {
    id: "1",
    isbn: "978-0134685991",
    title: "Effective Java",
    author: "Joshua Bloch",
    category: "Programming",
    totalCopies: 5,
    availableCopies: 3,
    publicationYear: 2018,
  },
  {
    id: "2",
    isbn: "978-0596007126",
    title: "Head First Design Patterns",
    author: "Freeman & Freeman",
    category: "Design Patterns",
    totalCopies: 4,
    availableCopies: 2,
    publicationYear: 2004,
  },
  {
    id: "3",
    isbn: "978-0201633610",
    title: "Design Patterns",
    author: "Gang of Four",
    category: "Design Patterns",
    totalCopies: 3,
    availableCopies: 1,
    publicationYear: 1994,
  },
];

let bookIssues: BookIssue[] = [
  {
    id: "1",
    studentId: "1",
    bookId: "1",
    issueDate: "2024-08-05",
    dueDate: "2024-08-19",
    status: "issued",
  },
  {
    id: "2",
    studentId: "2",
    bookId: "2",
    issueDate: "2024-08-03",
    returnDate: "2024-08-09",
    dueDate: "2024-08-17",
    status: "returned",
  },
];

let attendance: Attendance[] = [
  { id: "1", studentId: "1", courseId: "1", date: "2026-08-25", status: "present", semester: 4 },
  { id: "2", studentId: "2", courseId: "1", date: "2026-08-25", status: "present", semester: 4 },
  { id: "3", studentId: "5", courseId: "1", date: "2026-08-25", status: "late", semester: 4 },
  { id: "4", studentId: "3", courseId: "7", date: "2026-08-25", status: "present", semester: 2 },
  { id: "5", studentId: "6", courseId: "7", date: "2026-08-25", status: "absent", semester: 2 },
  { id: "6", studentId: "4", courseId: "13", date: "2026-08-25", status: "present", semester: 1 },

  { id: "7", studentId: "1", courseId: "1", date: "2026-08-26", status: "present", semester: 4 },
  { id: "8", studentId: "2", courseId: "1", date: "2026-08-26", status: "present", semester: 4 },
  { id: "9", studentId: "5", courseId: "1", date: "2026-08-26", status: "absent", semester: 4 },
  { id: "10", studentId: "3", courseId: "7", date: "2026-08-26", status: "present", semester: 2 },
  { id: "11", studentId: "6", courseId: "7", date: "2026-08-26", status: "late", semester: 2 },
  { id: "12", studentId: "4", courseId: "13", date: "2026-08-26", status: "present", semester: 1 },

  { id: "13", studentId: "1", courseId: "2", date: "2026-08-27", status: "present", semester: 4 },
  { id: "14", studentId: "2", courseId: "2", date: "2026-08-27", status: "present", semester: 4 },
  { id: "15", studentId: "5", courseId: "2", date: "2026-08-27", status: "absent", semester: 4 },
  { id: "16", studentId: "3", courseId: "7", date: "2026-08-27", status: "present", semester: 2 },
  { id: "17", studentId: "6", courseId: "7", date: "2026-08-27", status: "present", semester: 2 },
  { id: "18", studentId: "4", courseId: "13", date: "2026-08-27", status: "present", semester: 1 },
];

let timetables: Timetable[] = [
  // BBA Aviation - Semester 4
  {
    id: "1",
    courseId: "1",
    program: "BBA Aviation",
    dayOfWeek: "Monday",
    startTime: "09:00",
    endTime: "10:30",
    classroom: "Aero Lecture Hall 101",
    instructor: "Dr. Amit Patel",
    semester: 4,
  },
  {
    id: "2",
    courseId: "2",
    program: "BBA Aviation",
    dayOfWeek: "Tuesday",
    startTime: "11:00",
    endTime: "12:30",
    classroom: "Aero Lecture Hall 101",
    instructor: "Prof. Rajesh Kumar",
    semester: 4,
  },
  {
    id: "3",
    courseId: "3",
    program: "BBA Aviation",
    dayOfWeek: "Wednesday",
    startTime: "09:00",
    endTime: "10:30",
    classroom: "Terminal Ops Lab 202",
    instructor: "Dr. Amit Patel",
    semester: 4,
  },
  {
    id: "4",
    courseId: "1",
    program: "BBA Aviation",
    dayOfWeek: "Thursday",
    startTime: "13:30",
    endTime: "15:00",
    classroom: "Aero Lecture Hall 101",
    instructor: "Dr. Amit Patel",
    semester: 4,
  },
  {
    id: "5",
    courseId: "3",
    program: "BBA Aviation",
    dayOfWeek: "Friday",
    startTime: "10:00",
    endTime: "11:30",
    classroom: "Terminal Ops Lab 202",
    instructor: "Dr. Amit Patel",
    semester: 4,
  },

  // Pilot Training - Semester 2
  {
    id: "6",
    courseId: "7",
    program: "Pilot Training",
    dayOfWeek: "Monday",
    startTime: "10:30",
    endTime: "12:30",
    classroom: "Flight Simulator SIM-01 (Redbird FMX)",
    instructor: "Capt. Vikram Malhotra",
    semester: 2,
  },
  {
    id: "7",
    courseId: "7",
    program: "Pilot Training",
    dayOfWeek: "Tuesday",
    startTime: "14:00",
    endTime: "16:00",
    classroom: "Flight Simulator SIM-02 (ALSIM ALX)",
    instructor: "Capt. Vikram Malhotra",
    semester: 2,
  },
  {
    id: "8",
    courseId: "7",
    program: "Pilot Training",
    dayOfWeek: "Wednesday",
    startTime: "11:00",
    endTime: "12:30",
    classroom: "Airside Briefing Room B",
    instructor: "Capt. Vikram Malhotra",
    semester: 2,
  },
  {
    id: "9",
    courseId: "7",
    program: "Pilot Training",
    dayOfWeek: "Thursday",
    startTime: "09:00",
    endTime: "11:00",
    classroom: "Flight Simulator SIM-01 (Redbird FMX)",
    instructor: "Capt. Vikram Malhotra",
    semester: 2,
  },
  {
    id: "10",
    courseId: "7",
    program: "Pilot Training",
    dayOfWeek: "Friday",
    startTime: "13:00",
    endTime: "15:00",
    classroom: "Apron Flight Line 04",
    instructor: "Capt. Vikram Malhotra",
    semester: 2,
  },

  // Cabin Crew - Semester 1
  {
    id: "11",
    courseId: "13",
    program: "Cabin Crew",
    dayOfWeek: "Monday",
    startTime: "13:00",
    endTime: "14:30",
    classroom: "Cabin Mockup Hall 301",
    instructor: "Ms. Kavya Shah",
    semester: 1,
  },
  {
    id: "12",
    courseId: "13",
    program: "Cabin Crew",
    dayOfWeek: "Wednesday",
    startTime: "14:00",
    endTime: "16:00",
    classroom: "Aviation Safety & Evacuation Arena",
    instructor: "Ms. Kavya Shah",
    semester: 1,
  },
  {
    id: "13",
    courseId: "13",
    program: "Cabin Crew",
    dayOfWeek: "Friday",
    startTime: "09:00",
    endTime: "11:00",
    classroom: "Grooming & In-flight Demo Lab",
    instructor: "Ms. Kavya Shah",
    semester: 1,
  },
];

let hostelRooms: HostelRoom[] = [
  {
    id: "1",
    roomNumber: "101",
    capacity: 2,
    occupancy: 2,
    type: "double",
    floorNumber: 1,
    charges: 50000,
  },
  {
    id: "2",
    roomNumber: "102",
    capacity: 2,
    occupancy: 1,
    type: "double",
    floorNumber: 1,
    charges: 50000,
  },
  {
    id: "3",
    roomNumber: "201",
    capacity: 3,
    occupancy: 2,
    type: "triple",
    floorNumber: 2,
    charges: 60000,
  },
];

let roomAllocations: RoomAllocation[] = [
  {
    id: "1",
    roomId: "1",
    studentId: "1",
    allocationDate: "2024-08-01",
    status: "active",
    semester: 4,
  },
  {
    id: "2",
    roomId: "2",
    studentId: "2",
    allocationDate: "2024-08-01",
    status: "active",
    semester: 4,
  },
];

export const store = {
  getStudents: () => [...students],
  addStudent: (student: Omit<Student, "id">) => {
    const newStudent = { ...student, id: Date.now().toString() };
    students.push(newStudent);
    return newStudent;
  },
  updateStudent: (id: string, student: Partial<Student>) => {
    const idx = students.findIndex((s) => s.id === id);
    if (idx > -1) {
      students[idx] = { ...students[idx], ...student };
      return students[idx];
    }
  },
  deleteStudent: (id: string) => {
    students = students.filter((s) => s.id !== id);
  },
  getStudentById: (id: string) => students.find((s) => s.id === id),

  getCourses: () => [...courses],
  addCourse: (course: Omit<Course, "id">) => {
    const newCourse = { ...course, id: Date.now().toString() };
    courses.push(newCourse);
    return newCourse;
  },
  updateCourse: (id: string, updated: Partial<Omit<Course, "id">>) => {
    const idx = courses.findIndex((c) => c.id === id);
    if (idx > -1) {
      courses[idx] = { ...courses[idx], ...updated };
      return courses[idx];
    }
  },
  getCourseById: (id: string) => courses.find((c) => c.id === id),
  deleteCourse: (id: string) => {
    courses = courses.filter((c) => c.id !== id);
  },

  getVenues: () => [...trainingVenues],
  addVenue: (venue: Omit<TrainingVenue, "id">) => {
    const newVenue = { ...venue, id: Date.now().toString() };
    trainingVenues.push(newVenue);
    return newVenue;
  },
  updateVenue: (id: string, updated: Partial<Omit<TrainingVenue, "id">>) => {
    const idx = trainingVenues.findIndex((v) => v.id === id);
    if (idx > -1) {
      trainingVenues[idx] = { ...trainingVenues[idx], ...updated };
      return trainingVenues[idx];
    }
  },
  deleteVenue: (id: string) => {
    trainingVenues = trainingVenues.filter((v) => v.id !== id);
  },

  getPrograms: () => [...academicPrograms],
  addProgram: (prog: Omit<AcademicProgram, "id">) => {
    const newProg = { ...prog, id: Date.now().toString() };
    academicPrograms.push(newProg);
    return newProg;
  },
  updateProgram: (id: string, updated: Partial<Omit<AcademicProgram, "id">>) => {
    const idx = academicPrograms.findIndex((p) => p.id === id);
    if (idx > -1) {
      academicPrograms[idx] = { ...academicPrograms[idx], ...updated };
      return academicPrograms[idx];
    }
  },
  deleteProgram: (id: string) => {
    academicPrograms = academicPrograms.filter((p) => p.id !== id);
  },

  getFeeHeads: () => [...feeCategoryHeads],
  addFeeHead: (head: Omit<FeeCategoryHead, "id">) => {
    const newHead = { ...head, id: Date.now().toString() };
    feeCategoryHeads.push(newHead);
    return newHead;
  },
  updateFeeHead: (id: string, updated: Partial<Omit<FeeCategoryHead, "id">>) => {
    const idx = feeCategoryHeads.findIndex((f) => f.id === id);
    if (idx > -1) {
      feeCategoryHeads[idx] = { ...feeCategoryHeads[idx], ...updated };
      return feeCategoryHeads[idx];
    }
  },
  deleteFeeHead: (id: string) => {
    feeCategoryHeads = feeCategoryHeads.filter((f) => f.id !== id);
  },

  getEnrollments: () => [...enrollments],
  getEnrollmentsByStudent: (studentId: string) =>
    enrollments.filter((e) => e.studentId === studentId),
  getEnrollmentsByCourse: (courseId: string) =>
    enrollments.filter((e) => e.courseId === courseId),
  addEnrollment: (enrollment: Omit<Enrollment, "id">) => {
    const newEnrollment = { ...enrollment, id: Date.now().toString() };
    enrollments.push(newEnrollment);
    return newEnrollment;
  },

  getFees: () => [...fees],
  getFeesByStudent: (studentId: string) =>
    fees.filter((f) => f.studentId === studentId),
  addFee: (fee: Omit<Fee, "id">) => {
    const newFee = { ...fee, id: Date.now().toString() };
    fees.push(newFee);
    return newFee;
  },
  updateFeeStatus: (id: string, status: "pending" | "paid" | "overdue") => {
    const idx = fees.findIndex((f) => f.id === id);
    if (idx > -1) {
      fees[idx].status = status;
      if (status === "paid") {
        fees[idx].paidDate = new Date().toISOString().split("T")[0];
      }
      return fees[idx];
    }
  },

  getFaculties: () => [...faculties],
  getFacultyById: (id: string) => faculties.find((f) => f.id === id),
  addFaculty: (faculty: Omit<Faculty, "id">) => {
    const newFaculty = { ...faculty, id: Date.now().toString() };
    faculties.push(newFaculty);
    return newFaculty;
  },
  updateFaculty: (id: string, updated: Partial<Omit<Faculty, "id">>) => {
    const idx = faculties.findIndex((f) => f.id === id);
    if (idx > -1) {
      faculties[idx] = { ...faculties[idx], ...updated };
      return faculties[idx];
    }
  },
  deleteFaculty: (id: string) => {
    faculties = faculties.filter((f) => f.id !== id);
  },

  getAdmissions: () => [...admissions],
  getAdmissionById: (id: string) => admissions.find((a) => a.id === id),
  addAdmission: (admission: Omit<Admission, "id">) => {
    const newAdmission = { ...admission, id: Date.now().toString() };
    admissions.push(newAdmission);
    return newAdmission;
  },
  updateAdmission: (id: string, updated: Partial<Omit<Admission, "id">>) => {
    const idx = admissions.findIndex((a) => a.id === id);
    if (idx > -1) {
      admissions[idx] = { ...admissions[idx], ...updated };
      return admissions[idx];
    }
  },
  updateAdmissionStatus: (
    id: string,
    status: "pending" | "approved" | "rejected" | "under_review" | "medical_verified"
  ) => {
    const idx = admissions.findIndex((a) => a.id === id);
    if (idx > -1) {
      admissions[idx].status = status;
      return admissions[idx];
    }
  },
  deleteAdmission: (id: string) => {
    admissions = admissions.filter((a) => a.id !== id);
  },
  approveAndEnrollCandidate: (admissionId: string) => {
    const candidate = admissions.find((a) => a.id === admissionId);
    if (!candidate) return null;

    candidate.status = "approved";

    // Generate roll number
    const count = students.length + 1;
    const rollNo = `AVN-2026-${count.toString().padStart(3, "0")}`;

    // Create student record
    const newStudent: Student = {
      id: Date.now().toString(),
      rollNo: rollNo,
      name: candidate.applicantName,
      email: candidate.email,
      phone: candidate.phone,
      dob: candidate.dob || "2006-01-01",
      gender: candidate.gender || "Male",
      course: candidate.appliedCourse,
      semester: 1,
      address: "IRIK Academy Residential Campus",
      enrollmentDate: new Date().toISOString().split("T")[0],
    };

    students.push(newStudent);
    return { candidate, student: newStudent };
  },

  getLibraryBooks: () => [...libraryBooks],
  getLibraryBookById: (id: string) => libraryBooks.find((b) => b.id === id),
  addLibraryBook: (book: Omit<LibraryBook, "id">) => {
    const newBook = { ...book, id: Date.now().toString() };
    libraryBooks.push(newBook);
    return newBook;
  },

  getBookIssues: () => [...bookIssues],
  getBookIssuesByStudent: (studentId: string) =>
    bookIssues.filter((bi) => bi.studentId === studentId),
  addBookIssue: (issue: Omit<BookIssue, "id">) => {
    const newIssue = { ...issue, id: Date.now().toString() };
    bookIssues.push(newIssue);
    return newIssue;
  },
  returnBook: (id: string) => {
    const idx = bookIssues.findIndex((bi) => bi.id === id);
    if (idx > -1) {
      bookIssues[idx].status = "returned";
      bookIssues[idx].returnDate = new Date().toISOString().split("T")[0];
      return bookIssues[idx];
    }
  },

  getAttendance: () => [...attendance],
  getAttendanceByStudent: (studentId: string) =>
    attendance.filter((a) => a.studentId === studentId),
  addAttendance: (att: Omit<Attendance, "id">) => {
    const newAtt = { ...att, id: Date.now().toString() + Math.random().toString().slice(2, 6) };
    attendance.push(newAtt);
    return newAtt;
  },
  bulkAddAttendance: (records: Omit<Attendance, "id">[]) => {
    const added: Attendance[] = [];
    records.forEach((r, idx) => {
      const newAtt = { ...r, id: (Date.now() + idx).toString() };
      attendance.push(newAtt);
      added.push(newAtt);
    });
    return added;
  },

  getTimetables: () => [...timetables],
  getTimetableByCourse: (courseId: string) =>
    timetables.filter((t) => t.courseId === courseId),
  addTimetable: (tt: Omit<Timetable, "id">) => {
    const newTimetable = { ...tt, id: Date.now().toString() };
    timetables.push(newTimetable);
    return newTimetable;
  },
  updateTimetable: (id: string, updated: Partial<Omit<Timetable, "id">>) => {
    const idx = timetables.findIndex((t) => t.id === id);
    if (idx > -1) {
      timetables[idx] = { ...timetables[idx], ...updated };
      return timetables[idx];
    }
  },
  deleteTimetable: (id: string) => {
    const idx = timetables.findIndex((t) => t.id === id);
    if (idx > -1) {
      const removed = timetables.splice(idx, 1)[0];
      return removed;
    }
  },

  getHostelRooms: () => [...hostelRooms],
  getHostelRoomById: (id: string) => hostelRooms.find((r) => r.id === id),
  addHostelRoom: (room: Omit<HostelRoom, "id">) => {
    const newRoom = { ...room, id: Date.now().toString() };
    hostelRooms.push(newRoom);
    return newRoom;
  },

  getRoomAllocations: () => [...roomAllocations],
  getRoomAllocationsByStudent: (studentId: string) =>
    roomAllocations.filter((ra) => ra.studentId === studentId),
  addRoomAllocation: (allocation: Omit<RoomAllocation, "id">) => {
    const newAllocation = { ...allocation, id: Date.now().toString() };
    roomAllocations.push(newAllocation);
    return newAllocation;
  },

  // HR & Payroll (Irik.md 4.7)
  getPayrolls: () => [...payrolls],
  addPayroll: (pay: Omit<Payroll, "id">) => {
    const newPay = { ...pay, id: Date.now().toString() };
    payrolls.unshift(newPay);
    return newPay;
  },
  updatePayrollStatus: (id: string, status: "pending" | "paid") => {
    const p = payrolls.find((item) => item.id === id);
    if (p) {
      p.status = status;
      if (status === "paid") p.paidDate = new Date().toISOString().split("T")[0];
      return p;
    }
  },
  getLeaveRequests: () => [...leaveRequests],
  addLeaveRequest: (req: Omit<LeaveRequest, "id">) => {
    const newReq = { ...req, id: Date.now().toString() };
    leaveRequests.unshift(newReq);
    return newReq;
  },
  updateLeaveStatus: (id: string, status: "pending" | "approved" | "rejected") => {
    const req = leaveRequests.find((l) => l.id === id);
    if (req) {
      req.status = status;
      return req;
    }
  },

  // Finance & Accounting (Irik.md 4.8)
  getFinanceTransactions: () => [...financeTransactions],
  addFinanceTransaction: (tx: Omit<FinanceTransaction, "id">) => {
    const newTx = { ...tx, id: Date.now().toString() };
    financeTransactions.unshift(newTx);
    return newTx;
  },
  getBudgets: () => [...budgets],

  // Assets & Compliance (Irik.md 4.9)
  getAssets: () => [...assets],
  addAsset: (asset: Omit<Asset, "id">) => {
    const newAsset = { ...asset, id: Date.now().toString() };
    assets.push(newAsset);
    return newAsset;
  },
  updateAssetHours: (id: string, additionalHours: number) => {
    const a = assets.find((item) => item.id === id);
    if (a) {
      a.totalHours += additionalHours;
      return a;
    }
  },
  getMaintenanceLogs: () => [...maintenanceLogs],
  addMaintenanceLog: (log: Omit<MaintenanceLog, "id">) => {
    const newLog = { ...log, id: Date.now().toString() };
    maintenanceLogs.unshift(newLog);
    return newLog;
  },

  // LMS / E-Learning (Irik.md 4.10)
  getLMSContent: () => [...lmsContent],
  addLMSContent: (content: Omit<LMSContent, "id">) => {
    const newContent = { ...content, id: Date.now().toString() };
    lmsContent.unshift(newContent);
    return newContent;
  },
  getQuizzes: () => [...quizzes],
  getQuizById: (id: string) => quizzes.find((q) => q.id === id),
  addQuizSubmission: (submission: Omit<QuizSubmission, "id">) => {
    const newSub = { ...submission, id: Date.now().toString() };
    quizSubmissions.unshift(newSub);
    return newSub;
  },
  getQuizSubmissions: () => [...quizSubmissions],

  // ID Cards (Irik.md 4.11)
  getIDCards: () => [...idCards],
  getIDCardByOwner: (ownerId: string) => idCards.find((c) => c.ownerId === ownerId),
  addIDCard: (card: Omit<IDCard, "id">) => {
    const newCard = { ...card, id: Date.now().toString() };
    idCards.push(newCard);
    return newCard;
  },

  // Feedback & Complaints (Irik.md 4.12)
  getFeedbackTickets: () => [...feedbackTickets],
  addFeedbackTicket: (ticket: Omit<FeedbackTicket, "id">) => {
    const newTicket = { ...ticket, id: Date.now().toString() };
    feedbackTickets.unshift(newTicket);
    return newTicket;
  },
  updateTicketStatus: (id: string, status: "open" | "in_progress" | "resolved", notes?: string, rating?: number) => {
    const t = feedbackTickets.find((item) => item.id === id);
    if (t) {
      t.status = status;
      if (notes) t.resolutionNotes = notes;
      if (rating) t.rating = rating;
      return t;
    }
  },

  // Alumni & Placement (Irik.md 4.13)
  getAlumniRecords: () => [...alumniRecords],
  addAlumniRecord: (rec: Omit<AlumniRecord, "id">) => {
    const newRec = { ...rec, id: Date.now().toString() };
    alumniRecords.unshift(newRec);
    return newRec;
  },

  // Instructor Evaluation (Irik.md 4.15)
  getInstructorEvaluations: () => [...instructorEvaluations],
  addInstructorEvaluation: (ev: Omit<InstructorEvaluation, "id">) => {
    const newEv = { ...ev, id: Date.now().toString() };
    instructorEvaluations.unshift(newEv);
    return newEv;
  },

  // Signed Documents (Irik.md 4.16)
  getSignedDocuments: () => [...signedDocuments],
  addSignedDocument: (doc: Omit<SignedDocument, "id">) => {
    const newDoc = { ...doc, id: Date.now().toString() };
    signedDocuments.unshift(newDoc);
    return newDoc;
  },

  // Visitor & Gate Management (Irik.md 4.17)
  getVisitorLogs: () => [...visitorLogs],
  addVisitorLog: (v: Omit<VisitorLog, "id">) => {
    const newV = { ...v, id: Date.now().toString() };
    visitorLogs.unshift(newV);
    return newV;
  },
  checkoutVisitor: (id: string) => {
    const v = visitorLogs.find((item) => item.id === id);
    if (v) {
      v.status = "checked_out";
      v.exitTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      return v;
    }
  },

  // Roles & Permissions (Irik.md 4.18)
  getCustomRoles: () => [...customRoles],
  addCustomRole: (role: Omit<CustomRole, "id">) => {
    const newRole = { ...role, id: Date.now().toString() };
    customRoles.push(newRole);
    return newRole;
  },
  getRolePermissions: (roleId: string) => rolePermissions.filter((p) => p.roleId === roleId),
  updateRolePermission: (roleId: string, moduleName: string, actions: RolePermission["actions"]) => {
    const perm = rolePermissions.find((p) => p.roleId === roleId && p.module === moduleName);
    if (perm) {
      perm.actions = actions;
      return perm;
    } else {
      const newPerm = { roleId, module: moduleName, actions };
      rolePermissions.push(newPerm);
      return newPerm;
    }
  },

  // Settings & Audit Logs (Irik.md 4.19)
  getInstituteSettings: () => ({ ...instituteSettings }),
  updateInstituteSettings: (newSettings: Partial<InstituteSettings>) => {
    instituteSettings = { ...instituteSettings, ...newSettings };
    return instituteSettings;
  },
  getAuditLogs: () => [...auditLogs],
  addAuditLog: (log: Omit<AuditLog, "id" | "timestamp">) => {
    const newLog: AuditLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
    auditLogs.unshift(newLog);
    return newLog;
  },
};

// Seed Data for All Modules
let payrolls: Payroll[] = [
  {
    id: "1",
    staffId: "1",
    staffName: "Prof. Rajesh Kumar",
    month: "August",
    year: 2026,
    basicPay: 120000,
    allowances: 35000,
    deductions: 15000,
    netPay: 140000,
    status: "paid",
    paidDate: "2026-08-01",
  },
  {
    id: "2",
    staffId: "2",
    staffName: "Dr. Amit Patel",
    month: "August",
    year: 2026,
    basicPay: 110000,
    allowances: 30000,
    deductions: 12000,
    netPay: 128000,
    status: "paid",
    paidDate: "2026-08-01",
  },
  {
    id: "3",
    staffId: "3",
    staffName: "Dr. Neha Sharma",
    month: "August",
    year: 2026,
    basicPay: 115000,
    allowances: 32000,
    deductions: 14000,
    netPay: 133000,
    status: "paid",
    paidDate: "2026-08-01",
  },
  {
    id: "4",
    staffId: "4",
    staffName: "Capt. Vikram Malhotra",
    month: "August",
    year: 2026,
    basicPay: 220000,
    allowances: 60000,
    deductions: 25000,
    netPay: 255000,
    status: "pending",
  },
  {
    id: "5",
    staffId: "5",
    staffName: "Ms. Kavya Shah",
    month: "August",
    year: 2026,
    basicPay: 75000,
    allowances: 20000,
    deductions: 8000,
    netPay: 87000,
    status: "pending",
  },
];

let leaveRequests: LeaveRequest[] = [
  {
    id: "1",
    staffId: "2",
    staffName: "Dr. Amit Patel",
    leaveType: "Casual Leave",
    startDate: "2026-08-15",
    endDate: "2026-08-16",
    days: 2,
    reason: "Attending Aviation Regulatory Seminar",
    status: "approved",
  },
  {
    id: "2",
    staffId: "4",
    staffName: "Capt. Vikram Malhotra",
    leaveType: "Flight Medical Leave",
    startDate: "2026-08-28",
    endDate: "2026-08-30",
    days: 3,
    reason: "Annual DGCA Class 1 Medical Renewal Examination",
    status: "pending",
  },
];

let financeTransactions: FinanceTransaction[] = [
  {
    id: "1",
    type: "income",
    category: "Tuition Fees",
    amount: 1850000,
    date: "2026-08-10",
    description: "Term 1 Tuition Fee Collection Batch 2026",
    paymentMethod: "bank_transfer",
    department: "Academic",
  },
  {
    id: "2",
    type: "income",
    category: "Simulator Training Fees",
    amount: 420000,
    date: "2026-08-12",
    description: "Multi-Engine Simulator Slot Bookings",
    paymentMethod: "upi",
    department: "Flight Operations",
  },
  {
    id: "3",
    type: "expense",
    category: "Aviation Fuel",
    amount: 680000,
    date: "2026-08-14",
    description: "Avgas 100LL Bulk Refueling for Cessna & Piper Fleet",
    paymentMethod: "bank_transfer",
    department: "Flight Operations",
  },
  {
    id: "4",
    type: "expense",
    category: "Aircraft Maintenance",
    amount: 215000,
    date: "2026-08-18",
    description: "DGCA 100-Hour Mandatory Airframe & Avionics Inspection",
    paymentMethod: "bank_transfer",
    department: "Maintenance",
  },
  {
    id: "5",
    type: "expense",
    category: "Staff Payroll",
    amount: 850000,
    date: "2026-08-01",
    description: "Monthly Faculty & Operations Staff Salaries",
    paymentMethod: "bank_transfer",
    department: "Administration",
  },
];

let budgets: Budget[] = [
  {
    id: "1",
    department: "Flight Training Operations",
    allocatedAmount: 4500000,
    spentAmount: 2850000,
    fiscalYear: "2026-2027",
  },
  {
    id: "2",
    department: "Simulator Complex",
    allocatedAmount: 2000000,
    spentAmount: 1120000,
    fiscalYear: "2026-2027",
  },
  {
    id: "3",
    department: "Academic & LMS",
    allocatedAmount: 1500000,
    spentAmount: 840000,
    fiscalYear: "2026-2027",
  },
  {
    id: "4",
    department: "Maintenance & Compliance",
    allocatedAmount: 2500000,
    spentAmount: 1690000,
    fiscalYear: "2026-2027",
  },
];

let assets: Asset[] = [
  {
    id: "1",
    name: "Cessna 172 Skyhawk",
    type: "aircraft",
    registrationNumber: "VT-IRK",
    status: "active",
    totalHours: 1420,
    lastMaintenanceDate: "2026-07-20",
    nextMaintenanceDue: "2026-09-20",
    dgcaComplianceStatus: "compliant",
  },
  {
    id: "2",
    name: "Piper PA-28 Archer",
    type: "aircraft",
    registrationNumber: "VT-IRA",
    status: "active",
    totalHours: 980,
    lastMaintenanceDate: "2026-08-01",
    nextMaintenanceDue: "2026-10-01",
    dgcaComplianceStatus: "compliant",
  },
  {
    id: "3",
    name: "Redbird FMX Multi-Engine Simulator",
    type: "simulator",
    registrationNumber: "SIM-01",
    status: "active",
    totalHours: 2840,
    lastMaintenanceDate: "2026-07-15",
    nextMaintenanceDue: "2026-09-15",
    dgcaComplianceStatus: "compliant",
  },
  {
    id: "4",
    name: "ALSIM ALX FNPT II Simulator",
    type: "simulator",
    registrationNumber: "SIM-02",
    status: "maintenance",
    totalHours: 3120,
    lastMaintenanceDate: "2026-06-10",
    nextMaintenanceDue: "2026-08-30",
    dgcaComplianceStatus: "inspection_due",
  },
  {
    id: "5",
    name: "Doppler Aviation Weather Radar Lab Unit",
    type: "equipment",
    registrationNumber: "EQ-RAD-09",
    status: "active",
    totalHours: 890,
    lastMaintenanceDate: "2026-05-18",
    nextMaintenanceDue: "2026-11-18",
    dgcaComplianceStatus: "compliant",
  },
];

let maintenanceLogs: MaintenanceLog[] = [
  {
    id: "1",
    assetId: "1",
    assetName: "Cessna 172 Skyhawk (VT-IRK)",
    description: "100-Hour Mandatory Airframe & Engine Overhaul inspection",
    performedBy: "Chief AME Rajeshwar Rao",
    date: "2026-07-20",
    cost: 45000,
    complianceDocUrl: "/docs/compliance/VT-IRK-100hr.pdf",
    nextDueDate: "2026-09-20",
  },
  {
    id: "2",
    assetId: "4",
    assetName: "ALSIM ALX FNPT II Simulator (SIM-02)",
    description: "Avionics Multi-Screen Visual Projector Calibration & Force Feedback Repair",
    performedBy: "Sim Tech Avionics Ltd",
    date: "2026-08-22",
    cost: 32000,
    complianceDocUrl: "/docs/compliance/SIM-02-Calib.pdf",
    nextDueDate: "2026-08-30",
  },
];

let lmsContent: LMSContent[] = [
  {
    id: "1",
    courseId: "1",
    courseName: "BBA Aviation",
    title: "Aviation Meteorology & Weather Hazards Manual (Rev 2026)",
    type: "manual",
    fileUrl: "/content/aviation-met-2026.pdf",
    uploadedBy: "Dr. Amit Patel",
    uploadDate: "2026-08-05",
    size: "14.2 MB",
  },
  {
    id: "2",
    courseId: "7",
    courseName: "Pilot Training",
    title: "Pre-Flight Walkaround & Cockpit Checklist Guide (Cessna 172)",
    type: "checklist",
    fileUrl: "/content/cessna-checklist.pdf",
    uploadedBy: "Capt. Vikram Malhotra",
    uploadDate: "2026-08-11",
    size: "3.8 MB",
  },
  {
    id: "3",
    courseId: "4",
    courseName: "BSc Aviation",
    title: "Aerodynamics & Principles of Flight Video Lecture Series",
    type: "video",
    fileUrl: "/content/aerodynamics-lecture.mp4",
    uploadedBy: "Dr. Neha Sharma",
    uploadDate: "2026-08-15",
    size: "145 MB",
  },
  {
    id: "4",
    courseId: "13",
    courseName: "Cabin Crew",
    title: "Emergency Evacuation & In-Flight First Aid Protocols",
    type: "notes",
    fileUrl: "/content/cabin-crew-safety.pdf",
    uploadedBy: "Ms. Kavya Shah",
    uploadDate: "2026-08-18",
    size: "5.1 MB",
  },
];

let quizzes: Quiz[] = [
  {
    id: "1",
    courseId: "7",
    courseName: "Pilot Training",
    title: "DGCA Ground School: Aerodynamics & Flight Principles",
    totalMarks: 20,
    durationMinutes: 15,
    questions: [
      {
        id: "q1",
        question: "What is the primary factor that causes aerodynamic lift on an airfoil?",
        options: ["Gravity differential", "Pressure differential (Bernoulli's Principle & Newton's 3rd Law)", "Engine thrust alone", "Angle of climb"],
        correctIndex: 1,
      },
      {
        id: "q2",
        question: "What happens when an aircraft exceeds its critical angle of attack?",
        options: ["Speed doubles", "Aerodynamic Stall occurs", "Altitude increases rapidly", "Fuel consumption drops"],
        correctIndex: 1,
      },
      {
        id: "q3",
        question: "Which flight control surface controls aircraft pitch about the lateral axis?",
        options: ["Ailerons", "Rudder", "Elevator", "Flaps"],
        correctIndex: 2,
      },
      {
        id: "q4",
        question: "In standard atmospheric conditions (ISA), what is the sea level pressure in hPa/mb?",
        options: ["1013.25 hPa", "980.5 hPa", "1025.0 hPa", "1000.0 hPa"],
        correctIndex: 0,
      },
      {
        id: "q5",
        question: "What is the primary function of wing flaps during approach and landing?",
        options: ["Increase top speed", "Increase lift and drag at lower airspeeds", "Cool the engines", "Lock the landing gear"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "2",
    courseId: "1",
    courseName: "BBA Aviation",
    title: "Airport Ground Operations & IATA Standards Test",
    totalMarks: 20,
    durationMinutes: 15,
    questions: [
      {
        id: "q1",
        question: "What does the 3-letter IATA code 'DEL' represent?",
        options: ["Dallas Airport", "Indira Gandhi International Airport, Delhi", "Dammam Airport", "Dublin Airport"],
        correctIndex: 1,
      },
      {
        id: "q2",
        question: "What is the designated safety area between an aircraft hangar and runway called?",
        options: ["Apron / Ramp Area", "Terminal Lounge", "Holding Cell", "Cargo Bay"],
        correctIndex: 0,
      },
      {
        id: "q3",
        question: "Which global organization establishes worldwide civil aviation safety regulations?",
        options: ["WHO", "ICAO (International Civil Aviation Organization)", "UNICEF", "NATO"],
        correctIndex: 1,
      },
      {
        id: "q4",
        question: "What is the primary role of the Air Traffic Control (ATC) Tower controller?",
        options: ["Ticket issuance", "Active runway operations and aerodrome traffic separation", "Luggage loading", "Catering inspection"],
        correctIndex: 1,
      },
    ],
  },
];

let quizSubmissions: QuizSubmission[] = [
  {
    id: "1",
    quizId: "1",
    studentId: "1",
    studentName: "Rajesh Kumar",
    score: 18,
    totalMarks: 20,
    submittedAt: "2026-08-20 14:30",
    passed: true,
  },
  {
    id: "2",
    quizId: "1",
    studentId: "2",
    studentName: "Priya Singh",
    score: 20,
    totalMarks: 20,
    submittedAt: "2026-08-20 15:10",
    passed: true,
  },
];

let idCards: IDCard[] = [
  {
    id: "1",
    ownerType: "student",
    ownerId: "1",
    name: "Rajesh Kumar",
    rollOrEmpNo: "CS001",
    departmentOrCourse: "B.Tech CS / Aviation Ops",
    bloodGroup: "O+",
    emergencyContact: "+91 98765 43210",
    issuedDate: "2022-08-01",
    validUntil: "2026-08-01",
    qrPayload: "IRIK-STU-CS001-RAJESH",
    status: "active",
  },
  {
    id: "2",
    ownerType: "student",
    ownerId: "2",
    name: "Priya Singh",
    rollOrEmpNo: "CS002",
    departmentOrCourse: "B.Tech CS / Aviation Ops",
    bloodGroup: "B+",
    emergencyContact: "+91 98765 43211",
    issuedDate: "2022-08-01",
    validUntil: "2026-08-01",
    qrPayload: "IRIK-STU-CS002-PRIYA",
    status: "active",
  },
  {
    id: "3",
    ownerType: "staff",
    ownerId: "2",
    name: "Dr. Amit Patel",
    rollOrEmpNo: "EMP-102",
    departmentOrCourse: "Aviation Management",
    bloodGroup: "A+",
    emergencyContact: "+91 98765 43202",
    issuedDate: "2024-01-15",
    validUntil: "2028-01-15",
    qrPayload: "IRIK-FAC-EMP102-AMIT",
    status: "active",
  },
  {
    id: "4",
    ownerType: "staff",
    ownerId: "4",
    name: "Capt. Vikram Malhotra",
    rollOrEmpNo: "EMP-104",
    departmentOrCourse: "Chief Flight Instructor",
    bloodGroup: "AB+",
    emergencyContact: "+91 98765 43204",
    issuedDate: "2023-06-01",
    validUntil: "2028-06-01",
    qrPayload: "IRIK-FAC-EMP104-VIKRAM",
    status: "active",
  },
];

let feedbackTickets: FeedbackTicket[] = [
  {
    id: "1",
    raisedBy: "Rajesh Kumar",
    raisedByRole: "student",
    category: "simulator",
    subject: "Visual stutter on SIM-02 during crosswind approach scenario",
    description: "During 15-knot crosswind landing practice on SIM-02, the projector screen experienced momentary frame drops.",
    status: "in_progress",
    priority: "high",
    resolutionNotes: "Avionics team scheduled projector visual recalibration.",
    createdAt: "2026-08-24 11:20",
  },
  {
    id: "2",
    raisedBy: "Priya Singh",
    raisedByRole: "student",
    category: "facility",
    subject: "Request for extended library hours during DGCA exam week",
    description: "Requesting library to stay open until 10 PM for group study and charts preparation.",
    status: "resolved",
    priority: "medium",
    rating: 5,
    resolutionNotes: "Library hours extended to 10:30 PM until August 31st.",
    createdAt: "2026-08-19 16:45",
  },
  {
    id: "3",
    raisedBy: "Mr. Suresh Kumar",
    raisedByRole: "parent",
    category: "academics",
    subject: "Query regarding flight hours logbook certification",
    description: "Requesting signed statement of completed simulator hours for DGCA license submission.",
    status: "open",
    priority: "medium",
    createdAt: "2026-08-26 09:15",
  },
];

let alumniRecords: AlumniRecord[] = [
  {
    id: "1",
    name: "Capt. Rahul Verma",
    rollNo: "AVN2019-014",
    course: "Pilot Training / CPL",
    graduationYear: 2023,
    currentCompany: "IndiGo Airlines",
    designation: "First Officer (A320neo)",
    location: "Bangalore (BLR)",
    referralOptIn: true,
    email: "rahul.verma@alumni.irik.edu",
    phone: "+91 98450 11223",
  },
  {
    id: "2",
    name: "Sneha Kulkarni",
    rollNo: "CAB2020-042",
    course: "Cabin Crew & Hospitality",
    graduationYear: 2023,
    currentCompany: "Air India",
    designation: "Senior Flight Attendant (B777/B787)",
    location: "Mumbai (BOM)",
    referralOptIn: true,
    email: "sneha.k@alumni.irik.edu",
    phone: "+91 98210 99887",
  },
  {
    id: "3",
    name: "Rohan Mehta",
    rollNo: "BBA2018-009",
    course: "BBA Aviation Management",
    graduationYear: 2022,
    currentCompany: "Emirates",
    designation: "Flight Operations & Dispatch Officer",
    location: "Dubai (DXB)",
    referralOptIn: true,
    email: "rohan.mehta@alumni.irik.edu",
    phone: "+971 50 123 4567",
  },
  {
    id: "4",
    name: "Ananya Das",
    rollNo: "BBA2021-031",
    course: "BBA Aviation Management",
    graduationYear: 2024,
    currentCompany: "SpiceJet",
    designation: "Airport Operations & Ramp Coordinator",
    location: "New Delhi (DEL)",
    referralOptIn: true,
    email: "ananya.das@alumni.irik.edu",
    phone: "+91 99100 44332",
  },
];

let instructorEvaluations: InstructorEvaluation[] = [
  {
    id: "1",
    instructorId: "2",
    instructorName: "Dr. Amit Patel",
    studentId: "1",
    courseId: "1",
    courseName: "BBA Aviation",
    ratings: {
      teaching: 5,
      communication: 5,
      punctuality: 5,
      practicalTraining: 4,
    },
    comments: "Exceptional mastery in DGCA regulations and airport operations case studies.",
    submittedAt: "2026-08-21 16:00",
  },
  {
    id: "2",
    instructorId: "4",
    instructorName: "Capt. Vikram Malhotra",
    studentId: "2",
    courseId: "7",
    courseName: "Pilot Training",
    ratings: {
      teaching: 5,
      communication: 5,
      punctuality: 5,
      practicalTraining: 5,
    },
    comments: "Very thorough during cockpit briefings, stall recovery, and crosswind landings in the simulator.",
    submittedAt: "2026-08-22 17:30",
  },
];

let signedDocuments: SignedDocument[] = [
  {
    id: "1",
    ownerId: "1",
    ownerName: "Rajesh Kumar",
    ownerType: "student",
    documentType: "flight_medical_clearance",
    title: "DGCA Class 1 Medical Clearance & Flight Liability Waiver",
    signedDate: "2026-08-01 10:15",
    signerIp: "103.21.54.12",
    verificationHash: "SHA256:8f9b7c2a1e3d4f5678901234567890abcdef1234567890abcdef1234567890ab",
    status: "signed",
  },
  {
    id: "2",
    ownerId: "2",
    ownerName: "Priya Singh",
    ownerType: "student",
    documentType: "admission_contract",
    title: "IRIK Academic Honor Code & Aviation Safety Contract",
    signedDate: "2026-08-01 11:40",
    signerIp: "103.21.54.19",
    verificationHash: "SHA256:3e4c5b6a7d8e9f01234567890abcdef1234567890abcdef1234567890abcdef12",
    status: "signed",
  },
  {
    id: "3",
    ownerId: "1",
    ownerName: "Mr. Suresh Kumar",
    ownerType: "parent",
    documentType: "indemnity_consent",
    title: "Parental Consent & Fee Installment Commitment Agreement",
    signedDate: "2026-08-02 09:30",
    signerIp: "49.207.182.55",
    verificationHash: "SHA256:7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
    status: "signed",
  },
];

let visitorLogs: VisitorLog[] = [
  {
    id: "1",
    visitorName: "Capt. Arvind Swaminathan",
    phone: "+91 98401 22334",
    purpose: "DGCA Flight Training Organization Safety Audit",
    hostStaffName: "Dr. Amit Patel",
    areaAccessed: "Flight Hangar",
    entryTime: "09:30 AM",
    badgeNumber: "VIS-2026-089",
    status: "inside",
  },
  {
    id: "2",
    visitorName: "Mr. Suresh Kumar",
    phone: "+91 98765 43210",
    purpose: "Parent Fee Payment & Counseling Meeting",
    hostStaffName: "Admissions & Accounts Office",
    areaAccessed: "Admin Office",
    entryTime: "10:15 AM",
    exitTime: "11:45 AM",
    badgeNumber: "VIS-2026-090",
    status: "checked_out",
  },
  {
    id: "3",
    visitorName: "Eng. Deepak Joshi",
    phone: "+91 97112 33445",
    purpose: "Sim Tech Avionics Visual Projector Calibration",
    hostStaffName: "Capt. Vikram Malhotra",
    areaAccessed: "Simulator Complex",
    entryTime: "11:00 AM",
    badgeNumber: "VIS-2026-091",
    status: "inside",
  },
];

let customRoles: CustomRole[] = [
  { id: "1", name: "Super Admin", tier: "super_admin", department: "Executive", isCustom: false },
  { id: "2", name: "Flight Operations Manager", tier: "manager", department: "Operations", isCustom: true },
  { id: "3", name: "Academic Dean", tier: "manager", department: "Academics", isCustom: false },
  { id: "4", name: "Chief Financial Officer", tier: "manager", department: "Finance", isCustom: false },
  { id: "5", name: "Ground School Instructor", tier: "staff", department: "Academics", isCustom: false },
  { id: "6", name: "Gate & Security Officer", tier: "staff", department: "Security", isCustom: false },
];

let rolePermissions: RolePermission[] = [
  { roleId: "1", module: "Admissions", actions: { view: true, create: true, edit: true, delete: true, approve: true } },
  { roleId: "1", module: "Students", actions: { view: true, create: true, edit: true, delete: true, approve: true } },
  { roleId: "1", module: "Timetable", actions: { view: true, create: true, edit: true, delete: true, approve: true } },
  { roleId: "1", module: "Fees & Finance", actions: { view: true, create: true, edit: true, delete: true, approve: true } },
  { roleId: "1", module: "HR & Payroll", actions: { view: true, create: true, edit: true, delete: true, approve: true } },
  { roleId: "1", module: "Assets & Maintenance", actions: { view: true, create: true, edit: true, delete: true, approve: true } },
  { roleId: "2", module: "Assets & Maintenance", actions: { view: true, create: true, edit: true, delete: false, approve: true } },
  { roleId: "2", module: "Timetable", actions: { view: true, create: true, edit: true, delete: false, approve: true } },
];

let instituteSettings: InstituteSettings = {
  instituteName: "IRIK International Institute of Aviation",
  tagLine: "Premier DGCA Approved Aviation Academy & Flight Training Organization",
  address: "IRIK Aviation Campus, Hangar Complex, Aerodrome Road, Bangalore, India - 560047",
  email: "admissions@irik.edu.in",
  phone: "+91 (080) 4567-8900",
  dgcaApprovalNumber: "DGCA/FTO/ATO-2026/049",
  academicYear: "2026-2027",
  currency: "INR (₹)",
  paymentGatewayEnabled: true,
  upiId: "irikaviation@icici",
  smsEnabled: true,
  emailNotifEnabled: true,
  whatsappEnabled: true,
};

let auditLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: "2026-08-27 07:15:30",
    user: "admin",
    action: "UPDATE",
    module: "Assets & Maintenance",
    details: "Scheduled 100-Hour DGCA inspection for Cessna 172 (VT-IRK)",
  },
  {
    id: "2",
    timestamp: "2026-08-26 16:45:12",
    user: "admin",
    action: "CREATE",
    module: "HR & Payroll",
    details: "Generated August 2026 payroll batch for 5 faculty members",
  },
  {
    id: "3",
    timestamp: "2026-08-26 11:20:05",
    user: "staff",
    action: "APPROVE",
    module: "Admissions",
    details: "Approved admission application for applicant Ankit Sharma (BBA Aviation)",
  },
  {
    id: "4",
    timestamp: "2026-08-25 14:10:40",
    user: "parent",
    action: "PAYMENT",
    module: "Fees",
    details: "Online UPI payment received: ₹50,000 for student Rajesh Kumar (CS001)",
  },
];
