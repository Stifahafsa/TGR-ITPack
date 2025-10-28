const db = require('../config/database');

const affecterMateriel = (req, res) => {
    const { materiel_type, materiel_id, utilisateur_id } = req.body;
    
    if (!materiel_type || !materiel_id || !utilisateur_id) {
        return res.status(400).json({ 
            message: 'Type de matériel, ID du matériel et ID de l\'utilisateur sont requis.' 
        });
    }
    
    // Déterminer la table du matériel
    let tableName;
    switch(materiel_type) {
        case 'pc':
            tableName = 'pc';
            break;
        case 'imprimante':
            tableName = 'imprimantes';
            break;
        case 'scanner':
            tableName = 'scanners';
            break;
        default:
            return res.status(400).json({ message: 'Type de matériel invalide.' });
    }
    
    // Commencer une transaction
    db.beginTransaction((err) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ message: 'Erreur serveur.' });
        }
        
        // 1. Vérifier que le matériel existe
        const checkQuery = `SELECT * FROM ${tableName} WHERE id = ?`;
        db.query(checkQuery, [materiel_id], (err, results) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Erreur DB:', err);
                    res.status(500).json({ message: 'Erreur serveur.' });
                });
            }
            
            if (results.length === 0) {
                return db.rollback(() => {
                    res.status(404).json({ message: 'Matériel non trouvé.' });
                });
            }
            
            const materiel = results[0];
            
            // 2. Vérifier que l'utilisateur existe
            db.query('SELECT * FROM utilisateurs WHERE id = ?', [utilisateur_id], (err, userResults) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Erreur DB:', err);
                        res.status(500).json({ message: 'Erreur serveur.' });
                    });
                }
                
                if (userResults.length === 0) {
                    return db.rollback(() => {
                        res.status(404).json({ message: 'Utilisateur non trouvé.' });
                    });
                }
                
                const utilisateur = userResults[0];
                
                // Vérifier que le matériel et l'utilisateur sont de la même perception
                if (materiel.perception_id !== utilisateur.perception_id) {
                    return db.rollback(() => {
                        res.status(400).json({ 
                            message: 'Le matériel et l\'utilisateur doivent appartenir à la même perception.' 
                        });
                    });
                }
                
                // 3. Mettre à jour le matériel avec le nouvel utilisateur
                const updateQuery = `UPDATE ${tableName} SET utilisateur_id = ? WHERE id = ?`;
                db.query(updateQuery, [utilisateur_id, materiel_id], (err, results) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Erreur DB:', err);
                            res.status(500).json({ message: 'Erreur serveur.' });
                        });
                    }
                    
                    // 4. Historiser l'ancienne affectation (marquer la fin)
                    const historiqueUpdateQuery = `
                        UPDATE historique_affectations 
                        SET date_fin = CURDATE(), raison_fin = 'changement' 
                        WHERE materiel_type = ? AND materiel_id = ? AND date_fin IS NULL
                    `;
                    db.query(historiqueUpdateQuery, [materiel_type, materiel_id], (err, results) => {
                        if (err) {
                            return db.rollback(() => {
                                console.error('Erreur DB:', err);
                                res.status(500).json({ message: 'Erreur serveur.' });
                            });
                        }
                        
                        // 5. Créer une nouvelle entrée d'historique
                        const historiqueInsertQuery = `
                            INSERT INTO historique_affectations 
                            (materiel_type, materiel_id, utilisateur_id, date_debut)
                            VALUES (?, ?, ?, CURDATE())
                        `;
                        db.query(historiqueInsertQuery, [materiel_type, materiel_id, utilisateur_id], (err, results) => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error('Erreur DB:', err);
                                    res.status(500).json({ message: 'Erreur serveur.' });
                                });
                            }
                            
                            // Valider la transaction
                            db.commit((err) => {
                                if (err) {
                                    return db.rollback(() => {
                                        console.error('Erreur DB:', err);
                                        res.status(500).json({ message: 'Erreur serveur.' });
                                    });
                                }
                                res.json({ 
                                    message: 'Matériel affecté avec succès.',
                                    affectation: {
                                        id: results.insertId,
                                        materiel_type,
                                        materiel_id,
                                        utilisateur_id,
                                        date_debut: new Date().toISOString().split('T')[0]
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

const libererMateriel = (req, res) => {
    const { materiel_type, materiel_id } = req.body;
    
    if (!materiel_type || !materiel_id) {
        return res.status(400).json({ 
            message: 'Type de matériel et ID du matériel sont requis.' 
        });
    }
    
    let tableName;
    switch(materiel_type) {
        case 'pc':
            tableName = 'pc';
            break;
        case 'imprimante':
            tableName = 'imprimantes';
            break;
        case 'scanner':
            tableName = 'scanners';
            break;
        default:
            return res.status(400).json({ message: 'Type de matériel invalide.' });
    }
    
    db.beginTransaction((err) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ message: 'Erreur serveur.' });
        }
        
        // 1. Libérer le matériel
        const updateQuery = `UPDATE ${tableName} SET utilisateur_id = NULL WHERE id = ?`;
        db.query(updateQuery, [materiel_id], (err, results) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Erreur DB:', err);
                    res.status(500).json({ message: 'Erreur serveur.' });
                });
            }
            
            if (results.affectedRows === 0) {
                return db.rollback(() => {
                    res.status(404).json({ message: 'Matériel non trouvé.' });
                });
            }
            
            // 2. Marquer la fin de l'affectation dans l'historique
            const historiqueQuery = `
                UPDATE historique_affectations 
                SET date_fin = CURDATE(), raison_fin = 'liberation' 
                WHERE materiel_type = ? AND materiel_id = ? AND date_fin IS NULL
            `;
            db.query(historiqueQuery, [materiel_type, materiel_id], (err, results) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Erreur DB:', err);
                        res.status(500).json({ message: 'Erreur serveur.' });
                    });
                }
                
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Erreur DB:', err);
                            res.status(500).json({ message: 'Erreur serveur.' });
                        });
                    }
                    res.json({ message: 'Matériel libéré avec succès.' });
                });
            });
        });
    });
};

const getHistoriqueAffectations = (req, res) => {
    const { materiel_type, materiel_id } = req.params;
    
    const query = `
        SELECT ha.*, u.nom, u.prenom, u.fonction, p.nom as perception_nom
        FROM historique_affectations ha
        LEFT JOIN utilisateurs u ON ha.utilisateur_id = u.id
        LEFT JOIN perceptions p ON u.perception_id = p.id
        WHERE ha.materiel_type = ? AND ha.materiel_id = ?
        ORDER BY ha.date_debut DESC
    `;
    
    db.query(query, [materiel_type, materiel_id], (err, results) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ message: 'Erreur serveur.' });
        }
        res.json(results);
    });
};

const getAffectationsByPerception = (req, res) => {
    const { perceptionId } = req.params;
    
    const query = `
        (SELECT 'pc' as type, pc.id, pc.marque, pc.modele, pc.numero_serie, pc.numero_inventaire,
                u.nom as utilisateur_nom, u.prenom as utilisateur_prenom, u.fonction,
                pc.statut, pc.date_livraison
         FROM pc 
         LEFT JOIN utilisateurs u ON pc.utilisateur_id = u.id
         WHERE pc.perception_id = ? AND pc.utilisateur_id IS NOT NULL)
        
        UNION ALL
        
        (SELECT 'imprimante' as type, id, marque, modele, numero_serie, numero_inventaire,
                u.nom as utilisateur_nom, u.prenom as utilisateur_prenom, u.fonction,
                statut, date_livraison
         FROM imprimantes 
         LEFT JOIN utilisateurs u ON imprimantes.utilisateur_id = u.id
         WHERE imprimantes.perception_id = ? AND imprimantes.utilisateur_id IS NOT NULL)
        
        UNION ALL
        
        (SELECT 'scanner' as type, id, marque, modele, '' as numero_serie, '' as numero_inventaire,
                u.nom as utilisateur_nom, u.prenom as utilisateur_prenom, u.fonction,
                statut, created_at as date_livraison
         FROM scanners 
         LEFT JOIN utilisateurs u ON scanners.utilisateur_id = u.id
         WHERE scanners.perception_id = ? AND scanners.utilisateur_id IS NOT NULL)
        
        ORDER BY type, marque
    `;
    
    db.query(query, [perceptionId, perceptionId, perceptionId], (err, results) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ message: 'Erreur serveur.' });
        }
        res.json(results);
    });
};

module.exports = { 
    affecterMateriel, 
    libererMateriel, 
    getHistoriqueAffectations,
    getAffectationsByPerception
};