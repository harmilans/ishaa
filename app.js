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

  async function toggleMusic() {
    if (song.paused) {
      try {
        await song.play();
        toggle.classList.add("is-playing");
        toggle.setAttribute("aria-label", "Pause the soundtrack");
        title.textContent = "Pause soundtrack";
        subtitle.textContent = "Sweet Disposition";
      } catch {
        title.textContent = "Add song.mp3";
        subtitle.textContent = "assets/song.mp3";
      }
    } else {
      song.pause();
      toggle.classList.remove("is-playing");
      toggle.setAttribute("aria-label", "Play the soundtrack");
      title.textContent = "Play her soundtrack";
      subtitle.textContent = "Sweet Disposition";
    }
  }

  song.addEventListener("ended", () => toggle.classList.remove("is-playing"));
  song.addEventListener("error", () => {
    title.textContent = "Add song.mp3";
    subtitle.textContent = "assets/song.mp3";
  });
  toggle.addEventListener("click", toggleMusic);
}

setupParticles();
setupReveal();
setupMusic();
