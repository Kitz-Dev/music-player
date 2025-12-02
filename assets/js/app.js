'use strict'

const currentSong = document.getElementById("current-song")
const playButton = document.getElementById("play-button")
currentSong.volume = 0.5

playButton.addEventListener("click", () => {
    if (!currentSong.paused) {
        currentSong.pause()
    } else {
        currentSong.play()
    }
})