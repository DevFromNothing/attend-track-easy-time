
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  getAttendanceRecords, 
  calculateHoursWorked, 
  seedInitialData 
} from '@/services/attendanceService';
import { AttendanceRecord } from '@/lib/types';
import { Search } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
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

  const formatDateTime = (dateTimeString: string | null) => {
    if (!dateTimeString) return 'Not recorded';
    return new Date(dateTimeString).toLocaleString();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-brand-100 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
          <div>
            <h1 className="text-2xl font-bold text-brand-700">AttendEase</h1>
            <p className="text-gray-600">Admin Dashboard</p>
          </div>
          <div className="flex items-center mt-4 sm:mt-0">
            <span className="mr-4">Welcome, {user.fullName}</span>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </header>

        <Card className="shadow-md border-brand-200 mb-8">
          <CardHeader className="bg-brand-50 rounded-t-lg">
            <CardTitle className="text-xl text-brand-700">Attendance Records</CardTitle>
            <CardDescription>Monitor employee attendance data</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search by employee name"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  className="pl-10"
                />
                <Search className="h-4 w-4 absolute top-3 left-3 text-gray-400" />
              </div>
              
              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full sm:w-auto"
                  placeholder="Start Date"
                />
                
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full sm:w-auto"
                  placeholder="End Date"
                />
                
                <div className="flex gap-2">
                  <Button onClick={handleSearch}>
                    Search
                  </Button>
                  
                  <Button variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-md">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Employee Name
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Date
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Check-In Time
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Check-Out Time
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Hours Worked
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-4 px-4 text-center text-sm text-gray-500">
                        Loading attendance records...
                      </td>
                    </tr>
                  ) : attendanceRecords.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 px-4 text-center text-sm text-gray-500">
                        No attendance records found.
                      </td>
                    </tr>
                  ) : (
                    attendanceRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {record.employeeName}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {new Date(record.attendanceDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {new Date(record.checkInTime).toLocaleTimeString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {record.checkOutTime 
                            ? new Date(record.checkOutTime).toLocaleTimeString() 
                            : 'Not checked out'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {record.checkOutTime 
                            ? `${calculateHoursWorked(record.checkInTime, record.checkOutTime)} hrs` 
                            : 'In progress'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
