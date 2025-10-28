import React from 'react';

const StatsCards = ({ stats }) => {
    const cards = [
        {
            title: 'Total PC',
            value: stats.totalPc || 0,
            color: 'border-l-blue-500 bg-blue-50',
            icon: '💻',
            description: 'Ordinateurs en stock'
        },
        {
            title: 'Total Imprimantes',
            value: stats.totalImprimantes || 0,
            color: 'border-l-green-500 bg-green-50',
            icon: '🖨️',
            description: 'Imprimantes disponibles'
        },
        {
            title: 'Total Scanners',
            value: stats.totalScanners || 0,
            color: 'border-l-purple-500 bg-purple-50',
            icon: '📷',
            description: 'Scanners fonctionnels'
        },
        {
            title: 'Matériel en Panne',
            value: stats.materielEnPanne || 0,
            color: 'border-l-red-500 bg-red-50',
            icon: '⚠️',
            description: 'Équipements à réparer'
        },
        {
            title: 'Contrats Expirés',
            value: stats.contratsExpires || 0,
            color: 'border-l-orange-500 bg-orange-50',
            icon: '📅',
            description: 'Maintenance à renouveler'
        },
        {
            title: 'Utilisateurs',
            value: stats.totalUtilisateurs || 0,
            color: 'border-l-indigo-500 bg-indigo-50',
            icon: '👥',
            description: 'Personnel équipé'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {cards.map((card, index) => (
                <div key={index} className={`tgr-card p-4 border-l-4 ${card.color} hover:shadow-md transition-shadow`}>
                    <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-white bg-opacity-50">
                            <span className="text-2xl">{card.icon}</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">{card.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                            <p className="text-xs text-gray-500">{card.description}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;