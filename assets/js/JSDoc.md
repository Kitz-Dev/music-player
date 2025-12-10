# Documentation Technique - SwiftFox Music Player

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture globale](#architecture-globale)
3. [Modules et Classes](#modules-et-classes)
4. [Flux de données](#flux-de-données)
5. [Événements et interactions](#événements-et-interactions)

---

## Vue d'ensemble

SwiftFox Music Player est construit selon une architecture **MVC-like** avec séparation claire des responsabilités :

- **Modèle** : `PlaylistService` gère les données et la logique métier
- **Vue** : `UIController` gère l'affichage et les mises à jour visuelles
- **Contrôleur** : `AudioPlayer` orchestre l'ensemble et gère les événements
- **Service** : `AudioController` gère l'API Web Audio

---

## Architecture globale

```
┌─────────────────────────────────────────────────┐
│                  AudioPlayer                    │
│         (Orchestrateur principal)               │
└────────┬─────────────┬──────────────┬───────────┘
         │             │              │
         ▼             ▼              ▼
┌────────────┐  ┌──────────────┐  ┌─────────────┐
│ Playlist   │  │ UIController │  │    Audio    │
│  Service   │  │              │  │ Controller  │
└────────────┘  └──────────────┘  └─────────────┘
      │               │                   │
      ▼               ▼                   ▼
   [Données]      [DOM/UI]           [Audio API]
```

---

## Modules et Classes

### 1. DOM Object

**Type** : Object literal (singleton)

**Rôle** : Centralise toutes les références aux éléments DOM pour éviter les querySelector répétés.

**Propriétés** :

```javascript
/**
 * Objet contenant toutes les références DOM de l'application
 * @typedef {Object} DOM
 * @property {HTMLElement} currentSong - Element audio principal
 * @property {HTMLElement} currentSongTitle - Conteneur du titre
 * @property {HTMLElement} currentSongAuthor - Conteneur de l'artiste
 * @property {HTMLElement} currentSongCountUp - Affichage temps écoulé
 * @property {HTMLElement} currentSongCountDown - Affichage temps restant
 * @property {HTMLImageElement} currentSongAlbumCover - Image de pochette
 * @property {HTMLElement} playButton - Bouton play/pause
 * @property {HTMLElement} playTooltip - Tooltip du bouton play
 * @property {SVGUseElement} playButtonImg - Référence SVG du bouton play
 * @property {HTMLElement} nextButton - Bouton piste suivante
 * @property {HTMLElement} previousButton - Bouton piste précédente
 * @property {HTMLElement} shuffleButton - Bouton mode aléatoire
 * @property {HTMLElement} repeatButton - Bouton mode répétition
 * @property {HTMLInputElement} progressBar - Barre de progression
 * @property {HTMLInputElement} volumeBar - Barre de volume
 * @property {HTMLElement} volumeButton - Bouton de contrôle volume
 * @property {SVGUseElement} volumeButtonImg - Référence SVG du bouton volume
 */
```

**Avantages** :

- Performance : Une seule récupération des éléments au chargement
- Maintenabilité : Point unique de modification des sélecteurs
- Lisibilité : Noms explicites pour chaque élément

---

### 2. PlaylistService Class

**Rôle** : Gère la logique métier de la playlist (données, navigation, modes de lecture).

#### Propriétés

```javascript
/**
 * Service de gestion de la playlist
 * @class PlaylistService
 */
class PlaylistService {
  /**
   * @property {Array<Song>} playlist - Liste des chansons
   * @property {number} currentIndex - Index de la chanson en cours
   * @property {boolean} shuffleMode - État du mode aléatoire
   * @property {boolean} repeatMode - État du mode répétition
   * @property {Array<number>} playedIndexes - Historique des index joués (shuffle)
   */
}
```

#### Méthodes

##### loadPlaylist(url)

```javascript
/**
 * Charge la playlist depuis un fichier JSON
 * @async
 * @param {string} url - URL du fichier JSON de la playlist
 * @returns {Promise<Array<Song>>} La playlist triée alphabétiquement
 * @throws {Error} Si la requête HTTP échoue
 *
 * @example
 * await playlistService.loadPlaylist("./data/playlist.json");
 *
 * Structure JSON attendue :
 * [
 *   {},
 *   {
 *     "songs": [
 *       {
 *         "title": "Titre",
 *         "author": "Artiste",
 *         "url": "./music/file.mp3",
 *         "cover": "./img/cover.jpg"
 *       }
 *     ]
 *   }
 * ]
 */
```

**Comportement** :

1. Effectue une requête fetch vers l'URL
2. Vérifie le statut de la réponse
3. Parse le JSON
4. Extrait le tableau `songs` de `data[1]`
5. Trie par ordre alphabétique de titre
6. Retourne la playlist triée

##### getCurrentSong()

```javascript
/**
 * Retourne la chanson actuellement sélectionnée
 * @returns {Song} La chanson à l'index courant
 *
 * @typedef {Object} Song
 * @property {string} title - Titre de la chanson
 * @property {string} author - Nom de l'artiste
 * @property {string} url - URL du fichier audio
 * @property {string} cover - URL de l'image de pochette
 */
```

##### toggleShuffleMode()

```javascript
/**
 * Active/désactive le mode lecture aléatoire
 * @returns {boolean} Nouvel état du mode shuffle
 *
 * Comportement :
 * - Inverse l'état du mode shuffle
 * - Réinitialise l'historique des pistes jouées
 * - Ajoute l'index actuel à l'historique
 *
 * @example
 * const isShuffleActive = playlistService.toggleShuffleMode();
 * // isShuffleActive = true ou false
 */
```

##### toggleRepeatMode()

```javascript
/**
 * Active/désactive le mode répétition
 * @returns {boolean} Nouvel état du mode repeat
 *
 * Note : Le mode repeat fait rejouer indéfiniment la même piste
 */
```

##### nextSong()

```javascript
/**
 * Passe à la chanson suivante selon le mode actif
 * @returns {Song} La prochaine chanson à jouer
 *
 * Logique :
 * 1. Si shuffle activé → appelle getRandomSong()
 * 2. Si repeat activé → retourne getCurrentSong()
 * 3. Sinon → incrémente l'index (avec wrap-around)
 *
 * @example
 * const nextSong = playlistService.nextSong();
 * // Retourne une chanson différente selon le mode
 */
```

##### previousSong()

```javascript
/**
 * Revient à la chanson précédente
 * @returns {Song} La chanson précédente
 *
 * Comportement en mode shuffle :
 * - Remonte dans l'historique des pistes jouées
 * - Supprime la piste actuelle de l'historique
 * - Se positionne sur la piste précédente dans l'historique
 * - Si historique vide, reste sur la piste actuelle
 *
 * Comportement en mode normal :
 * - Décrémente l'index avec wrap-around
 * - Si index = 0, revient à la dernière piste
 */
```

##### getRandomSong()

```javascript
/**
 * Sélectionne une chanson aléatoire non encore jouée
 * @returns {Song} Une chanson aléatoire
 *
 * Algorithme :
 * 1. Vérifie si toutes les pistes ont été jouées
 * 2. Si oui, réinitialise l'historique
 * 3. Génère un index aléatoire
 * 4. Vérifie qu'il n'est pas dans l'historique
 * 5. Si déjà joué, réessaye (max 100 tentatives)
 * 6. Ajoute l'index à l'historique
 * 7. Retourne la chanson
 *
 * Protection contre boucle infinie :
 * - Si 100 tentatives échouent, prend simplement la piste suivante
 */
```

---

### 3. TimeFormatter Object

**Type** : Object literal (utility)

**Rôle** : Utilitaire de formatage du temps pour l'affichage.

```javascript
/**
 * Utilitaire de formatage du temps
 * @namespace TimeFormatter
 */
const TimeFormatter = {
  /**
   * Formate un temps en secondes au format MM:SS
   * @param {number} seconds - Temps en secondes (peut être décimal)
   * @returns {string} Temps formaté (ex: "3:05", "12:30")
   *
   * @example
   * TimeFormatter.formatTime(185.7); // "3:05"
   * TimeFormatter.formatTime(65);    // "1:05"
   * TimeFormatter.formatTime(5);     // "0:05"
   *
   * Comportement :
   * - Arrondit à l'entier inférieur (Math.floor)
   * - Ajoute un zéro devant les secondes < 10
   * - Format : "minutes:secondes"
   */
  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const sDisplay = s < 10 ? `0${s}` : s;
    return `${m}:${sDisplay}`;
  },
};
```

---

### 4. UIController Class

**Rôle** : Gère toutes les mises à jour de l'interface utilisateur.

#### Constructor

```javascript
/**
 * Contrôleur de l'interface utilisateur
 * @class UIController
 * @param {DOM} dom - Objet contenant les références DOM
 */
constructor(dom) {
    this.dom = dom;
}
```

#### Méthodes

##### updateSongInfo(song)

```javascript
/**
 * Met à jour les informations de la chanson affichée
 * @param {Song} song - Objet chanson à afficher
 *
 * Éléments mis à jour :
 * - Titre de la chanson
 * - Nom de l'artiste
 * - Pochette d'album
 * - Source audio (src de l'élément <audio>)
 *
 * @example
 * uiController.updateSongInfo({
 *   title: "Ma chanson",
 *   author: "Mon artiste",
 *   cover: "./img/cover.jpg",
 *   url: "./music/song.mp3"
 * });
 */
```

##### updatePlayButton(isPlaying)

```javascript
/**
 * Met à jour l'apparence du bouton play/pause
 * @param {boolean} isPlaying - État de lecture (true = en cours)
 *
 * Actions :
 * - Change l'icône SVG (play ↔ pause)
 * - Met à jour le texte du tooltip
 *
 * Icônes utilisées :
 * - isPlaying = true → "pause-button"
 * - isPlaying = false → "play-button"
 */
```

##### updateShuffleButton(isActive)

```javascript
/**
 * Met à jour l'apparence du bouton shuffle
 * @param {boolean} isActive - État du mode shuffle
 *
 * Modifications visuelles :
 * - Ajoute/retire la classe "active"
 * - Change la couleur de remplissage (fill)
 *   - Actif : #b417e4 (violet)
 *   - Inactif : #EDF2F7 (gris clair)
 */
```

##### updateRepeatButton(isActive)

```javascript
/**
 * Met à jour l'apparence du bouton repeat
 * @param {boolean} isActive - État du mode repeat
 *
 * Modifications visuelles :
 * - Ajoute/retire la classe "active"
 * - Change la couleur de trait (stroke)
 *   - Actif : #b417e4 (violet)
 *   - Inactif : #EDF2F7 (gris clair)
 */
```

##### toggleAlbumCoverAnimation()

```javascript
/**
 * Active/désactive l'animation de rotation de la pochette
 *
 * Comportement :
 * - Toggle la classe "active" sur l'image de pochette
 * - La classe "active" déclenche l'animation CSS rotate
 * - Animation : rotation 360° en 20s, infinie
 */
```

##### updateProgressBar(currentTime, duration)

```javascript
/**
 * Met à jour la barre de progression et les compteurs
 * @param {number} currentTime - Temps écoulé en secondes
 * @param {number} duration - Durée totale en secondes
 *
 * Actions effectuées :
 * 1. Calcule le pourcentage de progression
 * 2. Met à jour la valeur de l'input range
 * 3. Met à jour la variable CSS --slider-value
 * 4. Formate et affiche le temps écoulé
 * 5. Formate et affiche le temps restant
 *
 * Note : La variable CSS --slider-value permet de colorier
 * uniquement la partie "jouée" de la barre
 */
```

##### initProgressBar(duration)

```javascript
/**
 * Initialise la barre de progression au chargement d'une chanson
 * @param {number} duration - Durée totale de la chanson
 *
 * Configuration :
 * - Définit l'attribut max de l'input range
 * - Réinitialise la valeur à 0
 */
```

##### updateVolumeIcon(volume)

```javascript
/**
 * Met à jour l'icône de volume selon le niveau
 * @param {number} volume - Niveau de volume (0 à 1)
 *
 * Logique de sélection d'icône :
 * - volume === 0 → "mute-volume" (muet)
 * - volume < 0.5 → "low-volume" (faible)
 * - volume >= 0.5 → "high-volume" (élevé)
 */
```

##### updateVolumeBar(volume)

```javascript
/**
 * Met à jour la barre de volume
 * @param {number} volume - Niveau de volume (0 à 1)
 *
 * Actions :
 * 1. Convertit en pourcentage (0-100)
 * 2. Met à jour la valeur de l'input range
 * 3. Met à jour la variable CSS --slider-value
 * 4. Appelle updateVolumeIcon() pour adapter l'icône
 */
```

---

### 5. AudioController Class

**Rôle** : Gère le contrôle de l'élément audio HTML5 et ses interactions.

#### Constructor

```javascript
/**
 * Contrôleur audio
 * @class AudioController
 * @param {HTMLAudioElement} audioElement - Element audio HTML5
 * @param {UIController} uiController - Contrôleur UI pour feedback
 */
constructor(audioElement, uiController) {
    this.audio = audioElement;
    this.ui = uiController;
    this.previousVolume = 0.5; // Volume avant mute
}
```

#### Méthodes

##### play()

```javascript
/**
 * Lance la lecture audio
 *
 * Actions :
 * 1. Appelle audio.play()
 * 2. Met à jour le bouton play (via UI)
 */
```

##### pause()

```javascript
/**
 * Met en pause la lecture audio
 *
 * Actions :
 * 1. Appelle audio.pause()
 * 2. Met à jour le bouton play (via UI)
 */
```

##### togglePlay()

```javascript
/**
 * Bascule entre play et pause
 *
 * Logique :
 * - Si audio en pause → play()
 * - Si audio en lecture → pause()
 */
```

##### loadSong(song)

```javascript
/**
 * Charge une nouvelle chanson
 * @param {Song} song - Chanson à charger
 *
 * Actions :
 * 1. Définit la source audio
 * 2. Met à jour les infos dans l'UI
 *
 * Note : Ne lance pas automatiquement la lecture
 */
```

##### setVolume(volume)

```javascript
/**
 * Définit le niveau de volume
 * @param {number} volume - Niveau entre 0 et 1
 *
 * Actions :
 * 1. Applique le volume à l'élément audio
 * 2. Met à jour la barre de volume (UI)
 */
```

##### toggleMute()

```javascript
/**
 * Active/désactive le mode muet
 *
 * Logique :
 * - Si volume > 0 :
 *   1. Sauvegarde le volume actuel dans previousVolume
 *   2. Met le volume à 0
 * - Si volume === 0 :
 *   1. Restaure previousVolume
 *
 * Avantage : Permet de retrouver le volume précédent
 * au lieu de passer à un volume par défaut
 */
```

##### seekTo(time)

```javascript
/**
 * Se déplace à un moment précis dans la chanson
 * @param {number} time - Position en secondes
 *
 * Utilisation typique : Click sur la barre de progression
 */
```

---

### 6. AudioPlayer Class

**Rôle** : Classe principale qui orchestre l'ensemble de l'application.

#### Constructor

```javascript
/**
 * Application principale du lecteur audio
 * @class AudioPlayer
 * @param {DOM} dom - Objet contenant les références DOM
 */
constructor(dom) {
    this.dom = dom;
    this.playlistService = new PlaylistService();
    this.uiController = new UIController(dom);
    this.audioController = new AudioController(
        dom.currentSong,
        this.uiController
    );
    this.initVolume();
    this.initColor();
}
```

**Initialisation** :

- Crée toutes les instances de services
- Initialise le volume par défaut (50%)
- Initialise les couleurs des boutons

#### Méthodes principales

##### init(playlistUrl)

```javascript
/**
 * Initialise l'application
 * @async
 * @param {string} playlistUrl - URL du fichier de playlist
 *
 * Processus d'initialisation :
 * 1. Charge la playlist via PlaylistService
 * 2. Récupère la première chanson
 * 3. Charge cette chanson dans le player
 * 4. Configure tous les event listeners
 * 5. Gère les erreurs éventuelles
 *
 * @example
 * const player = new AudioPlayer(DOM);
 * await player.init("./data/playlist.json");
 */
```

##### setupEventListeners()

```javascript
/**
 * Configure tous les écouteurs d'événements
 *
 * Événements gérés :
 *
 * BOUTONS DE CONTRÔLE :
 * - playButton.click → togglePlay + animation pochette
 * - nextButton.click → playNextSong()
 * - previousButton.click → playPreviousSong()
 * - shuffleButton.click → toggleShuffleMode()
 * - repeatButton.click → toggleRepeatMode()
 *
 * AUDIO EVENTS :
 * - loadedmetadata → Initialise la barre de progression
 * - timeupdate → Met à jour la progression
 * - ended → Lance la chanson suivante
 *
 * BARRES DE CONTRÔLE :
 * - progressBar.input → Seek dans la chanson
 * - volumeBar.input → Ajuste le volume
 * - volumeButton.click → Toggle mute
 */
```

##### playNextSong()

```javascript
/**
 * Joue la chanson suivante
 *
 * Processus :
 * 1. Récupère la chanson suivante (PlaylistService)
 * 2. Charge la chanson (AudioController)
 * 3. Lance la lecture
 * 4. Démarre l'animation de pochette si nécessaire
 *
 * Note : La logique de sélection (normale/shuffle/repeat)
 * est gérée par PlaylistService.nextSong()
 */
```

##### playPreviousSong()

```javascript
/**
 * Joue la chanson précédente
 *
 * Processus identique à playNextSong()
 * mais appelle PlaylistService.previousSong()
 */
```

##### toggleShuffleMode()

```javascript
/**
 * Bascule le mode lecture aléatoire
 *
 * Actions :
 * 1. Active/désactive le shuffle (PlaylistService)
 * 2. Met à jour l'apparence du bouton (UIController)
 */
```

##### toggleRepeatMode()

```javascript
/**
 * Bascule le mode répétition
 *
 * Actions :
 * 1. Active/désactive le repeat (PlaylistService)
 * 2. Met à jour l'apparence du bouton (UIController)
 */
```

---

## Flux de données

### Chargement initial

```
1. new AudioPlayer(DOM)
   ↓
2. player.init("playlist.json")
   ↓
3. PlaylistService.loadPlaylist()
   ↓
4. Fetch + Parse JSON
   ↓
5. Sort playlist alphabetically
   ↓
6. Load first song
   ↓
7. Setup event listeners
   ↓
8. Application prête
```

### Cycle de lecture normale

```
User clicks NEXT
   ↓
AudioPlayer.playNextSong()
   ↓
PlaylistService.nextSong()
   ├─ shuffle? → getRandomSong()
   ├─ repeat? → getCurrentSong()
   └─ normal → currentIndex++
   ↓
AudioController.loadSong(song)
   ↓
UIController.updateSongInfo(song)
   ↓
AudioController.play()
   ↓
UIController.updatePlayButton(true)
```

### Mise à jour de la progression

```
<audio> timeupdate event
   ↓
AudioPlayer event listener
   ↓
UIController.updateProgressBar()
   ├─ Calculate percentage
   ├─ Update range value
   ├─ Update CSS variable
   ├─ Format elapsed time
   └─ Format remaining time
```

### Toggle Shuffle

```
User clicks SHUFFLE
   ↓
AudioPlayer.toggleShuffleMode()
   ↓
PlaylistService.toggleShuffleMode()
   ├─ Inverse shuffleMode
   └─ Reset playedIndexes
   ↓
UIController.updateShuffleButton()
   ├─ Add/remove "active" class
   └─ Change color
```

---

## Événements et interactions

### Événements DOM

| Élément        | Événement | Handler           | Action                   |
| -------------- | --------- | ----------------- | ------------------------ |
| playButton     | click     | togglePlay        | Play/Pause + animation   |
| nextButton     | click     | playNextSong      | Chanson suivante         |
| previousButton | click     | playPreviousSong  | Chanson précédente       |
| shuffleButton  | click     | toggleShuffleMode | Active/désactive shuffle |
| repeatButton   | click     | toggleRepeatMode  | Active/désactive repeat  |
| progressBar    | input     | seekTo            | Navigation dans la piste |
| volumeBar      | input     | setVolume         | Ajustement du volume     |
| volumeButton   | click     | toggleMute        | Mute/unmute              |

### Événements Audio

| Événement      | Déclencheur          | Action                              |
| -------------- | -------------------- | ----------------------------------- |
| loadedmetadata | Métadonnées chargées | Initialise la barre de progression  |
| timeupdate     | Position change      | Met à jour progression et compteurs |
| ended          | Fin de la piste      | Lance la piste suivante             |

---

## Patterns et bonnes pratiques

### Séparation des responsabilités

- **PlaylistService** : Logique métier pure (aucune référence DOM)
- **UIController** : Manipulation du DOM uniquement
- **AudioController** : Interaction avec l'API Audio
- **AudioPlayer** : Coordination et gestion des événements

### Avantages de cette architecture

1. **Testabilité** : Chaque classe peut être testée indépendamment
2. **Maintenabilité** : Modifications isolées par domaine
3. **Réutilisabilité** : Services réutilisables dans d'autres contextes
4. **Lisibilité** : Responsabilités claires et explicites

### Gestion d'état

L'état de l'application est distribué :

- **PlaylistService** : État de la playlist et modes
- **AudioController** : État de lecture et volume
- **UIController** : État visuel (sans état propre, pure synchronisation)

### Gestion des erreurs

```javascript
async init(playlistUrl) {
    try {
        await this.playlistService.loadPlaylist(playlistUrl);
        // ...
    } catch (error) {
        console.error("Erreur lors du chargement:", error);
    }
}
```

L'erreur est capturée au plus haut niveau (AudioPlayer) pour une gestion centralisée.

---

## Points d'amélioration possibles

### Fonctionnalités

1. **Playlist visible** : Afficher la liste des chansons
2. **Recherche** : Filtrer les chansons par titre/artiste
3. **Égaliseur** : Contrôles audio avancés
4. **Playlists multiples** : Gestion de plusieurs playlists
5. **Favoris** : Système de likes/favoris
6. **Keyboard shortcuts** : Contrôles clavier (espace, flèches)

### Technique

1. **LocalStorage** : Sauvegarder volume, mode shuffle, position
2. **Service Worker** : Lecture offline
3. **Web Audio API** : Visualisations, effets audio
4. **TypeScript** : Typage fort pour meilleure maintenance
5. **Tests unitaires** : Jest ou Vitest pour chaque classe
6. **Responsive avancé** : Support tactile pour mobile

### Performance

1. **Lazy loading** : Charger les pochettes à la demande
2. **Virtual scrolling** : Pour playlists très longues
3. **Audio preloading** : Précharger la piste suivante
4. **Code splitting** : Séparer les modules

---

## Glossaire

- **Shuffle** : Mode de lecture aléatoire
- **Repeat** : Mode de répétition d'une piste
- **Seek** : Se déplacer à une position précise
- **Mute** : Couper le son temporairement
- **Metadata** : Informations sur la piste (durée, etc.)
- **Range input** : Élément HTML pour curseurs (volume, progression)
- **SVG sprite** : Fichier SVG contenant plusieurs icônes
- **Tooltip** : Info-bulle au survol

---

_Documentation générée pour SwiftFox Music Player_  
_Version : 1.0_  
_Date : 2025_
