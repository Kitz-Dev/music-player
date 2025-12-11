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
    playlistButton1: document.getElementById("playlist-1"),
    playlistButton2: document.getElementById("playlist-2"),
    trackCard: document.getElementsByClassName("track-card")
}

// ============================================
// 2. PlaylistService.js - Gestion de la playlist
// ============================================
class PlaylistService {
    constructor() {
        this.playlist = []
        this.playlists = []
        this.currentIndex = 0
        this.shuffleMode = false  // Mode shuffle activé ou non
        this.playedIndexes = []   // Historique des pistes jouées en mode shuffle
        this.playlistIndex = 0
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

    async loadLibrary(libraryUrl) {
        const res = await fetch(libraryUrl)
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data = await res.json()
        this.library = data
        this.library = this.sortLibrary()
        return this.library
    }

    sortCurrentPlaylist() {
        return [...this.playlists[this.playlistIndex].songs].sort((a, b) =>
            a.title.localeCompare(b.title)
        )
    }

    sortLibrary() {
        return [...this.library].sort((a, b) =>
            a.title.localeCompare(b.title)
        )
    }

    switchPlaylist(id) {
        this.playlistIndex = id
        this.playlist = this.sortCurrentPlaylist()
    }

    getCurrentSong() {
        return this.playlist[this.currentIndex]
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

    nextSong() {
        if (this.shuffleMode) {
            return this.getRandomSong()
        } else if (this.repeatMode) {
            return this.getCurrentSong()
        } else {
            this.currentIndex = (this.currentIndex + 1) % this.playlist.length
            return this.getCurrentSong()
        }
    }

    previousSong() {
        if (this.shuffleMode) {
            // En mode shuffle, on revient à la piste précédente dans l'historique
            if (this.playedIndexes.length > 1) {
                this.playedIndexes.pop() // Retire la piste actuelle
                this.currentIndex = this.playedIndexes[this.playedIndexes.length - 1]
            }
            return this.getCurrentSong()
        } else {
            this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length
            return this.getCurrentSong()
        }
    }

    getRandomSong() {
        // Si toutes les pistes ont été jouées, on réinitialise
        if (this.playedIndexes.length >= this.playlist.length) {
            this.playedIndexes = [this.currentIndex]
        }

        let randomIndex
        let attempts = 0
        do {
            randomIndex = Math.floor(Math.random() * this.playlist.length)
            attempts++
            // Évite les boucles infinies
            if (attempts > 100) {
                randomIndex = (this.currentIndex + 1) % this.playlist.length
                break
            }
        } while (this.playedIndexes.includes(randomIndex) && this.playlist.length > 1)

        this.currentIndex = randomIndex
        this.playedIndexes.push(randomIndex)
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
    }

    createAndPlayLibrary() {
        this.library = this.playlistService.library
        const insertDiv = document.getElementById("library-tracks-container")
        const currentDiv = document.getElementById("track-1") // ??

        for (let i = 0; i < this.library.length; i++) {
            const track = this.library[i]
            const newDiv = document.createElement("div")
            const newImg = document.createElement("img")
            const newSpanContainer = document.createElement("div")
            const newSpan = document.createElement("span")
            const spanTitle = document.createTextNode(track.title)
            const spanSpacer = document.createTextNode(" - ")
            const spanAuthor = document.createTextNode(track.author)

            const newAnimSpanContainer = document.createElement("div")
            const newAnimSpan = document.createElement("span")
            const spanAnimTitle = document.createTextNode(track.title)
            const spanAnimSpacer = document.createTextNode(" - ")
            const spanAnimAuthor = document.createTextNode(track.author)

            newDiv.setAttribute("class", "track-card")
            newSpanContainer.setAttribute("class", "track-title-container")
            newImg.setAttribute("src", track.cover)
            newImg.setAttribute("aria-label", "Cover Image")
            newSpan.setAttribute("class", "track-title")

            newDiv.appendChild(newImg)
            newDiv.appendChild(newSpanContainer)
            newSpanContainer.appendChild(newSpan)
            newSpan.appendChild(spanTitle)
            newSpan.appendChild(spanSpacer)
            newSpan.appendChild(spanAuthor)

            newDiv.addEventListener("click", () => {
                this.audioController.loadSong(track)
                if (!this.dom.currentSongAlbumCover.classList.contains("active")) {
                    this.uiController.toggleAlbumCoverAnimation()
                }
                this.audioController.play()
            })

            // TODO : Library Listening List

            // TODO : Mouseover event
            const titleLength = newSpan.offsetWidth
            newDiv.addEventListener("mouseover", () => {
                // console.log("toto")
                console.log(newSpan.offsetWidth)

                if (newSpan.offsetWidth >= 150 && newAnimSpanContainer != null) {
                    console.log("toto")

                    newAnimSpanContainer.setAttribute("class", "track-title-container")
                    newAnimSpan.setAttribute("class", "track-title")
                    newAnimSpan.setAttribute("width", "auto")

                    newDiv.appendChild(newAnimSpanContainer)
                    newAnimSpanContainer.appendChild(newAnimSpan)
                    newAnimSpan.appendChild(spanAnimTitle)
                    newAnimSpan.appendChild(spanAnimSpacer)
                    newAnimSpan.appendChild(spanAnimAuthor)

                    newDiv.classList.add("active")
                }
            })

            newDiv.addEventListener("mouseleave", () => {
                newDiv.classList.remove("active")
            })

            insertDiv.insertBefore(newDiv, currentDiv)
        };
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
            this.libraryController.createAndPlayLibrary()
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

        // Bouton playlist 1
        this.dom.playlistButton1.addEventListener("click", () => {
            this.playlistService.switchPlaylist(0)
        })

        // Bouton playlist 2
        this.dom.playlistButton2.addEventListener("click", () => {
            this.playlistService.switchPlaylist(1)
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
            this.audioController.seekTo(e.target.value)
            const percentage = (e.target.value / this.dom.progressBar.max) * 100
            this.dom.progressBar.style.setProperty('--slider-value', `${percentage}%`)
        })

        // Contrôle du volume
        this.dom.volumeBar.addEventListener("input", (e) => {
            this.audioController.setVolume(parseFloat(e.target.value))
        })

        this.dom.volumeButton.addEventListener("click", () => {
            this.audioController.toggleMute()
        })
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