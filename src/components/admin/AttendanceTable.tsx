
import React from 'react';
import { AttendanceRecord } from '@/lib/types';
import { calculateHoursWorked } from '@/services/attendanceService';

interface AttendanceTableProps {
  attendanceRecords: AttendanceRecord[];
  isLoading: boolean;
}

const AttendanceTable = ({ attendanceRecords, isLoading }: AttendanceTableProps) => {
  return (
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
  );
};

export default AttendanceTable;
