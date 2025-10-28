import React from 'react';

const Charts = ({ stats, perceptionStats }) => {
    return (
        <div className="tgr-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistiques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Répartition par type</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">PC</span>
                            <span className="font-semibold text-blue-600">{stats.totalPc || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Imprimantes</span>
                            <span className="font-semibold text-green-600">{stats.totalImprimantes || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Scanners</span>
                            <span className="font-semibold text-purple-600">{stats.totalScanners || 0}</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Statut du matériel</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">En service</span>
                            <span className="font-semibold text-green-600">
                                {(stats.totalPc || 0) + (stats.totalImprimantes || 0) + (stats.totalScanners || 0) - (stats.materielEnPanne || 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">En panne</span>
                            <span className="font-semibold text-red-600">{stats.materielEnPanne || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Charts;