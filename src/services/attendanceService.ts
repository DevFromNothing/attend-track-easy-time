
import { AttendanceRecord, CheckInOutResponse } from "@/lib/types";
import { getCurrentUser } from "./authService";
import { getAllRecords, saveAllRecords } from "./utils/storageUtils";
import { formatDate, calculateHoursWorked } from "./utils/dateUtils";
import { seedInitialData } from "./utils/mockData";

// Check if user already checked in today
const hasCheckedInToday = (userId: string): boolean => {
  const today = formatDate(new Date());
  return getAllRecords().some(
    record => record.employeeId === userId && 
              record.attendanceDate === today
  );
};

// Check if user already checked out today
const hasCheckedOutToday = (userId: string): boolean => {
  const today = formatDate(new Date());
  return getAllRecords().some(
    record => record.employeeId === userId && 
              record.attendanceDate === today && 
              record.checkOutTime !== null
  );
};

// Find today's active check-in record
const findTodayCheckIn = (userId: string): AttendanceRecord | undefined => {
  const today = formatDate(new Date());
  return getAllRecords().find(
    record => record.employeeId === userId && 
              record.attendanceDate === today
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
  
  // Check if already checked out
  if (hasCheckedOutToday(user.userId)) {
    return { success: false, message: 'You have already checked out today' };
  }
  
  // Check if hasn't checked in
  if (!hasCheckedInToday(user.userId)) {
    return { success: false, message: 'You must check in before checking out' };
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
  
  const checkedIn = hasCheckedInToday(user.userId);
  const checkedOut = hasCheckedOutToday(user.userId);
  
  return { checkedIn, checkedOut };
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

// Re-export functions from utility files
export { formatDate, calculateHoursWorked, seedInitialData };
