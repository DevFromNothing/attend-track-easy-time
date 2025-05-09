
// Helper to format date for storage
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Calculate hours worked from check-in and check-out times
export const calculateHoursWorked = (checkIn: string, checkOut: string | null): string => {
  if (!checkOut) return '0';
  
  const startTime = new Date(checkIn).getTime();
  const endTime = new Date(checkOut).getTime();
  const diffMs = endTime - startTime;
  const diffHrs = diffMs / (1000 * 60 * 60);
  
  return diffHrs.toFixed(2);
};
