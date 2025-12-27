// ============================================
// 1. DOM.js - Gestion des éléments DOM
// ============================================
const DOM = {
    currentSong: document.getElementById("current-song"),
    currentSongTitle: document.getElementById("song-title"),
    currentSongTitleAnim: document.getElementById("song-title-anim"),
    currentSongTitleWrapper: document.getElementById("song-title-wrapper"),
    currentSongTitleContainer: document.getElementById("song-title-container"),
    currentSongTitleAnimContainer: document.getElementById("song-title-anim-container"),
    currentSongAuthor: document.getElementById("song-author"),
    currentSongAuthorAnim: document.getElementById("song-author-anim"),
    currentSongCountUp: document.getElementById("song-countup"),
    currentSongCountDown: document.getElementById("song-countdown"),
    currentSongAlbumCover: document.getElementById("album-cover"),
    playButton: document.getElementById("play-button"),
    playTooltip: document.getElementById("play-tooltip"),
    playButtonImg: document.getElementById("play-button-img"),
    nextButton: document.getElementById("next-button"),
    previousButton: document.getElementById("previous-button"),
    shuffleButton: document.getElementById("shuffle-button"),
    repeatButton: document.getElementById("repeat-button"),
    progressBar: document.getElementById("progress-bar"),
    volumeBar: document.getElementById("volume-bar"),
    volumeButton: document.getElementById("volume-button"),
    volumeButtonImg: document.getElementById("volume-button-img"),
    trackListTitle: document.getElementById("tracklist-title"),
    tracklistReturnButton: document.getElementById("tracklist-return-button-container"),
    trackCardContainer: document.getElementById("library-tracks-container"),
    trackCard: document.getElementsByClassName("track-card"),
    sortLibrary: document.getElementById("add-playlist-button-container")
}

// ============================================
// 2. PlaylistService.js - Gestion de la playlist
// ============================================
class PlaylistService {
    constructor() {
        this.playlist = []
        this.playlists = []
        this.libraryTracks = []
        this.library = []
        this.currentIndex = 0
        this.currentLibraryIndex = 0
        this.playlistIndex = 0
        this.playlistSelectionMode = false
        this.libraryMode = true
        this.shuffleMode = false  // Mode shuffle activé ou non
        this.repeatMode = false
        this.playedIndexes = []   // Historique des pistes jouées en mode shuffle
        this.libraryPlayedIndexes = []
        this.currentPlayingSongId = null
        this.revertSortMode = false
    }

    async loadPlaylist(playlistUrl) {
        const res = await fetch(playlistUrl)
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data = await res.json()
        this.playlists = data
        this.playlist = this.sortCurrentPlaylist()
        return this.playlist
    }


    // TODO : Link library to UI/UX
    async loadLibrary(libraryUrl) {
        const res = await fetch(libraryUrl)
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data = await res.json()
        this.library = data
        this.libraryTracks = this.sortLibrary()
        return this.libraryTracks
    }

    sortCurrentPlaylist() {
        if (this.revertSortMode) {
            return [...this.playlists[this.playlistIndex].songs].sort((a, b) =>
                b.title.localeCompare(a.title)
            )
        } else {
            return [...this.playlists[this.playlistIndex].songs].sort((a, b) =>
                a.title.localeCompare(b.title)
            )
        }
    }

    sortLibrary() {
        if (this.revertSortMode) {
            return [...this.library[0].songs].sort((a, b) =>
                b.title.localeCompare(a.title)
            )
        } else {
            return [...this.library[0].songs].sort((a, b) =>
                a.title.localeCompare(b.title)
            )
        }
    }

    refreshCurrentList() {
        if (this.libraryMode) {
            this.libraryTracks = this.sortLibrary()
            return this.libraryTracks
        } else {
            this.playlist = this.sortCurrentPlaylist()
            return this.playlist
        }
    }

    sortLibraryByAuthor() {
        return [...this.library[0].songs].sort((a, b) =>
            a.author.localeCompare(b.author)
        )
    }

    switchPlaylist(id) {
        this.playlistIndex = id
        this.playlist = this.sortCurrentPlaylist()
    }

    setPlaylistSelectionMode(isActive) {
        this.playlistSelectionMode = isActive
        return isActive
    }

    getCurrentSong() {
        if (this.libraryMode) {
            return this.libraryTracks[this.currentLibraryIndex]
        } else {
            return this.playlist[this.currentIndex]
        }
    }

    toggleShuffleMode() {
        this.shuffleMode = !this.shuffleMode
        // Réinitialise l'historique quand on active/désactive
        this.playedIndexes = [this.currentIndex]
        return this.shuffleMode
    }

    toggleRepeatMode() {
        this.repeatMode = !this.repeatMode
        return this.repeatMode
    }

    setLibraryMode(isActive) {
        this.libraryMode = isActive
        return isActive
    }

    setSortMode(isRevert) {
        this.revertSortMode = isRevert
        return isRevert
    }

    nextSong() {
        if (this.libraryMode) {
            if (this.shuffleMode) {
                return this.getRandomSong()
            } else if (this.repeatMode) {
                return this.getCurrentSong()
            } else {
                this.currentLibraryIndex = (this.currentLibraryIndex + 1) % this.libraryTracks.length
                return this.getCurrentSong()
            }
        }
        else {
            if (this.shuffleMode) {
                return this.getRandomSong()
            } else if (this.repeatMode) {
                return this.getCurrentSong()
            } else {
                this.currentIndex = (this.currentIndex + 1) % this.playlist.length
                return this.getCurrentSong()
            }
        }
    }

    previousSong() {
        if (this.libraryMode) {
            if (this.shuffleMode) {
                if (this.libraryPlayedIndexes.length > 1) {
                    this.libraryPlayedIndexes.pop()
                    this.currentLibraryIndex = this.libraryPlayedIndexes[this.libraryPlayedIndexes.length - 1]
                }
                return this.getCurrentSong()
            } else {
                this.currentLibraryIndex = (this.currentLibraryIndex - 1 + this.libraryTracks.length) % this.libraryTracks.length
                return this.getCurrentSong()
            }
        } else {
            if (this.shuffleMode) {
                if (this.playedIndexes.length > 1) {
                    this.playedIndexes.pop()
                    this.currentIndex = this.playedIndexes[this.playedIndexes.length - 1]
                }
                return this.getCurrentSong()
            } else {
                this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length
                return this.getCurrentSong()
            }
        }
    }

    getRandomSong() {
        let played, list, currentIndexProp

        if (this.libraryMode) {
            played = this.libraryPlayedIndexes
            list = this.libraryTracks
            currentIndexProp = 'currentLibraryIndex'
        } else {
            played = this.playedIndexes
            list = this.playlist
            currentIndexProp = 'currentIndex'
        }

        if (played.length >= list.length) {
            played.length = 0
            played.push(this[currentIndexProp])
        }

        let randomIndex
        let attempts = 0
        do {
            randomIndex = Math.floor(Math.random() * list.length)
            attempts++
            if (attempts > 100) {
                randomIndex = (this[currentIndexProp] + 1) % list.length
                break
            }
        } while (played.includes(randomIndex) && list.length > 1)

        this[currentIndexProp] = randomIndex
        played.push(randomIndex)
        return this.getCurrentSong()
    }
}

// ============================================
// 3. TimeFormatter.js - Formatage du temps
// ============================================
const TimeFormatter = {
    formatTime(seconds) {
        const m = Math.floor(seconds / 60)
        const s = Math.floor(seconds % 60)
        const sDisplay = s < 10 ? `0${s}` : s
        return `${m}:${sDisplay}`
    }
}

// ============================================
// 4. UIController.js - Contrôle de l'interface
// ============================================
class UIController {
    constructor(dom) {
        this.dom = dom
    }

    updateSongInfo(song) {
        this.dom.currentSongTitle.textContent = song.title
        this.dom.currentSongTitleAnim.textContent = song.title
        this.dom.currentSongAuthor.textContent = song.author
        this.dom.currentSongAuthorAnim.textContent = song.author
        this.dom.currentSongAlbumCover.src = song.cover
        this.dom.currentSong.src = song.url
        this.toggleSongTitleAnim()
    }

    updatePlayButton(isPlaying) {
        const icon = isPlaying ? "pause-button" : "play-button"
        const tooltip = isPlaying ? "Pause" : "Play"
        this.dom.playButtonImg.setAttribute("href", `./img/sprite.svg#${icon}`)
        this.dom.playTooltip.textContent = tooltip
    }

    updateShuffleButton(isActive) {
        if (isActive) {
            this.dom.shuffleButton.classList.add("active")
            this.dom.shuffleButton.style.fill = "#b417e4"
        } else {
            this.dom.shuffleButton.classList.remove("active")
            this.dom.shuffleButton.style.fill = "#EDF2F7"
        }
    }

    updateRepeatButton(isActive) {
        if (isActive) {
            this.dom.repeatButton.classList.add("active")
            this.dom.repeatButton.style.stroke = "#b417e4"
        } else {
            this.dom.repeatButton.classList.remove("active")
            this.dom.repeatButton.style.stroke = "#EDF2F7"
        }
    }

    toggleAlbumCoverAnimation() {
        this.dom.currentSongAlbumCover.classList.toggle("active")
    }

    updateProgressBar(currentTime, duration) {
        const percentage = (currentTime / duration) * 100
        this.dom.progressBar.value = Math.floor(currentTime)
        this.dom.progressBar.style.setProperty('--slider-value', `${percentage}%`)
        this.dom.currentSongCountUp.textContent = TimeFormatter.formatTime(currentTime)
        this.dom.currentSongCountDown.textContent = TimeFormatter.formatTime(duration)
    }

    initProgressBar(duration) {
        this.dom.progressBar.max = Math.floor(duration)
        this.dom.progressBar.value = 0
    }

    updateVolumeIcon(volume) {
        let icon
        if (volume === 0) {
            icon = "mute-volume"
        } else if (volume < 0.5) {
            icon = "low-volume"
        } else {
            icon = "high-volume"
        }
        this.dom.volumeButtonImg.setAttribute("href", `../../img/sprite.svg#${icon}`)
    }

    updateVolumeBar(volume) {
        const percentage = volume * 100
        this.dom.volumeBar.value = volume
        this.dom.volumeBar.style.setProperty('--slider-value', `${percentage}%`)
        this.updateVolumeIcon(volume)
    }

    toggleSongTitleAnim() {
        const titleLength = this.dom.currentSongTitleContainer.offsetWidth
        if (titleLength >= 300) {
            this.dom.currentSongTitleContainer.classList.add("active")
            this.dom.currentSongTitleWrapper.classList.add("active")
            this.dom.currentSongTitleAnimContainer.classList.add("active")
        } else if (titleLength < 300) {
            this.dom.currentSongTitleContainer.classList.remove("active")
            this.dom.currentSongTitleWrapper.classList.remove("active")
            this.dom.currentSongTitleAnimContainer.classList.remove("active")
        }
    }

    toggleReturnButton(show) {
        if (show) {
            this.dom.tracklistReturnButton.style.display = "flex"
        } else {
            this.dom.tracklistReturnButton.style.display = "none"
        }
    }

    updateTracklistTitle(title) {
        this.dom.trackListTitle.textContent = title
    }
}

// ============================================
// 5. LibraryController.js - Contrôle de la bibliothèque
// ============================================
class LibraryController {
    constructor(dom, playlistService, audioController, uiController) {
        this.dom = dom
        this.playlistService = playlistService
        this.audioController = audioController
        this.uiController = uiController
        this.trackCardMap = new Map()
        this.currentAnimatedCard = null
    }

    createCoverImage(coverSrc) {
        const newImg = document.createElement("img")
        newImg.setAttribute("src", coverSrc)
        newImg.setAttribute("aria-label", "Album Cover")
        return newImg
    }

    createTitleSpan(text) {
        const newSpan = document.createElement("span")
        newSpan.setAttribute("class", "track-title")
        const newSpanContent = document.createTextNode(text)
        newSpan.appendChild(newSpanContent)
        return newSpan
    }

    createTitleContainer(track) {
        const trackTitleContainer = document.createElement("div")
        trackTitleContainer.setAttribute("class", "track-title-container")
        trackTitleContainer.appendChild(this.createTitleSpan(track.title))
        trackTitleContainer.appendChild(this.createTitleSpan(" - "))
        trackTitleContainer.appendChild(this.createTitleSpan(track.author))
        return trackTitleContainer
    }

    createPlaylistTitleContainer(track) {
        const trackTitleContainer = document.createElement("div")
        trackTitleContainer.setAttribute("class", "track-title-container")
        trackTitleContainer.appendChild(this.createTitleSpan(track.title))
        return trackTitleContainer
    }

    createTitleWrapper(track) {
        const newWrapper = document.createElement("div")
        newWrapper.setAttribute("class", "track-title-wrapper")
        newWrapper.appendChild(this.createTitleContainer(track))
        return newWrapper
    }

    createPlaylistTitleWrapper(track) {
        const newWrapper = document.createElement("div")
        newWrapper.setAttribute("class", "track-title-wrapper")
        newWrapper.appendChild(this.createPlaylistTitleContainer(track))
        return newWrapper
    }

    handleTrackClick(track, sourceList, isLibrary) {
        const clickedIndex = sourceList.indexOf(track)
        this.playlistService.setLibraryMode(isLibrary)

        if (isLibrary) {
            this.playlistService.currentLibraryIndex = clickedIndex
            if (this.playlistService.shuffleMode) {
                this.playlistService.libraryPlayedIndexes = [clickedIndex]
            }
        } else {
            this.playlistService.currentIndex = clickedIndex
            if (this.playlistService.shuffleMode) {
                this.playlistService.playedIndexes = [clickedIndex]
            }
        }

        this.audioController.loadSong(track)
        if (!this.dom.currentSongAlbumCover.classList.contains("active")) {
            this.uiController.toggleAlbumCoverAnimation()
        }
        this.audioController.play()
    }

    handleMouseEnter(trackCard, titleWrapper, track) {
        const mainContainer = titleWrapper.querySelector(".track-title-container")
        trackCard.classList.add("hover-anim")

        if (this.shouldShowScrollingAnimation(mainContainer, titleWrapper)) {
            titleWrapper.appendChild(this.createTitleContainer(track))
            trackCard.classList.add("active")
        }
    }

    handleMouseLeave(trackCard) {
        trackCard.classList.remove("active", "hover-anim")
    }

    handleTrackCardAnim(isPlaying, track) {
        this.uiController.updateTrackCardAnim(isPlaying, track)
    }

    shouldShowScrollingAnimation(mainContainer, wrapper) {
        if (mainContainer.offsetWidth >= wrapper.offsetWidth && mainContainer != null) {
            return true
        }
    }

    onSongChange(song) {
        const newCard = this.trackCardMap.get(song.id)
        if (!newCard) return
        if (this.currentAnimatedCard) {
            this.currentAnimatedCard.classList.remove("playing")
        }

        newCard.classList.add("playing")
        this.currentAnimatedCard = newCard
    }

    attachTrackCardEvents(trackCard, titleWrapper, track, sourceList, isLibrary) {
        trackCard.addEventListener("click", () => {
            this.handleTrackClick(track, sourceList, isLibrary)
        })

        trackCard.addEventListener("mouseenter", () => {
            this.handleMouseEnter(trackCard, titleWrapper, track)
        })

        trackCard.addEventListener("mouseleave", () => {
            this.handleMouseLeave(trackCard)
        })
    }

    // TODO : Fix animation au changement de playlist
    attachPlaylistCardEvents(playlistCard, playlist) {
        playlistCard.addEventListener("click", () => {
            const playlistId = playlist.id

            this.playlistService.setLibraryMode(false)
            this.playlistService.switchPlaylist(playlistId)
            this.playlistService.currentIndex = 0

            this.displayTracks(this.playlistService.playlist, false)

            this.playlistService.setPlaylistSelectionMode(false)
            this.uiController.toggleReturnButton(true)
            this.uiController.updateTracklistTitle(playlist.title)
        })
    }

    attachLibraryCardEvents(libraryCard) {
        libraryCard.addEventListener("click", () => {
            this.playlistService.setLibraryMode(true)
            this.playlistService.currentLibraryIndex = 0

            this.displayTracks(this.playlistService.libraryTracks, true)

            this.playlistService.setPlaylistSelectionMode(false)
            this.uiController.toggleReturnButton(true)
            this.uiController.updateTracklistTitle("Library")
        })
    }

    createTrackCard(track, sourceList, isLibrary) {
        const trackCard = document.createElement("div")
        const coverImage = this.createCoverImage(track.cover)
        const newWrapper = this.createTitleWrapper(track)
        trackCard.setAttribute("class", "track-card")
        trackCard.setAttribute("id", `track-card ${track.id}`)
        trackCard.appendChild(coverImage)
        trackCard.appendChild(newWrapper)
        this.trackCardMap.set(track.id, trackCard)
        this.attachTrackCardEvents(trackCard, newWrapper, track, sourceList, isLibrary)
        return trackCard
    }

    displayTracks(playlist, isLibrary = true) {
        const insertDiv = this.dom.trackCardContainer
        this.removeLibrary()

        playlist.forEach(element => {
            const trackCard = this.createTrackCard(element, playlist, isLibrary)
            insertDiv.insertBefore(trackCard, null)
        });

        this.restorePlayingAnimation()
    }

    restorePlayingAnimation() {
        const currentSongId = this.playlistService.currentPlayingSongId
        if (currentSongId) {
            const card = this.trackCardMap.get(currentSongId)
            if (card) {
                if (this.currentAnimatedCard) {
                    this.currentAnimatedCard.classList.remove("playing")
                }
                card.classList.add("playing")
                this.currentAnimatedCard = card
            }
        }
    }

    removeLibrary() {
        const container = this.dom.trackCardContainer
        while (container.firstChild) {
            container.removeChild(container.firstChild)
        }
        this.trackCardMap.clear()
    }

    createPlaylistChoice(playlists) {
        const playlistCard = document.createElement("div")
        const coverImage = this.createCoverImage(playlists.cover)
        const newWrapper = this.createPlaylistTitleWrapper(playlists)
        playlistCard.setAttribute("class", "playlist-card")
        playlistCard.setAttribute("id", `playlist-${playlists.id}`)
        playlistCard.appendChild(coverImage)
        playlistCard.appendChild(newWrapper)
        this.attachPlaylistCardEvents(playlistCard, playlists)
        return playlistCard
    }

    createLibraryCard(library) {
        const libraryCard = document.createElement("div")
        const coverImage = this.createCoverImage("../fox-corpo-icon.webp")
        const newWrapper = this.createPlaylistTitleWrapper(library)
        libraryCard.setAttribute("class", "playlist-card")
        libraryCard.appendChild(coverImage)
        libraryCard.appendChild(newWrapper)
        this.attachLibraryCardEvents(libraryCard)
        return libraryCard
    }

    displayPlaylistChoice(playlists) {
        const insertDiv = this.dom.trackCardContainer
        this.removeLibrary()

        const libraryCard = this.createLibraryCard(this.playlistService.library[0])
        insertDiv.insertBefore(libraryCard, null)

        playlists.forEach(element => {
            const playlistCard = this.createPlaylistChoice(element)
            insertDiv.insertBefore(playlistCard, null)
        });

        this.playlistService.setPlaylistSelectionMode(true)
        this.uiController.toggleReturnButton(false)
        this.uiController.updateTracklistTitle("Playlists")
    }
}

// ============================================
// 6. AudioController.js - Contrôle audio
// ============================================
class AudioController {
    constructor(audioElement, uiController) {
        this.audio = audioElement
        this.ui = uiController
        this.previousVolume = 0.5
        this.songChangeListener = null
        this.currentSongIdCallback = null
    }

    play() {
        this.audio.play()
        this.ui.updatePlayButton(true)
    }

    pause() {
        this.audio.pause()
        this.ui.updatePlayButton(false)
    }

    togglePlay() {
        if (this.audio.paused) {
            this.play()
        } else {
            this.pause()
        }
    }

    loadSong(song) {
        if (this.songChangeListener) {
            this.songChangeListener(song)
        }

        if (this.currentSongIdCallback) {
            this.currentSongIdCallback(song.id)
        }

        this.audio.src = song.url
        this.ui.updateSongInfo(song)
    }

    setVolume(volume) {
        this.audio.volume = volume
        this.ui.updateVolumeBar(volume)
    }

    toggleMute() {
        if (this.audio.volume > 0) {
            this.previousVolume = this.audio.volume
            this.setVolume(0)
        } else {
            this.setVolume(this.previousVolume)
        }
    }

    seekTo(time) {
        this.audio.currentTime = time
    }
}

// ============================================
// 7. AudioPlayer.js - Application principale
// ============================================
class AudioPlayer {
    constructor(dom) {
        this.dom = dom
        this.playlistService = new PlaylistService()
        this.uiController = new UIController(dom)
        this.audioController = new AudioController(dom.currentSong, this.uiController)
        this.libraryController = new LibraryController(dom, this.playlistService, this.audioController, this.uiController)

        this.audioController.songChangeListener = (song) => {
            this.libraryController.onSongChange(song)
        }

        this.audioController.currentSongIdCallback = (songId) => {
            this.playlistService.currentPlayingSongId = songId
        }

        this.initVolume()
        this.initColor()
    }

    initVolume() {
        const initialVolume = 0.5
        this.audioController.setVolume(initialVolume)
    }

    initColor() {
        const initialColor = "#EDF2F7"
        this.dom.shuffleButton.style.fill = initialColor
        this.dom.repeatButton.style.stroke = initialColor
    }

    async init(playlistUrl, libraryUrl) {
        try {
            await this.playlistService.loadPlaylist(playlistUrl)
            await this.playlistService.loadLibrary(libraryUrl)
            this.libraryController.displayTracks(this.playlistService.libraryTracks)
            const firstSong = this.playlistService.getCurrentSong()
            this.audioController.loadSong(firstSong)
            this.setupEventListeners()
        } catch (error) {
            console.error("Erreur lors du chargement de la playlist:", error)
        }
    }

    setupEventListeners() {
        // Bouton play/pause
        this.dom.playButton.addEventListener("click", () => {
            this.audioController.togglePlay()
            this.uiController.toggleAlbumCoverAnimation()
        })

        // Bouton suivant
        this.dom.nextButton.addEventListener("click", () => {
            this.playNextSong()
        })

        // Bouton précédent
        this.dom.previousButton.addEventListener("click", () => {
            this.playPreviousSong()
        })

        // Bouton shuffle
        this.dom.shuffleButton.addEventListener("click", () => {
            this.toggleShuffleMode()
        })

        // Bouton repeat
        this.dom.repeatButton.addEventListener("click", () => {
            this.toggleRepeatMode()
        })

        // Bouton tracklist return
        this.dom.tracklistReturnButton.addEventListener("click", () => {
            this.libraryController.displayPlaylistChoice(this.playlistService.playlists)
        })

        // Événements audio
        this.dom.currentSong.addEventListener("loadedmetadata", () => {
            this.uiController.initProgressBar(this.dom.currentSong.duration)
        })

        this.dom.currentSong.addEventListener("timeupdate", () => {
            if (!this.dom.currentSong.paused) {
                this.uiController.updateProgressBar(
                    this.dom.currentSong.currentTime,
                    this.dom.currentSong.duration
                )
            }
        })

        this.dom.currentSong.addEventListener("ended", () => {
            this.playNextSong()
        })

        // Barre de progression
        this.dom.progressBar.addEventListener("input", (e) => {
            const value = Number(e.target.value)
            const duration = this.dom.progressBar.max
            this.audioController.seekTo(e.target.value)
            const percentage = (e.target.value / this.dom.progressBar.max) * 100
            this.dom.progressBar.style.setProperty('--slider-value', `${percentage}%`)
            this.uiController.updateProgressBar(value, duration)
        })

        // Contrôle du volume
        this.dom.volumeBar.addEventListener("input", (e) => {
            this.audioController.setVolume(parseFloat(e.target.value))
        })

        this.dom.volumeButton.addEventListener("click", () => {
            this.audioController.toggleMute()
        })

        // Sort current list
        this.dom.sortLibrary.addEventListener("click", () => {
            if (this.playlistService.playlistSelectionMode) {
                return
            }

            this.playlistService.revertSortMode = !this.playlistService.revertSortMode

            const sortedList = this.playlistService.refreshCurrentList()

            this.libraryController.displayTracks(
                sortedList,
                this.playlistService.libraryMode
            )

            console.log('Sort mode:', this.playlistService.revertSortMode ? 'Z-A' : 'A-Z')
        })
    }

    playCurrentSong() {
        const song = this.playlistService.getCurrentSong()
        this.audioController.loadSong(song)
        this.audioController.play()
        if (!this.dom.currentSongAlbumCover.classList.contains("active")) {
            this.uiController.toggleAlbumCoverAnimation()
        }
    }

    playNextSong() {
        const song = this.playlistService.nextSong()
        this.audioController.loadSong(song)
        this.audioController.play()
        if (!this.dom.currentSongAlbumCover.classList.contains("active")) {
            this.uiController.toggleAlbumCoverAnimation()
        }
    }

    playPreviousSong() {
        const song = this.playlistService.previousSong()
        this.audioController.loadSong(song)
        this.audioController.play()
        if (!this.dom.currentSongAlbumCover.classList.contains("active")) {
            this.uiController.toggleAlbumCoverAnimation()
        }
    }

    playRandomSong() {
        const currentIndex = this.playlistService.currentIndex
        const song = this.playlistService.getRandomSong(currentIndex)
        this.audioController.loadSong(song)
        this.audioController.play()
    }

    toggleShuffleMode() {
        const isShuffleActive = this.playlistService.toggleShuffleMode()
        this.uiController.updateShuffleButton(isShuffleActive)
    }

    toggleRepeatMode() {
        const isRepeatActive = this.playlistService.toggleRepeatMode()
        this.uiController.updateRepeatButton(isRepeatActive)
    }
}

// ============================================
// 8. Initialisation
// ============================================
const player = new AudioPlayer(DOM)
player.init("../../data/playlist.json", "../../data/library.json")