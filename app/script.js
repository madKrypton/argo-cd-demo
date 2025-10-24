// Get DOM elements
const audioPlayer = document.getElementById('audioPlayer');
const songTitle = document.getElementById('songTitle');
const progressBar = document.getElementById('progress');
const albumArt = document.getElementById('albumArt');

// Function to play selected song
function playSong(songUrl, title, albumImage) {
    audioPlayer.src = songUrl;
    audioPlayer.play();
    songTitle.textContent = title;
    
    // Update album art if provided
    if (albumImage) {
        albumArt.src = albumImage;
    }
    
    // Add active animation
    const allSongItems = document.querySelectorAll('.song-item');
    allSongItems.forEach(item => {
        item.style.background = '#f8f9fa';
    });
    
    event.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
}

// Update progress bar
audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = progress + '%';
});

// Reset progress when song ends
audioPlayer.addEventListener('ended', () => {
    progressBar.style.width = '0%';
    songTitle.textContent = 'Select a song';
});

// Add playing state
audioPlayer.addEventListener('play', () => {
    console.log('Playing:', songTitle.textContent);
});

audioPlayer.addEventListener('pause', () => {
    console.log('Paused');
});

// Welcome message
console.log('🎵 Music Dashboard Loaded Successfully!');
console.log('Enjoy your music collection!');

// Smooth scroll for navigation (if you add navigation later)
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard ready!');
});
