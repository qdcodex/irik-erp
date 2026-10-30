# MongoDB Integration Guide

## Database Configuration

### Environment Setup

Create `.env.local` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/erp
NODE_ENV=development
```

### Connection

The application automatically connects to MongoDB when API routes are called.

Database connection utility: `lib/db.ts`

## Database Schema

### 13 Collections Created

#### 1. **users**
```json
{
  "username": "string (unique)",
  "email": "string (unique)",
  "password": "string",
  "role": "admin|faculty|student|staff",
  "fullName": "string",
  "avatar": "string (optional)",
  "timestamps": true
}
```

#### 2. **students**
```json
{
  "rollNo": "string (unique)",
  "name": "string",
  "email": "string (unique)",
  "phone": "string",
  "dob": "date",
  "gender": "string",
  "course": "string",
  "semester": "number",
  "address": "string",
  "enrollmentDate": "date",
  "timestamps": true
}
```

#### 3. **courses**
```json
{
  "code": "string (unique)",
  "name": "string",
  "credits": "number",
  "semester": "number",
  "instructor": "string",
  "timestamps": true
}
```

#### 4. **enrollments**
```json
{
  "studentId": "ObjectId (ref: Student)",
  "courseId": "ObjectId (ref: Course)",
  "grade": "string",
  "marks": "number",
  "semester": "number",
  "timestamps": true
}
```

#### 5. **fees**
```json
{
  "studentId": "ObjectId (ref: Student)",
  "amount": "number",
  "feeType": "string",
  "dueDate": "date",
  "paidDate": "date (optional)",
  "status": "pending|paid|overdue",
  "semester": "number",
  "timestamps": true
}
```

#### 6. **faculties**
```json
{
  "name": "string",
  "email": "string (unique)",
  "phone": "string",
  "department": "string",
  "qualification": "string",
  "joiningDate": "date",
  "timestamps": true
}
```

#### 7. **admissions**
```json
{
  "applicantName": "string",
  "email": "string",
  "phone": "string",
  "appliedCourse": "string",
  "appliedDate": "date",
  "status": "pending|approved|rejected",
  "marks": "number",
  "timestamps": true
}
```

#### 8. **librarybooks**
```json
{
  "isbn": "string",
  "title": "string",
  "author": "string",
  "category": "string",
  "totalCopies": "number",
  "availableCopies": "number",
  "publicationYear": "number",
  "timestamps": true
}
```

#### 9. **bookissues**
```json
{
  "studentId": "ObjectId (ref: Student)",
  "bookId": "ObjectId (ref: LibraryBook)",
  "issueDate": "date",
  "returnDate": "date (optional)",
  "dueDate": "date",
  "status": "issued|returned|overdue",
  "timestamps": true
}
```

#### 10. **attendances**
```json
{
  "studentId": "ObjectId (ref: Student)",
  "courseId": "ObjectId (ref: Course)",
  "date": "date",
  "status": "present|absent|late",
  "semester": "number",
  "timestamps": true
}
```

#### 11. **timetables**
```json
{
  "courseId": "ObjectId (ref: Course)",
  "dayOfWeek": "string",
  "startTime": "string (HH:MM)",
  "endTime": "string (HH:MM)",
  "classroom": "string",
  "instructor": "string",
  "semester": "number",
  "timestamps": true
}
```

#### 12. **hostelrooms**
```json
{
  "roomNumber": "string (unique)",
  "capacity": "number",
  "occupancy": "number",
  "type": "single|double|triple",
  "floorNumber": "number",
  "charges": "number",
  "timestamps": true
}
```

#### 13. **romallocations**
```json
{
  "roomId": "ObjectId (ref: HostelRoom)",
  "studentId": "ObjectId (ref: Student)",
  "allocationDate": "date",
  "releaseDate": "date (optional)",
  "status": "active|released",
  "semester": "number",
  "timestamps": true
}
```

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `GET /api/students/[id]` - Get student by ID
- `PUT /api/students/[id]` - Update student
- `DELETE /api/students/[id]` - Delete student

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course
- `GET /api/courses/[id]` - Get course by ID

### Other Entities
Similar endpoints available for:
- `/api/enrollments`
- `/api/fees`
- `/api/faculties`
- `/api/admissions`
- `/api/library-books`
- `/api/book-issues`
- `/api/attendance`
- `/api/timetables`
- `/api/hostel-rooms`
- `/api/room-allocations`

### Database Initialization
- `POST /api/init` - Initialize database with sample data

## Sample Data

The `POST /api/init` endpoint creates:
- 6 users (1 admin, 2 faculty, 2 students, 1 staff)
- 2 students with full details
- 3 courses
- 2 faculty members
- 4 enrollments
- 2 fee records
- 2 library books
- 2 attendance records
- 2 timetable entries
- 2 hostel rooms
- 2 room allocations
- 2 admission applications

## Usage

### Initialize Database

```bash
curl -X POST http://localhost:3000/api/init
```

### Fetch Students

```bash
curl http://localhost:3000/api/students
```

### Create Student

```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "rollNo": "CS003",
    "name": "John Doe",
    "email": "john@college.edu",
    "phone": "9876543212",
    "course": "B.Tech CS",
    "semester": 4
  }'
```

## Database Backup & Restore

### Backup
```bash
mongodump --db erp --out ./backup
```

### Restore
```bash
mongorestore --db erp ./backup/erp
```

## Performance Optimization

- Indexes are automatically created on unique fields
- ObjectId references enable efficient joins
- Timestamps auto-track creation and modification
- Consider adding indexes on frequently queried fields

## Future Enhancements

- Add API authentication/authorization
- Implement pagination for large datasets
- Add data validation middleware
- Create backup automation
- Add data archival strategy
- Implement rate limiting
