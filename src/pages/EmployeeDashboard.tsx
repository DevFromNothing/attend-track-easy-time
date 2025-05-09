
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { checkIn, checkOut, getAttendanceStatus, seedInitialData } from '@/services/attendanceService';
import { Clock } from 'lucide-react';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
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

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      const response = await checkIn();
      
      if (response.success) {
        toast({
          title: "Check-in successful",
          description: response.message,
        });
        setAttendanceStatus({ checkedIn: true, checkedOut: false });
      } else {
        toast({
          title: "Check-in failed",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Check-in error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setIsCheckingOut(true);
    try {
      const response = await checkOut();
      
      if (response.success) {
        toast({
          title: "Check-out successful",
          description: response.message,
        });
        setAttendanceStatus({ checkedIn: true, checkedOut: true });
      } else {
        toast({
          title: "Check-out failed",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Check-out error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
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
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
          <div>
            <h1 className="text-2xl font-bold text-brand-700">AttendEase</h1>
            <p className="text-gray-600">Employee Dashboard</p>
          </div>
          <div className="flex items-center mt-4 sm:mt-0">
            <span className="mr-4">Welcome, {user.fullName}</span>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 shadow-md border-brand-200">
            <CardHeader className="bg-brand-50 rounded-t-lg">
              <CardTitle className="text-xl text-brand-700">Attendance Control</CardTitle>
              <CardDescription>Mark your attendance for today</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Clock className="h-8 w-8 text-brand-600 mr-2" />
                    <span className="text-3xl font-bold text-brand-800">{currentTime}</span>
                  </div>
                  <p className="text-gray-600">{currentDate}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <Button
                    className="flex-1 h-16 text-lg bg-green-600 hover:bg-green-700"
                    onClick={handleCheckIn}
                    disabled={isCheckingIn || attendanceStatus.checkedIn}
                  >
                    {isCheckingIn ? 'Processing...' : 'Check In'}
                  </Button>
                  
                  <Button
                    className="flex-1 h-16 text-lg bg-red-600 hover:bg-red-700"
                    onClick={handleCheckOut}
                    disabled={isCheckingOut || !attendanceStatus.checkedIn || attendanceStatus.checkedOut}
                  >
                    {isCheckingOut ? 'Processing...' : 'Check Out'}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t p-4">
              <div className="text-center">
                {attendanceStatus.checkedIn && !attendanceStatus.checkedOut && (
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    You are currently checked in
                  </span>
                )}
                
                {attendanceStatus.checkedIn && attendanceStatus.checkedOut && (
                  <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    You have completed your attendance for today
                  </span>
                )}
                
                {!attendanceStatus.checkedIn && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    You haven't checked in today
                  </span>
                )}
              </div>
            </CardFooter>
          </Card>

          <Card className="shadow-md border-brand-200">
            <CardHeader className="bg-brand-50 rounded-t-lg">
              <CardTitle className="text-xl text-brand-700">Status</CardTitle>
              <CardDescription>Today's attendance summary</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-semibold ${attendanceStatus.checkedIn ? 'text-green-600' : 'text-gray-500'}`}>
                    {attendanceStatus.checkedIn 
                      ? (attendanceStatus.checkedOut ? 'Completed' : 'Active') 
                      : 'Not Started'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Check In:</span>
                  <span className="font-semibold">
                    {attendanceStatus.checkedIn ? 'Complete' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Check Out:</span>
                  <span className="font-semibold">
                    {attendanceStatus.checkedOut ? 'Complete' : 'Pending'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
