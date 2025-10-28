const db = require('../config/database');

const getAllScanners = (req, res) => {
    const query = `
        SELECT scan.*, p.nom as perception_nom, 
               u.nom as utilisateur_nom, u.prenom as utilisateur_prenom, u.fonction,
               u.telephone as utilisateur_telephone
        FROM scanners scan
        LEFT JOIN perceptions p ON scan.perception_id = p.id
        LEFT JOIN utilisateurs u ON scan.utilisateur_id = u.id
        ORDER BY p.nom, scan.marque
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ message: 'Erreur serveur.' });
        }
        res.json(results);
    });
};

const getScannerById = (req, res) => {
    const { id } = req.params;
    
    const query = `
        SELECT scan.*, p.nom as perception_nom, 
               u.nom as utilisateur_nom, u.prenom as utilisateur_prenom, u.fonction
        FROM scanners scan
        LEFT JOIN perceptions p ON scan.perception_id = p.id
        LEFT JOIN utilisateurs u ON scan.utilisateur_id = u.id
        WHERE scan.id = ?
    `;
    
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ message: 'Erreur serveur.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Scanner non trouvé.' });
        }
        res.json(results[0]);
    });
};

const createScanner = (req, res) => {
    const { 
        marque, modele, perception_id, statut 
    } = req.body;
    
    if (!marque || !modele || !perception_id) {
        return res.status(400).json({ 
            message: 'Marque, modèle et perception sont obligatoires.' 
        });
    }
    
    const query = `INSERT INTO scanners (marque, modele, perception_id, statut) 
                   VALUES (?, ?, ?, ?)`;
    
    db.query(query, [
        marque, modele, perception_id, statut || 'en_service'
    ], (err, results) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ message: 'Erreur serveur.', error: err });
        }
        res.status(201).json({ 
            message: 'Scanner créé avec succès.', 
            id: results.insertId 
        });
    });
};

const updateScanner = (req, res) => {
    const { id } = req.params;
    const { 
        marque, modele, perception_id, statut, utilisateur_id 
    } = req.body;
    
    const query = `UPDATE scanners SET marque=?, modele=?, perception_id=?, statut=?, utilisateur_id=?
                   WHERE id=?`;
    
    db.query(query, [
        marque, modele, perception_id, statut, utilisateur_id, id
    ], (err, results) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ message: 'Erreur serveur.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Scanner non trouvé.' });
        }
        res.json({ message: 'Scanner mis à jour avec succès.' });
    });
};

const deleteScanner = (req, res) => {
    const { id } = req.params;
    
    db.query('DELETE FROM scanners WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ message: 'Erreur serveur.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Scanner non trouvé.' });
        }
        res.json({ message: 'Scanner supprimé avec succès.' });
    });
};

module.exports = { 
    getAllScanners, 
    getScannerById, 
    createScanner, 
    updateScanner, 
    deleteScanner 
};