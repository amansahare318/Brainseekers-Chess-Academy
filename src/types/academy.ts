export type ChessLevel = "Beginner" | "Intermediate" | "Advanced" | "Tournament Player";
export type LeadStatus = "New" | "Contacted" | "Trial Scheduled" | "Trial Completed" | "Approved" | "Rejected";
export type SessionRole = "admin" | "coach" | "student" | "parent" | "public";

export interface Lead {
  id: string;
  studentName: string;
  age: number;
  chessLevel: ChessLevel;
  parentName: string;
  parentMobile: string;
  parentEmail?: string;
  city: string;
  address?: string;
  learningGoal: string;
  studentMobile?: string;
  status: LeadStatus;
  trialDate?: string;
  trialTime?: string;
  createdAt: string;
}

export interface Parent {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  occupation?: string;
  studentsLinked: string[]; // student IDs
}

export interface Student {
  id: string;
  name: string;
  dob: string;
  age: number;
  gender: string;
  mobile?: string;
  email?: string;
  photoUrl?: string;
  parentId: string; // parent ID link
  city: string;
  state: string;
  country: string;
  level: ChessLevel;
  fideRating?: number;
  experience?: string;
  learningGoal: string;
  coachId?: string; // coach ID link
  batchId?: string; // batch ID link
  joiningDate: string;
}

export interface Coach {
  id: string;
  name: string;
  title: string;
  elo: string;
  image: string;
  stat: string;
}

export interface Batch {
  id: string;
  name: string;
  schedule: string;
}
