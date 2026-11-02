// Global Auth Context — wraps the whole app
import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthChange, logout } from '../firebase/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout: handleLogout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook to use auth anywhere
export function useAuth() {
  return useContext(AuthContext);
}

