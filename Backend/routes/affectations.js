const express = require('express');
const router = express.Router();
const { 
    affecterMateriel, 
    libererMateriel, 
    getHistoriqueAffectations,
    getAffectationsByPerception
} = require('../controllers/affectationController');
const { authMiddleware } = require('../middleware/auth');

router.post('/affecter', authMiddleware, affecterMateriel);
router.post('/liberer', authMiddleware, libererMateriel);
router.get('/historique/:materiel_type/:materiel_id', authMiddleware, getHistoriqueAffectations);
router.get('/perception/:perceptionId', authMiddleware, getAffectationsByPerception);

module.exports = router;