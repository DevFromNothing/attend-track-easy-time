
import { useToast } from "@/components/ui/use-toast";
import { LoginResponse, User } from "@/lib/types";

// Mock users database
const MOCK_USERS = [
  { 
    userId: '1', 
    username: 'admin', 
    password: 'admin123', 
    fullName: 'Admin User', 
    role: 'admin' as const
  },
  { 
    userId: '2', 
    username: 'employee1', 
    password: 'emp123', 
    fullName: 'John Smith', 
    role: 'employee' as const 
  },
  { 
    userId: '3', 
    username: 'employee2', 
    password: 'emp123', 
    fullName: 'Jane Doe', 
    role: 'employee' as const 
  }
];

// In a real application, this would be an API call
export const login = async (username: string, password: string): Promise<LoginResponse> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = MOCK_USERS.find(u => u.username === username && u.password === password);
  
  if (user) {
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return {
      success: true,
      ...userWithoutPassword
    };
  }
  
  return {
    success: false,
    userId: '',
    username: '',
    fullName: '',
    role: 'employee',
    message: 'Invalid username or password'
  };
};

export const logout = (): void => {
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('currentUser');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getCurrentUser();
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};
