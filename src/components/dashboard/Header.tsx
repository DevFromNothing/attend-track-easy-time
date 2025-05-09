
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

type HeaderProps = {
  user: {
    fullName: string;
  } | null;
};

const Header = ({ user }: HeaderProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
      <div>
        <h1 className="text-2xl font-bold text-brand-700">AttendEase</h1>
        <p className="text-gray-600">Employee Dashboard</p>
      </div>
      <div className="flex items-center mt-4 sm:mt-0">
        <span className="mr-4">Welcome, {user?.fullName}</span>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>
    </header>
  );
};

export default Header;
