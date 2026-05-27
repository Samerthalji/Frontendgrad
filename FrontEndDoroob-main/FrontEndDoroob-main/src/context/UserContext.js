import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../Api/userService";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 3. يفضل تبدأ بـ true لتجنب الـ Flicker

  const fetchUser = async () => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const data = await getUserProfile();

      console.log("🔥 fetchUser result:", data);
      console.log("🔥 skills from backend:", data.skills);

      setUser(data);
    } catch (error) {
      console.error("❌ fetchUser error:", error);
      logout();
    }
  }
  setLoading(false);
};
  useEffect(() => {
    fetchUser();
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    fetchUser(); 
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, fetchUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);