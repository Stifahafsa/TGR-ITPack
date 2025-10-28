const db = require('../config/database');

const getAllImprimantes = (req, res) => {
    const query = `
        SELECT imp.*, p.nom as perception_nom, 
               u.nom as utilisateur_nom, u.prenom as utilisateur_prenom, u.fonction,
               u.telephone as utilisateur_telephone
        FROM imprimantes imp
        LEFT JOIN perceptions p ON imp.perception_id = p.id
        LEFT JOIN utilisateurs u ON imp.utilisateur_id = u.id
        ORDER BY p.nom, imp.marque
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ message: 'Erreur serveur.' });
        }
        res.json(results);
    });
};

const getImprimanteById = (req, res) => {
    const { id } = req.params;
    
    const query = `
        SELECT imp.*, p.nom as perception_nom, 
               u.nom as utilisateur_nom, u.prenom as utilisateur_prenom, u.fonction
        FROM imprimantes imp
        LEFT JOIN perceptions p ON imp.perception_id = p.id
        LEFT JOIN utilisateurs u ON imp.utilisateur_id = u.id
        WHERE imp.id = ?
    `;
    
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ message: 'Erreur serveur.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Imprimante non trouvée.' });
        }
        res.json(results[0]);
    });
};

const createImprimante = (req, res) => {
    const { 
        marque, modele, numero_serie, numero_inventaire, 
        date_livraison, date_achat, date_fin_contrat_maintenance, 
        perception_id, statut 
    } = req.body;
    
    if (!marque || !modele || !numero_serie || !numero_inventaire || !date_livraison || !perception_id) {
        return res.status(400).json({ 
            message: 'Tous les champs obligatoires doivent être remplis.' 
        });
    }
    
    const query = `INSERT INTO imprimantes (marque, modele, numero_serie, numero_inventaire, 
                   date_livraison, date_achat, date_fin_contrat_maintenance, perception_id, statut) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [
        marque, modele, numero_serie, numero_inventaire, 
        date_livraison, date_achat, date_fin_contrat_maintenance, 
        perception_id, statut || 'en_service'
    ], (err, results) => {
        if (err) {
            console.error('Erreur DB:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ 
                    message: 'Numéro de série ou numéro d\'inventaire déjà existant.' 
                });
            }
            return res.status(500).json({ message: 'Erreur serveur.', error: err });
        }
        res.status(201).json({ 
            message: 'Imprimante créée avec succès.', 
            id: results.insertId 
        });
    });
};

const updateImprimante = (req, res) => {
    const { id } = req.params;
    const { 
        marque, modele, numero_serie, numero_inventaire, 
        date_livraison, date_achat, date_fin_contrat_maintenance, 
        perception_id, statut, utilisateur_id 
    } = req.body;
    
    const query = `UPDATE imprimantes SET marque=?, modele=?, numero_serie=?, numero_inventaire=?, 
                   date_livraison=?, date_achat=?, date_fin_contrat_maintenance=?, 
                   perception_id=?, statut=?, utilisateur_id=?
                   WHERE id=?`;
    
    db.query(query, [
        marque, modele, numero_serie, numero_inventaire, 
        date_livraison, date_achat, date_fin_contrat_maintenance, 
        perception_id, statut, utilisateur_id, id
    ], (err, results) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ message: 'Erreur serveur.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Imprimante non trouvée.' });
        }
        res.json({ message: 'Imprimante mise à jour avec succès.' });
    });
};

const deleteImprimante = (req, res) => {
    const { id } = req.params;
    
    db.query('DELETE FROM imprimantes WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ message: 'Erreur serveur.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Imprimante non trouvée.' });
        }
        res.json({ message: 'Imprimante supprimée avec succès.' });
    });
};

module.exports = { 
    getAllImprimantes, 
    getImprimanteById, 
    createImprimante, 
    updateImprimante, 
    deleteImprimante 
};