
import { AttendanceRecord } from "@/lib/types";

// Storage key for attendance records
export const STORAGE_KEY = 'attendance_records';

// Helper to get all records
export const getAllRecords = (): AttendanceRecord[] => {
  const records = localStorage.getItem(STORAGE_KEY);
  return records ? JSON.parse(records) : [];
};

// Helper to save all records
export const saveAllRecords = (records: AttendanceRecord[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};
