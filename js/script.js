/**
 * Java Developer Portfolio - Interactive Engine
 * Vanilla JavaScript (ES6+) - Zero External Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleBackground();
  initNavbar();
  initTypingEffect();
  initScrollReveal();
  initSkillTabs();
  initProjectFilters();
  initContactForm();
  initProjectModal();
  initBackToTop();
});

/* ==========================================================================
   1. Dynamic Background Particle Mesh
   ========================================================================== */
function initParticleBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 18000), 55);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 1.6 + 0.8;
      this.color = Math.random() > 0.4 ? 'rgba(99, 102, 241,' : 'rgba(6, 182, 212,';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + '0.7)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    // Update & draw particles
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

/* ==========================================================================
   2. Navbar Scroll Spy & Mobile Toggle
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelector('.nav-links');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const links = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    links.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on navigation link click
    links.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   3. Hero Dynamic Typing Effect
   ========================================================================== */
function initTypingEffect() {
  const typingElement = document.querySelector('.hero-typing');
  if (!typingElement) return;

  const titles = [
    'Backend Engineer',
    'Spring Boot Specialist',
    'Microservices Architect',
    'Distributed Systems Dev',
    'REST & GraphQL API Designer'
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      typingElement.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 45;
    } else {
      typingElement.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
      typeSpeed = 1800; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* ==========================================================================
   4. Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   5. Interactive Skill Tabs Filtering
   ========================================================================== */
function initSkillTabs() {
  const tabs = document.querySelectorAll('.skills-tabs .tab-btn');
  const cards = document.querySelectorAll('.skill-card');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      cards.forEach((card) => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   6. Project Category Filters
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-filters .filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.filter;

      projectCards.forEach((card) => {
        const cardCats = card.dataset.category ? card.dataset.category.split(' ') : [];
        if (category === 'all' || cardCats.includes(category)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   7. Interactive Project Architecture Modal
   ========================================================================== */
function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');
  const detailsBtns = document.querySelectorAll('.view-project-details');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalTech = document.getElementById('modal-tech');
  const modalMetrics = document.getElementById('modal-metrics');

  if (!modal || !closeBtn) return;

  const projectData = {
    'fintech-microservices': {
      title: 'High-Throughput Fintech Payment Gateway',
      desc: 'An enterprise microservices platform handling asynchronous transaction processing, idempotent payment execution, distributed tracing via Spring Cloud Sleuth & Zipkin, and resilience mechanisms using Resilience4j circuit breakers.',
      tech: ['Java 17', 'Spring Boot 3', 'Kafka', 'Redis Cluster', 'PostgreSQL', 'Docker', 'Kubernetes'],
      metrics: 'Processes 8,500+ TPS with sub-25ms P99 latency and 99.99% availability.'
    },
    'ecommerce-backend': {
      title: 'Distributed Multi-Tenant E-Commerce Platform',
      desc: 'Event-driven backend service architecture featuring dynamic tenant schema isolation with Spring Data JPA, Redis caching layer with cache-aside pattern, and Elasticsearch product discovery.',
      tech: ['Java 21', 'Spring Boot', 'Spring Security (JWT/OAuth2)', 'Elasticsearch', 'RabbitMQ', 'MySQL'],
      metrics: 'Scaled to 250,000+ daily active users with 40% reduction in database load.'
    },
    'iot-telemetry': {
      title: 'Real-Time IoT Telemetry Ingestion Hub',
      desc: 'Reactive streaming ingestion engine utilizing Spring WebFlux and Apache Kafka to ingest, aggregate, and persist millions of sensor event data packets per minute into time-series storage.',
      tech: ['Java 17', 'Spring WebFlux', 'Apache Kafka', 'MongoDB Time Series', 'Docker', 'Prometheus/Grafana'],
      metrics: 'Ingests over 12M telemetry events daily with zero data loss.'
    },
    'cloud-devops': {
      title: 'Automated CI/CD & Service Discovery Platform',
      desc: 'Production-ready cloud orchestration pipeline featuring automated Maven builds, Docker multi-stage image packaging, SonarQube static code quality gates, and Eureka service mesh registry.',
      tech: ['Spring Cloud Netflix Eureka', 'Docker', 'Maven', 'GitHub Actions', 'AWS ECS', 'SonarQube'],
      metrics: 'Reduced release cycle time from days to 12 minutes with automated zero-downtime rollouts.'
    }
  };

  detailsBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = btn.dataset.project;
      const data = projectData[projKey];

      if (data) {
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;
        modalMetrics.textContent = data.metrics;

        modalTech.innerHTML = '';
        data.tech.forEach((t) => {
          const pill = document.createElement('span');
          pill.className = 'project-tag';
          pill.textContent = t;
          modalTech.appendChild(pill);
        });

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

/* ==========================================================================
   8. Contact Form Client-Side Handling
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const statusBox = document.getElementById('form-status-msg');

  if (!form || !statusBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#sender-name').value.trim();
    const email = form.querySelector('#sender-email').value.trim();
    const subject = form.querySelector('#sender-subject').value.trim();
    const message = form.querySelector('#sender-message').value.trim();
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!name || !email || !message) {
      statusBox.className = 'form-status error';
      statusBox.textContent = 'Please fill out all required fields.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      statusBox.className = 'form-status error';
      statusBox.textContent = 'Please enter a valid email address.';
      return;
    }

    // Submit state animation
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending Message...</span>';

    setTimeout(() => {
      statusBox.className = 'form-status success';
      statusBox.textContent = `Thank you, ${name}! Your message has been sent successfully. I will get back to you shortly.`;
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      setTimeout(() => {
        statusBox.style.display = 'none';
        statusBox.className = 'form-status';
      }, 6000);
    }, 1000);
  });
}

/* ==========================================================================
   9. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backBtn = document.getElementById('back-to-top');
  if (!backBtn) return;

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
