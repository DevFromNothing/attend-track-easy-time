
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { login } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!username.trim() || !password.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter both username and password',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await login(username, password);
      
      if (response.success) {
        // Update auth context
        setUser({
          userId: response.userId,
          username: response.username,
          fullName: response.fullName,
          role: response.role
        });
        
        // Redirect based on user role
        if (response.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/employee');
        }
        
        toast({
          title: 'Success',
          description: `Welcome, ${response.fullName}!`,
        });
      } else {
        toast({
          title: 'Authentication Failed',
          description: response.message || 'Invalid username or password',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-brand-50 to-brand-100">
      <div className="w-full max-w-md p-4">
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-brand-700">AttendEase</h1>
            <p className="text-slate-600">Employee Attendance System</p>
          </div>
        </div>
        
        <Card className="border-brand-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-brand-600 hover:bg-brand-700"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Demo Accounts:</p>
          <p>Admin: username: admin, password: admin123</p>
          <p>Employee: username: employee1, password: emp123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
