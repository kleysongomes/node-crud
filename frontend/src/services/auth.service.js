import axios from 'axios';

const API_URL = 'http://localhost:3000';

const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
    });

    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('token');
};

const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

export { login, logout, isAuthenticated };