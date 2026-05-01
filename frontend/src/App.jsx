import React from 'react'
import Login from './components/login'
import { Routes, Route } from "react-router-dom"
import lesson from "./components/lesson"


const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className='grid w-full h-screen place-items-center bg-cyan-100'>
            <Login />
          </div>
        }
      />

      <Route path="/lesson" element={<lesson />} />
    </Routes>
  )
}

export default App