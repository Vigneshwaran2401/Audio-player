// Get references to the HTML elements
const audioPlayer = new Audio();
const playPauseBtn = document.getElementById("playPauseBtn");
const songTitle = document.getElementById("songTitle");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const progressBar = document.querySelector(".progress-bar");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const songList = document.getElementById("songList");

let songs = []; // Array to store the uploaded songs
let currentSongIndex = 0; // Index of the currently playing song

// Function to initialize the audio player with the current song
function initializePlayer() {
  const currentSong = songs[currentSongIndex];
  audioPlayer.src = currentSong.file;
  audioPlayer.addEventListener("loadedmetadata", () => {
    totalTime.textContent = formatTime(audioPlayer.duration);
  });
  songTitle.textContent = currentSong.name;
}

// Function to format time in mm:ss format
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Function to toggle between play and pause states
function togglePlayPause() {
  if (audioPlayer.paused) {
    playAudio();
  } else {
    pauseAudio();
  }
}

// Function to play the audio
function playAudio() {
  audioPlayer.play();
  playPauseBtn.classList.remove("fa-play");
  playPauseBtn.classList.add("fa-pause");
}

// Function to pause the audio
function pauseAudio() {
  audioPlayer.pause();
  playPauseBtn.classList.remove("fa-pause");
  playPauseBtn.classList.add("fa-play");
}

// Event listener for play/pause button click
playPauseBtn.addEventListener("click", togglePlayPause);

// Function to update the progress bar
function updateProgressBar() {
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressBar.style.width = `${progress}%`;
  currentTime.textContent = formatTime(audioPlayer.currentTime);
}

// Event listener for time update to update the progress bar
audioPlayer.addEventListener("timeupdate", updateProgressBar);

// Event listener for file input change to handle song uploads
document.getElementById("songInput").addEventListener("change", (event) => {
  const files = event.target.files;
  songs = Array.from(files).map((file) => ({
    name: file.name,
    file: URL.createObjectURL(file),
    duration: 0, // You can calculate the duration using an audio library
  }));
  currentSongIndex = 0;
  initializePlayer();
  playAudio();
  renderSongList();
});

// Function to render the song list
function renderSongList() {
  songList.innerHTML = '';

  songs.forEach((song, index) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = song.name;
    a.setAttribute('data-index', index);
    li.appendChild(a);
    songList.appendChild(li);
  });
}

// Function to play a song
function playSong(index) {
  if (index >= 0 && index < songs.length) {
    currentSongIndex = index;
    initializePlayer();
    playAudio();
    updateActiveSong();
  }
}

  // Function to update the active song in the song list
  function updateActiveSong() {
    const songLinks = document.querySelectorAll('#songList a');
    songLinks.forEach((link) => {
      link.classList.remove('active');
    });
    songLinks[currentSongIndex].classList.add('active');
  }

  // Function to play the previous song
  function playPreviousSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
      currentSongIndex = songs.length - 1;
    }
    initializePlayer();
    playAudio();
    updateActiveSong();
  }

  // Function to play the next song
  function playNextSong() {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
      currentSongIndex = 0;
    }
    initializePlayer();
    playAudio();
    updateActiveSong();
  }

  // Event listener for previous button click
  previousBtn.addEventListener("click", playPreviousSong);

  // Event listener for next button click
  nextBtn.addEventListener("click", playNextSong);

  // Load songs from local storage
  const storedSongs = localStorage.getItem("songs");
  if (storedSongs) {
    songs = JSON.parse(storedSongs);
    renderSongList();
  }

  // Event listener for song list item click
  songList.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      const index = parseInt(event.target.getAttribute('data-index'));
      playSong(index);
    }
  });

  // Function to update the logo rotation
  function updateLogoRotation() {
    const logo = document.getElementById("logo");
    const rotation = (audioPlayer.currentTime / audioPlayer.duration) * 360;
    logo.style.transform = `rotate(${rotation}deg)`;
  }

  // Event listener for time update to update the progress bar, logo rotation, and check for song end
  audioPlayer.addEventListener("timeupdate", () => {
    updateProgressBar();
    updateLogoRotation();
    if (audioPlayer.currentTime === audioPlayer.duration) {
      playNextSong();
    }
  });

  // Function to update the progress bar and current time
  function updateProgress() {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTime.textContent = formatTime(audioPlayer.currentTime);
  }

  // Event listener for time update to update the progress bar and current time
  audioPlayer.addEventListener("timeupdate", updateProgress);

  // Event listener for audio player events
  audioPlayer.addEventListener("ended", () => {
    playNextSong();
  });

  // Initialize the song list
  renderSongList();
