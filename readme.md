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
- [API Documentation](#api-documentation)

## 🎯 Aperçu

SwiftFox Music Player est un lecteur audio web complet offrant une expérience utilisateur fluide avec des contrôles intuitifs, une gestion de playlists multiples, une bibliothèque musicale et des modes de lecture avancés.

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
  - Support séparé pour la bibliothèque et les playlists

- **Mode Repeat (Répétition)** 🔁
  - Répétition de la piste en cours
  - Indication visuelle de l'activation (couleur violette)

### Gestion du volume

- **Contrôle du volume** : Curseur vertical pour ajuster le volume
- **Bouton Mute** : Activation/désactivation du son
- **Indicateur visuel** : Icône adaptée au niveau de volume (muet, faible, élevé)
- **Affichage au survol** : La barre de volume apparaît au survol du bouton
- **Mémorisation** : Le volume précédent est restauré après unmute

### Interface utilisateur

- **Pochette d'album animée** : Rotation lors de la lecture
- **Informations de la piste** : Titre et artiste affichés avec défilement automatique pour les titres longs
- **Panneau d'informations détaillées** : 
  - Pochette de l'album
  - Titre et artiste
  - Genre musical
  - Description/Lore de la piste
- **Tooltips** : Info-bulles sur les boutons au survol
- **Design responsive** : Interface adaptative
- **Thème sombre** : Palette de couleurs moderne avec accents violets
- **Animations au survol** : Effet de zoom et défilement sur les cartes de pistes

### Gestion des playlists et bibliothèque

- **Bibliothèque musicale** : Collection globale de toutes les pistes disponibles
- **Playlists multiples** : Support de plusieurs playlists personnalisées
- **Sélecteur de playlist** : Interface de choix entre bibliothèque et playlists
- **Navigation** : Bouton de retour pour revenir au sélecteur de playlists
- **Chargement automatique** : Import depuis fichiers JSON
- **Tri dynamique** : 
  - Tri alphabétique ascendant/descendant
  - Bouton de tri avec indicateur visuel (flèches)
  - Tri désactivé en mode sélection de playlist
- **Cartes de pistes interactives** :
  - Clic pour lire une piste
  - Animation visuelle de la piste en cours de lecture
  - Défilement automatique des titres longs au survol
- **Navigation fluide** : Passage automatique à la piste suivante en fin de lecture

## 🏗️ Architecture

Le projet suit une architecture modulaire avec séparation des responsabilités :

### Modules principaux

1. **DOM** : Gestion centralisée des références aux éléments DOM
2. **PlaylistService** : Logique métier de la playlist et de la bibliothèque
3. **TimeFormatter** : Utilitaire de formatage du temps
4. **UIController** : Contrôle de l'interface utilisateur
5. **LibraryController** : Gestion de l'affichage des pistes et playlists
6. **AudioController** : Gestion de la lecture audio avec système de callbacks
7. **AudioPlayer** : Orchestration générale de l'application

### Pattern Observer

Le système utilise des listeners/callbacks pour la communication entre modules :
- `songChangeListener` : Notification des changements de piste
- `songInfosUpdateListener` : Mise à jour des informations détaillées
- `currentSongIdCallback` : Suivi de la piste en cours

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
│   ├── playlist.json
│   └── library.json
├── fonts/
│   ├── Alkatra-Regular.woff2
│   └── DMSans-*.ttf
├── img/
│   ├── sprite.svg
│   └── fox-corpo-icon.webp
└── music/
    └── [vos fichiers audio]
```

3. Créez votre fichier `playlist.json` :

```json
[
  {
    "id": 0,
    "title": "Ma Playlist 1",
    "cover": "./img/playlist-cover.jpg",
    "songs": [
      {
        "id": "song_1",
        "title": "Titre de la chanson",
        "author": "Nom de l'artiste",
        "url": "./music/fichier.mp3",
        "cover": "./img/cover.jpg",
        "genre": "Rock",
        "lore": "Description de la chanson..."
      }
    ]
  },
  {
    "id": 1,
    "title": "Ma Playlist 2",
    "cover": "./img/playlist2-cover.jpg",
    "songs": []
  }
]
```

4. Créez votre fichier `library.json` :

```json
[
  {
    "id": 0,
    "title": "Library",
    "songs": [
      {
        "id": "song_1",
        "title": "Titre de la chanson",
        "author": "Nom de l'artiste",
        "url": "./music/fichier.mp3",
        "cover": "./img/cover.jpg",
        "genre": "Rock",
        "lore": "Description de la chanson..."
      }
    ]
  }
]
```

5. Ouvrez `index.html` dans un navigateur moderne

## 💡 Utilisation

### Interface utilisateur

**Boutons de contrôle** (de gauche à droite) :

- 🔀 Shuffle : Active/désactive le mode aléatoire
- ⏮️ Previous : Piste précédente
- ⏯️ Play/Pause : Lance ou met en pause la lecture
- ⏭️ Next : Piste suivante
- 🔁 Repeat : Active/désactive la répétition

**Boutons supplémentaires** :

- ↕️ Tri : Change l'ordre de tri (A-Z ou Z-A)
- ← Retour : Retourne au sélecteur de playlists

**Barres de contrôle** :

- Barre de progression : Cliquez ou glissez pour naviguer dans la piste
- Barre de volume : Survolez l'icône de volume et ajustez avec le curseur vertical

### Navigation

1. **Au démarrage** : La bibliothèque s'affiche par défaut
2. **Sélection de playlist** : Cliquez sur le bouton retour pour voir toutes les playlists disponibles
3. **Lecture** : Cliquez sur une carte de piste pour la lire
4. **Informations** : Les détails de la piste en cours s'affichent automatiquement

### Raccourcis et comportements

- La pochette d'album tourne pendant la lecture
- Le bouton play/pause change d'icône selon l'état
- Les boutons shuffle et repeat changent de couleur quand activés
- Le passage automatique à la piste suivante se fait en fin de lecture
- En mode shuffle, le bouton "précédent" revient dans l'historique
- Les titres longs défilent automatiquement au survol de la carte
- La piste en cours de lecture est marquée visuellement dans la liste
- Le tri est désactivé dans l'écran de sélection de playlists

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
- Map() pour la gestion efficace des cartes de pistes
- Event delegation pour les performances

## 📁 Structure du projet

```
app.js
├── DOM : Références aux éléments DOM
├── PlaylistService : Gestion de la playlist et bibliothèque
│   ├── loadPlaylist()
│   ├── loadLibrary()
│   ├── getCurrentSong()
│   ├── nextSong()
│   ├── previousSong()
│   ├── getRandomSong()
│   ├── toggleShuffleMode()
│   ├── toggleRepeatMode()
│   ├── switchPlaylist()
│   ├── setLibraryMode()
│   ├── setSortMode()
│   └── refreshCurrentList()
├── TimeFormatter : Formatage du temps
├── UIController : Mise à jour de l'interface
│   ├── updateSongInfo()
│   ├── updatePlayButton()
│   ├── updateShuffleButton()
│   ├── updateRepeatButton()
│   ├── updateProgressBar()
│   ├── updateVolumeBar()
│   ├── toggleSongTitleAnim()
│   ├── toggleReturnButton()
│   └── updateTracklistTitle()
├── LibraryController : Gestion de l'affichage
│   ├── createTrackCard()
│   ├── createPlaylistChoice()
│   ├── createLibraryCard()
│   ├── createSongInfos()
│   ├── displayTracks()
│   ├── displayInfos()
│   ├── displayPlaylistChoice()
│   ├── clearSongInfos()
│   ├── removeLibrary()
│   ├── onSongChange()
│   └── attachTrackCardEvents()
├── AudioController : Contrôle audio
│   ├── play()
│   ├── pause()
│   ├── togglePlay()
│   ├── loadSong()
│   ├── setVolume()
│   ├── toggleMute()
│   └── seekTo()
└── AudioPlayer : Application principale
    ├── init() : Initialisation
    ├── setupEventListeners()
    ├── playNextSong()
    ├── playPreviousSong()
    ├── toggleShuffleMode()
    └── toggleRepeatMode()
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
- Utilisation de Map() pour O(1) lookup des cartes de pistes
- Nettoyage des DOM listeners lors de la suppression de cartes

### Compatibilité

- Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- Support mobile et desktop
- Polices avec fallbacks système

### Gestion de l'état

- Index séparés pour bibliothèque et playlists
- Historiques de lecture distincts pour shuffle
- Mode bibliothèque/playlist géré par flags booléens
- Synchronisation automatique entre états audio et UI

## 🐛 Problèmes connus

- Le mode repeat et shuffle ne peuvent pas être actifs simultanément (par design)
- La barre de volume nécessite un survol (pas de support tactile natif - TODO)
- Animation de défilement peut se déclencher brièvement lors du changement de playlist

## 🔮 Améliorations futures

- [ ] Migration vers une base de données (SQL)
- [ ] Système d'utilisateurs et authentification
- [ ] Sauvegarde des préférences utilisateur
- [ ] Historique d'écoute persistant
- [ ] Système de favoris
- [ ] Création/édition de playlists depuis l'interface
- [ ] Support tactile amélioré pour mobile
- [ ] Raccourcis clavier
- [ ] Visualiseur audio
- [ ] Mode picture-in-picture

## 📄 Licence

Projet éducatif - TP de développement web

## 👤 Auteur

Romain Laimé

---

_Kitz_ 🦊
