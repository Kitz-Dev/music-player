# SwiftFox Music Player 🎵

Un lecteur audio web moderne et élégant développé en JavaScript vanilla avec une architecture orientée objet.

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Technologies](#technologies)
- [Structure du projet](#structure-du-projet)

## 🎯 Aperçu

SwiftFox Music Player est un lecteur audio web complet offrant une expérience utilisateur fluide avec des contrôles intuitifs, une gestion de playlist et des modes de lecture avancés.

## ✨ Fonctionnalités

### Contrôles de lecture

- **Play/Pause** : Lecture et mise en pause de la piste en cours
- **Piste suivante** : Passage à la piste suivante dans la playlist
- **Piste précédente** : Retour à la piste précédente
- **Barre de progression** : Visualisation et navigation dans la piste en cours
- **Compteurs temporels** : Affichage du temps écoulé et restant

### Modes de lecture

- **Mode Shuffle (Aléatoire)** 🔀

  - Lecture aléatoire des pistes
  - Historique des pistes jouées pour navigation cohérente
  - Évite la répétition jusqu'à ce que toutes les pistes aient été jouées
  - Indication visuelle de l'activation (couleur violette)

- **Mode Repeat (Répétition)** 🔁
  - Répétition de la piste en cours
  - Indication visuelle de l'activation (couleur violette)

### Gestion du volume

- **Contrôle du volume** : Curseur vertical pour ajuster le volume
- **Bouton Mute** : Activation/désactivation du son
- **Indicateur visuel** : Icône adaptée au niveau de volume (muet, faible, élevé)
- **Affichage au survol** : La barre de volume apparaît au survol du bouton

### Interface utilisateur

- **Pochette d'album animée** : Rotation lors de la lecture
- **Informations de la piste** : Titre et artiste affichés
- **Tooltips** : Info-bulles sur les boutons au survol
- **Design responsive** : Interface adaptative
- **Thème sombre** : Palette de couleurs moderne avec accents violets

### Gestion de la playlist

- **Chargement automatique** : Import depuis fichier JSON
- **Tri alphabétique** : Organisation par titre
- **Navigation fluide** : Passage automatique à la piste suivante en fin de lecture

## 🏗️ Architecture

Le projet suit une architecture modulaire avec séparation des responsabilités :

### Modules principaux

1. **DOM** : Gestion centralisée des références aux éléments DOM
2. **PlaylistService** : Logique métier de la playlist
3. **TimeFormatter** : Utilitaire de formatage du temps
4. **UIController** : Contrôle de l'interface utilisateur
5. **AudioController** : Gestion de la lecture audio
6. **AudioPlayer** : Orchestration générale de l'application

## 🚀 Installation

1. Clonez le repository

```bash
git clone https://github.com/Kitz-Dev/music-player.git
cd swiftfox-music-player
```

2. Assurez-vous d'avoir la structure de fichiers suivante :

```
projet/
├── index.html
├── assets/
│   ├── css/
│   │   ├── app.css
│   │   └── normalize.css
│   └── js/
│       └── app.js
├── data/
│   └── playlist.json
├── fonts/
│   ├── Alkatra-Regular.woff2
│   └── DMSans-*.ttf
├── img/
│   └── sprite.svg
└── music/
    └── [vos fichiers audio]
```

3. Créez votre fichier `playlist.json` :

```json
[
  {},
  {
    "songs": [
      {
        "title": "Titre de la chanson",
        "author": "Nom de l'artiste",
        "url": "./music/fichier.mp3",
        "cover": "./img/cover.jpg"
      }
    ]
  }
]
```

4. Ouvrez `index.html` dans un navigateur moderne

## 💡 Utilisation

### Interface utilisateur

**Boutons de contrôle** (de gauche à droite) :

- 🔀 Shuffle : Active/désactive le mode aléatoire
- ⏮️ Previous : Piste précédente
- ⏯️ Play/Pause : Lance ou met en pause la lecture
- ⏭️ Next : Piste suivante
- 🔁 Repeat : Active/désactive la répétition

**Barres de contrôle** :

- Barre de progression : Cliquez ou glissez pour naviguer dans la piste
- Barre de volume : Survolez l'icône de volume et ajustez avec le curseur vertical

### Raccourcis et comportements

- La pochette d'album tourne pendant la lecture
- Le bouton play/pause change d'icône selon l'état
- Les boutons shuffle et repeat changent de couleur quand activés
- Le passage automatique à la piste suivante se fait en fin de lecture
- En mode shuffle, le bouton "précédent" revient dans l'historique

## 🛠️ Technologies

- **HTML5** : Structure sémantique
- **CSS3** : Styles modernes avec variables CSS et animations
- **JavaScript (ES6+)** : Classes, modules, async/await
- **Web Audio API** : Contrôle audio natif
- **SVG** : Icônes vectorielles via sprite sheet

### Fonctionnalités web modernes utilisées

- Fetch API pour le chargement de données
- Audio element avec metadata
- Custom range inputs stylisés
- CSS animations et transforms
- Font loading optimization (preload)

## 📁 Structure du projet

```
app.js
├── DOM : Références aux éléments DOM
├── PlaylistService : Gestion de la playlist
│   ├── loadPlaylist()
│   ├── nextSong()
│   ├── previousSong()
│   ├── toggleShuffleMode()
│   └── toggleRepeatMode()
├── TimeFormatter : Formatage du temps
├── UIController : Mise à jour de l'interface
│   ├── updateSongInfo()
│   ├── updatePlayButton()
│   ├── updateProgressBar()
│   └── updateVolumeBar()
├── AudioController : Contrôle audio
│   ├── play()
│   ├── pause()
│   ├── setVolume()
│   └── toggleMute()
└── AudioPlayer : Application principale
    └── init() : Initialisation et event listeners
```

## 🎨 Personnalisation

### Couleurs

Les couleurs principales sont définies dans `app.css` :

```css
:root {
  --primary-color: #1a202c;
  --secondary-color: #b417e4;
  --title-color: #edf2f7;
}
```

### Polices

Une police utilisée :

- **Alkatra** : Titres et éléments décoratifs

## 📝 Notes techniques

### Sécurité

- Content Security Policy configurée
- Protection contre le clickjacking (X-Frame-Options)
- CORS activé pour les ressources audio

### Performance

- Font preloading pour chargement optimisé
- Lazy loading optionnel pour les images
- Métadonnées audio préchargées

### Compatibilité

- Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- Support mobile et desktop
- Polices avec fallbacks système

## 🐛 Problèmes connus

- Le mode repeat et shuffle ne peuvent pas être actifs simultanément (par design)
- La barre de volume nécessite un survol (pas de support tactile natif - TODO)

## 📄 Licence

Projet éducatif - TP de développement web

## 👤 Auteur

Romain Laimé

---

_Kitz_ 🦊
