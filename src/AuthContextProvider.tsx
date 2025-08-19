import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { useApiGet } from "./api/ApiGet";


interface UserInfo {
  name?: string;
  role?: string;
}

interface UserDetails {
  username: string;
  email: string;
  role: string;
  address: string;
  phone: string;
}

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  initData: UserDetails | null;
  loadingInitData: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [initData, setInitData] = useState<UserDetails | null>(null);
  const [loadingInitData, setLoadingInitData] = useState(false);

  // Fetch user init data only when authenticated
  const {
    data: fetchedInitData,
    isLoading,
  } = useApiGet<UserDetails>({
    endpoint: "/api/Users/user/details",
    enabled: isAuthenticated,
    queryKey: ["userInitData"],
    config: {
      headers: {
        "Cache-Control": "no-cache", // avoid caching issues
      },
    },
  });

  // Update loading state
  useEffect(() => {
    setLoadingInitData(isLoading);
  }, [isLoading]);

  // Set init data once fetched
  useEffect(() => {
    if (fetchedInitData) {
      setInitData(fetchedInitData);
    }
  }, [fetchedInitData]);

  // On app load: restore auth state from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: any = jwtDecode(token);
      setAuthenticated(true);
      setUser({ name: decoded.name, role: decoded.role });
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded: any = jwtDecode(token);
    setAuthenticated(true);
    setUser({ name: decoded.name, role: decoded.role });
    // `initData` will be fetched automatically
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    setUser(null);
    setInitData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        initData,
        loadingInitData,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within AuthProvider");
  return context;
};
