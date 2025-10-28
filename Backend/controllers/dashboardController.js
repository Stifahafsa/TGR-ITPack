const db = require('../config/database');

const getDashboardStats = (req, res) => {
    const queries = {
        totalPc: 'SELECT COUNT(*) as count FROM pc',
        totalImprimantes: 'SELECT COUNT(*) as count FROM imprimantes',
        totalScanners: 'SELECT COUNT(*) as count FROM scanners',
        materielEnPanne: `
            SELECT COUNT(*) as count FROM (
                SELECT id FROM pc WHERE statut = 'en_panne'
                UNION ALL
                SELECT id FROM imprimantes WHERE statut = 'en_panne'
                UNION ALL
                SELECT id FROM scanners WHERE statut = 'en_panne'
            ) as panne
        `,
        contratsExpires: `
            SELECT COUNT(*) as count FROM (
                SELECT id FROM pc WHERE date_fin_contrat_maintenance < CURDATE()
                UNION ALL
                SELECT id FROM imprimantes WHERE date_fin_contrat_maintenance < CURDATE()
            ) as expires
        `,
        materielReforme: `
            SELECT COUNT(*) as count FROM (
                SELECT id FROM pc WHERE statut = 'reforme'
                UNION ALL
                SELECT id FROM imprimantes WHERE statut = 'reforme'
                UNION ALL
                SELECT id FROM scanners WHERE statut = 'reforme'
            ) as reforme
        `,
        totalUtilisateurs: 'SELECT COUNT(*) as count FROM utilisateurs'
    };

    const stats = {};
    let completed = 0;
    const totalQueries = Object.keys(queries).length;

    Object.keys(queries).forEach(key => {
        db.query(queries[key], (err, results) => {
            if (err) {
                console.error('Erreur DB:', err);
                // Continuer avec les autres requêtes même si une échoue
            } else {
                stats[key] = results[0].count;
            }
            
            completed++;
            if (completed === totalQueries) {
                res.json(stats);
            }
        });
    });
};

const getMaterielByPerception = (req, res) => {
    const query = `
        SELECT p.nom as perception, 
               COUNT(pc.id) as total_pc,
               COUNT(imp.id) as total_imprimantes,
               COUNT(scan.id) as total_scanners
        FROM perceptions p
        LEFT JOIN pc ON p.id = pc.perception_id
        LEFT JOIN imprimantes imp ON p.id = imp.perception_id
        LEFT JOIN scanners scan ON p.id = scan.perception_id
        GROUP BY p.id, p.nom
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

const getStatutStats = (req, res) => {
    const query = `
        SELECT 'en_service' as statut,
               (SELECT COUNT(*) FROM pc WHERE statut = 'en_service') +
               (SELECT COUNT(*) FROM imprimantes WHERE statut = 'en_service') +
               (SELECT COUNT(*) FROM scanners WHERE statut = 'en_service') as count
        UNION ALL
        SELECT 'en_panne' as statut,
               (SELECT COUNT(*) FROM pc WHERE statut = 'en_panne') +
               (SELECT COUNT(*) FROM imprimantes WHERE statut = 'en_panne') +
               (SELECT COUNT(*) FROM scanners WHERE statut = 'en_panne') as count
        UNION ALL
        SELECT 'en_maintenance' as statut,
               (SELECT COUNT(*) FROM pc WHERE statut = 'en_maintenance') +
               (SELECT COUNT(*) FROM imprimantes WHERE statut = 'en_maintenance') +
               (SELECT COUNT(*) FROM scanners WHERE statut = 'en_maintenance') as count
        UNION ALL
        SELECT 'reforme' as statut,
               (SELECT COUNT(*) FROM pc WHERE statut = 'reforme') +
               (SELECT COUNT(*) FROM imprimantes WHERE statut = 'reforme') +
               (SELECT COUNT(*) FROM scanners WHERE statut = 'reforme') as count
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
    getDashboardStats, 
    getMaterielByPerception, 
    getStatutStats 
};