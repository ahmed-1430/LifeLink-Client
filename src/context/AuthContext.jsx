/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { createContext, useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import API from '../api/axios';


export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('lifelink_token'));


    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({
                    email: decoded.email,
                    role: decoded.role,
                    userId: decoded.userId
                });
            } catch (err) {
                console.error('Invalid token', err);
                setUser(null);
                setToken(null);
            }
        }
    }, [token]);


    const login = (tokenStr, userData) => {
        localStorage.setItem('lifelink_token', tokenStr);
        setToken(tokenStr);
        setUser(userData ? userData : null);
    };


    const logout = () => {
        localStorage.removeItem('lifelink_token');
        setToken(null);
        setUser(null);
    };


    const value = { user, token, login, logout };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};