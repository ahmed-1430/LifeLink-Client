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
                const profile = res.data;

                // Blocked user safety
                if (profile.status === "blocked") {
                    logout();
                    return;
                }

                setUser(profile);
            })
            .catch(() => {
                logout();
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    /* ===============================
       Login
    ================================ */
    const login = (token) => {
        localStorage.setItem("lifelink_token", token);
        setLoading(true);

        API.get("/auth/profile")
            .then((res) => {
                setUser(res.data);
            })
            .catch(() => {
                logout();
            })
            .finally(() => {
                setLoading(false);
            });
    };

    /* ===============================
       Logout
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
