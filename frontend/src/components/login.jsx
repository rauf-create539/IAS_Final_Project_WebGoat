import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Login = () => {
    const navigate = useNavigate();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(''), 3000);
            return () => clearTimeout(timer);  
        }
        }, [success]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isLoginMode && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {

            if (isLoginMode) {
                const res = await api.post('/token/', {
                    email: formData.email,
                    password: formData.password,
                });
                localStorage.setItem('access_token', res.data.access);
                localStorage.setItem('refresh_token', res.data.refresh);
                navigate('/lesson');
            } else {
                await api.post('/register/', {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                });

                setSuccess("Account created! Please log in.");
                setIsLoginMode(true);
                setFormData({ username: "", email: "", password: "", confirmPassword: "" });
            }
        } catch (err) {
            if (isLoginMode) {
                setError("Invalid email or password.");
            } else {
            const data = err.response?.data;
            if (data) {
                const messages = Object.entries(data)
                    .map(([field, errors]) =>
                        `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
                    )
                    .join('\n');
                setError(messages);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="w-110 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">

            <div className="flex justify-center mb-4">
                <h2 className="text-3xl font-semibold text-center text-black">
                    {isLoginMode ? "Login" : "Sign Up"}
                </h2>
            </div>

            {/* Tab Control */}
            <div className="relative flex h-12 mb-6 border border-gray-300 rounded-full overflow-hidden">

                {/* Sliding Background - Red to Black Gradient */}
                <div
                    className={`absolute top-0 h-full w-1/2 rounded-full bg-linear-to-r from-red-700 via-red-600 to-black transition-all duration-500 ${isLoginMode ? "left-0" : "left-1/2"
                        }`}
                ></div>

                {/* Login Button */}
                <button
                    type="button"
                    onClick={() => setIsLoginMode(true)}
                    className={`w-1/2 text-lg font-medium z-10 transition-all ${isLoginMode ? "text-white" : "text-black"
                        }`}
                >
                    Login
                </button>

                {/* Sign Up Button */}
                <button
                    type="button"
                    onClick={() => setIsLoginMode(false)}
                    className={`w-1/2 text-lg font-medium z-10 transition-all ${!isLoginMode ? "text-white" : "text-black"
                        }`}
                >
                    Sign Up
                </button>
            </div>

            {success && (
                <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-sm font-medium">
                    {success}
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
                    {error.split('\n').map((line, i) => (
                        <p key={i} className="mb-1 last:mb-0">{line}</p>
                    ))}
                </div>
            )}

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>

                {/* Username */}
                {!isLoginMode && (
                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-red-600 placeholder-gray-400"
                    />
                )}

                {/* Email */}
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-red-600 placeholder-gray-400"
                />

                {/* Password */}
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-red-600 placeholder-gray-400"
                />

                {/* Confirm Password */}
                {!isLoginMode && (
                    <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-red-600 placeholder-gray-400"
                    />
                )}

                {/* Submit Button - Red to Black Gradient */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-3 rounded-full bg-linear-to-r from-red-700 via-red-600 to-black text-white font-medium hover:opacity-90 transition-opacity shadow-md"
                >
                    {loading ? "Loading..." : isLoginMode ? "Login" : "Sign Up"}
                </button>

                {/* Forgot Password */}
                {isLoginMode && (
                    <div className="text-center">
                        <p className="text-red-600 hover:underline cursor-pointer font-medium">
                            Forgot Password?
                        </p>
                    </div>
                )}

                {/* Switch Link */}
                <p className="text-center text-gray-600">
                    {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                    <span onClick={() => { setIsLoginMode(!isLoginMode); setError(''); setSuccess(''); }}
                        className="text-red-600 hover:underline ml-1 cursor-pointer font-bold">
                        {isLoginMode ? "Sign Up" : "Login"}
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Login;