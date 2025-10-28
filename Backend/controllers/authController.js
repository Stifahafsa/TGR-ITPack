const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    const query = 'SELECT * FROM responsables WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ message: 'Erreur serveur.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        const user = results[0];
        
        // En production, utiliser bcrypt.compare
        // const isMatch = await bcrypt.compare(password, user.password);
        const isMatch = password === 'password123'; // Temporaire pour le développement

        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role,
                nom: user.nom,
                prenom: user.prenom
            },
            process.env.JWT_SECRET || 'votre_secret_jwt',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role
            }
        });
    });
};

const getProfile = (req, res) => {
    res.json({
        user: req.user
    });
};

module.exports = { login, getProfile };