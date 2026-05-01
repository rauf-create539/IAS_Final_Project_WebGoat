import React from 'react';
import { Routes, Route } from "react-router-dom";
import Lesson from './components/Lesson'; // Matches filename in src_2.zip
import Login from './components/Login';   // Matches filename in src_2.zip

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
      <Route path="/lesson" element={<Lesson />} />
    </Routes>
  );
}; 

export default App;