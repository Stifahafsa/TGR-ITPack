const express = require('express');
const router = express.Router();
const { 
    getAllScanners, 
    getScannerById, 
    createScanner, 
    updateScanner, 
    deleteScanner 
} = require('../controllers/scannerController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getAllScanners);
router.get('/:id', authMiddleware, getScannerById);
router.post('/', authMiddleware, createScanner);
router.put('/:id', authMiddleware, updateScanner);
router.delete('/:id', authMiddleware, deleteScanner);

module.exports = router;