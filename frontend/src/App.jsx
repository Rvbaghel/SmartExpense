import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';

// Pages (ensure exact filenames)
import Home from './pages/Home';
import Earning from './pages/Earning';
import Expenses from './pages/Expenses';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/SignUp';       // file must be SignUp.jsx
import Profile from './pages/Profile';
import Review from './pages/Review';       // file must be Review.jsx

// Context
import ThemeProvider from './context/ThemeContext';
import { UserProvider } from './context/UserContext';

// Styles
import './App.css';
import Information from './pages/Information';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main id="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/earning" element={<Earning />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/about" element={<About />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/track-info" element={<Information />} />
                <Route path="/review" element={<Review />} />   {/* ✅ Added Review route */}
              </Routes>
            </main>
            <Footer />
            <BackToTop />
          </div>
        </Router>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App
