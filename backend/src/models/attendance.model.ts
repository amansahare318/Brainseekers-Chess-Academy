import { Schema, model, Document, Types } from 'mongoose';

export type AttendanceStatus = 'Present' | 'Absent' | 'Late';

export interface IAttendance extends Document {
  student: Types.ObjectId;
  batch: Types.ObjectId;
  coach: Types.ObjectId;
  date: Date;
  status: AttendanceStatus;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    batch: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
    coach: { type: Schema.Types.ObjectId, ref: 'Coach', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true },
    remarks: { type: String, trim: true },
  },
  { timestamps: true }
);

AttendanceSchema.index({ student: 1, batch: 1, date: 1 }, { unique: true });
AttendanceSchema.index({ batch: 1, date: -1 });
AttendanceSchema.index({ date: 1 });

export const Attendance = model<IAttendance>('Attendance', AttendanceSchema);
