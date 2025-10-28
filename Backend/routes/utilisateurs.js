const express = require('express');
const router = express.Router();
const { 
    getAllUtilisateurs, 
    getUtilisateursByPerception, 
    createUtilisateur, 
    updateUtilisateur, 
    deleteUtilisateur 
} = require('../controllers/utilisateurController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getAllUtilisateurs);
router.get('/perception/:perceptionId', authMiddleware, getUtilisateursByPerception);
router.post('/', authMiddleware, createUtilisateur);
router.put('/:id', authMiddleware, updateUtilisateur);
router.delete('/:id', authMiddleware, deleteUtilisateur);

module.exports = router;