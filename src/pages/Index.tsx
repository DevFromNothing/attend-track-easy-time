
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect based on authentication status
    if (user) {
      // If user is logged in, redirect to appropriate dashboard
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/employee');
      }
    } else {
      // If not logged in, redirect to login page
      navigate('/login');
    }
  }, [user, navigate]);

  // This component won't render anything as it immediately redirects
  return null;
};

export default Index;
