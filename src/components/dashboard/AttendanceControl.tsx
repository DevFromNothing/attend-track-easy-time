
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Clock } from 'lucide-react';
import { checkIn, checkOut } from '@/services/attendanceService';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type AttendanceControlProps = {
  currentTime: string;
  currentDate: string;
  attendanceStatus: {
    checkedIn: boolean;
    checkedOut: boolean;
  };
  onStatusChange: () => void;
};

const AttendanceControl = ({
  currentTime,
  currentDate,
  attendanceStatus,
  onStatusChange,
}: AttendanceControlProps) => {
  const { toast } = useToast();
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      const response = await checkIn();
      
      if (response.success) {
        toast({
          title: "Check-in successful",
          description: response.message,
        });
        onStatusChange();
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
        onStatusChange();
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

  return (
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
  );
};

export default AttendanceControl;
