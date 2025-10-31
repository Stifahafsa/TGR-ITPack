import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const CompactHeader = () => {
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const getInitials = (prenom, nom) => {
        return `${prenom?.charAt(0) || ''}${nom?.charAt(0) || ''}`.toUpperCase();
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <header className="bg-white shadow-lg border-b border-gray-100">
            <div className="px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Section logo uniquement */}
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 p-1">
                            <img 
                                src="../images/logo-tgr.png" 
                                alt="Logo TGR Pack Informatique" 
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    // Fallback si l'image ne charge pas
                                    e.target.style.display = 'none';
                                    const fallback = document.createElement('div');
                                    fallback.className = 'w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded flex items-center justify-center';
                                    fallback.innerHTML = '<span class="text-white font-bold text-xs">TGR</span>';
                                    e.target.parentNode.appendChild(fallback);
                                }}
                            />
                        </div>
                    </div>

                    {/* Section centrale avec date et actions */}
                    <div className="flex items-center space-x-8">
                        {/* Date et heure centrée */}
                        <div className="flex flex-col items-center">
                            <span className="text-sm font-semibold text-gray-800">
                                {formatTime(currentTime)}
                            </span>
                            <span className="text-xs text-gray-500 hidden sm:block">
                                {formatDate(currentTime)}
                            </span>
                        </div>

                        
                    </div>

                    {/* Section utilisateur et actions */}
                    <div className="flex items-center space-x-4">
                        {/* Actions rapides */}
                        <div className="hidden md:flex items-center space-x-2">
                            {/* Notification */}
                            <button className="relative p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 0-6 6v2.25l-2.47 2.47a.75.75 0 0 0 .53 1.28h15.88a.75.75 0 0 0 .53-1.28L16.5 12V9.75a6 6 0 0 0-6-6z" />
                                </svg>
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
                            </button>

                            {/* Recherche */}
                            <button className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>

                        {/* Menu utilisateur compact */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-2 bg-orange-50 hover:bg-orange-100 rounded-lg px-3 py-2 transition-all duration-200 border border-orange-200 group"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-xs">
                                        {getInitials(user?.prenom, user?.nom)}
                                    </span>
                                </div>
                                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="font-semibold text-gray-900 text-sm">
                                            {user?.prenom} {user?.nom}
                                        </p>
                                        <p className="text-gray-500 text-xs">{user?.email}</p>
                                        <div className="mt-1">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                                {user?.role === 'super_admin' ? 'Super Admin' : 'Responsable TGR'}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span>Déconnexion</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay pour fermer le menu */}
            {showUserMenu && (
                <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                ></div>
            )}
        </header>
    );
};

export default CompactHeader;