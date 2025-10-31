import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPerception, setSelectedPerception] = useState(null);
  const [timeRange, setTimeRange] = useState('today');

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
      setError('Erreur de chargement des données - Affichage des données de démonstration');
      
      // Données mockées en cas d'erreur
      setStats({
        totalPc: 4,
        totalImprimantes: 3,
        totalScanners: 2,
        materielEnPanne: 1,
        contratsExpires: 2,
        totalUtilisateurs: 6,
        tauxDisponibilite: 88.9,
        perceptionStats: [
          { 
            perception: 'Ouarzazate', 
            code: 'OUA', 
            total_pc: 2, 
            total_imprimantes: 1, 
            total_scanners: 1, 
            en_panne: 0,
            total_problemes: 0,
            pc_en_panne_count: 0,
            imprimantes_en_panne_count: 0,
            scanners_en_panne_count: 0
          },
          { 
            perception: 'Boumalne Dades', 
            code: 'BMD', 
            total_pc: 1, 
            total_imprimantes: 1, 
            total_scanners: 0, 
            en_panne: 1,
            total_problemes: 1,
            pc_en_panne_count: 1,
            imprimantes_en_panne_count: 0,
            scanners_en_panne_count: 0
          },
          { 
            perception: 'Tinghir', 
            code: 'TNG', 
            total_pc: 1, 
            total_imprimantes: 0, 
            total_scanners: 1, 
            en_panne: 0,
            total_problemes: 0,
            pc_en_panne_count: 0,
            imprimantes_en_panne_count: 0,
            scanners_en_panne_count: 0
          },
          { 
            perception: 'Zagora', 
            code: 'ZGR', 
            total_pc: 0, 
            total_imprimantes: 1, 
            total_scanners: 0, 
            en_panne: 0,
            total_problemes: 0,
            pc_en_panne_count: 0,
            imprimantes_en_panne_count: 0,
            scanners_en_panne_count: 0
          },
          { 
            perception: 'Trésorerie Provinciale Ouarzazate', 
            code: 'TP_OUA', 
            total_pc: 0, 
            total_imprimantes: 0, 
            total_scanners: 0, 
            en_panne: 0,
            total_problemes: 0,
            pc_en_panne_count: 0,
            imprimantes_en_panne_count: 0,
            scanners_en_panne_count: 0
          }
        ],
        statutStats: [
          { type: 'pc', statut: 'en_service', count: 3 },
          { type: 'pc', statut: 'en_panne', count: 1 },
          { type: 'pc', statut: 'en_maintenance', count: 0 },
          { type: 'imprimante', statut: 'en_service', count: 2 },
          { type: 'imprimante', statut: 'reforme', count: 1 },
          { type: 'scanner', statut: 'en_service', count: 2 }
        ],
        evolutionData: [
          { mois: 'Jan', pc: 2, imprimantes: 1, scanners: 1 },
          { mois: 'Fév', pc: 3, imprimantes: 2, scanners: 1 },
          { mois: 'Mar', pc: 4, imprimantes: 3, scanners: 2 },
          { mois: 'Avr', pc: 4, imprimantes: 3, scanners: 2 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  // Couleurs TGR améliorées
  const COLORS = {
    primary: '#FF6B35',
    primaryLight: '#FF8C42',
    primaryDark: '#E55A2B',
    secondary: '#1E40AF',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    purple: '#8B5CF6',
    indigo: '#4F46E5',
    gray: '#6B7280',
    lightGray: '#F3F4F6'
  };

  // Données pour les charts
  const repartitionData = [
    { name: 'PC', value: stats.totalPc || 0, color: COLORS.secondary, icon: '💻' },
    { name: 'Imprimantes', value: stats.totalImprimantes || 0, color: COLORS.info, icon: '🖨️' },
    { name: 'Scanners', value: stats.totalScanners || 0, color: COLORS.purple, icon: '📷' }
  ];

  const statutData = stats.statutStats ? stats.statutStats.map(item => ({
    name: item.statut.replace('_', ' ').toUpperCase(),
    value: item.count,
    type: item.type,
    color: item.statut === 'en_service' ? COLORS.success : 
           item.statut === 'en_panne' ? COLORS.danger : 
           item.statut === 'en_maintenance' ? COLORS.warning : COLORS.gray
  })) : [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Composant de carte de statistique amélioré
  const StatCard = ({ title, value, color, icon, description, trend, trendValue }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] group">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
        </div>
        {trend && (
          <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {trend === 'up' ? '↗' : '↘'} {trendValue}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Chargement des données du tableau de bord...</p>
          <p className="text-gray-400 text-sm mt-2">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* En-tête amélioré */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Tableau de Bord Pack Informatique
            </h1>
            <p className="text-orange-100 text-lg opacity-90">
              Trésorerie Générale du Royaume - Gestion centralisée du parc informatique
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {error && (
              <div className="bg-orange-800 bg-opacity-50 text-orange-100 text-sm px-4 py-2 rounded-full flex items-center">
                ⚠️ <span className="ml-2">{error}</span>
              </div>
            )}
            <button 
              onClick={fetchDashboardData}
              className="bg-white text-orange-600 px-6 py-2 rounded-lg hover:bg-orange-50 transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center"
            >
              <span className="mr-2">🔄</span>
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total PC" 
          value={stats.totalPc || 0} 
          color="text-blue-600" 
          icon="💻" 
          description="Ordinateurs en stock"
          trend="up"
          trendValue="+2"
        />
        <StatCard 
          title="Total Imprimantes" 
          value={stats.totalImprimantes || 0} 
          color="text-cyan-600" 
          icon="🖨️" 
          description="Imprimantes disponibles"
          trend="up"
          trendValue="+1"
        />
        <StatCard 
          title="Total Scanners" 
          value={stats.totalScanners || 0} 
          color="text-purple-600" 
          icon="📷" 
          description="Scanners fonctionnels"
          trend="up"
          trendValue="+1"
        />
        <StatCard 
          title="Taux Disponibilité" 
          value={`${stats.tauxDisponibilite || (((stats.totalPc || 0) + (stats.totalImprimantes || 0) + (stats.totalScanners || 0) - (stats.materielEnPanne || 0)) / 
            ((stats.totalPc || 0) + (stats.totalImprimantes || 0) + (stats.totalScanners || 0)) * 100 || 0).toFixed(1)}%`} 
          color="text-green-600" 
          icon="📊" 
          description="Équipements opérationnels"
        />
      </div>

      {/* Deuxième ligne de cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Matériel en Panne" 
          value={stats.materielEnPanne || 0} 
          color="text-red-600" 
          icon="⚠️" 
          description="Équipements à réparer"
        />
        <StatCard 
          title="Contrats Expirés" 
          value={stats.contratsExpires || 0} 
          color="text-amber-600" 
          icon="📅" 
          description="Maintenance à renouveler"
        />
        <StatCard 
          title="Utilisateurs" 
          value={stats.totalUtilisateurs || 0} 
          color="text-indigo-600" 
          icon="👥" 
          description="Personnel équipé"
        />
        <StatCard 
          title="Total Équipements" 
          value={(stats.totalPc || 0) + (stats.totalImprimantes || 0) + (stats.totalScanners || 0)} 
          color="text-orange-600" 
          icon="🏢" 
          description="Parc informatique total"
        />
      </div>

      {/* Charts principaux */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Répartition par type de matériel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 xl:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <div className="w-3 h-8 bg-blue-500 rounded-lg mr-3"></div>
              Répartition du Matériel
            </h2>
            <div className="text-sm text-gray-500">
              Total: {repartitionData.reduce((sum, item) => sum + item.value, 0)}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={repartitionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {repartitionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span style={{ color: '#374151', fontSize: '12px' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {repartitionData.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold" style={{ color: item.color }}>
                  {item.value}
                </div>
                <div className="text-sm text-gray-600">{item.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Statut du matériel (bar chart global par statut) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <div className="w-3 h-6 bg-green-500 mr-3 rounded" /> Statut du Matériel (global)
            </h2>
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="text-sm border rounded px-2 py-1">
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>
          </div>

          {/* BarChart existant: on réutilise statutStats s'il existe */}
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={(stats.statutStats || []).map(s => ({ name: `${s.type} - ${s.statut.replace('_',' ')}`, value: s.count, color: s.statut === 'en_service' ? '#10B981' : (s.statut === 'en_panne' ? '#EF4444' : '#F59E0B') }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[6,6,0,0]}>
                {(stats.statutStats || []).map((entry, i) => (
                  <Cell key={i} fill={entry.statut === 'en_service' ? '#10B981' : (entry.statut === 'en_panne' ? '#EF4444' : '#F59E0B')} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistiques par perception */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <div className="w-3 h-8 bg-orange-500 rounded-lg mr-3"></div>
            Répartition par Perception
          </h2>
          <div className="text-sm text-gray-500">
            {stats.perceptionStats?.length || 0} perceptions
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {stats.perceptionStats && stats.perceptionStats.map((perception, index) => (
            <div 
              key={index}
              className={`border-2 rounded-xl p-4 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                selectedPerception?.code === perception.code 
                  ? 'border-orange-500 bg-orange-50 shadow-md' 
                  : 'border-gray-200 hover:border-orange-300'
              }`}
              onClick={() => setSelectedPerception(perception)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight">
                    {perception.perception}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Code: {perception.code}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                  perception.total_problemes > 0 
                    ? 'bg-red-100 text-red-800 border border-red-200' 
                    : 'bg-green-100 text-green-800 border border-green-200'
                }`}>
                  {perception.total_problemes > 0 ? `⚠️ ${perception.total_problemes}` : '✅'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center">
                    <span className="mr-2">💻</span> PC
                  </span>
                  <div className="text-right">
                    <span className="font-semibold">{perception.total_pc || 0}</span>
                    {perception.pc_en_panne_count > 0 && (
                      <span className="text-red-600 text-xs ml-1">({perception.pc_en_panne_count})</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center">
                    <span className="mr-2">🖨️</span> Imprimantes
                  </span>
                  <div className="text-right">
                    <span className="font-semibold">{perception.total_imprimantes || 0}</span>
                    {perception.imprimantes_en_panne_count > 0 && (
                      <span className="text-red-600 text-xs ml-1">({perception.imprimantes_en_panne_count})</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center">
                    <span className="mr-2">📷</span> Scanners
                  </span>
                  <div className="text-right">
                    <span className="font-semibold">{perception.total_scanners || 0}</span>
                    {perception.scanners_en_panne_count > 0 && (
                      <span className="text-red-600 text-xs ml-1">({perception.scanners_en_panne_count})</span>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-gray-700">Total</span>
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
        <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-300 p-6 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <div className="w-3 h-8 bg-orange-500 rounded-lg mr-3"></div>
                Détails - {selectedPerception.perception}
              </h2>
              <p className="text-gray-600 text-sm mt-1">Code: {selectedPerception.code}</p>
            </div>
            <button 
              onClick={() => setSelectedPerception(null)}
              className="text-gray-500 hover:text-gray-700 text-lg bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">{selectedPerception.total_pc || 0}</div>
              <div className="text-lg text-blue-800 font-semibold">PC</div>
              <div className="text-sm text-blue-600 mt-2">Ordinateurs</div>
              {selectedPerception.pc_en_panne_count > 0 && (
                <div className="text-xs text-red-600 mt-2 font-semibold">
                  ⚠️ {selectedPerception.pc_en_panne_count} en panne
                </div>
              )}
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl border border-cyan-200">
              <div className="text-3xl font-bold text-cyan-600 mb-2">{selectedPerception.total_imprimantes || 0}</div>
              <div className="text-lg text-cyan-800 font-semibold">Imprimantes</div>
              <div className="text-sm text-cyan-600 mt-2">Équipements d'impression</div>
              {selectedPerception.imprimantes_en_panne_count > 0 && (
                <div className="text-xs text-red-600 mt-2 font-semibold">
                  ⚠️ {selectedPerception.imprimantes_en_panne_count} en panne
                </div>
              )}
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">{selectedPerception.total_scanners || 0}</div>
              <div className="text-lg text-purple-800 font-semibold">Scanners</div>
              <div className="text-sm text-purple-600 mt-2">Équipements de numérisation</div>
              {selectedPerception.scanners_en_panne_count > 0 && (
                <div className="text-xs text-red-600 mt-2 font-semibold">
                  ⚠️ {selectedPerception.scanners_en_panne_count} en panne
                </div>
              )}
            </div>
          </div>
          
          <div className={`p-4 rounded-xl border-2 ${
            selectedPerception.total_problemes > 0 
              ? 'bg-red-50 border-red-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center">
              <div className={`text-2xl mr-3 ${
                selectedPerception.total_problemes > 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {selectedPerception.total_problemes > 0 ? '🔧' : '✅'}
              </div>
              <div>
                <h3 className={`font-semibold text-lg ${
                  selectedPerception.total_problemes > 0 ? 'text-red-800' : 'text-green-800'
                }`}>
                  {selectedPerception.total_problemes > 0 ? 'Attention Requis' : 'État Optimal'}
                </h3>
                <p className={selectedPerception.total_problemes > 0 ? 'text-red-700' : 'text-green-700'}>
                  {selectedPerception.total_problemes > 0 
                    ? `${selectedPerception.total_problemes} équipement(s) nécessite(nt) une intervention technique`
                    : 'Tous les équipements sont opérationnels et en bon état de fonctionnement'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Indicateurs de performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-2 text-orange-100 text-lg">Total Équipements</h3>
              <div className="text-4xl font-bold">
                {(stats.totalPc || 0) + (stats.totalImprimantes || 0) + (stats.totalScanners || 0)}
              </div>
              <p className="text-orange-100 text-sm mt-2">Parc informatique TGR</p>
            </div>
            <div className="text-3xl">🏢</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-2 text-green-100 text-lg">Taux de Disponibilité</h3>
              <div className="text-4xl font-bold">
                {(((stats.totalPc || 0) + (stats.totalImprimantes || 0) + (stats.totalScanners || 0) - (stats.materielEnPanne || 0)) / 
                  ((stats.totalPc || 0) + (stats.totalImprimantes || 0) + (stats.totalScanners || 0)) * 100 || 0).toFixed(1)}%
              </div>
              <p className="text-green-100 text-sm mt-2">Équipements opérationnels</p>
            </div>
            <div className="text-3xl">📈</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-2 text-blue-100 text-lg">Personnel Équipé</h3>
              <div className="text-4xl font-bold">{stats.totalUtilisateurs || 0}</div>
              <p className="text-blue-100 text-sm mt-2">Agents TGR</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;