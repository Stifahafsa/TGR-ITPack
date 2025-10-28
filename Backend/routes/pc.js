const express = require('express');
const router = express.Router();
const { getAllPc, getPcById, createPc, updatePc, deletePc } = require('../controllers/pcController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getAllPc);
router.get('/:id', authMiddleware, getPcById);
router.post('/', authMiddleware, createPc);
router.put('/:id', authMiddleware, updatePc);
router.delete('/:id', authMiddleware, deletePc);

module.exports = router;