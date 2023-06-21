import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');

    useEffect(() => {
        if (location.state && location.state.message) {
            setNotification(location.state.message);

            const timer = setTimeout(() => {
                setNotification('');
                navigate({ state: null });
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [location, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', loginData);

            if (response.status === 200) {
                const { token, status } = response.data;

                sessionStorage.setItem('jwtToken', token);
                sessionStorage.setItem('status', status);
                sessionStorage.setItem('loggedin', true);

                navigate('/dashboard');
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="bg-white p-8 shadow-md rounded-md w-full sm:max-w-md">
                <h1 className="text-3xl font-bold mb-4">Login</h1>
                {error && <p className="text-red-500">{error}</p>}
                <form>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1 font-semibold">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={loginData.email}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-1 font-semibold">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={loginData.password}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={handleLogin}
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
                        >
                            Log in
                        </button>
                    </div>
                    <div>
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-500">
                            Sign up
                        </Link>
                    </div>
                </form>
                {notification && (
                    <div className="mt-4 p-2 bg-green-500 text-white rounded">
                        {notification}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
