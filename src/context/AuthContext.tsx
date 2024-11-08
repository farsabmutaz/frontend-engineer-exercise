import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
    id: number;
    username: string;
    password: string; // Ideally, you should not expose the password
}

interface AuthContextProps {
    isAuthenticated: boolean;
    user: User | null;
    login: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    // Function to check session status
    const checkSession = async () => {
        try {
            const response = await fetch('http://localhost:4001/session', {
                credentials: 'include',
            });
            
            if (response.ok) {
                const sessionData: User = await response.json();
                if (sessionData && sessionData.id) {
                    setIsAuthenticated(true);
                    setUser(sessionData);
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to check session:", error);
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    // Check session on component mount
    useEffect(() => {
        checkSession();
    }, []);

    // Update the login function to fetch session data
    const login = async () => {
        await checkSession();
    };

    const logout = async () => {
        try {
            const response = await fetch('http://localhost:4001/logout', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.status === 204) {
                setIsAuthenticated(false);
                setUser(null);
                navigate('/');
            }
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
