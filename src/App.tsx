import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import React from 'react';

import CollegePage from './pages/College';
import CommutePage from './pages/Commute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StateSearch from './pages/StateSearch';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './guards/ProtectedRoute';
import { Navbar } from './components/navbar';
import PublicRoute from './guards/PublicRoute';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="App" style={{ margin: '1rem' }}>
                    <header className="App-header">
                        <h1>Focus Frontend Interview Exercise</h1>
                    </header>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/states"
                            element={
                                <ProtectedRoute>
                                    <StateSearch />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/commutes"
                            element={
                                <ProtectedRoute>
                                    <CommutePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/college"
                            element={
                                <ProtectedRoute>
                                    <CollegePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route element={<PublicRoute />}>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                        </Route>
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
