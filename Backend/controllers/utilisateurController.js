const db = require('../config/database');

const getAllUtilisateurs = (req, res) => {
    const query = `
        SELECT u.*, p.nom as perception_nom, p.code as perception_code 
        FROM utilisateurs u 
        LEFT JOIN perceptions p ON u.perception_id = p.id
        ORDER BY p.nom, u.nom
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ message: 'Erreur serveur.' });
        }
        res.json(results);
    });
};

const getUtilisateursByPerception = (req, res) => {
    const { perceptionId } = req.params;
    
    const query = `
        SELECT u.*, p.nom as perception_nom 
        FROM utilisateurs u 
        LEFT JOIN perceptions p ON u.perception_id = p.id 
        WHERE u.perception_id = ?
        ORDER BY u.nom
    `;
    
    db.query(query, [perceptionId], (err, results) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ message: 'Erreur serveur.' });
        }
        res.json(results);
    });
};

const createUtilisateur = (req, res) => {
    const { nom, prenom, telephone, email, fonction, perception_id } = req.body;
    
    if (!nom || !prenom || !perception_id) {
        return res.status(400).json({ message: 'Nom, prénom et perception sont obligatoires.' });
    }
    
    const query = `INSERT INTO utilisateurs (nom, prenom, telephone, email, fonction, perception_id) 
                   VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [nom, prenom, telephone, email, fonction, perception_id], 
        (err, results) => {
            if (err) {
                console.error('Erreur DB:', err);
                return res.status(500).json({ message: 'Erreur serveur.', error: err });
            }
            res.status(201).json({ 
                message: 'Utilisateur créé avec succès.', 
                id: results.insertId 
            });
        });
};

const updateUtilisateur = (req, res) => {
    const { id } = req.params;
    const { nom, prenom, telephone, email, fonction, perception_id } = req.body;
    
    const query = `UPDATE utilisateurs SET nom=?, prenom=?, telephone=?, email=?, fonction=?, perception_id=?
                   WHERE id=?`;
    
    db.query(query, [nom, prenom, telephone, email, fonction, perception_id, id], 
        (err, results) => {
            if (err) {
                console.error('Erreur DB:', err);
                return res.status(500).json({ message: 'Erreur serveur.' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Utilisateur non trouvé.' });
            }
            res.json({ message: 'Utilisateur mis à jour avec succès.' });
        });
};

const deleteUtilisateur = (req, res) => {
    const { id } = req.params;
    
    // Vérifier si l'utilisateur a du matériel affecté
    const checkQuery = `
        SELECT (SELECT COUNT(*) FROM pc WHERE utilisateur_id = ?) +
               (SELECT COUNT(*) FROM imprimantes WHERE utilisateur_id = ?) +
               (SELECT COUNT(*) FROM scanners WHERE utilisateur_id = ?) as total_affectations
    `;
    
    db.query(checkQuery, [id, id, id], (err, results) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ message: 'Erreur serveur.' });
        }
        
        if (results[0].total_affectations > 0) {
            return res.status(400).json({ 
                message: 'Impossible de supprimer cet utilisateur car il a du matériel affecté.' 
            });
        }
        
        db.query('DELETE FROM utilisateurs WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error('Erreur DB:', err);
                return res.status(500).json({ message: 'Erreur serveur.' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Utilisateur non trouvé.' });
            }
            res.json({ message: 'Utilisateur supprimé avec succès.' });
        });
    });
};

module.exports = { 
    getAllUtilisateurs, 
    getUtilisateursByPerception, 
    createUtilisateur, 
    updateUtilisateur, 
    deleteUtilisateur 
};