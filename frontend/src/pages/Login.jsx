import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const result = await login(email, password)
        
        if (result.success) {
            navigate('/dashboard')
        } else {
            setError(result.message)
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Éléments décoratifs en orange */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-bounce-slow"></div>
            <div className="absolute top-1/4 right-10 w-96 h-96 bg-gradient-to-br from-amber-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-bounce-slower"></div>
            <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-bounce-slowest"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
                    {/* En-tête avec logo image */}
                    <div className="text-center mb-10">
                        <div className="mx-auto w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-6 transform hover:scale-105 transition-transform duration-300 p-2 border border-orange-100">
                            <img 
                                src="../images/logo-tgr.png" 
                                alt="Logo TGR Pack Informatique" 
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    // Fallback si l'image ne charge pas
                                    e.target.style.display = 'none';
                                    const fallback = document.createElement('div');
                                    fallback.className = 'w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center';
                                    fallback.innerHTML = '<span class="text-white font-bold text-lg">TGR</span>';
                                    e.target.parentNode.appendChild(fallback);
                                }}
                            />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-600 to-amber-600 bg-clip-text text-transparent mb-2">
                            TGR-ITPack
                        </h1>
                        <p className="text-orange-700 text-lg font-light">
                            Trésorerie Générale du Royaume
                        </p>
                        <div className="mt-4 flex justify-center space-x-1">
                            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-150"></div>
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-300"></div>
                        </div>
                    </div>

                    {/* Formulaire */}
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm font-medium shadow-sm">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </div>
                            </div>
                        )}
                        
                        {/* Champ Email */}
                        <div className="group">
                            <label htmlFor="email" className="block text-sm font-semibold text-orange-800 mb-3 ml-1">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                    Adresse email
                                </div>
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full px-5 py-4 bg-white border border-orange-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all duration-300 group-hover:border-orange-300 placeholder-orange-400 text-orange-800 font-medium"
                                    placeholder="votre@email.tgr.ma"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-orange-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Champ Mot de passe */}
                        <div className="group">
                            <label htmlFor="password" className="block text-sm font-semibold text-orange-800 mb-3 ml-1">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Mot de passe
                                </div>
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full px-5 py-4 bg-white border border-orange-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all duration-300 group-hover:border-orange-300 placeholder-orange-400 text-orange-800 font-medium"
                                    placeholder="Votre mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-orange-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Bouton de connexion */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full group relative bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-xl overflow-hidden"
                            >
                                {/* Effet de brillance */}
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                        <span className="text-lg">Connexion en cours...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-3 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        <span className="text-lg">Se connecter</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Informations supplémentaires */}
                    <div className="mt-8 pt-6 border-t border-orange-100">
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Système de gestion du parc informatique
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                Version 1.0.0 • TGR Maroc
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login