'use strict'
const currentSong = document.getElementById("current-song")
const playButton = document.getElementById("play-button")
const playTooltip = document.getElementById("play-tooltip")
const nextButton = document.getElementById("next-button")
const previousButton = document.getElementById("previous-button")

currentSong.volume = 0.5

let sortedAlphabetically = []
let currentIndex = 0

const playSong = async () => {
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
        console.log(sortedAlphabetically)

        currentSong.src = sortedAlphabetically[0].url

        playButton.addEventListener("click", () => {
            if (!currentSong.paused) {
                currentSong.pause()
                playTooltip.textContent = "Play"
                document.getElementById("play-button-img").setAttribute("href", "./img/sprite.svg#play-button")
            } else {
                currentSong.play()
                playTooltip.textContent = "Pause"
                document.getElementById("play-button-img").setAttribute("href", "./img/sprite.svg#pause-button")
            }
        })

        nextButton.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % sortedAlphabetically.length
            currentSong.src = sortedAlphabetically[currentIndex].url
            currentSong.play()
            playTooltip.textContent = "Pause"
            document.getElementById("play-button-img").setAttribute("href", "./img/sprite.svg#pause-button")
        })

        previousButton.addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + sortedAlphabetically.length) % sortedAlphabetically.length
            currentSong.src = sortedAlphabetically[currentIndex].url
            currentSong.play()
            playTooltip.textContent = "Pause"
            document.getElementById("play-button-img").setAttribute("href", "./img/sprite.svg#pause-button")
        })
    } catch (error) {
        console.log(error)
    }
}

playSong()



