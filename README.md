# Miss'Pronos 🎭👑

Application web pour pronostiquer l'élection Miss France et comparer ses résultats avec ses amis.

[![Style: Tailwind](https://img.shields.io/badge/Style-Tailwind-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-039BE5?logo=Firebase&logoColor=white)](https://firebase.google.com)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://reactjs.org)

## 📱 Fonctionnalités

- Pronostics Miss France
  - Top 3 complet
  - Top 5 (4ème et 5ème place)
  - Sélection de 10 autres Miss qualifiées
- Groupes et classements
  - Création et gestion de groupes privés
  - Partage via code d'invitation
  - Classement en direct des pronostics
  - Chat de groupe
- Leaderboard globale et par groupe
- Obtention de badges (développement en cours)
- Quiz culture générale
  - 20 questions officielles
  - Comparaison des scores par groupe

## 🛠️ Stack Technique

- **Frontend**
  - React
  - Tailwind CSS
  - Framer Motion (animations)
  - React Hot Toast (notifications)
- **Backend**
  - Firebase Authentication
  - Cloud Firestore
  - Règles de sécurité personnalisées

## 📂 Structure du projet

```
/src
  /components     # Composants React réutilisables
    /ui          # Composants UI génériques
    /dashboard   # Composants spécifiques au dashboard
    /groups      # Composants liés aux groupes
  /pages         # Pages principales
  /contexts      # Contextes React (Auth, etc.)
  /hooks         # Hooks personnalisés
  /config        # Configuration Firebase
```

## ⚙️ Installation

```bash
# Cloner le projet
git clone https://github.com/kuroroLuciferPhantom/miss-france-predictions.git

# Installer les dépendances
npm install

# Lancer en développement
npm start
```

## 📖 Documentation

- [Guide de développement](https://github.com/kuroroLuciferPhantom/miss-france-predictions/issues/2)
- [Suivi du développement](https://github.com/kuroroLuciferPhantom/miss-france-predictions/issues/1)

## 🎨 Charte graphique

- Couleurs principales : Rose (pink-500) et Violet (purple-500)
- Utilisation de dégradés : `from-pink-500 to-purple-500`
- Design responsive avec Tailwind
- Composants réutilisables stylisés
