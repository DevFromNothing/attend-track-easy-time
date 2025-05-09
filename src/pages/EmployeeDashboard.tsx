
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAttendanceStatus, seedInitialData } from '@/services/attendanceService';
import Header from '@/components/dashboard/Header';
import AttendanceControl from '@/components/dashboard/AttendanceControl';
import StatusCard from '@/components/dashboard/StatusCard';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [attendanceStatus, setAttendanceStatus] = useState({
    checkedIn: false,
    checkedOut: false
  });

  // Seed initial data
  useEffect(() => {
    seedInitialData();
  }, []);

  // Update current time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDate(now.toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Get attendance status
  useEffect(() => {
    setAttendanceStatus(getAttendanceStatus());
  }, []);

  // Update attendance status
  const handleStatusChange = () => {
    setAttendanceStatus(getAttendanceStatus());
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-brand-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Header user={user} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AttendanceControl 
            currentTime={currentTime}
            currentDate={currentDate}
            attendanceStatus={attendanceStatus}
            onStatusChange={handleStatusChange}
          />

          <StatusCard attendanceStatus={attendanceStatus} />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
