import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [changePasswordData, setChangePasswordData] = useState({
        currentPassword: '',
        newPassword: '',
    });
    const [showUpdateProfile, setShowUpdateProfile] = useState(false);
    const [updateProfileData, setUpdateProfileData] = useState({
        name: '',
        email: '',
        gender: '',
        phone: '',
        status: '',
        date: ''
    });
    const [profileError, setProfileError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
      if (!sessionStorage.getItem('loggedin')) {
        navigate('/');
      }
    }, [navigate]);

    const handleLogout = () => {
        navigate('/', { state: { message: 'Logged out successfully' } });
        sessionStorage.clear();
    };

    const handleDeleteAccount = async () => {
        const headers = {
            Authorization: `Bearer ${sessionStorage.getItem('jwtToken')}`,
        };

        await axios.delete('http://localhost:5000/api/profile/delete', {
            headers: headers,
        });
        navigate('/signup', { state: { message: 'Account deleted successfully' } });
    };


    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setChangePasswordData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleProfileInputChange = (e) => {
        const { name, value } = e.target;
        if(e.target.name==="date") {
            const formattedDate = new Date(e.target.value);
            const year = formattedDate.getFullYear();
            const month = formattedDate.getMonth() + 1;
            const day = formattedDate.getDate();
        
            const formattedDateString = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
            setUpdateProfileData((prevData) => ({ ...prevData, [name]: formattedDateString }));
        }
        else {
            setUpdateProfileData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const headers = {
                Authorization: `Bearer ${sessionStorage.getItem('jwtToken')}`,
            };

            const response = await axios.get('http://localhost:5000/api/profile/fetch-all', {
                headers: headers,
            });

            if (response.status === 200) {
                const { name, email, gender, phone, status, date } = response.data.user;

                setUpdateProfileData({
                    name: name,
                    email: email,
                    gender: gender,
                    phone: phone,
                    status: status,
                    date: date
                });

                setShowUpdateProfile(true);
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
            setProfileError('An error occurred while fetching profile data. Please try again later.');
        }
    };

    const handleSubmitUpdateProfile = async (e) => {
        e.preventDefault();

        try {
            const headers = {
                Authorization: `Bearer ${sessionStorage.getItem('jwtToken')}`,
            };
            const response = await axios.put(
                'http://localhost:5000/api/profile/update-profile',
                updateProfileData,
                {
                    headers: headers,
                }
            );

            if (response.status === 200) {
                setUpdateProfileData({
                    name: '',
                    email: '',
                    gender: '',
                    phone: '',
                    status: '',
                    date: ''
                });

                setSuccessMessage('Profile updated successfully');

                setShowUpdateProfile(false);

                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setProfileError(error.response.data.message);
            } else {
                console.error('Error updating profile:', error);
                setProfileError('An error occurred. Please try again later.');
            }
        }
    };

    const handleSubmitChangePassword = async (e) => {
        e.preventDefault();

        if (!changePasswordData.currentPassword || !changePasswordData.newPassword) {
            setPasswordError('Please fill in all fields.');
            return;
        }

        try {
            const headers = {
                Authorization: `Bearer ${sessionStorage.getItem('jwtToken')}`,
            };

            const response = await axios.put(
                'http://localhost:5000/api/profile/change-password',
                changePasswordData,
                {
                    headers: headers,
                }
            );

            if (response.status === 200) {
                setChangePasswordData({
                    currentPassword: '',
                    newPassword: '',
                });

                setSuccessMessage('Password changed successfully');

                setShowChangePassword(false)

                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setPasswordError(error.response.data.message);
            } else {
                console.error('Error changing password:', error);
                setPasswordError('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="bg-white p-8 shadow-md rounded-md w-full sm:max-w-md">
                <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                <div className="max-w-sm">
                    {sessionStorage.getItem('status') && <p>Account status: {sessionStorage.getItem('status')[0].toUpperCase() + sessionStorage.getItem('status').substring(1)}</p>}
                    <div className='flex flex-col'>
                    <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 my-2"
                        onClick={() => setShowChangePassword(true)}
                    >
                        Change Password
                    </button>
                    <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 my-2"
                        onClick={() => handleUpdateProfile()}
                    >
                        Update Profile
                    </button>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2 my-2"
                    >
                        Logout
                    </button>
                    <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2 my-2"
                    >
                        Delete Account
                    </button>
                    </div>
                    {successMessage && (
                        <div className="mt-4 p-2 bg-green-500 text-white rounded">{successMessage}</div>
                    )}
                </div>

                {showUpdateProfile && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                        <div className="bg-white p-8 shadow-md rounded-md max-w-lg">
                            <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
                            {profileError && <div className="text-red-500 mb-4">{profileError}</div>}
                            <form onSubmit={handleSubmitUpdateProfile}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block mb-1 font-semibold">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={updateProfileData.name}
                                        onChange={handleProfileInputChange}
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
                                        value={updateProfileData.email}
                                        onChange={handleProfileInputChange}
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
                                        value={updateProfileData.gender}
                                        onChange={handleProfileInputChange}
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
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={updateProfileData.phone}
                                        onChange={handleProfileInputChange}
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
                                        value={updateProfileData.status}
                                        onChange={handleProfileInputChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        required
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="active">Active</option>
                                        <option value="de-active">De-Active</option>
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
                                        value={updateProfileData.date ? updateProfileData.date.substr(0, 10) : ''}
                                        onChange={handleProfileInputChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
                                    >
                                        Update Profile
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowUpdateProfile(false);
                                            setProfileError('');
                                        }}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded px-4 py-2 ml-2"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showChangePassword && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                        <div className="bg-white p-8 shadow-md rounded-md max-w-lg">
                            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
                            {passwordError && <div className="text-red-500 mb-4">{passwordError}</div>}
                            <form onSubmit={handleSubmitChangePassword}>
                                <div className="mb-4">
                                    <label htmlFor="currentPassword" className="block mb-1 font-semibold">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={changePasswordData.currentPassword}
                                        onChange={handlePasswordInputChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="newPassword" className="block mb-1 font-semibold">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        value={changePasswordData.newPassword}
                                        onChange={handlePasswordInputChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
                                    >
                                        Change Password
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowChangePassword(false);
                                            setPasswordError('');
                                        }}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded px-4 py-2 ml-2"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
