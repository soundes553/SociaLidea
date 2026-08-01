# Socialidea

Socialidea est un mini réseau social développé en **HTML, CSS et JavaScript vanilla**, connecté à l'API [Tarmeez Academy](https://tarmeezacademy.com/api/v1). Les utilisateurs peuvent s'inscrire, se connecter, publier des posts avec image, et commenter les publications des autres.

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

Aucune installation n'est nécessaire, le projet n'a pas de dépendances à builder (Bootstrap et Axios sont chargés via CDN).

```bash
git clone https://github.com/TON-PSEUDO/socialidea.git
cd socialidea
```

Puis ouvre simplement `index.html` dans ton navigateur, ou lance un petit serveur local (recommandé pour éviter les soucis de CORS avec `file://`) :

```bash
# avec l'extension VS Code "Live Server"
# ou avec Python :
python -m http.server 5500
```

Puis va sur `http://localhost:5500`.

## 📁 Structure du projet

```
socialidea/
├── index.html      # Page principale
├── style.css        # Styles et animations
├── script.js         # Logique (auth, posts, commentaires, scroll infini)
└── README.md
```

## 🌐 Déploiement

Le projet est 100% statique, il peut être déployé sur :
- **GitHub Pages** (Settings → Pages → branch `main` → `/root`)
- **Netlify** ou **Vercel** (glisser-déposer le dossier ou connecter le repo)

## 📌 Notes / améliorations possibles

- [ ] Pagination ou compteur de "chargement" plus visible sur le scroll infini
- [ ] Suppression / modification d'un commentaire
- [ ] Likes sur les posts
- [ ] Gestion des erreurs réseau plus détaillée côté utilisateur

## 👤 Auteur

Développé par **Soundes Chine**.

## 📄 Licence

Projet réalisé à des fins d'apprentissage (bootcamp Tarmeez Academy).
