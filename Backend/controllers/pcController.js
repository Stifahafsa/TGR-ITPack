const db = require('../config/database');

const getAllPc = (req, res) => {
    const query = `
        SELECT pc.*, p.nom as perception_nom, 
               u.nom as utilisateur_nom, u.prenom as utilisateur_prenom, u.fonction,
               u.telephone as utilisateur_telephone
        FROM pc 
        LEFT JOIN perceptions p ON pc.perception_id = p.id
        LEFT JOIN utilisateurs u ON pc.utilisateur_id = u.id
        ORDER BY p.nom, pc.marque
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ message: 'Erreur serveur.' });
        }
        res.json(results);
    });
};

const getPcById = (req, res) => {
    const { id } = req.params;
    
    const query = `
        SELECT pc.*, p.nom as perception_nom, 
               u.nom as utilisateur_nom, u.prenom as utilisateur_prenom, u.fonction
        FROM pc 
        LEFT JOIN perceptions p ON pc.perception_id = p.id
        LEFT JOIN utilisateurs u ON pc.utilisateur_id = u.id
        WHERE pc.id = ?
    `;
    
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ message: 'Erreur serveur.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'PC non trouvé.' });
        }
        res.json(results[0]);
    });
};

const createPc = (req, res) => {
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
    
    const query = `INSERT INTO pc (marque, modele, numero_serie, numero_inventaire, 
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
            message: 'PC créé avec succès.', 
            id: results.insertId 
        });
    });
};

const updatePc = (req, res) => {
    const { id } = req.params;
    const { 
        marque, modele, numero_serie, numero_inventaire, 
        date_livraison, date_achat, date_fin_contrat_maintenance, 
        perception_id, statut, utilisateur_id 
    } = req.body;
    
    const query = `UPDATE pc SET marque=?, modele=?, numero_serie=?, numero_inventaire=?, 
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
            return res.status(404).json({ message: 'PC non trouvé.' });
        }
        res.json({ message: 'PC mis à jour avec succès.' });
    });
};

const deletePc = (req, res) => {
    const { id } = req.params;
    
    db.query('DELETE FROM pc WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ message: 'Erreur serveur.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'PC non trouvé.' });
        }
        res.json({ message: 'PC supprimé avec succès.' });
    });
};

module.exports = { 
    getAllPc, 
    getPcById, 
    createPc, 
    updatePc, 
    deletePc 
};