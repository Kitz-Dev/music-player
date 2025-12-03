'use strict'
const currentSong = document.getElementById("current-song")
const currentSongTitle = document.getElementById("song-title")
const currentSongAuthor = document.getElementById("song-author")
const currentSongCountUp = document.getElementById("song-countup")
const currentSongCountDown = document.getElementById("song-countdown")
const currentSongAlbumCover = document.getElementById("album-cover")
const playButton = document.getElementById("play-button")
const playTooltip = document.getElementById("play-tooltip")
const nextButton = document.getElementById("next-button")
const previousButton = document.getElementById("previous-button")
const progressBar = document.getElementById("progress-bar")
const volumeBar = document.getElementById("volume-bar")
const initialVolumePercentage = (volumeBar.value / volumeBar.max) * 100

volumeBar.style.setProperty('--slider-value', `${initialVolumePercentage}%`)
currentSong.volume = 0.5
volumeBar.value = 0.5

let sortedAlphabetically = []
let currentIndex = 0

const audioPlayer = async () => {
    try {
        const res = await fetch("../../data/playlist.json")

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()
        const playlist2 = data[1].songs

        sortedAlphabetically = [...playlist2].sort((a, b) => {
            if (a.title < b.title) {
                return -1
            }
            if (a.title > b.title) {
                return 1
            }
            return 0
        })

        currentSong.src = sortedAlphabetically[0].url
        currentSongTitle.textContent = sortedAlphabetically[currentIndex].title
        currentSongAuthor.textContent = sortedAlphabetically[currentIndex].author

        playButton.addEventListener("click", () => {
            if (!currentSong.paused) {
                currentSong.pause()
                playTooltip.textContent = "Play"
                document.getElementById("play-button-img").setAttribute("href", "./img/sprite.svg#play-button")
                currentSongAlbumCover.classList.toggle("active")
            } else {
                currentSong.play()
                playTooltip.textContent = "Pause"
                document.getElementById("play-button-img").setAttribute("href", "./img/sprite.svg#pause-button")
                currentSongAlbumCover.src = sortedAlphabetically[currentIndex].cover
                currentSongAlbumCover.classList.toggle("active")
            }
        })

        nextButton.addEventListener("click", () => {
            if (currentSong.paused) {
                currentSongAlbumCover.classList.toggle("active")
                playTooltip.textContent = "Pause"
                document.getElementById("play-button-img").setAttribute("href", "./img/sprite.svg#pause-button")
            }
            currentIndex = (currentIndex + 1) % sortedAlphabetically.length
            currentSong.src = sortedAlphabetically[currentIndex].url
            currentSongTitle.textContent = sortedAlphabetically[currentIndex].title
            currentSongAuthor.textContent = sortedAlphabetically[currentIndex].author
            currentSongAlbumCover.src = sortedAlphabetically[currentIndex].cover
            currentSong.play()
            playTooltip.textContent = "Pause"
            document.getElementById("play-button-img").setAttribute("href", "./img/sprite.svg#pause-button")
        })

        previousButton.addEventListener("click", () => {
            if (currentSong.paused) {
                currentSongAlbumCover.classList.toggle("active")
                playTooltip.textContent = "Pause"
                document.getElementById("play-button-img").setAttribute("href", "./img/sprite.svg#pause-button")
            }
            currentIndex = (currentIndex - 1 + sortedAlphabetically.length) % sortedAlphabetically.length
            currentSong.src = sortedAlphabetically[currentIndex].url
            currentSongTitle.textContent = sortedAlphabetically[currentIndex].title
            currentSongAuthor.textContent = sortedAlphabetically[currentIndex].author
            currentSongAlbumCover.src = sortedAlphabetically[currentIndex].cover
            currentSong.play()
            playTooltip.textContent = "Pause"
            document.getElementById("play-button-img").setAttribute("href", "./img/sprite.svg#pause-button")
        })


        currentSong.addEventListener("loadedmetadata", () => {
            progressBar.max = Math.floor(currentSong.duration)
            progressBar.value = currentSong.currentTime
        })

        currentSong.addEventListener("timeupdate", () => {
            if (!currentSong.paused) {
                progressBar.value = Math.floor(currentSong.currentTime)
                const percentage = (currentSong.currentTime / currentSong.duration) * 100
                progressBar.style.setProperty('--slider-value', `${percentage}%`)
                progressBar.value = Math.floor(currentSong.currentTime)
                let s = Math.floor(currentSong.currentTime % 60)
                let m = Math.floor(currentSong.currentTime / 60)
                let sDisplay = s > 0 ? (s < 10 ? "0" + s : s) : "00"
                currentSongCountUp.textContent = (m + ":" + sDisplay)
                currentSongCountDown.textContent = Math.floor(currentSong.duration / 60) + ":" + Math.floor(currentSong.duration % 60)
            }
        })

        currentSong.addEventListener("ended", () => {
            currentIndex = (currentIndex + 1) % sortedAlphabetically.length
            currentSong.src = sortedAlphabetically[currentIndex].url
            currentSongAlbumCover.src = sortedAlphabetically[currentIndex].cover
            currentSongTitle.textContent = sortedAlphabetically[currentIndex].title
            currentSongAuthor.textContent = sortedAlphabetically[currentIndex].author
            currentSong.play()
        })

        progressBar.addEventListener("input", () => {
            currentSong.currentTime = progressBar.value
            const percentage = (progressBar.value / progressBar.max) * 100
            progressBar.style.setProperty('--slider-value', `${percentage}%`)
            currentSong.currentTime = progressBar.value
        })

        volumeBar.addEventListener("input", () => {
            const percentage = (volumeBar.value / volumeBar.max) * 100
            volumeBar.style.setProperty('--slider-value', `${percentage}%`)
            currentSong.volume = volumeBar.value
        })

    } catch (error) {
        console.log(error)
    }
}

audioPlayer()