import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="flex items-center">
                                <div className="h-8 w-8 bg-tgr-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">TGR</span>
                                </div>
                                <span className="ml-2 text-xl font-semibold text-gray-900">
                                    Pack Informatique
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-700">
                            <span className="font-semibold text-tgr-700">{user?.prenom} {user?.nom}</span>
                            <span className="ml-2 text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-full">
                                {user?.role === 'super_admin' ? 'Administrateur' : 'Responsable TGR'}
                            </span>
                        </div>
                        <button
                            onClick={logout}
                            className="btn-tgr-secondary text-sm"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;