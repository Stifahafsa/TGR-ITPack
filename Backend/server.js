const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes de base pour test
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK',
        message: 'API Pack Informatique TGR en fonctionnement',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.json({ 
        message: 'Bienvenue sur l\'API Pack Informatique TGR',
        version: '1.0.0'
    });
});

// Import et utilisation des routes AVEC gestion d'erreurs
try {
    const authRoutes = require('./routes/auth');
    app.use('/api/auth', authRoutes);
    console.log('✅ Routes auth chargées');
} catch (error) {
    console.log('⚠️ Routes auth non chargées:', error.message);
}

try {
    const pcRoutes = require('./routes/pc');
    app.use('/api/pc', pcRoutes);
    console.log('✅ Routes PC chargées');
} catch (error) {
    console.log('⚠️ Routes PC non chargées:', error.message);
}

try {
    const utilisateursRoutes = require('./routes/utilisateurs');
    app.use('/api/utilisateurs', utilisateursRoutes);
    console.log('✅ Routes utilisateurs chargées');
} catch (error) {
    console.log('⚠️ Routes utilisateurs non chargées:', error.message);
}

try {
    const perceptionsRoutes = require('./routes/perceptions');
    app.use('/api/perceptions', perceptionsRoutes);
    console.log('✅ Routes perceptions chargées');
} catch (error) {
    console.log('⚠️ Routes perceptions non chargées:', error.message);
}

// Routes optionnelles (créez-les plus tard)
try {
    const imprimantesRoutes = require('./routes/imprimantes');
    app.use('/api/imprimantes', imprimantesRoutes);
    console.log('✅ Routes imprimantes chargées');
} catch (error) {
    console.log('⚠️ Routes imprimantes non chargées - à créer plus tard');
}

try {
    const scannersRoutes = require('./routes/scanners');
    app.use('/api/scanners', scannersRoutes);
    console.log('✅ Routes scanners chargées');
} catch (error) {
    console.log('⚠️ Routes scanners non chargées - à créer plus tard');
}

try {
    const affectationsRoutes = require('./routes/affectations');
    app.use('/api/affectations', affectationsRoutes);
    console.log('✅ Routes affectations chargées');
} catch (error) {
    console.log('⚠️ Routes affectations non chargées - à créer plus tard');
}

try {
    const dashboardRoutes = require('./routes/dashboard');
    app.use('/api/dashboard', dashboardRoutes);
    console.log('✅ Routes dashboard chargées');
} catch (error) {
    console.log('⚠️ Routes dashboard non chargées - à créer plus tard');
}

// Gestion des routes non trouvées - VERSION CORRIGÉE
app.use((req, res, next) => {
    res.status(404).json({ 
        message: 'Route non trouvée',
        path: req.path,
        method: req.method
    });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    res.status(500).json({ 
        message: 'Erreur interne du serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Contactez l\'administrateur'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📊 API Pack Informatique TGR`);
    console.log(`📍 Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    console.log('');
    console.log('📋 Endpoints disponibles:');
    console.log('   GET  /api/health');
    console.log('   POST /api/auth/login');
    console.log('   GET  /api/pc');
    console.log('   GET  /api/utilisateurs');
    console.log('   GET  /api/perceptions');
});