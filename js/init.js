document.addEventListener("DOMContentLoaded", function() {
  const playButton = document.getElementById("playMusic");
  if (playButton) {
    playButton.addEventListener("click", function() {
      document.getElementById("song")?.play();
    });
  }
});

document.addEventListener("DOMContentLoaded", function() {
  if (typeof Eg === 'function') {
    new Eg('.e-gallery', {
      // opsi default, misal:
      thumbnail: true,
      lightbox: true
    });
  }
});

