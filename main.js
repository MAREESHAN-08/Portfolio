/**
 * MAREESWARAN PORTFOLIO - MAIN INTERACTIVE ENGINE
 * Modern Vanilla JS with Zero External Heavy Dependencies
 * Mobile-First Optimized
 */

document.addEventListener("DOMContentLoaded", () => {
  initParticleBackground();
  initTypingEffect();
  initThemeSwitcher();
  initProjectsFilterAndModal();
  initSkillsFilter();
  initNavbarAndScroll();
  initContactForm();
  initCustomCursor();
});

/* ==========================================================================
   1. INTERACTIVE PARTICLE CANVAS BACKGROUND
   ========================================================================== */
function initParticleBackground() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  // Reduce particle count on mobile for smooth battery-friendly 60fps performance
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 35 : Math.min(Math.floor(window.innerWidth / 18), 75);
  const mouse = { x: null, y: null, radius: 130 };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.baseRadius = this.radius;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      if (mouse.x != null && mouse.y != null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2.5;
          this.y -= (dy / dist) * force * 2.5;
          this.radius = this.baseRadius * 1.8;
        } else {
          this.radius = this.baseRadius;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#06b6d4";
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 105) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const opacity = (1 - dist / 105) * 0.22;
          ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. DYNAMIC ROTATING TYPING EFFECT
   ========================================================================== */
function initTypingEffect() {
  const typingElement = document.getElementById("typingText");
  if (!typingElement) return;

  const roles = [
    "Software Engineer",
    "Python & SQL Specialist",
    "Data Analyst (Excel & Tableau)",
    "Java & Flutter Developer",
    "Creative Canva Designer"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 45;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 95;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingDelay = 1800; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingDelay = 450; // Pause before new word
    }

    setTimeout(type, typingDelay);
  }

  type();
}

/* ==========================================================================
   3. THEME SWITCHER (CYAN, PURPLE, EMERALD, SUNSET)
   ========================================================================== */
function initThemeSwitcher() {
  const themeBtn = document.getElementById("themeSwitchBtn");
  const themes = ["cyan", "purple", "emerald", "sunset"];
  const currentTheme = localStorage.getItem("selected_theme") || "cyan";

  applyTheme(currentTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const activeTheme = document.documentElement.getAttribute("data-theme") || "cyan";
      const nextIndex = (themes.indexOf(activeTheme) + 1) % themes.length;
      const nextTheme = themes[nextIndex];
      applyTheme(nextTheme);
      localStorage.setItem("selected_theme", nextTheme);
    });
  }

  function applyTheme(theme) {
    if (theme === "cyan") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }
}

/* ==========================================================================
   4. PROJECTS FILTER & MODAL ENGINE
   ========================================================================== */
function initProjectsFilterAndModal() {
  const filterBtns = document.querySelectorAll(".project-filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.style.display = "flex";
          card.style.animation = "fadeInUp 0.4s ease both";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Modal Setup
  const modal = document.getElementById("projectModal");
  const modalClose = document.getElementById("modalCloseBtn");
  const modalTitle = document.getElementById("modalTitle");
  const modalImg = document.getElementById("modalImg");
  const modalDesc = document.getElementById("modalDesc");
  const modalFeatures = document.getElementById("modalFeatures");
  const modalTech = document.getElementById("modalTech");
  const modalGithub = document.getElementById("modalGithub");
  const modalLive = document.getElementById("modalLive");

  const projectDetails = {
    1: {
      title: "3D Human Pose Estimation & Predictive Fitness Analysis",
      img: "IMG-20250912-WA0027-removebg-preview.png",
      desc: "An AI-powered fitness coaching system that leverages 3D human pose estimation to track body movements in real time. It analyses exercise form, counts repetitions, and delivers predictive performance insights to help users train smarter and safer.",
      features: [
        "Real-time 3D pose landmark detection using MediaPipe",
        "Automated rep counter with exercise form accuracy scoring",
        "Predictive fitness performance analytics",
        "OpenCV video feed integration with overlay visualisation"
      ],
      tech: ["Python", "MediaPipe", "OpenCV", "Machine Learning", "Pose Estimation"],
      github: "https://github.com/MAREESHAN-08/Fitnesss_cocach",
      live: "#"
    },
    2: {
      title: "Malcolm Lismore Photography Website",
      img: "IMG-20250912-WA0027-removebg-preview.png",
      desc: "A fully responsive, visually immersive photography portfolio website built for a Scottish landscape, wedding, and wildlife photographer. Showcases stunning gallery layouts, smooth page transitions, and clean modern design.",
      features: [
        "Responsive masonry photo gallery with lightbox viewer",
        "Smooth scroll and animated navigation transitions",
        "Mobile-first fully responsive layout",
        "Contact form and social integration"
      ],
      tech: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "GitHub Pages"],
      github: "https://github.com/MAREESHAN-08",
      live: "https://mareeshan-08.github.io/Photography-Website/"
    },
    3: {
      title: "iCommunity – Community Sports Facilities Booking System",
      img: "IMG-20250912-WA0027-removebg-preview.png",
      desc: "A full-featured sports facility booking management system for community centres. Enables users to browse, search, and reserve sports venues, while admins manage bookings, facilities, and member records with ease.",
      features: [
        "User registration, login, and role-based access control",
        "Real-time facility availability calendar and slot booking",
        "Admin dashboard for venue and member management",
        "SQL-backed relational database with JDBC connectivity"
      ],
      tech: ["Java", "SQL", "JDBC", "OOP", "Swing UI"],
      github: "https://github.com/MAREESHAN-08/Community-Sports-Facilities-Booking-System",
      live: "#"
    }
  };

  document.querySelectorAll(".btn-project-details").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const data = projectDetails[id];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalImg.src = data.img;
      modalDesc.textContent = data.desc;

      modalFeatures.innerHTML = data.features.map((f) => `<li><i class="fa-solid fa-check" style="color:var(--primary); margin-right:8px;"></i>${f}</li>`).join("");
      modalTech.innerHTML = data.tech.map((t) => `<span class="project-tag-pill">${t}</span>`).join("");
      modalGithub.href = data.github;
      modalLive.href = data.live;

      modal.classList.add("open");
    });
  });

  if (modalClose) {
    modalClose.addEventListener("click", () => modal.classList.remove("open"));
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) {
      modal.classList.remove("open");
    }
  });
}

/* ==========================================================================
   5. SKILLS FILTERING & ANIMATED PROGRESS BARS
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll(".skills-filter-btn");
  const skillCards = document.querySelectorAll(".skill-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      skillCards.forEach((card) => {
        const cat = card.getAttribute("data-category") || "";
        const categories = cat.split(" ");
        if (filter === "all" || categories.includes(filter)) {
          card.style.display = "block";
          card.style.animation = "fadeInUp 0.35s ease both";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Trigger skill bars on viewport entry
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target.querySelector(".skill-bar-inner");
          if (bar) {
            const pct = bar.getAttribute("data-pct") || "80%";
            bar.style.width = pct;
          }
        }
      });
    },
    { threshold: 0.15 }
  );

  skillCards.forEach((card) => observer.observe(card));
}

/* ==========================================================================
   6. NAVBAR, MOBILE DRAWER, & SCROLL SPY
   ========================================================================== */
function initNavbarAndScroll() {
  const header = document.querySelector("header");
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const progressBar = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTopBtn");
  const navLinks = document.querySelectorAll("nav a");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      navMenu.classList.toggle("active");
    });

    // Close mobile menu when any link is tapped
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
      });
    });

    // Close mobile menu when tapping outside
    document.addEventListener("click", (e) => {
      if (navMenu.classList.contains("active") && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Header styling on scroll
    if (scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Scroll progress bar
    if (progressBar && docHeight > 0) {
      const pct = (scrollY / docHeight) * 100;
      progressBar.style.width = pct + "%";
    }

    // Back to top button visibility
    if (backToTop) {
      if (scrollY > 350) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    }

    // Scroll Spy for nav links
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((sec) => {
      const top = sec.offsetTop - 110;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/* ==========================================================================
   7. CONTACT FORM & ONE-CLICK COPY
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const alertBox = document.getElementById("formAlert");
  const copyBtn = document.getElementById("copyEmailBtn");

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const email = "eshanmareeshaneswaran@gmail.com";
      navigator.clipboard.writeText(email).then(() => {
        copyBtn.textContent = "Copied!";
        copyBtn.style.color = "#10b981";
        setTimeout(() => {
          copyBtn.textContent = "Copy";
          copyBtn.style.color = "";
        }, 2000);
      });
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("contactName").value.trim();
      const email = document.getElementById("contactEmail").value.trim();
      const subject = document.getElementById("contactSubject").value.trim();
      const message = document.getElementById("contactMessage").value.trim();

      if (!name || !email || !message) {
        alert("Please fill in all required fields.");
        return;
      }

      // Display immediate success alert & trigger confetti
      if (alertBox) {
        alertBox.className = "form-alert success";
        alertBox.innerHTML = `<strong>Thank you, ${name}!</strong> Your message is ready. Opening your email app to send...`;
      }

      triggerConfetti();

      // Launch mailto link with pre-filled content
      const mailtoLink = `mailto:eshanmareeshaneswaran@gmail.com?subject=${encodeURIComponent(subject || "Portfolio Inquiry from " + name)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message)}`;

      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 900);

      form.reset();
    });
  }
}

/* ==========================================================================
   8. CUSTOM MOUSE CURSOR (DESKTOP ONLY)
   ========================================================================== */
function initCustomCursor() {
  if (window.innerWidth < 992 || window.matchMedia("(hover: none)").matches) return;

  const dot = document.createElement("div");
  const ring = document.createElement("div");
  dot.className = "custom-cursor-dot";
  ring.className = "custom-cursor-ring";
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(renderRing);
  }
  renderRing();

  document.querySelectorAll("a, button, input, textarea, .skill-card, .project-card").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      ring.style.transform = "translate(-50%, -50%) scale(1.6)";
      ring.style.borderColor = "#ffffff";
    });
    el.addEventListener("mouseleave", () => {
      ring.style.transform = "translate(-50%, -50%) scale(1)";
      ring.style.borderColor = "";
    });
  });
}

/* ==========================================================================
   9. LIGHTWEIGHT NATIVE CONFETTI
   ========================================================================== */
function triggerConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = "99999";
  canvas.style.pointerEvents = "none";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ["#06b6d4", "#3b82f6", "#ec4899", "#f59e0b", "#10b981", "#a855f7"];

  for (let i = 0; i < 80; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.7) * 17,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10
    });
  }

  let frames = 0;
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frames++;

    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.rotation += p.vRot;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (frames < 110) {
      requestAnimationFrame(update);
    } else {
      canvas.remove();
    }
  }
  update();
}
