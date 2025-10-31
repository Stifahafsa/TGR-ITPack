import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CompactSidebar = () => {
    const { user, logout } = useAuth();
    const [isHovered, setIsHovered] = useState(false);

    const navigation = [
        { 
            name: 'Dashboard', 
            href: '/dashboard', 
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ) 
        },
        { 
            name: 'PC', 
            href: '/pc', 
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ) 
        },
        { 
            name: 'Imprimantes', 
            href: '/imprimantes', 
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
            ) 
        },
        { 
            name: 'Scanners', 
            href: '/scanners', 
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
            ) 
        },
        { 
            name: 'Utilisateurs', 
            href: '/utilisateurs', 
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            ) 
        },
        { 
            name: 'Affectations', 
            href: '/affectations', 
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            ) 
        },
    ];

    const getInitials = (prenom, nom) => {
        return `${prenom?.charAt(0) || ''}${nom?.charAt(0) || ''}`.toUpperCase();
    };

    return (
        <div 
            className={`bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen flex flex-col transition-all duration-300 border-r border-gray-700 ${
                isHovered ? 'w-64' : 'w-20'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Logo avec image */}
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-center">
                    {isHovered ? (
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1 border border-gray-600">
                                <img 
                                    src="../images/logo-tgr.png" 
                                    alt="Logo TGR Pack Informatique" 
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        // Fallback si l'image ne charge pas
                                        e.target.style.display = 'none';
                                        const fallback = document.createElement('div');
                                        fallback.className = 'w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center';
                                        fallback.innerHTML = '<span class="text-white font-bold text-sm">TGR</span>';
                                        e.target.parentNode.appendChild(fallback);
                                    }}
                                />
                            </div>
                            <div>
                                <span className="text-white font-bold text-lg block">TGR-ITPack</span>
                                <span className="text-gray-400 text-xs block">Gestion Parc Infomatique</span>
                            </div>
                        </div>
                    ) : (
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1 border border-gray-600">
                            <img 
                                src="../images/logo-tgr.png" 
                                alt="Logo TGR" 
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    const fallback = document.createElement('div');
                                    fallback.className = 'w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center';
                                    fallback.innerHTML = '<span class="text-white font-bold text-sm">T</span>';
                                    e.target.parentNode.appendChild(fallback);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation corrigée */}
            <nav className="flex-1 px-2 py-6 space-y-2">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                            `flex items-center p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                                isActive 
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg transform scale-105' 
                                    : 'text-gray-400 hover:bg-gray-750 hover:text-white hover:translate-x-2 hover:shadow-md'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {/* Effet de fond au survol */}
                                <div className={`absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                                    isActive ? 'opacity-20' : ''
                                }`}></div>
                                
                                {/* Icône */}
                                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${
                                    isActive 
                                        ? 'bg-white bg-opacity-20 text-white' 
                                        : 'text-gray-400 group-hover:text-orange-400'
                                }`}>
                                    {item.icon}
                                </div>
                                
                                {/* Nom du menu */}
                                {isHovered && (
                                    <span className="ml-3 font-medium text-sm relative z-10">{item.name}</span>
                                )}

                                {/* Indicateur d'état actif */}
                                {isActive && (
                                    <div className="absolute right-3 w-2 h-2 bg-white rounded-full"></div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Section utilisateur et déconnexion */}
            <div className="p-4 border-t border-gray-700 bg-gray-850">
                {/* Info utilisateur */}
                {isHovered && user && (
                    <div className="mb-4 p-3 bg-gray-750 rounded-lg border border-gray-600">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center shadow-sm">
                                <span className="text-white font-semibold text-xs">
                                    {getInitials(user?.prenom, user?.nom)}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">
                                    {user?.prenom} {user?.nom}
                                </p>
                                <p className="text-gray-400 text-xs truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bouton déconnexion */}
                <button
                    onClick={logout}
                    className="w-full flex items-center p-3 text-gray-400 hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 hover:text-white rounded-xl transition-all duration-300 group relative overflow-hidden"
                >
                    {/* Effet de fond au survol */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Icône */}
                    <div className="relative z-10 w-8 h-8 bg-gray-700 group-hover:bg-white group-hover:bg-opacity-20 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    
                    {/* Texte */}
                    {isHovered && (
                        <span className="ml-3 font-medium text-sm relative z-10">Déconnexion</span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default CompactSidebar;