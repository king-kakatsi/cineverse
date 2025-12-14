"use client"
import { ACCESS_TOKEN_KEY, CURRENT_USER_KEY } from '@/helpers/constants';
import { fetchFromLocalStorage } from '@/services/localStorageService';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const UserContext = createContext(undefined);

export function useUserContext() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
}

export function UserProvider({ children }) {

    // State variables 
    const [currentUser, setCurrentUser] = useState(null);
    const [accessToken, setAccessToken] = useState('');
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const loadUserData = () => {
            try {
                const thisUser = fetchFromLocalStorage(CURRENT_USER_KEY);
                if (thisUser) {
                    setCurrentUser(thisUser);
                }

                const theToken = fetchFromLocalStorage(ACCESS_TOKEN_KEY);
                if (theToken) {
                    setAccessToken(theToken);
                }
            } catch (error) {
                console.error('Error loading user data from localStorage:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

    // %%%%%%%%%%%%%% UPDATE USER %%%%%%%%%%%%%%
    const updateUserInfos = useCallback((newUser, token) => {
        setCurrentUser(newUser);
        setAccessToken(token);
    }, []);
    // %%%%%%%%%%%%%% END - UPDATE USER %%%%%%%%%%%%%%

    // %%%%%%%%%%%%%% LOGOUT %%%%%%%%%%%%%%
    const logout = useCallback(() => {
        setCurrentUser(null);
        setAccessToken('');
        // Optionnel: Supprimer aussi du localStorage
    }, []);
    // %%%%%%%%%%%%%% END - LOGOUT %%%%%%%%%%%%%%

    const value = {
        currentUser,
        accessToken,
        loading,
        updateUserInfos,
        logout
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}