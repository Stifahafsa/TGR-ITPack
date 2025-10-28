const express = require('express');
const router = express.Router();
const { getAllPerceptions, getPerceptionStats } = require('../controllers/perceptionController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getAllPerceptions);
router.get('/stats', authMiddleware, getPerceptionStats);

module.exports = router;