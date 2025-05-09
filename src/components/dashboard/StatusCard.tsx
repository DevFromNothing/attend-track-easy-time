
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type StatusCardProps = {
  attendanceStatus: {
    checkedIn: boolean;
    checkedOut: boolean;
  };
};

const StatusCard = ({ attendanceStatus }: StatusCardProps) => {
  return (
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
  );
};

export default StatusCard;
