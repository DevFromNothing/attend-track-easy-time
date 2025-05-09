
import { AttendanceRecord } from "@/lib/types";
import { formatDate } from "./dateUtils";
import { getAllRecords, saveAllRecords } from "./storageUtils";

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
