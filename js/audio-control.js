                    jQuery(document).ready(function($) {
                      var startSeconds = '';
                      var endSeconds = 9999;
                      var e = window.settingAutoplay;
                      var startTime = startSeconds; // detik mulai
                      var endTime = endSeconds; // detik berhenti
                      var audio = document.getElementById("song");
                      var isPlaying = false;
                      var endTimeInterval;
                      if (e) {
                        $("#mute-sound").show();
                        if (audio) {
                          audio.currentTime = startTime;
                        }
                      } else {
                        $("#unmute-sound").show();
                      }
                      $("#audio-container").click(function() {
                        if (e) {
                          $("#mute-sound").show();
                          $("#unmute-sound").hide();
                          pauseAudio();
                          e = false;
                        } else {
                          $("#unmute-sound").show();
                          $("#mute-sound").hide();
                          playAudio();
                          e = true;
                        }
                      });

                      function playAudio() {
                        if (audio) {
                          audio.currentTime = startTime;
                          audio.play();
                          isPlaying = true;
                          monitorEndTime();
                        }
                      }

                      function pauseAudio() {
                        if (audio) {
                          audio.pause();
                          isPlaying = false;
                          clearInterval(endTimeInterval);
                        }
                      }

                      function monitorEndTime() {
                        clearInterval(endTimeInterval);
                        endTimeInterval = setInterval(function() {
                          if (audio && audio.currentTime >= endTime) {
                            audio.pause();
                            isPlaying = false;
                            clearInterval(endTimeInterval);
                          }
                        }, 200); // periksa setiap 200ms
                      }
                    });


                    // Ambil elemen audio dengan ID "song"
                    const audioElement = document.getElementById("song");
                    // Event listener untuk visibility change
                    document.addEventListener("visibilitychange", () => {
                      if (document.visibilityState === "hidden") {
                        // Pause audio jika tab berpindah
                        if (audioElement && !audioElement.paused) {
                          audioElement.pause();
                        }
                        // Pause video YouTube jika tab berpindah
                        if (typeof player !== "undefined" && player.getPlayerState) {
                          if (player.getPlayerState() === YT.PlayerState.PLAYING || player.getPlayerState() === YT.PlayerState.BUFFERING) {
                            player.pauseVideo();
                          }
                        }
                      } else if (document.visibilityState === "visible") {
                        // Play audio jika tab kembali aktif
                        if (audioElement && audioElement.paused) {
                          audioElement.play().catch((err) => {
                            console.log("Error saat mencoba memutar audio:", err);
                          });
                        }
                        // Play video YouTube jika tab kembali aktif
                        if (typeof player !== "undefined" && player.getPlayerState) {
                          if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
                            player.playVideo();
                          }
                        }
                      }
                    });
                   
