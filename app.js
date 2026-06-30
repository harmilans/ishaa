function setupParticles() {
  const canvas = document.querySelector("#particle-field");
  const ctx = canvas.getContext("2d");
  const particles = Array.from({ length: 62 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.8 + 0.45,
    vx: (Math.random() - 0.5) * 0.00055,
    vy: (Math.random() - 0.5) * 0.00055
  }));

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((particle) => {
      particle.x = (particle.x + particle.vx + 1) % 1;
      particle.y = (particle.y + particle.vy + 1) % 1;
      ctx.beginPath();
      ctx.arc(particle.x * window.innerWidth, particle.y * window.innerHeight, particle.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.42)";
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
}

function setupReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.16 });

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function setupMusic() {
  const song = document.querySelector("#bg-song");
  const toggle = document.querySelector("#music-toggle");
  const title = toggle.querySelector("strong");
  const subtitle = toggle.querySelector("small");

  function setPlaying() {
    toggle.classList.add("is-playing");
    toggle.setAttribute("aria-label", "Pause the soundtrack");
    title.textContent = "Pause soundtrack";
    subtitle.textContent = "Sweet Disposition";
  }

  function setPaused(label = "Play soundtrack", sublabel = "Sweet Disposition") {
    toggle.classList.remove("is-playing");
    toggle.setAttribute("aria-label", "Play the soundtrack");
    title.textContent = label;
    subtitle.textContent = sublabel;
  }

  async function playSong(showBlockedState = false) {
    try {
      song.volume = 0.72;
      await song.play();
      setPlaying();
      return true;
    } catch {
      if (showBlockedState) setPaused("Tap to start", "Browser paused autoplay");
      return false;
    }
  }

  async function toggleMusic() {
    if (song.paused) {
      try {
        await playSong();
      } catch {
        title.textContent = "Add song.mp3";
        subtitle.textContent = "assets/song.mp3";
      }
    } else {
      song.pause();
      setPaused();
    }
  }

  song.addEventListener("playing", setPlaying);
  song.addEventListener("pause", () => setPaused());
  song.addEventListener("ended", () => setPaused());
  song.addEventListener("error", () => {
    title.textContent = "Add song.mp3";
    subtitle.textContent = "assets/song.mp3";
  });
  toggle.addEventListener("click", toggleMusic);

  playSong(true);

  const retryAutoplay = () => {
    if (song.paused) playSong();
    window.removeEventListener("pointerdown", retryAutoplay);
    window.removeEventListener("keydown", retryAutoplay);
  };
  window.addEventListener("pointerdown", retryAutoplay, { once: true });
  window.addEventListener("keydown", retryAutoplay, { once: true });
}

setupParticles();
setupReveal();
setupMusic();
