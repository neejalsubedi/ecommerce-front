import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { useApiGet, type InitApiResponse } from "./api/ApiGet";
 // adjust path

interface UserInfo {
  name?: string;
  role?: string;
}

interface UserDetails{
 
   username:string,
  email:string,
  role:string
  address:string,
  phone:string
 }

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  initData:UserDetails | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [initData, setInitData] = useState<UserDetails| null>(null);
  console.log("authini",initData)

  // 🔍 Dynamically control when to fetch init data
  const { data: fetchedInitData } = useApiGet<UserDetails>({
    endpoint: "/api/Users/user/details",
    enabled: isAuthenticated, // only fetch when authenticated
    queryKey: ["userInitData"],
    config: {
      headers: {
        "Cache-Control": "no-cache", // to avoid 304
      },
    },
  });

  useEffect(() => {
    if (fetchedInitData) {
      setInitData(fetchedInitData);
    }
  }, [fetchedInitData]);

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
    setInitData(initData)
    // ⚠️ Init data will be fetched automatically because `isAuthenticated` becomes true
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    setUser(null);
    setInitData(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, initData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
