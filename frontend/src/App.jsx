import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Lesson from './components/Lesson';
import Login from './components/Login';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          /* 
             Changed 'grid' to 'flex flex-col' to allow the header 
             to sit on top of the Login card.
          */
          <div className='flex flex-col items-center justify-center w-full h-screen bg-zinc-950 p-6'>

            {/* Header text outside the Login card */}
            <h1 className="mb-10 text-4xl font-black tracking-tighter text-white uppercase md:text-5xl">
              Welcome to <span className="text-red-600">WebGoat</span> Lesson
            </h1>

            <Login />
          </div>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/lesson" element={
        <ProtectedRoute>
          <Lesson />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default App;