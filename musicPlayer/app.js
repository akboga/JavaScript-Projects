const container = document.querySelector(".container")
const image = document.querySelector("#music-image")
const title = document.querySelector("#music-details .title")
const singer = document.querySelector("#music-details .singer")
const prev = document.querySelector("#controls #prev")
const play = document.querySelector("#controls #play")
const next = document.querySelector("#controls #next")
const duration = document.querySelector("#duration")
const currentTime = document.querySelector("#current-time")
const progressBar = document.querySelector("#progress-bar")
const volume = document.querySelector("#volume")
const volumeBar = document.querySelector("#volume-bar")
const ul = document.querySelector("ul")

const player = new MusicPlayer(musicList)

window.addEventListener("load", () => {
    let music = player.getMusic()
    displayMusic(music)
    displayMusicList(player.musicList)
    isPlayingNow()
});

function displayMusic(music){
    title.innerText = music.getName();
    singer.innerText = music.singer;
    image.src = "img/" + music.img;
    audio.src = "mp3/" + music.file;
}

// PLAY and PAUSE Event
play.addEventListener("click", ()=>{
    const isMusicPlay = container.classList.contains("playing")
    isMusicPlay ? pauseMusic() : playMusic()
})

const pauseMusic = () => {
    container.classList.remove("playing")
    play.querySelector("i").classList = "fa-solid fa-play"
    audio.pause()
}

const playMusic = () => {
    container.classList.add("playing")
    play.querySelector("i").classList = "fa-solid fa-pause"
    audio.play()
}

// PREVIOUS and NEXT Event
prev.addEventListener("click", ()=> { prevMusic() })

const prevMusic = () => {
    player.prev()
    let music = player.getMusic()
    displayMusic(music)
    playMusic()
    isPlayingNow()
}

next.addEventListener("click", ()=>{nextMusic() })

const nextMusic = () => {
    player.next()
    let music = player.getMusic()
    displayMusic(music)
    playMusic()
    isPlayingNow()
}

// SÜRE BİLGİSİNİN AUDIO İLE BAĞLANMASI.
const calculateTime = (second) => {
    const minute = Math.floor(second / 60)
    const seconds = Math.floor(second % 60)
    const updatedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
    const sonuc = `${minute}:${updatedSeconds}`
    return sonuc
} 

audio.addEventListener("loadedmetadata", ()=>{
    duration.textContent = calculateTime(audio.duration)
    progressBar.max = Math.floor(audio.duration)
})

audio.addEventListener("timeupdate", ()=>{
    progressBar.value = Math.floor(audio.currentTime)
    currentTime.textContent = calculateTime(progressBar.value)
})

progressBar.addEventListener("input", ()=>{
    currentTime.textContent = calculateTime(progressBar.value)
    audio.currentTime = progressBar.value
})

// VOLUME CONTROL
let muteState = "unMute"

volumeBar.addEventListener("input", (e) => {
    const value = e.target.value
    audio.volume = value / 100          // Auido bar 0 ile 1 arasında değer alacağı için 100e böleriz.
    if(value == 0){
        audio.muted = true
        muteState = "mute"
        volume.classList = "fa-solid fa-volume-xmark"
    }else{
        audio.muted = false
        muteState = "unMute"
        volume.classList = "fa-solid fa-volume-high"
    }
})

volume.addEventListener("click", ()=>{
    if(muteState === "unMute"){
        audio.muted = true
        muteState = "mute"
        volume.classList = "fa-solid fa-volume-xmark"
        volumeBar.value = 0
    }else{
        audio.muted = false
        muteState = "unMute"
        volume.classList = "fa-solid fa-volume-high"
        volumeBar.value = 100
    }
})

// MÜZİK LİSTESİNİN DOLDURULMASI
const displayMusicList = (list) => {
    for(let i=0; i<list.length; i++ ){
        let liTag = `
        <li li-index='${i}' onClick="selectedMusic(this)" class="list-group-item d-flex justify-content-between align-items-center">
            <span>${list[i].getName()}</span>
            <span id="music-${i}" class="badge bg-primary rounded-pill"></span>
            <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
        </li>
        `
        ul.insertAdjacentHTML("beforeend", liTag)

        let liAudioDuration = ul.querySelector(`#music-${i}`)
        let liAudioTag = ul.querySelector(`.music-${i}`)
        
        liAudioTag.addEventListener("loadeddata", ()=>{
            liAudioDuration.innerText = calculateTime(liAudioTag.duration)
        })

        
    }
}

// LİSTEDEN SEÇİLEN MÜZİĞİN ÇALMASI
const selectedMusic = (li) => {
    player.index = li.getAttribute("li-index")
    displayMusic(player.getMusic())
    playMusic()
    isPlayingNow()
}

const isPlayingNow = () => {
    for(let li of ul.querySelectorAll("li")){
        if(li.classList.contains("playing")){
            li.classList.remove("playing")
        }
        if(li.getAttribute("li-index") == player.index){
            li.classList.add("playing")
        }
    }
}

// MÜZİK BİTİNCE DİĞER MÜZİĞE GEÇ
audio.addEventListener("ended", () => {
    nextMusic()
})