// routes/dashboard.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/dashboard/stats - Statistiques complètes pour le dashboard
router.get('/stats', (req, res) => {
  console.log('📊 GET /api/dashboard/stats - Chargement des statistiques complètes');

  const queries = {
    // Statistiques générales (exclure les équipements réformés)
    totalPc: `SELECT COUNT(*) as count FROM pc WHERE statut != 'reforme'`,
    totalImprimantes: `SELECT COUNT(*) as count FROM imprimantes WHERE statut != 'reforme'`,
    totalScanners: `SELECT COUNT(*) as count FROM scanners WHERE statut != 'reforme'`,
    totalUtilisateurs: `SELECT COUNT(*) as count FROM utilisateurs`,
    
    // Matériel en panne (tous types)
    materielEnPanne: `
      SELECT COUNT(*) as count FROM (
        SELECT id FROM pc WHERE statut = 'en_panne'
        UNION ALL
        SELECT id FROM imprimantes WHERE statut = 'en_panne'
        UNION ALL
        SELECT id FROM scanners WHERE statut = 'en_panne'
      ) as panne
    `,
    
    // Contrats de maintenance expirés (déjà expirés)
    contratsExpires: `
      SELECT COUNT(*) as count FROM (
        SELECT id FROM pc WHERE date_fin_contrat_maintenance < CURDATE()
        UNION ALL
        SELECT id FROM imprimantes WHERE date_fin_contrat_maintenance < CURDATE()
      ) as contrats
    `,
    
    // Statistiques par perception (version détaillée)
    perceptionStats: `
      SELECT 
        p.id,
        p.nom as perception,
        p.code,
        p.adresse,
        p.telephone,
        
        -- Totaux par type d'équipement
        COUNT(DISTINCT pc.id) as total_pc,
        COUNT(DISTINCT imp.id) as total_imprimantes,
        COUNT(DISTINCT scan.id) as total_scanners,
        
        -- Équipements en panne par type
        COUNT(DISTINCT CASE WHEN pc.statut = 'en_panne' THEN pc.id END) as pc_en_panne_count,
        COUNT(DISTINCT CASE WHEN imp.statut = 'en_panne' THEN imp.id END) as imprimantes_en_panne_count,
        COUNT(DISTINCT CASE WHEN scan.statut = 'en_panne' THEN scan.id END) as scanners_en_panne_count,
        
        -- Total problèmes
        (COUNT(DISTINCT CASE WHEN pc.statut = 'en_panne' THEN pc.id END) +
         COUNT(DISTINCT CASE WHEN imp.statut = 'en_panne' THEN imp.id END) +
         COUNT(DISTINCT CASE WHEN scan.statut = 'en_panne' THEN scan.id END)) as total_problemes,
        
        -- Ancien champ pour compatibilité
        COUNT(DISTINCT CASE WHEN pc.statut = 'en_panne' THEN pc.id END) +
        COUNT(DISTINCT CASE WHEN imp.statut = 'en_panne' THEN imp.id END) +
        COUNT(DISTINCT CASE WHEN scan.statut = 'en_panne' THEN scan.id END) as en_panne

      FROM perceptions p
      LEFT JOIN pc ON p.id = pc.perception_id AND pc.statut != 'reforme'
      LEFT JOIN imprimantes imp ON p.id = imp.perception_id AND imp.statut != 'reforme'
      LEFT JOIN scanners scan ON p.id = scan.perception_id AND scan.statut != 'reforme'
      GROUP BY p.id, p.nom, p.code, p.adresse, p.telephone
      ORDER BY p.nom
    `,
    
    // Statistiques par statut détaillées
    statutStats: `
      SELECT 'pc' as type, statut, COUNT(*) as count FROM pc GROUP BY statut
      UNION ALL
      SELECT 'imprimante' as type, statut, COUNT(*) as count FROM imprimantes GROUP BY statut
      UNION ALL
      SELECT 'scanner' as type, statut, COUNT(*) as count FROM scanners GROUP BY statut
      ORDER BY type, statut
    `,
    
    // Données d'évolution pour les graphiques
    evolutionData: `
      SELECT 
        DATE_FORMAT(MIN(date_livraison), '%b') as mois,
        COUNT(CASE WHEN type = 'pc' THEN id END) as pc,
        COUNT(CASE WHEN type = 'imprimante' THEN id END) as imprimantes,
        COUNT(CASE WHEN type = 'scanner' THEN id END) as scanners
      FROM (
        SELECT date_livraison, id, 'pc' as type FROM pc WHERE statut != 'reforme'
        UNION ALL
        SELECT date_livraison, id, 'imprimante' as type FROM imprimantes WHERE statut != 'reforme'
        UNION ALL
        SELECT date_livraison, id, 'scanner' as type FROM scanners WHERE statut != 'reforme'
      ) as materiel
      WHERE date_livraison >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(date_livraison, '%Y-%m')
      ORDER BY MIN(date_livraison)
      LIMIT 6
    `
  };

  // Exécuter toutes les requêtes
  const results = {};
  const queryPromises = [];

  Object.keys(queries).forEach(key => {
    queryPromises.push(
      new Promise((resolve, reject) => {
        db.query(queries[key], (error, queryResults) => {
          if (error) {
            console.error(`❌ Erreur query ${key}:`, error);
            resolve(getDefaultValue(key));
          } else {
            resolve(processQueryResult(key, queryResults));
          }
        });
      })
    );
  });

  // Fonction pour les valeurs par défaut
  function getDefaultValue(key) {
    const defaults = {
      'totalPc': 0,
      'totalImprimantes': 0,
      'totalScanners': 0,
      'totalUtilisateurs': 0,
      'materielEnPanne': 0,
      'contratsExpires': 0,
      'perceptionStats': [],
      'statutStats': [],
      'evolutionData': []
    };
    return defaults[key] || null;
  }

  // Fonction pour traiter les résultats
  function processQueryResult(key, queryResults) {
    switch(key) {
      case 'totalPc':
      case 'totalImprimantes':
      case 'totalScanners':
      case 'totalUtilisateurs':
      case 'materielEnPanne':
      case 'contratsExpires':
        return queryResults[0]?.count || 0;
      default:
        return queryResults;
    }
  }

  Promise.all(queryPromises)
    .then(values => {
      const keys = Object.keys(queries);
      
      // Assigner les résultats
      keys.forEach((key, index) => {
        results[key] = values[index];
      });

      // Calculer le taux de disponibilité
      const totalEquipements = (results.totalPc || 0) + (results.totalImprimantes || 0) + (results.totalScanners || 0);
      const equipementsOperationnels = totalEquipements - (results.materielEnPanne || 0);
      results.tauxDisponibilite = totalEquipements > 0 
        ? ((equipementsOperationnels / totalEquipements) * 100).toFixed(1)
        : 0;

      console.log('✅ Statistiques dashboard chargées:', {
        totalPc: results.totalPc,
        totalImprimantes: results.totalImprimantes,
        totalScanners: results.totalScanners,
        materielEnPanne: results.materielEnPanne,
        contratsExpires: results.contratsExpires,
        tauxDisponibilite: results.tauxDisponibilite,
        perceptions: results.perceptionStats.length,
        statuts: results.statutStats.length
      });

      res.json(results);
    })
    .catch(error => {
      console.error('❌ Erreur générale dashboard:', error);
      res.status(500).json({ 
        message: 'Erreur lors de la récupération des statistiques',
        error: error.message 
      });
    });
});

// GET /api/dashboard/perception/:id/details - Détails complets d'une perception
router.get('/perception/:id/details', (req, res) => {
  const perceptionId = req.params.id;
  console.log(`📋 GET /api/dashboard/perception/${perceptionId}/details`);

  const queries = {
    // Informations de base de la perception
    perceptionInfo: `SELECT * FROM perceptions WHERE id = ?`,
    
    // Tous les PC de la perception
    pcs: `
      SELECT 
        pc.*,
        u.nom as utilisateur_nom,
        u.prenom as utilisateur_prenom,
        u.fonction as utilisateur_fonction
      FROM pc 
      LEFT JOIN utilisateurs u ON pc.utilisateur_id = u.id
      WHERE pc.perception_id = ?
      ORDER BY pc.statut, pc.marque, pc.modele
    `,
    
    // Toutes les imprimantes de la perception
    imprimantes: `
      SELECT 
        imp.*,
        u.nom as utilisateur_nom,
        u.prenom as utilisateur_prenom,
        u.fonction as utilisateur_fonction
      FROM imprimantes imp
      LEFT JOIN utilisateurs u ON imp.utilisateur_id = u.id
      WHERE imp.perception_id = ?
      ORDER BY imp.statut, imp.marque, imp.modele
    `,
    
    // Tous les scanners de la perception
    scanners: `
      SELECT 
        scan.*,
        u.nom as utilisateur_nom,
        u.prenom as utilisateur_prenom,
        u.fonction as utilisateur_fonction
      FROM scanners scan
      LEFT JOIN utilisateurs u ON scan.utilisateur_id = u.id
      WHERE scan.perception_id = ?
      ORDER BY scan.statut, scan.marque, scan.modele
    `,
    
    // Utilisateurs de la perception
    utilisateurs: `SELECT * FROM utilisateurs WHERE perception_id = ? ORDER BY nom, prenom`
  };

  const results = {};
  const queryPromises = [];

  Object.keys(queries).forEach(key => {
    queryPromises.push(
      new Promise((resolve, reject) => {
        db.query(queries[key], [perceptionId], (error, queryResults) => {
          if (error) {
            console.error(`❌ Erreur query ${key}:`, error);
            resolve([]);
          } else {
            resolve(queryResults);
          }
        });
      })
    );
  });

  Promise.all(queryPromises)
    .then(values => {
      const keys = Object.keys(queries);
      
      results.perceptionInfo = values[keys.indexOf('perceptionInfo')][0] || null;
      results.pcs = values[keys.indexOf('pcs')];
      results.imprimantes = values[keys.indexOf('imprimantes')];
      results.scanners = values[keys.indexOf('scanners')];
      results.utilisateurs = values[keys.indexOf('utilisateurs')];

      if (!results.perceptionInfo) {
        return res.status(404).json({ message: 'Perception non trouvée' });
      }

      console.log(`✅ Détails perception ${results.perceptionInfo.nom}:`, {
        pcs: results.pcs.length,
        imprimantes: results.imprimantes.length,
        scanners: results.scanners.length,
        utilisateurs: results.utilisateurs.length
      });

      res.json(results);
    })
    .catch(error => {
      console.error('❌ Erreur détails perception:', error);
      res.status(500).json({ 
        message: 'Erreur lors de la récupération des détails de la perception',
        error: error.message 
      });
    });
});

module.exports = router;