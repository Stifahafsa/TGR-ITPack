import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const navigation = [
        { name: 'Tableau de Bord', href: '/dashboard', icon: '📊' },
        { name: 'PC', href: '/pc', icon: '💻' },
        { name: 'Imprimantes', href: '/imprimantes', icon: '🖨️' },
        { name: 'Scanners', href: '/scanners', icon: '📷' },
        { name: 'Utilisateurs', href: '/utilisateurs', icon: '👥' },
        { name: 'Affectations', href: '/affectations', icon: '🔗' },
    ];

    return (
        <div className="bg-white w-64 min-h-screen border-r border-gray-200 p-4">
            <nav className="space-y-1">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${
                                isActive 
                                    ? 'bg-tgr-50 text-tgr-700 border-r-2 border-tgr-600' 
                                    : 'hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <span className="mr-3 text-lg">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;