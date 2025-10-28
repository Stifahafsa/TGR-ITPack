const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/stats', (req, res) => {
  console.log('📊 Requête dashboard stats reçue');

  const queries = {
    totalPc: 'SELECT COUNT(*) as count FROM pc',
    totalImprimantes: 'SELECT COUNT(*) as count FROM imprimantes',
    totalScanners: 'SELECT COUNT(*) as count FROM scanners',
    materielEnPanne: `
      SELECT COUNT(*) as count FROM (
        SELECT id FROM pc WHERE statut = "en_panne"
        UNION ALL
        SELECT id FROM imprimantes WHERE statut = "en_panne"
        UNION ALL
        SELECT id FROM scanners WHERE statut = "en_panne"
      ) as panne
    `,
    contratsExpires: `
      SELECT COUNT(*) as count FROM (
        SELECT id FROM pc WHERE date_fin_contrat_maintenance < CURDATE()
        UNION ALL
        SELECT id FROM imprimantes WHERE date_fin_contrat_maintenance < CURDATE()
      ) as expires
    `,
    totalUtilisateurs: 'SELECT COUNT(*) as count FROM utilisateurs',
    // Nouvelles statistiques
    statsParPerception: `
      SELECT 
        p.nom as perception,
        p.code,
        COUNT(pc.id) as total_pc,
        COUNT(imp.id) as total_imprimantes,
        COUNT(scan.id) as total_scanners,
        SUM(CASE WHEN pc.statut = "en_panne" OR imp.statut = "en_panne" OR scan.statut = "en_panne" THEN 1 ELSE 0 END) as en_panne
      FROM perceptions p
      LEFT JOIN pc ON p.id = pc.perception_id
      LEFT JOIN imprimantes imp ON p.id = imp.perception_id
      LEFT JOIN scanners scan ON p.id = scan.perception_id
      GROUP BY p.id, p.nom, p.code
    `,
    statsParStatut: `
      SELECT 'pc' as type, statut, COUNT(*) as count FROM pc GROUP BY statut
      UNION ALL
      SELECT 'imprimante' as type, statut, COUNT(*) as count FROM imprimantes GROUP BY statut
      UNION ALL
      SELECT 'scanner' as type, statut, COUNT(*) as count FROM scanners GROUP BY statut
    `
  };

  const stats = {};
  let completedQueries = 0;
  const totalQueries = Object.keys(queries).length;

  const checkCompletion = () => {
    completedQueries++;
    if (completedQueries === totalQueries) {
      console.log('📈 Stats envoyées');
      res.json(stats);
    }
  };

  // Requêtes principales
  db.query(queries.totalPc, (error, results) => {
    if (!error) stats.totalPc = results[0].count;
    checkCompletion();
  });

  db.query(queries.totalImprimantes, (error, results) => {
    if (!error) stats.totalImprimantes = results[0].count;
    checkCompletion();
  });

  db.query(queries.totalScanners, (error, results) => {
    if (!error) stats.totalScanners = results[0].count;
    checkCompletion();
  });

  db.query(queries.materielEnPanne, (error, results) => {
    if (!error) stats.materielEnPanne = results[0].count;
    checkCompletion();
  });

  db.query(queries.contratsExpires, (error, results) => {
    if (!error) stats.contratsExpires = results[0].count;
    checkCompletion();
  });

  db.query(queries.totalUtilisateurs, (error, results) => {
    if (!error) stats.totalUtilisateurs = results[0].count;
    checkCompletion();
  });

  // Nouvelles statistiques
  db.query(queries.statsParPerception, (error, results) => {
    if (!error) stats.perceptionStats = results;
    checkCompletion();
  });

  db.query(queries.statsParStatut, (error, results) => {
    if (!error) stats.statutStats = results;
    checkCompletion();
  });
});

module.exports = router;