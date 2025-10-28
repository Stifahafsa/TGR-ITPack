import React, { useState, useEffect } from 'react';
import { materielAPI } from '../services/api';

const Imprimantes = () => {
  const [imprimantes, setImprimantes] = useState([]);
  const [perceptions, setPerceptions] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingImprimante, setEditingImprimante] = useState(null);

  const [formData, setFormData] = useState({
    marque: '',
    modele: '',
    numero_serie: '',
    numero_inventaire: '',
    date_livraison: '',
    date_achat: '',
    date_fin_contrat_maintenance: '',
    perception_id: '',
    statut: 'en_service'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [imprimantesRes, perceptionsRes, utilisateursRes] = await Promise.all([
        materielAPI.get('/imprimantes'),
        materielAPI.get('/perceptions'),
        materielAPI.get('/utilisateurs')
      ]);
      setImprimantes(imprimantesRes.data);
      setPerceptions(perceptionsRes.data);
      setUtilisateurs(utilisateursRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      alert('Erreur de chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingImprimante) {
        await materielAPI.put(`/imprimantes/${editingImprimante.id}`, formData);
      } else {
        await materielAPI.post('/imprimantes', formData);
      }
      setShowForm(false);
      setEditingImprimante(null);
      setFormData({
        marque: '', modele: '', numero_serie: '', numero_inventaire: '',
        date_livraison: '', date_achat: '', date_fin_contrat_maintenance: '',
        perception_id: '', statut: 'en_service'
      });
      fetchData();
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (imprimante) => {
    setEditingImprimante(imprimante);
    setFormData({
      marque: imprimante.marque,
      modele: imprimante.modele,
      numero_serie: imprimante.numero_serie,
      numero_inventaire: imprimante.numero_inventaire,
      date_livraison: imprimante.date_livraison,
      date_achat: imprimante.date_achat || '',
      date_fin_contrat_maintenance: imprimante.date_fin_contrat_maintenance || '',
      perception_id: imprimante.perception_id,
      statut: imprimante.statut
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette imprimante ?')) {
      try {
        await materielAPI.delete(`/imprimantes/${id}`);
        fetchData();
      } catch (error) {
        console.error('Erreur:', error);
        alert(error.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  const getStatusColor = (statut) => {
    const colors = {
      'en_service': 'bg-green-100 text-green-800',
      'en_panne': 'bg-red-100 text-red-800',
      'en_maintenance': 'bg-yellow-100 text-yellow-800',
      'reforme': 'bg-gray-100 text-gray-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Imprimantes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Ajouter une Imprimante
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingImprimante ? 'Modifier l\'Imprimante' : 'Nouvelle Imprimante'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Marque"
              value={formData.marque}
              onChange={(e) => setFormData({...formData, marque: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Modèle"
              value={formData.modele}
              onChange={(e) => setFormData({...formData, modele: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Numéro de série"
              value={formData.numero_serie}
              onChange={(e) => setFormData({...formData, numero_serie: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Numéro d'inventaire"
              value={formData.numero_inventaire}
              onChange={(e) => setFormData({...formData, numero_inventaire: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="date"
              placeholder="Date de livraison"
              value={formData.date_livraison}
              onChange={(e) => setFormData({...formData, date_livraison: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="date"
              placeholder="Date d'achat"
              value={formData.date_achat}
              onChange={(e) => setFormData({...formData, date_achat: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              placeholder="Fin de contrat maintenance"
              value={formData.date_fin_contrat_maintenance}
              onChange={(e) => setFormData({...formData, date_fin_contrat_maintenance: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={formData.perception_id}
              onChange={(e) => setFormData({...formData, perception_id: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner une perception</option>
              {perceptions.map(p => (
                <option key={p.id} value={p.id}>{p.nom}</option>
              ))}
            </select>
            <select
              value={formData.statut}
              onChange={(e) => setFormData({...formData, statut: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en_service">En service</option>
              <option value="en_panne">En panne</option>
              <option value="en_maintenance">En maintenance</option>
              <option value="reforme">Réformé</option>
            </select>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                {editingImprimante ? 'Modifier' : 'Créer'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setEditingImprimante(null);
                  setFormData({
                    marque: '', modele: '', numero_serie: '', numero_inventaire: '',
                    date_livraison: '', date_achat: '', date_fin_contrat_maintenance: '',
                    perception_id: '', statut: 'en_service'
                  });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Marque/Modèle</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Numéros</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Perception</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {imprimantes.map(imprimante => (
                <tr key={imprimante.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{imprimante.marque}</div>
                    <div className="text-sm text-gray-500">{imprimante.modele}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Série: {imprimante.numero_serie}</div>
                    <div className="text-sm text-gray-500">Inventaire: {imprimante.numero_inventaire}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Livraison: {formatDate(imprimante.date_livraison)}</div>
                    {imprimante.date_fin_contrat_maintenance && (
                      <div className={`text-sm ${
                        new Date(imprimante.date_fin_contrat_maintenance) < new Date() 
                          ? 'text-red-600 font-semibold' 
                          : 'text-gray-500'
                      }`}>
                        Contrat: {formatDate(imprimante.date_fin_contrat_maintenance)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(imprimante.statut)}`}>
                      {imprimante.statut.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {imprimante.perception_nom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(imprimante)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(imprimante.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Imprimantes;