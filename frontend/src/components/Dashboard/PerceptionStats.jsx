import React from 'react';

const PerceptionStats = ({ perceptionStats, onPerceptionClick }) => {
  if (!perceptionStats || perceptionStats.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Répartition par Perception
        </h2>
        <p className="text-gray-500 text-center">Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Répartition par Perception
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {perceptionStats.map((perception, index) => (
          <div 
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onPerceptionClick(perception)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">{perception.perception}</h3>
                <p className="text-sm text-gray-600">Code: {perception.code}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                perception.en_panne > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {perception.en_panne > 0 ? '⚠️ Problèmes' : '✅ Optimal'}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">💻 PC</span>
                <span className="font-semibold">{perception.total_pc || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">🖨️ Imprimantes</span>
                <span className="font-semibold">{perception.total_imprimantes || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">📷 Scanners</span>
                <span className="font-semibold">{perception.total_scanners || 0}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span className="text-orange-600">
                    {(perception.total_pc || 0) + (perception.total_imprimantes || 0) + (perception.total_scanners || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerceptionStats;