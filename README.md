
```markdown
# 🖥️ TGR Pack Informatique - Système de Gestion du Parc Informatique

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

Système complet de gestion du parc informatique pour la Trésorerie Générale du Royaume (TGR). Cette application permet de gérer le matériel informatique, les utilisateurs, les affectations et fournit des tableaux de bord en temps réel.

## 📋 Table des Matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies Utilisées](#-technologies-utilisées)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Structure du Projet](#-structure-du-projet)
- [API Endpoints](#-api-endpoints)
- [Base de Données](#-base-de-données)
- [Développement](#-développement)
- [Contributions](#-contributions)
- [Licence](#-licence)

## 🚀 Fonctionnalités

### 📊 Tableau de Bord
- **Vue d'ensemble** du parc informatique
- **Statistiques en temps réel** (PC, imprimantes, scanners)
- **Graphiques interactifs** de répartition et statut
- **Alertes matériel en panne** et contrats expirés
- **Détails par perception** avec indicateurs de performance

### 💻 Gestion du Matériel
- **PC** : Ajout, modification, suppression et suivi
- **Imprimantes** : Gestion complète avec contrats de maintenance
- **Scanners** : Inventaire et statut opérationnel
- **Statuts** : En service, en panne, en maintenance, réformé

### 👥 Gestion des Utilisateurs
- **Employés TGR** avec affectations par perception
- **Fonctions et coordonnées** complètes
- **Historique des affectations** de matériel

### 🔄 Système d'Affectation
- **Historique complet** des affectations
- **Suivi des changements** avec raisons
- **Rapports détaillés** par utilisateur et matériel

### 🔐 Sécurité
- **Authentification JWT** sécurisée
- **Rôles utilisateurs** (Super Admin, Responsable TGR)
- **Protection des routes** et données sensibles

## 🛠 Technologies Utilisées

### Frontend
- **React 18** - Framework JavaScript
- **Tailwind CSS** - Framework CSS utilitaire
- **React Router** - Navigation SPA
- **Recharts** - Bibliothèque de graphiques
- **Axios** - Client HTTP

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Base de données relationnelle
- **JWT** - Authentification JSON Web Tokens
- **bcrypt** - Hashage des mots de passe
- **CORS** - Cross-Origin Resource Sharing

## 📥 Installation

### Prérequis
- Node.js (v16 ou supérieur)
- MySQL (v8.0 ou supérieur)
- npm ou yarn

### Clonage du Repository
```bash
git clone https://github.com/Stifahafsa/TGR-ITPack.git
cd TGR-ITPack
```

### Installation des Dépendances

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

## ⚙️ Configuration

### Configuration de la Base de Données

1. **Créer la base de données MySQL** :
```sql
CREATE DATABASE pack_informatique_tgr;
```

2. **Configurer les variables d'environnement** :
Créez un fichier `.env` dans le dossier `backend` :

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=pack_informatique_tgr
DB_PORT=3306

# JWT
JWT_SECRET=votre_secret_jwt_super_securise

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
```

### Initialisation de la Base de Données

Exécutez le script SQL fourni dans `database/schema.sql` pour créer les tables et les données d'exemple.

## 🎯 Utilisation

### Démarrage de l'Application

1. **Démarrer le serveur backend** :
```bash
cd backend
npm start
```
Le serveur sera accessible sur `http://localhost:5000`

2. **Démarrer l'application frontend** :
```bash
cd frontend
npm npm run dev
```
L'application sera accessible sur `http://localhost:5173`

### Comptes par Défaut

Deux comptes sont créés automatiquement :

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| `admin@tgr.ma` | `password123` | Super Administrateur |
| `responsable@tgr.ma` | `password123` | Responsable TGR |

## 📁 Structure du Projet

```
tgr-pack-informatique/
├── backend/
│   ├── controllers/     # Contrôleurs API
│   ├── routes/          # Routes Express
│   ├── middleware/      # Middleware d'authentification
│   ├── config/          # Configuration base de données
│   ├── database/        # Scripts SQL
│   └── server.js        # Point d'entrée serveur
├── frontend/
│   ├── src/
│   │   ├── components/  # Composants React réutilisables
│   │   ├── pages/       # Pages de l'application
│   │   ├── context/     # Contextes React (Auth)
│   │   ├── services/    # Services API
│   │   └── App.jsx      # Composant principal
│   └── public/          # Fichiers statiques
└── README.md
```

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `GET /api/auth/profile` - Profil utilisateur connecté

### Dashboard
- `GET /api/dashboard/stats` - Statistiques générales
- `GET /api/dashboard/perception/:id/details` - Détails perception

### Gestion Matériel
- `GET/POST/PUT/DELETE /api/pc` - Gestion des PC
- `GET/POST/PUT/DELETE /api/imprimantes` - Gestion des imprimantes
- `GET/POST/PUT/DELETE /api/scanners` - Gestion des scanners

### Utilisateurs & Affectations
- `GET/POST/PUT/DELETE /api/utilisateurs` - Gestion utilisateurs
- `GET/POST /api/affectations` - Gestion des affectations

## 🗃️ Base de Données

### Tables Principales
- **perceptions** - Sites TGR (Ouarzazate, Boumalne Dades, etc.)
- **utilisateurs** - Employés TGR
- **pc** - Ordinateurs avec contrats de maintenance
- **imprimantes** - Imprimantes avec suivi maintenance
- **scanners** - Équipements de numérisation
- **historique_affectations** - Historique des affectations
- **responsables** - Comptes administrateurs

### Schéma de Base de Données
![Schéma DB](docs/database-schema.png) *(Optionnel : Ajouter un diagramme)*

## 🛠 Développement

### Scripts Disponibles

#### Backend
```bash
npm start      # Mode développement avec nodemon      
npm test         # Exécuter les tests
```

#### Frontend
```bash
npm run dev        # Serveur de développement
npm run build    # Build de production
npm test         # Exécuter les tests
```

### Guidelines de Code
- Utiliser ESLint et Prettier pour la cohérence du code
- Respecter les conventions de nommage React
- Commenter le code complexe
- Écrire des commits significatifs

## 🤝 Contributions

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Standards de Contribution
- Suivre la structure de code existante
- Ajouter des tests pour les nouvelles fonctionnalités
- Mettre à jour la documentation
- Vérifier que tous les tests passent

## 📄 Licence

Ce projet est développé pour la Trésorerie Générale du Royaume (TGR) lors de mon stage d'expérience et il est destiné à un usage interne pour le responsable informatique du TGR.

---

## 📞 Support

Pour toute question ou problème :
- 📧 Email : [stifahafsa4@gmail.com]
- 🐛 Issues : [GitHub Issues](https://github.com/Stifahafsa/tgr-pack-informatique/issues)

## 🙏 Remerciements

- Équipe de développement TGR
- Contributeurs open source
- Communauté React et Node.js

---

<div align="center">

**Développé avec ❤️ pour la Trésorerie Générale du Royaume**

*Système de Gestion du Parc Informatique - Version 1.0.0*

</div>
```

## 📋 Fichiers supplémentaires recommandés

Créez également ces fichiers dans votre repository :

### `.gitignore`
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
*.tgz
*.tar.gz

# Database
*.db
*.sqlite

# Logs
logs
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

