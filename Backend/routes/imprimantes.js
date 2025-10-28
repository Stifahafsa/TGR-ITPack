const express = require('express');
const router = express.Router();
const { 
    getAllImprimantes, 
    getImprimanteById, 
    createImprimante, 
    updateImprimante, 
    deleteImprimante 
} = require('../controllers/imprimanteController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getAllImprimantes);
router.get('/:id', authMiddleware, getImprimanteById);
router.post('/', authMiddleware, createImprimante);
router.put('/:id', authMiddleware, updateImprimante);
router.delete('/:id', authMiddleware, deleteImprimante);

module.exports = router;