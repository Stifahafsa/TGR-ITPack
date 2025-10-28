import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Pc from './pages/Pc'
import Imprimantes from './pages/Imprimantes'
import Scanners from './pages/Scanners'
import Utilisateurs from './pages/Utilisateurs'
import Affectations from './pages/Affectations'

function App() {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <Router>
            <div className="App">
                {user ? (
                    <Layout>
                        <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/pc" element={<Pc />} />
                            <Route path="/imprimantes" element={<Imprimantes />} />
                            <Route path="/scanners" element={<Scanners />} />
                            <Route path="/utilisateurs" element={<Utilisateurs />} />
                            <Route path="/affectations" element={<Affectations />} />
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </Layout>
                ) : (
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                )}
            </div>
        </Router>
    )
}

export default App