
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { getAttendanceRecords, seedInitialData } from '@/services/attendanceService';
import { AttendanceRecord } from '@/lib/types';
import AdminHeader from '@/components/admin/AdminHeader';
import AttendanceFilters from '@/components/admin/AttendanceFilters';
import AttendanceTable from '@/components/admin/AttendanceTable';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [nameFilter, setNameFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with some data
  useEffect(() => {
    seedInitialData();
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    setIsLoading(true);
    try {
      const records = await getAttendanceRecords(nameFilter, startDate, endDate);
      setAttendanceRecords(records);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      toast({
        title: "Error",
        description: "Failed to fetch attendance records",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchAttendanceRecords();
  };

  const handleReset = () => {
    setNameFilter('');
    setStartDate('');
    setEndDate('');
    fetchAttendanceRecords();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-brand-100 p-4">
      <div className="max-w-7xl mx-auto">
        <AdminHeader user={user} />

        <Card className="shadow-md border-brand-200 mb-8">
          <CardHeader className="bg-brand-50 rounded-t-lg">
            <CardTitle className="text-xl text-brand-700">Attendance Records</CardTitle>
            <CardDescription>Monitor employee attendance data</CardDescription>
          </CardHeader>
          
          <CardContent>
            <AttendanceFilters
              nameFilter={nameFilter}
              setNameFilter={setNameFilter}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              handleSearch={handleSearch}
              handleReset={handleReset}
            />
            
            <AttendanceTable
              attendanceRecords={attendanceRecords}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
