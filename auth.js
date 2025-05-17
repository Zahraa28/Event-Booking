export const isAuthenticated = () => {
    return !!getToken();
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const setToken = (token) => {
    localStorage.setItem('token', token);
};

export const removeToken = () => {
    localStorage.removeItem('token');
};

export const login = (token) => {
    setToken(token);
};

export const logout = () => {
    removeToken();
    localStorage.removeItem('user');
}; 