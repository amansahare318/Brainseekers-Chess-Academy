import { Counter as CounterModel } from '../models/counter.model';

/**
 * Returns the next sequential student ID in the format BCA-2026-XXX
 */
export const generateStudentId = async (): Promise<string> => {
  const result = await CounterModel.findOneAndUpdate(
    { name: 'studentId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const seqNum = result?.seq ?? 1;
  const padded = String(seqNum).padStart(3, '0');
  return `BCA-2026-${padded}`;
};
