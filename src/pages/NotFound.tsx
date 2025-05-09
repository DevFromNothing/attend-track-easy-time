
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-brand-50 to-brand-100 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-brand-700">404</h1>
        <p className="text-xl text-gray-600 mt-4 mb-6">Oops! Page not found</p>
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
