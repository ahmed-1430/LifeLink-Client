/* eslint-disable react-hooks/immutability */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import API from "../api/axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /* ===============================
       Load user on app start / reload
    ================================ */
    useEffect(() => {
        const token = localStorage.getItem("lifelink_token");

        if (!token) {
            setLoading(false);
            return;
        }

        API.get("/auth/profile")
            .then((res) => {
                if (res.data?.status === "blocked") {
                    logout();
                    return;
                }

                setUser(res.data);
            })
            .catch(() => {
                logout();
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    /* ===============================
       LOGIN (FIXED)
       token + user come from Login.jsx
    ================================ */
    const login = (token, userData) => {
        localStorage.setItem("lifelink_token", token);
        setUser(userData);
    };

    /* ===============================
       LOGOUT
    ================================ */
    const logout = () => {
        localStorage.removeItem("lifelink_token");
        setUser(null);
        setLoading(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
