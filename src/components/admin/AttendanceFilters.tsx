
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface AttendanceFiltersProps {
  nameFilter: string;
  setNameFilter: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  handleSearch: () => void;
  handleReset: () => void;
}

const AttendanceFilters = ({
  nameFilter,
  setNameFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleSearch,
  handleReset
}: AttendanceFiltersProps) => {
  return (
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
  );
};

export default AttendanceFilters;
