//ELEMENT SELECTORS

$(".player").each(function () {
  var player = $(this).get(0);
  var video = player.querySelector(".customVideo");
  var playBtn = player.querySelector(".play-btn");
  var volumeBtn = player.querySelector(".volume-btn");
  var volumeSlider = player.querySelector(".volume-slider");
  var progressSlider = player.querySelector(".progress");
  var textCurrent = player.querySelector(".time-current");
  var fullscreenBtn = player.querySelector(".fullscreen");
  var controls = player.querySelector(".controls");

  //GLOBAL VARS
  let lastVolume = 1;
  let isMouseDown = false;
  // start video paused
  video.pause();

  //PLAYER FUNCTIONS
  function togglePlay() {
    controls.style.bottom = "-80px";
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    playBtn.classList.toggle("paused");
  }
  function togglePlayBtn() {
    playBtn.classList.toggle("playing");
  }

  function toggleMute() {
    if (video.volume) {
      lastVolume = video.volume;
      video.volume = 0;

      volumeBtn.classList.add("muted");
    } else {
      video.volume = lastVolume;
      volumeBtn.classList.remove("muted");
    }
  }
  function changeVolume(e) {
    if (e.type === "mousemove" && !isMouseDown) return;

    if (e.which === 1) {
      video.volume = volumeSlider.value / 100;
      return;
    }

    e.preventDefault();

    volumeBtn.classList.remove("muted");
    let volume = e.target.value / 100;
    volume < 0.1 ? (volume = 0) : (volume = volume);
    video.volume = volume;
    if (volume > 0.7) {
      volumeBtn.classList.add("loud");
    } else if (volume < 0.7 && volume > 0) {
      volumeBtn.classList.remove("loud");
    } else if (volume == 0) {
      volumeBtn.classList.add("muted");
    }
    lastVolume = volume;
  }
  function neatTime(time) {
    // var hours = Math.floor((time % 86400)/3600)
    var minutes = Math.floor((time % 3600) / 60);
    var seconds = Math.floor(time % 60);
    seconds = seconds > 9 ? seconds : `0${seconds}`;
    return `${minutes}:${seconds}`;
  }
  function updateProgress(e) {
    textCurrent.innerHTML = `${neatTime(video.currentTime)} / ${neatTime(
      video.duration
    )}`;
    if (isMouseDown) return;
    progressSlider.value = video.currentTime;

    // finish video edge case
    if (neatTime(progressSlider.value) == neatTime(video.duration)) {
      playBtn.classList.add("paused");
      return;
    }
  }
  let wasPaused = true;
  let firstCheck = true;
  function setProgress(e) {
    if (!isMouseDown && e.type === "mousemove") {
      return;
    }
    video.currentTime = progressSlider.value;
    if (!isMouseDown) {
      firstCheck = true;
      if (!wasPaused) {
        video.play();
      }
      return;
    }
    // pause while mousedown
    if (isMouseDown) {
      if (firstCheck) {
        wasPaused = video.paused;
      }
      firstCheck = false;
      video.pause();
    }
  }
  function launchIntoFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }
  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
  var fullscreen = false;
  function toggleFullscreen() {
    if (fullscreen) {
      exitFullscreen();
      video.classList.add("smallVideo");
      video.classList.remove("fullScreenVideo");
    } else {
      launchIntoFullscreen(player);
      video.classList.remove("smallVideo");
      video.classList.add("fullScreenVideo");
    }
    fullscreen = !fullscreen;
  }
  function setSpeed(e) {
    console.log(parseFloat(this.dataset.speed));
    video.playbackRate = this.dataset.speed;
    speedBtns.forEach((speedBtn) => speedBtn.classList.remove("active"));
    this.classList.add("active");
  }
  function handleKeypress(e) {
    switch (e.key) {
      case " ":
        togglePlay();
      case "ArrowRight":
        video.currentTime += 5;
      case "ArrowLeft":
        video.currentTime -= 5;
      default:
        return;
    }
  }

  function setVideoData() {
    if (video.readyState) {
      progressSlider.max = Math.round(video.duration);
      textCurrent.innerHTML = `0:00 / ${neatTime(video.duration)}`;
    }
  }
  // for chrome
  setVideoData();
  //EVENT LISTENERS
  video.addEventListener("loadeddata", setVideoData, false);
  playBtn.addEventListener("click", togglePlay);
  video.addEventListener("click", togglePlay);
  video.addEventListener("play", togglePlayBtn);
  video.addEventListener("pause", togglePlayBtn);
  video.addEventListener("ended", togglePlayBtn);
  video.addEventListener("timeupdate", updateProgress);
  video.addEventListener("canplay", updateProgress);
  volumeBtn.addEventListener("click", toggleMute);
  window.addEventListener("mousedown", () => (isMouseDown = true));
  window.addEventListener("mouseup", () => (isMouseDown = false));
  // volumeSlider.addEventListener('mouseover', changeVolume);

  volumeSlider.addEventListener("mousemove", changeVolume);
  volumeSlider.addEventListener("change", changeVolume);

  progressSlider.addEventListener("click", setProgress);
  progressSlider.addEventListener("change", setProgress);
  progressSlider.addEventListener("mousemove", setProgress);

  fullscreenBtn.addEventListener("click", toggleFullscreen);
  window.addEventListener("keydown", handleKeypress);
});
