const db = require('../config/database');

const getAllPerceptions = (req, res) => {
    const query = 'SELECT * FROM perceptions ORDER BY nom';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ message: 'Erreur serveur.' });
        }
        res.json(results);
    });
};

const getPerceptionStats = (req, res) => {
    const query = `
        SELECT p.id, p.nom, p.code,
               (SELECT COUNT(*) FROM pc WHERE perception_id = p.id) as total_pc,
               (SELECT COUNT(*) FROM imprimantes WHERE perception_id = p.id) as total_imprimantes,
               (SELECT COUNT(*) FROM scanners WHERE perception_id = p.id) as total_scanners,
               (SELECT COUNT(*) FROM pc WHERE perception_id = p.id AND statut = 'en_panne') as pc_en_panne,
               (SELECT COUNT(*) FROM utilisateurs WHERE perception_id = p.id) as total_utilisateurs
        FROM perceptions p
        ORDER BY p.nom
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ message: 'Erreur serveur.' });
        }
        res.json(results);
    });
};

module.exports = { 
    getAllPerceptions,
    getPerceptionStats
};