import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [isLoginMode, setIsLoginMode] = useState(true);

    return (
        <div className="w-110 bg-white p-8 rounded-2xl shadow-lg">

            {/* Header */}
            <div className="flex justify-center mb-4">
                <h2 className="text-3xl font-semibold text-center">
                    {isLoginMode ? "Login" : "Sign Up"}
                </h2>
            </div>

            {/* Tab Control */}
            <div className="relative flex h-12 mb-6 border border-gray-300 rounded-full overflow-hidden">

                {/* Sliding Background */}
                <div
                    className={`absolute top-0 h-full w-1/2 rounded-full bg-linear-to-r from-blue-700 via-cyan-600 to-cyan-200 transition-all duration-500 ${isLoginMode ? "left-0" : "left-1/2"
                        }`}
                ></div>

                {/* Login Button */}
                <button
                    onClick={() => navigate("/lesson")}
                    className={`w-1/2 text-lg font-medium z-10 transition-all ${isLoginMode ? "text-white" : "text-black"
                        }`}
                >
                    Login
                </button>

                {/* Sign Up Button */}
                <button
                    onClick={() => setIsLoginMode(false)}
                    className={`w-1/2 text-lg font-medium z-10 transition-all ${!isLoginMode ? "text-white" : "text-black"
                        }`}
                >
                    Sign Up
                </button>
            </div>

            {/* Form */}
            <form className="space-y-4">

                {/* Username */}
                {!isLoginMode && (
                    <input
                        type="text"
                        placeholder="Username"
                        required
                        className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
                    />
                )}

                {/* Email */}
                <input
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
                />

                {/* Password */}
                <input
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
                />

                {/* Confirm Password */}
                {!isLoginMode && (
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        required
                        className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
                    />
                )}

                {/* Submit Button FIRST */}
                <button
                    className="w-full p-3 rounded-full bg-linear-to-r from-blue-700 via-cyan-600 to-cyan-200 text-white font-medium hover:opacity-90 transition-opacity"
                >
                    {isLoginMode ? "Login" : "Sign Up"}
                </button>

                {/* Forgot Password BELOW BUTTON */}
                {isLoginMode && (
                    <div className="text-center">
                        <p className="text-cyan-600 hover:underline cursor-pointer">
                            Forgot Password?
                        </p>
                    </div>
                )}

                {/* Switch Link */}
                <p className="text-center text-gray-600">
                    {isLoginMode
                        ? "Don't have an account?"
                        : "Already have an account?"}

                    <span
                        onClick={() => setIsLoginMode(!isLoginMode)}
                        className="text-cyan-600 hover:underline ml-1 cursor-pointer"
                    >
                        {isLoginMode ? "Sign Up" : "Login"}
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Login;