import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPerception, setSelectedPerception] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/dashboard/stats');
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const statsData = await response.json();
      setStats(statsData);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Erreur de chargement des données');
      
      // Données mockées
      setStats({
        totalPc: 4,
        totalImprimantes: 3,
        totalScanners: 2,
        materielEnPanne: 1,
        contratsExpires: 0,
        totalUtilisateurs: 6,
        perceptionStats: [
          { perception: 'Ouarzazate', code: 'OUA', total_pc: 2, total_imprimantes: 1, total_scanners: 1, en_panne: 0 },
          { perception: 'Boumalne Dades', code: 'BMD', total_pc: 1, total_imprimantes: 1, total_scanners: 0, en_panne: 1 },
          { perception: 'Tinghir', code: 'TNG', total_pc: 1, total_imprimantes: 0, total_scanners: 1, en_panne: 0 },
          { perception: 'Zagora', code: 'ZGR', total_pc: 0, total_imprimantes: 1, total_scanners: 0, en_panne: 0 },
          { perception: 'Trésorerie Provinciale Ouarzazate', code: 'TP_OUA', total_pc: 0, total_imprimantes: 0, total_scanners: 0, en_panne: 0 }
        ],
        statutStats: [
          { type: 'pc', statut: 'en_service', count: 3 },
          { type: 'pc', statut: 'en_panne', count: 1 },
          { type: 'imprimante', statut: 'en_service', count: 2 },
          { type: 'imprimante', statut: 'reforme', count: 1 },
          { type: 'scanner', statut: 'en_service', count: 2 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  // Couleurs TGR (orange et dérivés)
  const COLORS = {
    primary: '#FF6B35',
    secondary: '#FF8C42',
    accent: '#FFA552',
    light: '#FFB773',
    dark: '#E55A2B',
    blue: '#1E40AF',
    green: '#10B981',
    red: '#EF4444',
    purple: '#8B5CF6',
    indigo: '#4F46E5'
  };

  // Données pour le chart de répartition
  const repartitionData = [
    { name: 'PC', value: stats.totalPc || 0, color: COLORS.blue },
    { name: 'Imprimantes', value: stats.totalImprimantes || 0, color: COLORS.green },
    { name: 'Scanners', value: stats.totalScanners || 0, color: COLORS.purple }
  ];

  // Données pour le chart de statut
  const statutData = [
    { name: 'En service', value: (stats.totalPc || 0) + (stats.totalImprimantes || 0) + (stats.totalScanners || 0) - (stats.materielEnPanne || 0), color: COLORS.green },
    { name: 'En panne', value: stats.materielEnPanne || 0, color: COLORS.red },
    { name: 'Maintenance', value: stats.contratsExpires || 0, color: COLORS.accent }
  ];

  // Composant de carte de statistique
  const StatCard = ({ title, value, color, icon, description }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 border-l-4 ${color} hover:shadow-md transition-shadow`}>
      <div className="flex items-center">
        <div className="p-2 rounded-lg bg-white bg-opacity-50">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tableau de Bord Pack Informatique
          </h1>
          <p className="text-gray-600 mt-1">
            Trésorerie Générale du Royaume - Gestion du parc informatique
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {error && (
            <div className="text-red-600 text-sm bg-red-50 px-3 py-1 rounded-full">
              ⚠️ {error}
            </div>
          )}
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
          >
            Actualiser
          </button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard 
          title="Total PC" 
          value={stats.totalPc || 0} 
          color="border-l-blue-500" 
          icon="💻" 
          description="Ordinateurs en stock" 
        />
        <StatCard 
          title="Total Imprimantes" 
          value={stats.totalImprimantes || 0} 
          color="border-l-green-500" 
          icon="🖨️" 
          description="Imprimantes disponibles" 
        />
        <StatCard 
          title="Total Scanners" 
          value={stats.totalScanners || 0} 
          color="border-l-purple-500" 
          icon="📷" 
          description="Scanners fonctionnels" 
        />
        <StatCard 
          title="Matériel en Panne" 
          value={stats.materielEnPanne || 0} 
          color="border-l-red-500" 
          icon="⚠️" 
          description="Équipements à réparer" 
        />
        <StatCard 
          title="Contrats Expirés" 
          value={stats.contratsExpires || 0} 
          color="border-l-orange-500" 
          icon="📅" 
          description="Maintenance à renouveler" 
        />
        <StatCard 
          title="Utilisateurs" 
          value={stats.totalUtilisateurs || 0} 
          color="border-l-indigo-500" 
          icon="👥" 
          description="Personnel équipé" 
        />
      </div>

      {/* Charts principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par type de matériel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-6 bg-orange-500 rounded mr-3"></span>
            Répartition du Matériel
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={repartitionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {repartitionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Statut du matériel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-6 bg-orange-500 rounded mr-3"></span>
            Statut du Matériel
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statutData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={COLORS.primary} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistiques par perception */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-2 h-6 bg-orange-500 rounded mr-3"></span>
          Répartition par Perception
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.perceptionStats && stats.perceptionStats.map((perception, index) => (
            <div 
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-orange-300"
              onClick={() => setSelectedPerception(perception)}
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

      {/* Détails de la perception sélectionnée */}
      {selectedPerception && (
        <div className="bg-white rounded-xl shadow-sm border border-2 border-orange-300 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="w-2 h-6 bg-orange-500 rounded mr-3"></span>
              Détails - {selectedPerception.perception}
            </h2>
            <button 
              onClick={() => setSelectedPerception(null)}
              className="text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">{selectedPerception.total_pc || 0}</div>
              <div className="text-lg text-blue-800 font-semibold">PC</div>
              <div className="text-sm text-blue-600 mt-2">Ordinateurs</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">{selectedPerception.total_imprimantes || 0}</div>
              <div className="text-lg text-green-800 font-semibold">Imprimantes</div>
              <div className="text-sm text-green-600 mt-2">Équipements d'impression</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">{selectedPerception.total_scanners || 0}</div>
              <div className="text-lg text-purple-800 font-semibold">Scanners</div>
              <div className="text-sm text-purple-600 mt-2">Équipements de numérisation</div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${
            selectedPerception.en_panne > 0 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
          }`}>
            <h3 className={`font-semibold mb-2 ${
              selectedPerception.en_panne > 0 ? 'text-red-800' : 'text-green-800'
            }`}>
              {selectedPerception.en_panne > 0 ? '🔧 État du parc - Attention requis' : '✅ État du parc - Optimal'}
            </h3>
            <p className={selectedPerception.en_panne > 0 ? 'text-red-700' : 'text-green-700'}>
              {selectedPerception.en_panne > 0 
                ? `${selectedPerception.en_panne} équipement(s) nécessite(nt) une intervention technique`
                : 'Tous les équipements sont opérationnels et en bon état de fonctionnement'
              }
            </p>
          </div>
        </div>
      )}

      {/* Récapitulatif global */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold mb-2 text-orange-100">Total Équipements</h3>
          <div className="text-3xl font-bold">
            {(stats.totalPc || 0) + (stats.totalImprimantes || 0) + (stats.totalScanners || 0)}
          </div>
          <p className="text-orange-100 text-sm mt-2">Parc informatique total TGR</p>
        </div>
        
        <div className="bg-linear-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold mb-2 text-green-100">Taux de Disponibilité</h3>
          <div className="text-3xl font-bold">
            {(((stats.totalPc || 0) + (stats.totalImprimantes || 0) + (stats.totalScanners || 0) - (stats.materielEnPanne || 0)) / 
              ((stats.totalPc || 0) + (stats.totalImprimantes || 0) + (stats.totalScanners || 0)) * 100 || 0).toFixed(1)}%
          </div>
          <p className="text-green-100 text-sm mt-2">Équipements opérationnels</p>
        </div>
        
        <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold mb-2 text-blue-100">Personnel Équipé</h3>
          <div className="text-3xl font-bold">{stats.totalUtilisateurs || 0}</div>
          <p className="text-blue-100 text-sm mt-2">Agents TGR</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;