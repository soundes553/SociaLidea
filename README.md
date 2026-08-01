# Socialidea

[![Live Demo](https://img.shields.io/badge/demo-live-6c5ce7?style=for-the-badge)](https://soundes553.github.io/SociaLidea/)
![Status](https://img.shields.io/badge/status-active-brightgreen?style=for-the-badge)

Socialidea est un mini réseau social développé en **HTML, CSS et JavaScript vanilla**, connecté à l'API [Tarmeez Academy](https://tarmeezacademy.com/api/v1). Les utilisateurs peuvent s'inscrire, se connecter, publier des posts avec image, et commenter les publications des autres.

**🔗 Démo en ligne : [soundes553.github.io/SociaLidea](https://soundes553.github.io/SociaLidea/)**

## 📑 Sommaire

- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#️-stack-technique)
- [Démarrer le projet](#-démarrer-le-projet)
- [Structure du projet](#-structure-du-projet)
- [Déploiement](#-déploiement)
- [Améliorations possibles](#-notes--améliorations-possibles)

## ✨ Fonctionnalités

- 🔐 **Authentification** — inscription (avec photo de profil) et connexion
- 📰 **Fil d'actualité** avec scroll infini (chargement automatique des posts suivants)
- 📝 **Création de post** avec titre, texte et image
- 💬 **Commentaires** — affichage/masquage animé au clic sur un post, ajout de commentaire en direct (réservé aux utilisateurs connectés)
- 🏷️ Affichage des tags associés à chaque post
- 🎨 UI moderne animée : apparition en fondu des posts, effets de survol, skeleton loader pendant le chargement, transitions fluides
- 📱 Interface responsive (Bootstrap 5)

## 🛠️ Stack technique

| Techno | Usage |
|---|---|
| HTML5 / CSS3 | Structure et style |
| JavaScript (vanilla) | Logique de l'application |
| [Bootstrap 5](https://getbootstrap.com/) | Composants UI (modales, grille, boutons) |
| [Axios](https://axios-http.com/) | Requêtes HTTP vers l'API |
| [Tarmeez Academy API](https://tarmeezacademy.com/api/v1) | Backend (posts, auth, commentaires) |

## 🚀 Démarrer le projet

Aucune installation n'est nécessaire — Bootstrap et Axios sont chargés via CDN, pas de `npm install` à faire.

```bash
git clone https://github.com/soundes553/SociaLidea.git
cd SociaLidea
```

Ouvre simplement `index.html` dans ton navigateur, ou lance un petit serveur local (recommandé pour éviter les soucis de CORS) :

```bash
# avec l'extension VS Code "Live Server"
# ou avec Python :
python -m http.server 5500
```

Puis va sur `http://localhost:5500`.

## 📁 Structure du projet

```
SociaLidea/
├── index.html    # Page principale
├── style.css     # Styles et animations
├── script.js     # Logique (auth, posts, commentaires, scroll infini)
└── README.md
```

## 🌐 Déploiement

Le projet est 100% statique et déployé via **GitHub Pages** :
👉 [https://soundes553.github.io/SociaLidea/](https://soundes553.github.io/SociaLidea/)

Il peut aussi être déployé en quelques secondes sur **Netlify** ou **Vercel** (glisser-déposer le dossier ou connecter le repo).

## 📌 Notes / améliorations possibles

- [ ] Pagination ou compteur de "chargement" plus visible sur le scroll infini
- [ ] Suppression / modification d'un commentaire
- [ ] Likes sur les posts
- [ ] Gestion des erreurs réseau plus détaillée côté utilisateur

## 👤 Auteur

Développé par **Soundes Chine**.

## 📄 Licence

Projet réalisé à des fins d'apprentissage (bootcamp Tarmeez Academy).
