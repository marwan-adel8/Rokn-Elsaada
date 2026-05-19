import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext();

const getBaseURL = () => {
  const isLocal = window.location.hostname === "localhost" || window.location.hostname.startsWith("192.168.");
  return isLocal 
    ? `http://${window.location.hostname}:5000/api` 
    : "https://rokn-elsaada-backend.vercel.app/api";
};
axios.defaults.baseURL = getBaseURL();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(Cookies.get("token") || null);
  const [loading, setLoading] = useState(true);

  // Update token in headers whenever it changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await axios.get("/auth/me");
          setUser(res.data);
        } catch (error) {
          console.error("Failed to fetch user", error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = (userData, userToken, redirectPath = "/") => {
    console.log("Login function called, redirecting to:", redirectPath);
    // إزالة الداتا من اللوكال ستوريدج للتنظيف
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // حفظ التوكن في الكوكيز لمدة 7 أيام
    Cookies.set("token", userToken, { expires: 7 });

    // التوجه للمسار الجديد
    window.location.href = window.location.origin + redirectPath;

    // ضمان إضافي لعمل Reload قوي لتنظيف الـ Network
    setTimeout(() => {
      window.location.reload(true);
    }, 100);
  };

  const logout = () => {
    console.log("Logout function called, reloading to Home");
    // التنظيف من اللوكال ستوريدج والكوكيز
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    Cookies.remove("token");

    // التوجه للصفحة الرئيسية
    window.location.href = window.location.origin + "/";

    // ضمان إضافي لعمل Reload
    setTimeout(() => {
      window.location.reload(true);
    }, 100);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
