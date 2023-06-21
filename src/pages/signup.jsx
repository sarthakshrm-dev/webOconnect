import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const SignupPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        gender: '',
        phone: '',
        password: '',
        status: 'pending',
        date: '',
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
        if (e.target.name === "date") {
            const formattedDate = new Date(e.target.value);
            const year = formattedDate.getFullYear();
            const month = formattedDate.getMonth() + 1;
            const day = formattedDate.getDate();

            const formattedDateString = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
            setSignupData((prevData) => ({ ...prevData, [name]: formattedDateString }));
        }
        else {
            setSignupData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const handleSignup = async () => {
        if (!signupData.name || !signupData.email || !signupData.gender || !signupData.phone || !signupData.password || !signupData.date) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', signupData);

            if (response.status === 201) {
                navigate('/', { state: { message: 'Account created successfully' } });
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError(error.response.data.message);
            } else {
                console.error('Error signing up:', error);
                setError('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="bg-white p-8 shadow-md rounded-md w-full sm:max-w-md">
                <h1 className="text-3xl font-bold mb-4">Signup</h1>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {notification && (
                    <div className="mt-4 p-2 bg-green-500 text-white rounded">
                        {notification}
                    </div>
                )}
                <form>
                    <div className="mb-4">
                        <label htmlFor="name" className="block mb-1 font-semibold">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={signupData.name}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1 font-semibold">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={signupData.email}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="gender" className="block mb-1 font-semibold">
                            Gender
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            value={signupData.gender}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block mb-1 font-semibold">
                            Phone
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={signupData.phone}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
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
                            value={signupData.password}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="status" className="block mb-1 font-semibold">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={signupData.status}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                            <option value="de-active">De-active</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="date" className="block mb-1 font-semibold">
                            Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={signupData.date}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={handleSignup}
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
                        >
                            Sign up
                        </button>
                    </div>
                    <div>
                        Already have an account? <Link to="/" className="text-blue-500">Log in</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
