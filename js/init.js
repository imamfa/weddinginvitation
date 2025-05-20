<script>
  document.addEventListener("DOMContentLoaded", function() {
    const playButton = document.getElementById("playMusic");
    playButton.addEventListener("click", () => {
      document.getElementById("bgm").play();
    });
  });
</script>
