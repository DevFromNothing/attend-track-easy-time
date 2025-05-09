
import { AttendanceRecord, CheckInOutResponse } from "@/lib/types";
import { getCurrentUser } from "./authService";

// Simulate a database with localStorage
const STORAGE_KEY = 'attendance_records';

// Helper to get all records
const getAllRecords = (): AttendanceRecord[] => {
  const records = localStorage.getItem(STORAGE_KEY);
  return records ? JSON.parse(records) : [];
};

// Helper to save all records
const saveAllRecords = (records: AttendanceRecord[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

// Helper to format date for storage
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Check if user already checked in today
const hasCheckedInToday = (userId: string): boolean => {
  const today = formatDate(new Date());
  return getAllRecords().some(
    record => record.employeeId === userId && 
              record.attendanceDate === today && 
              !record.checkOutTime
  );
};

// Find today's active check-in record
const findTodayCheckIn = (userId: string): AttendanceRecord | undefined => {
  const today = formatDate(new Date());
  return getAllRecords().find(
    record => record.employeeId === userId && 
              record.attendanceDate === today && 
              !record.checkOutTime
  );
};

export const checkIn = async (): Promise<CheckInOutResponse> => {
  const user = getCurrentUser();
  
  if (!user) {
    return { success: false, message: 'User not authenticated' };
  }
  
  // Check if already checked in
  if (hasCheckedInToday(user.userId)) {
    return { success: false, message: 'You have already checked in today' };
  }
  
  // Create new check-in record
  const now = new Date();
  const newRecord: AttendanceRecord = {
    id: `${user.userId}-${now.getTime()}`,
    employeeId: user.userId,
    employeeName: user.fullName,
    checkInTime: now.toISOString(),
    checkOutTime: null,
    attendanceDate: formatDate(now)
  };
  
  // Save to "database"
  const allRecords = getAllRecords();
  allRecords.push(newRecord);
  saveAllRecords(allRecords);
  
  return { 
    success: true, 
    message: `Successfully checked in at ${now.toLocaleTimeString()}`,
    record: newRecord
  };
};

export const checkOut = async (): Promise<CheckInOutResponse> => {
  const user = getCurrentUser();
  
  if (!user) {
    return { success: false, message: 'User not authenticated' };
  }
  
  // Find active check-in
  const allRecords = getAllRecords();
  const recordIndex = allRecords.findIndex(
    record => record.employeeId === user.userId && 
              record.attendanceDate === formatDate(new Date()) && 
              !record.checkOutTime
  );
  
  if (recordIndex === -1) {
    return { success: false, message: 'No active check-in found for today' };
  }
  
  // Update the record with check-out time
  const now = new Date();
  allRecords[recordIndex].checkOutTime = now.toISOString();
  saveAllRecords(allRecords);
  
  return { 
    success: true, 
    message: `Successfully checked out at ${now.toLocaleTimeString()}`,
    record: allRecords[recordIndex]
  };
};

export const getAttendanceStatus = (): { checkedIn: boolean, checkedOut: boolean } => {
  const user = getCurrentUser();
  if (!user) {
    return { checkedIn: false, checkedOut: false };
  }
  
  const todayRecord = findTodayCheckIn(user.userId);
  
  if (!todayRecord) {
    return { checkedIn: false, checkedOut: false };
  }
  
  return {
    checkedIn: true,
    checkedOut: !!todayRecord.checkOutTime
  };
};

export const getAttendanceRecords = async (
  nameFilter?: string, 
  startDate?: string, 
  endDate?: string
): Promise<AttendanceRecord[]> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let records = getAllRecords();
  
  // Apply filters
  if (nameFilter) {
    const lowerCaseFilter = nameFilter.toLowerCase();
    records = records.filter(record => 
      record.employeeName.toLowerCase().includes(lowerCaseFilter)
    );
  }
  
  if (startDate) {
    records = records.filter(record => record.attendanceDate >= startDate);
  }
  
  if (endDate) {
    records = records.filter(record => record.attendanceDate <= endDate);
  }
  
  // Sort by date (newest first)
  return records.sort((a, b) => 
    new Date(b.attendanceDate).getTime() - new Date(a.attendanceDate).getTime()
  );
};

// Seed some initial data if none exists
export const seedInitialData = () => {
  if (getAllRecords().length === 0) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const mockData: AttendanceRecord[] = [
      {
        id: '1',
        employeeId: '2',
        employeeName: 'John Smith',
        checkInTime: new Date(yesterday.setHours(9, 0, 0)).toISOString(),
        checkOutTime: new Date(yesterday.setHours(17, 30, 0)).toISOString(),
        attendanceDate: formatDate(yesterday)
      },
      {
        id: '2',
        employeeId: '3',
        employeeName: 'Jane Doe',
        checkInTime: new Date(yesterday.setHours(8, 45, 0)).toISOString(),
        checkOutTime: new Date(yesterday.setHours(18, 0, 0)).toISOString(),
        attendanceDate: formatDate(yesterday)
      },
      {
        id: '3',
        employeeId: '2',
        employeeName: 'John Smith',
        checkInTime: new Date(twoDaysAgo.setHours(9, 15, 0)).toISOString(),
        checkOutTime: new Date(twoDaysAgo.setHours(16, 45, 0)).toISOString(),
        attendanceDate: formatDate(twoDaysAgo)
      }
    ];
    
    saveAllRecords(mockData);
  }
};

// Calculate hours worked from check-in and check-out times
export const calculateHoursWorked = (checkIn: string, checkOut: string | null): string => {
  if (!checkOut) return '0';
  
  const startTime = new Date(checkIn).getTime();
  const endTime = new Date(checkOut).getTime();
  const diffMs = endTime - startTime;
  const diffHrs = diffMs / (1000 * 60 * 60);
  
  return diffHrs.toFixed(2);
};
