
export interface User {
  userId: string;
  username: string;
  fullName: string;
  role: 'employee' | 'admin';
}

export interface LoginResponse {
  success: boolean;
  userId: string;
  username: string;
  fullName: string;
  role: 'employee' | 'admin';
  message?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  checkInTime: string;
  checkOutTime: string | null;
  attendanceDate: string;
}

export interface CheckInOutResponse {
  success: boolean;
  message: string;
  record?: AttendanceRecord;
}
