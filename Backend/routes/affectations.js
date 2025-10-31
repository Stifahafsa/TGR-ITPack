const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/affectations - Récupérer toutes les affectations
router.get('/', (req, res) => {
  console.log('📋 Requête affectations reçue');

  const query = `
    SELECT 
      'pc' as type,
      pc.id,
      pc.marque,
      pc.modele,
      pc.numero_serie,
      pc.numero_inventaire,
      pc.statut,
      pc.date_livraison,
      u.id as utilisateur_id,
      u.nom as utilisateur_nom,
      u.prenom as utilisateur_prenom,
      u.fonction as utilisateur_fonction,
      p.nom as perception_nom,
      p.code as perception_code
    FROM pc
    LEFT JOIN utilisateurs u ON pc.utilisateur_id = u.id
    LEFT JOIN perceptions p ON pc.perception_id = p.id
    WHERE pc.utilisateur_id IS NOT NULL
    
    UNION ALL
    
    SELECT 
      'imprimante' as type,
      imp.id,
      imp.marque,
      imp.modele,
      imp.numero_serie,
      imp.numero_inventaire,
      imp.statut,
      imp.date_livraison,
      u.id as utilisateur_id,
      u.nom as utilisateur_nom,
      u.prenom as utilisateur_prenom,
      u.fonction as utilisateur_fonction,
      p.nom as perception_nom,
      p.code as perception_code
    FROM imprimantes imp
    LEFT JOIN utilisateurs u ON imp.utilisateur_id = u.id
    LEFT JOIN perceptions p ON imp.perception_id = p.id
    WHERE imp.utilisateur_id IS NOT NULL
    
    UNION ALL
    
    SELECT 
      'scanner' as type,
      scan.id,
      scan.marque,
      scan.modele,
      scan.numero_serie,
      scan.numero_inventaire,
      scan.statut,
      scan.date_livraison,
      u.id as utilisateur_id,
      u.nom as utilisateur_nom,
      u.prenom as utilisateur_prenom,
      u.fonction as utilisateur_fonction,
      p.nom as perception_nom,
      p.code as perception_code
    FROM scanners scan
    LEFT JOIN utilisateurs u ON scan.utilisateur_id = u.id
    LEFT JOIN perceptions p ON scan.perception_id = p.id
    WHERE scan.utilisateur_id IS NOT NULL
    
    ORDER BY type, perception_nom, utilisateur_nom
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('❌ Erreur affectations:', error);
      return res.status(500).json({ 
        message: 'Erreur lors de la récupération des affectations',
        error: error.message 
      });
    }
    
    console.log(`✅ ${results.length} affectations trouvées`);
    res.json(results);
  });
});

// GET /api/affectations/utilisateurs - Récupérer les utilisateurs disponibles
router.get('/utilisateurs', (req, res) => {
  const query = `
    SELECT u.id, u.nom, u.prenom, u.fonction, u.perception_id, p.nom as perception_nom
    FROM utilisateurs u
    LEFT JOIN perceptions p ON u.perception_id = p.id
    ORDER BY u.nom, u.prenom
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('❌ Erreur utilisateurs:', error);
      return res.status(500).json({ 
        message: 'Erreur lors de la récupération des utilisateurs',
        error: error.message 
      });
    }
    
    res.json(results);
  });
});

// GET /api/affectations/materiel-disponible - Récupérer le matériel non affecté
router.get('/materiel-disponible', (req, res) => {
  const query = `
    SELECT 
      'pc' as type, 
      pc.id, 
      pc.marque, 
      pc.modele, 
      pc.numero_serie, 
      pc.numero_inventaire, 
      pc.perception_id,
      p.nom as perception_nom
    FROM pc 
    LEFT JOIN perceptions p ON pc.perception_id = p.id
    WHERE pc.utilisateur_id IS NULL
    
    UNION ALL
    
    SELECT 
      'imprimante' as type, 
      imp.id, 
      imp.marque, 
      imp.modele, 
      imp.numero_serie, 
      imp.numero_inventaire, 
      imp.perception_id,
      p.nom as perception_nom
    FROM imprimantes imp
    LEFT JOIN perceptions p ON imp.perception_id = p.id
    WHERE imp.utilisateur_id IS NULL
    
    UNION ALL
    
    SELECT 
      'scanner' as type, 
      scan.id, 
      scan.marque, 
      scan.modele, 
      scan.numero_serie, 
      scan.numero_inventaire, 
      scan.perception_id,
      p.nom as perception_nom
    FROM scanners scan
    LEFT JOIN perceptions p ON scan.perception_id = p.id
    WHERE scan.utilisateur_id IS NULL
    
    ORDER BY type, marque, modele
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('❌ Erreur matériel disponible:', error);
      return res.status(500).json({ 
        message: 'Erreur lors de la récupération du matériel disponible',
        error: error.message 
      });
    }
    
    res.json(results);
  });
});

// POST /api/affectations/affecter - Affecter un matériel à un utilisateur
router.post('/affecter', (req, res) => {
  const { materielType, materielId, utilisateurId } = req.body;
  
  console.log('🔄 Tentative d\'affectation:', { materielType, materielId, utilisateurId });
  
  // VÉRIFICATION PLUS ROBUSTE DES DONNÉES
  if (!materielType || !materielId || !utilisateurId) {
    return res.status(400).json({ 
      success: false,
      message: 'Données manquantes: type, id matériel et id utilisateur requis',
      received: { materielType, materielId, utilisateurId }
    });
  }

  // VALIDATION DES TYPES
  if (typeof materielId !== 'number' || typeof utilisateurId !== 'number') {
    return res.status(400).json({ 
      success: false,
      message: 'IDs doivent être des nombres',
      received: { materielId: typeof materielId, utilisateurId: typeof utilisateurId }
    });
  }

  let tableName;
  switch (materielType) {
    case 'pc': tableName = 'pc'; break;
    case 'imprimante': tableName = 'imprimantes'; break;
    case 'scanner': tableName = 'scanners'; break;
    default: 
      return res.status(400).json({ 
        success: false,
        message: 'Type de matériel invalide. Doit être: pc, imprimante ou scanner',
        received: materielType
      });
  }

  // Vérifier d'abord si le matériel existe et n'est pas déjà affecté
  const checkQuery = `SELECT utilisateur_id, marque, modele FROM ${tableName} WHERE id = ?`;
  
  db.query(checkQuery, [materielId], (checkError, checkResults) => {
    if (checkError) {
      console.error('❌ Erreur vérification matériel:', checkError);
      return res.status(500).json({ 
        success: false,
        message: 'Erreur lors de la vérification du matériel',
        error: checkError.message 
      });
    }
    
    if (checkResults.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: `Matériel non trouvé: ${materielType} #${materielId}` 
      });
    }
    
    const materiel = checkResults[0];
    
    if (materiel.utilisateur_id !== null) {
      return res.status(400).json({ 
        success: false,
        message: 'Ce matériel est déjà affecté à un utilisateur',
        currentUser: materiel.utilisateur_id
      });
    }

    // Vérifier si l'utilisateur existe
    const checkUserQuery = `SELECT id, nom, prenom FROM utilisateurs WHERE id = ?`;
    db.query(checkUserQuery, [utilisateurId], (userError, userResults) => {
      if (userError) {
        console.error('❌ Erreur vérification utilisateur:', userError);
        return res.status(500).json({ 
          success: false,
          message: 'Erreur lors de la vérification de l\'utilisateur',
          error: userError.message 
        });
      }
      
      if (userResults.length === 0) {
        return res.status(404).json({ 
          success: false,
          message: `Utilisateur non trouvé: #${utilisateurId}` 
        });
      }

      // Affecter le matériel
      const affecterQuery = `UPDATE ${tableName} SET utilisateur_id = ? WHERE id = ?`;
      
      db.query(affecterQuery, [utilisateurId, materielId], (error, results) => {
        if (error) {
          console.error('❌ Erreur affectation:', error);
          return res.status(500).json({ 
            success: false,
            message: 'Erreur lors de l\'affectation',
            error: error.message 
          });
        }
        
        if (results.affectedRows === 0) {
          return res.status(404).json({ 
            success: false,
            message: 'Matériel non trouvé lors de la mise à jour' 
          });
        }
        
        // Ajouter à l'historique
        const historiqueQuery = `
          INSERT INTO historique_affectations 
          (materiel_type, materiel_id, utilisateur_id, date_debut) 
          VALUES (?, ?, ?, CURDATE())
        `;
        
        db.query(historiqueQuery, [materielType, materielId, utilisateurId], (histError) => {
          if (histError) {
            console.error('❌ Erreur historique:', histError);
            // On continue même si l'historique échoue, mais on log l'erreur
          }
          
          console.log(`✅ Matériel ${materielType} #${materielId} (${materiel.marque} ${materiel.modele}) affecté à utilisateur #${utilisateurId}`);
          
          res.json({ 
            success: true,
            message: 'Affectation réussie',
            materiel: {
              type: materielType,
              id: materielId,
              marque: materiel.marque,
              modele: materiel.modele
            },
            utilisateur: {
              id: utilisateurId,
              nom: userResults[0].nom,
              prenom: userResults[0].prenom
            },
            affectedRows: results.affectedRows 
          });
        });
      });
    });
  });
});
// POST /api/affectations/desaffecter - Désaffecter un matériel
router.post('/desaffecter', (req, res) => {
  const { materielType, materielId } = req.body;
  
  console.log('🔄 Tentative de désaffectation:', { materielType, materielId });
  
  if (!materielType || !materielId) {
    return res.status(400).json({ 
      success: false,
      message: 'Données manquantes: type et id matériel requis' 
    });
  }

  let tableName;
  switch (materielType) {
    case 'pc': tableName = 'pc'; break;
    case 'imprimante': tableName = 'imprimantes'; break;
    case 'scanner': tableName = 'scanners'; break;
    default: 
      return res.status(400).json({ 
        success: false,
        message: 'Type de matériel invalide' 
      });
  }

  // Vérifier d'abord si le matériel existe et est affecté
  const checkQuery = `SELECT utilisateur_id FROM ${tableName} WHERE id = ?`;
  
  db.query(checkQuery, [materielId], (checkError, checkResults) => {
    if (checkError) {
      console.error('❌ Erreur vérification matériel:', checkError);
      return res.status(500).json({ 
        success: false,
        message: 'Erreur lors de la vérification du matériel',
        error: checkError.message 
      });
    }
    
    if (checkResults.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Matériel non trouvé' 
      });
    }
    
    if (checkResults[0].utilisateur_id === null) {
      return res.status(400).json({ 
        success: false,
        message: 'Ce matériel n\'est pas affecté' 
      });
    }

    const utilisateurId = checkResults[0].utilisateur_id;
    
    // Désaffecter le matériel
    const desaffecterQuery = `UPDATE ${tableName} SET utilisateur_id = NULL WHERE id = ?`;
    
    db.query(desaffecterQuery, [materielId], (error, results) => {
      if (error) {
        console.error('❌ Erreur désaffectation:', error);
        return res.status(500).json({ 
          success: false,
          message: 'Erreur lors de la désaffectation',
          error: error.message 
        });
      }
      
      if (results.affectedRows === 0) {
        return res.status(404).json({ 
          success: false,
          message: 'Matériel non trouvé' 
        });
      }
      
      // Mettre à jour l'historique
      const updateHistoriqueQuery = `
        UPDATE historique_affectations 
        SET date_fin = CURDATE(), raison_fin = 'changement'
        WHERE materiel_type = ? AND materiel_id = ? AND date_fin IS NULL
      `;
      
      db.query(updateHistoriqueQuery, [materielType, materielId], (histError) => {
        if (histError) {
          console.error('❌ Erreur mise à jour historique:', histError);
        }
        
        console.log(`✅ Matériel ${materielType} #${materielId} désaffecté`);
        res.json({ 
          success: true,
          message: 'Désaffectation réussie',
          affectedRows: results.affectedRows 
        });
      });
    });
  });
});

module.exports = router;