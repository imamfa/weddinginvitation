document.addEventListener("DOMContentLoaded", function() {
  const playButton = document.getElementById("playMusic");
  if (playButton) {
    playButton.addEventListener("click", function() {
      document.getElementById("song")?.play();
    });
  }
});
