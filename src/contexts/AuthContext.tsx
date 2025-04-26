import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

// Define types
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isOtpRequired?: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void; // <-- Add this
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  setUser: () => {}, // <-- Default empty function (to avoid errors)
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
  
      // Defensive check: if user isOtpRequired, force logout or ask for otp again
      if (parsedUser.isOtpRequired) {
        setUser(null);
        localStorage.removeItem("user");
      } else {
        setUser(parsedUser);
      }
    }
    setIsLoading(false);
  }, []);
  

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate delay

    // In a real app, you would validate the user's credentials with an API
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userWithoutPassword = JSON.parse(storedUser);
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      return true;
    }

    return false;
  };

  // Register function
  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate delay

    // In a real app, you would create a new user in your database
    const newUser = {
      id: `${Date.now()}`, // Simulating a unique ID based on time
      name,
      email,
      role: "user",
    };

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    return true;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        setUser, // <-- Provide setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
