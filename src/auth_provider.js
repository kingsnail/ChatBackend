import React, { useState, useCallback } from 'react';
import AuthContext from './auth_context';

const AuthProvider = (props) => {
    const [token, setToken] = useState(null);

    const loginHandler = (token) => {
        setToken(token);
        localStorage.setItem('userToken', token);
    };

    const logoutHandler = () => {
        setToken(null);
        localStorage.removeItem('userToken');
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!token,
                token: token,
                login: loginHandler,
                logout: logoutHandler
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
