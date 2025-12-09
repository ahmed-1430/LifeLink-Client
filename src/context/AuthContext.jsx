/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("lifelink_token"));
    const [loading, setLoading] = useState(true);

    //  Validate Token + Auto Logout if expired
    const validateToken = (tokenStr) => {
        try {
            const decoded = jwtDecode(tokenStr);

            const now = Date.now() / 1000;
            if (decoded.exp && decoded.exp < now) {
                console.warn("Token expired");
                logout();
                return null;
            }

            return decoded;
        } catch (err) {
            console.error("Invalid token:", err);
            logout();
            return null;
        }
    };

    useEffect(() => {
        if (token) {
            const decoded = validateToken(token);
            if (decoded) {
                setUser({
                    email: decoded.email,
                    role: decoded.role,
                    userId: decoded.userId,
                });
            }
        }
        setLoading(false);
    }, [token]);

    //  Login function
    const login = (tokenStr, userData) => {
        localStorage.setItem("lifelink_token", tokenStr);
        setToken(tokenStr);

        // immediate decode
        const decoded = validateToken(tokenStr);
        if (decoded) {
            setUser({
                email: decoded.email,
                role: decoded.role,
                userId: decoded.userId,
            });
        }
    };

    //  Logout function
    const logout = () => {
        localStorage.removeItem("lifelink_token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
