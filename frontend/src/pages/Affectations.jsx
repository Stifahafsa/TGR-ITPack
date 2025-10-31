import React, { useState, useEffect } from 'react';

const Affectations = () => {
  const [affectations, setAffectations] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [materielDisponible, setMaterielDisponible] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAffecterForm, setShowAffecterForm] = useState(false);
  const [selectedMateriel, setSelectedMateriel] = useState('');
  const [selectedUtilisateur, setSelectedUtilisateur] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');
  const [apiStatus, setApiStatus] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const showNotification = (message, type = 'success') => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 4000);
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setApiStatus('🔄 Chargement des données...');

      // Test de connexion d'abord
      const healthResponse = await fetch('/api/health');
      if (!healthResponse.ok) {
        throw new Error('Serveur non disponible');
      }

      const [affectationsRes, utilisateursRes, materielRes] = await Promise.all([
        fetch('/api/affectations').then(res => {
          if (!res.ok) throw new Error(`Affectations: ${res.status}`);
          return res.json();
        }),
        fetch('/api/affectations/utilisateurs').then(res => {
          if (!res.ok) throw new Error(`Utilisateurs: ${res.status}`);
          return res.json();
        }),
        fetch('/api/affectations/materiel-disponible').then(res => {
          if (!res.ok) throw new Error(`Matériel: ${res.status}`);
          return res.json();
        })
      ]);

      setAffectations(affectationsRes);
      setUtilisateurs(utilisateursRes);
      setMaterielDisponible(materielRes);

      setApiStatus(`✅ ${affectationsRes.length} affectations, ${utilisateursRes.length} utilisateurs, ${materielRes.length} matériels disponibles`);

    } catch (error) {
      console.error('Erreur chargement:', error);
      setApiStatus('❌ Erreur de connexion au serveur');
      showNotification('Impossible de charger les données depuis le serveur', 'error');
      
      // Charger des données d'exemple
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    // Données d'exemple basées sur votre base
    const mockAffectations = [
      {
        type: 'pc',
        id: 1,
        marque: 'DELL',
        modele: 'OptiPlex 7070',
        numero_serie: 'DLX707012345',
        numero_inventaire: 'INV-PC-001',
        statut: 'en_service',
        utilisateur_nom: 'ALAOUI',
        utilisateur_prenom: 'Mohammed',
        utilisateur_fonction: 'Agent comptable',
        perception_nom: 'Ouarzazate',
        perception_code: 'OUA'
      },
      {
        type: 'pc',
        id: 2,
        marque: 'HP',
        modele: 'ProDesk 600 G6',
        numero_serie: 'HPPD60067890',
        numero_inventaire: 'INV-PC-002',
        statut: 'en_service',
        utilisateur_nom: 'BENNANI',
        utilisateur_prenom: 'Fatima',
        utilisateur_fonction: 'Chef de service',
        perception_nom: 'Ouarzazate',
        perception_code: 'OUA'
      }
    ];

    const mockUtilisateurs = [
      { id: 1, nom: 'ALAOUI', prenom: 'Mohammed', fonction: 'Agent comptable', perception_nom: 'Ouarzazate' },
      { id: 2, nom: 'BENNANI', prenom: 'Fatima', fonction: 'Chef de service', perception_nom: 'Ouarzazate' },
      { id: 3, nom: 'CHAKIR', prenom: 'Hassan', fonction: 'Agent administratif', perception_nom: 'Boumalne Dades' }
    ];

    const mockMateriel = [
      { 
        type: 'imprimante', 
        id: 1, 
        marque: 'HP', 
        modele: 'LaserJet Pro M404dn', 
        numero_serie: 'HPLJM4041111', 
        numero_inventaire: 'INV-IMP-001',
        perception_nom: 'Ouarzazate'
      },
      { 
        type: 'imprimante', 
        id: 2, 
        marque: 'CANON', 
        modele: 'i-SENSYS MF644Cdw', 
        numero_serie: 'CNMF6442222', 
        numero_inventaire: 'INV-IMP-002',
        perception_nom: 'Boumalne Dades'
      }
    ];

    setAffectations(mockAffectations);
    setUtilisateurs(mockUtilisateurs);
    setMaterielDisponible(mockMateriel);
  };

  const handleAffecter = async (e) => {
    e.preventDefault();
    
    if (!selectedMateriel || !selectedUtilisateur) {
      showNotification('Veuillez sélectionner un matériel et un utilisateur', 'error');
      return;
    }

    try {
      const [materielType, materielId] = selectedMateriel.split('-');
      const utilisateur = utilisateurs.find(u => u.id === parseInt(selectedUtilisateur));
      const materiel = materielDisponible.find(m => m.id === parseInt(materielId) && m.type === materielType);

      const response = await fetch('/api/affectations/affecter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          materielType,
          materielId: parseInt(materielId),
          utilisateurId: parseInt(selectedUtilisateur)
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showNotification(`✅ ${materiel.marque} ${materiel.modele} affecté à ${utilisateur.prenom} ${utilisateur.nom}`);
        
        setShowAffecterForm(false);
        setSelectedMateriel('');
        setSelectedUtilisateur('');
        
        // Recharger les données
        setTimeout(() => {
          fetchAllData();
        }, 1000);
        
      } else {
        throw new Error(result.message || 'Erreur lors de l\'affectation');
      }

    } catch (error) {
      console.error('Erreur affectation:', error);
      showNotification(`❌ ${error.message}`, 'error');
    }
  };

  const handleDesaffecter = async (materielType, materielId, materielInfo) => {
    if (!confirm(`Êtes-vous sûr de vouloir désaffecter ce matériel ?\n${materielInfo.marque} ${materielInfo.modele} - ${materielInfo.numero_serie}`)) {
      return;
    }

    try {
      const response = await fetch('/api/affectations/desaffecter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          materielType,
          materielId: parseInt(materielId)
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showNotification(`✅ ${materielInfo.marque} ${materielInfo.modele} désaffecté avec succès`);
        
        // Recharger les données
        setTimeout(() => {
          fetchAllData();
        }, 1000);
        
      } else {
        throw new Error(result.message || 'Erreur lors de la désaffectation');
      }

    } catch (error) {
      console.error('Erreur désaffectation:', error);
      showNotification(`❌ ${error.message}`, 'error');
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'pc': return 'bg-blue-100 text-blue-800';
      case 'imprimante': return 'bg-green-100 text-green-800';
      case 'scanner': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'en_service': return 'bg-green-100 text-green-800';
      case 'en_panne': return 'bg-red-100 text-red-800';
      case 'en_maintenance': return 'bg-orange-100 text-orange-800';
      case 'reforme': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'pc': return '💻';
      case 'imprimante': return '🖨️';
      case 'scanner': return '📷';
      default: return '🔧';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Popup de notification */}
      {showPopup && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`p-4 rounded-lg shadow-lg border ${
            popupType === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              <span className="text-lg mr-2">{popupType === 'success' ? '✅' : '❌'}</span>
              <span className="font-medium">{popupMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Affectations</h1>
          <p className="text-gray-600 mt-1">Affectation du matériel informatique TGR</p>
        </div>
        <button 
          onClick={() => setShowAffecterForm(true)}
          className="group bg-white text-orange-600 font-semibold py-3 px-6 rounded-xl border-2 border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center space-x-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
        >
          
          <span> + Nouvelle Affectation</span>
        </button>
      </div>

      {/* Statut */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-blue-600 mr-2">📊</span>
            <span className="text-blue-800">{apiStatus}</span>
          </div>
          <button 
            onClick={fetchAllData}
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            Actualiser
          </button>
        </div>
      </div>

      {/* Cartes de résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Affectations Actives</p>
              <p className="text-2xl font-bold text-gray-900">{affectations.length}</p>
            </div>
            <div className="text-2xl">📋</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">{utilisateurs.length}</p>
            </div>
            <div className="text-2xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Matériel Disponible</p>
              <p className="text-2xl font-bold text-gray-900">{materielDisponible.length}</p>
            </div>
            <div className="text-2xl">🖥️</div>
          </div>
        </div>
      </div>

      {/* Formulaire d'affectation */}
      {showAffecterForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Nouvelle Affectation</h2>
                <button 
                  onClick={() => setShowAffecterForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-lg"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleAffecter} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Matériel disponible
                    </label>
                    <select
                      value={selectedMateriel}
                      onChange={(e) => setSelectedMateriel(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    >
                      <option value="">Sélectionner un matériel</option>
                      {materielDisponible.map((item) => (
                        <option key={`${item.type}-${item.id}`} value={`${item.type}-${item.id}`}>
                          {getTypeIcon(item.type)} {item.marque} {item.modele} - {item.numero_serie}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Utilisateur
                    </label>
                    <select
                      value={selectedUtilisateur}
                      onChange={(e) => setSelectedUtilisateur(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    >
                      <option value="">Sélectionner un utilisateur</option>
                      {utilisateurs.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.prenom} {user.nom} - {user.fonction}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAffecterForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold"
                  >
                    Confirmer l'Affectation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Liste des affectations */}
      <div className="tgr-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Matériels Affectés
          </h2>
          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
            {affectations.length} affectation(s)
          </span>
        </div>

        {affectations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune affectation trouvée</h3>
            <p className="text-gray-600 mb-6">
              Aucun matériel n'est actuellement affecté à un utilisateur.
            </p>
            <button 
              onClick={() => setShowAffecterForm(true)}
              className="tgr-btn bg-orange-500 text-white hover:bg-orange-600"
            >
              Créer une première affectation
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matériel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° Série
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Perception
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {affectations.map((affectation) => (
                  <tr key={`${affectation.type}-${affectation.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getTypeIcon(affectation.type)}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {affectation.marque} {affectation.modele}
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(affectation.type)}`}>
                            {affectation.type}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{affectation.numero_serie}</div>
                      <div className="text-sm text-gray-500">{affectation.numero_inventaire}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {affectation.utilisateur_prenom} {affectation.utilisateur_nom}
                      </div>
                      <div className="text-sm text-gray-500">{affectation.utilisateur_fonction}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{affectation.perception_nom}</div>
                      <div className="text-sm text-gray-500">{affectation.perception_code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(affectation.statut)}`}>
                        {affectation.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDesaffecter(affectation.type, affectation.id, affectation)}
                        className="text-red-600 hover:text-red-900 px-3 py-1 rounded-lg text-sm"
                      >
                        Désaffecter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Matériel disponible */}
      <div className="tgr-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Matériel Disponible
          </h2>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
            {materielDisponible.length} disponible(s)
          </span>
        </div>
        
        {materielDisponible.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-gray-500">Tout le matériel est actuellement affecté !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materielDisponible.map((item) => (
              <div 
                key={`${item.type}-${item.id}`} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer hover:border-orange-300"
                onClick={() => {
                  setSelectedMateriel(`${item.type}-${item.id}`);
                  setShowAffecterForm(true);
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{getTypeIcon(item.type)}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-900">
                    {item.marque} {item.modele}
                  </div>
                  <div className="text-sm text-gray-600">
                    Série: {item.numero_serie}
                  </div>
                  <div className="text-sm text-gray-600">
                    Inventaire: {item.numero_inventaire}
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <button className="w-full px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-semibold">
                    Affecter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Affectations;