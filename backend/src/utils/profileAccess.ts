import { Types } from 'mongoose';
import { User, Role } from '../models/user.model';
import { Parent } from '../models/parent.model';
import { Student } from '../models/student.model';

export async function getUserProfileRef(userId: string) {
  const user = await User.findById(userId);
  return user?.profileRef;
}

export async function canAccessStudent(userId: string, role: Role, studentId: string): Promise<boolean> {
  if (role === Role.ADMIN) return true;

  const profileRef = await getUserProfileRef(userId);
  if (!profileRef) return false;

  if (role === Role.STUDENT) {
    return String(profileRef) === studentId;
  }

  if (role === Role.PARENT) {
    const parent = await Parent.findById(profileRef);
    return parent?.students.some((s) => String(s) === studentId) ?? false;
  }

  if (role === Role.COACH) {
    const student = await Student.findById(studentId);
    return Boolean(student?.coach && String(student.coach) === String(profileRef));
  }

  return false;
}

export function toObjectId(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  return new Types.ObjectId(id);
}
