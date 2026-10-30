import { User, AuthUser } from "./types";

let users: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@college.edu",
    password: "admin123",
    role: "admin",
    fullName: "System Administrator",
  },
  {
    id: "2",
    username: "dr_amit",
    email: "amit@college.edu",
    password: "faculty123",
    role: "faculty",
    fullName: "Dr. Amit Patel",
  },
  {
    id: "3",
    username: "dr_neha",
    email: "neha@college.edu",
    password: "faculty123",
    role: "faculty",
    fullName: "Dr. Neha Sharma",
  },
  {
    id: "4",
    username: "rajesh",
    email: "rajesh@college.edu",
    password: "student123",
    role: "student",
    fullName: "Rajesh Kumar",
  },
  {
    id: "5",
    username: "priya",
    email: "priya@college.edu",
    password: "student123",
    role: "student",
    fullName: "Priya Singh",
  },
  {
    id: "6",
    username: "staff",
    email: "staff@college.edu",
    password: "staff123",
    role: "staff",
    fullName: "College Staff",
  },
  {
    id: "7",
    username: "parent",
    email: "parent.kumar@gmail.com",
    password: "parent123",
    role: "parent",
    fullName: "Mr. Suresh Kumar (Parent of Rajesh)",
  },
];

export const authStore = {
  login: (username: string, password: string): AuthUser | null => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      const { password: _, ...authUser } = user;
      return authUser as AuthUser;
    }
    return null;
  },

  getUserById: (id: string): AuthUser | null => {
    const user = users.find((u) => u.id === id);
    if (user) {
      const { password: _, ...authUser } = user;
      return authUser as AuthUser;
    }
    return null;
  },

  getAllUsers: (): AuthUser[] => {
    return users.map(({ password: _, ...user }) => user as AuthUser);
  },

  addUser: (newUser: Omit<User, "id">): AuthUser => {
    const user: User = {
      ...newUser,
      id: Date.now().toString(),
    };
    users.push(user);
    const { password: _, ...authUser } = user;
    return authUser as AuthUser;
  },
};

// Sample demo credentials
export const DEMO_CREDENTIALS = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "dr_amit", password: "faculty123", role: "faculty" },
  { username: "rajesh", password: "student123", role: "student" },
  { username: "staff", password: "staff123", role: "staff" },
  { username: "parent", password: "parent123", role: "parent" },
];
