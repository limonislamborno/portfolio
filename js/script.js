document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initParticleBackground();
  initNavbar();
  initTypingEffect();
  initScrollReveal();
  initSkillTabs();
  initProjectFilters();
  initContactForm();
  initProjectModal();
  initBackToTop();
  initCard3DTilt();
  initStatCounters();
  initSkillBarAnimation();
});

function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('portfolio-theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateToggleIcon(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateToggleIcon(newTheme);
  });

  function updateToggleIcon(theme) {
    const sunIcon = toggleBtn.querySelector('.icon-sun');
    const moonIcon = toggleBtn.querySelector('.icon-moon');
    if (sunIcon && moonIcon) {
      if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      }
    }
  }
}

function initParticleBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 20000), 45);

  const mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.baseX = this.x;
      this.baseY = this.y;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 1.6 + 0.8;
      this.density = Math.random() * 20 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = (dx / distance) * force * 3;
          const directionY = (dy / distance) * force * 3;
          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }

    draw(isDark) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(129, 140, 248, 0.65)' : 'rgba(79, 70, 229, 0.45)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = (1 - dist / 120) * (isDark ? 0.16 : 0.08);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = isDark ? `rgba(165, 180, 252, ${alpha})` : `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    if (mouse.x !== null && mouse.y !== null) {
      for (let i = 0; i < particles.length; i++) {
        const dx = mouse.x - particles[i].x;
        const dy = mouse.y - particles[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const alpha = (1 - dist / mouse.radius) * (isDark ? 0.22 : 0.12);
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(particles[i].x, particles[i].y);
          ctx.strokeStyle = isDark ? `rgba(99, 102, 241, ${alpha})` : `rgba(79, 70, 229, ${alpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw(isDark);
    });

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelector('.nav-links');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const links = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
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

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    links.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}

function initTypingEffect() {
  const typingElement = document.querySelector('.hero-typing');
  if (!typingElement) return;

  const titles = [
    'Java Developer',
    'Flutter App Developer',
    'Spring Boot Specialist',
    'Microservices & Docker Engineer',
    'SQL Optimization Expert',
    'Full-Stack & Mobile Dev'
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 90;

  function type() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      typingElement.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 35;
    } else {
      typingElement.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 75;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
      typeSpeed = 1600;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typeSpeed = 300;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

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
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px'
    }
  );

  reveals.forEach((el) => observer.observe(el));
}

function initSkillTabs() {
  const tabs = document.querySelectorAll('.skills-tabs .tab-btn');
  const cards = document.querySelectorAll('.skill-card');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      cards.forEach((card) => {
        const cats = card.dataset.category ? card.dataset.category.split(' ') : [];
        if (filter === 'all' || cats.includes(filter)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(6px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 180);
        }
      });
    });
  });
}

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
          }, 15);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 180);
        }
      });
    });
  });
}

function initCard3DTilt() {
  const tiltElements = document.querySelectorAll('.project-card, .skill-card, .highlight-box, .hero-portrait-frame');

  tiltElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      el.style.setProperty('--mouse-x', `${x}px`);
      el.style.setProperty('--mouse-y', `${y}px`);

      if (window.innerWidth > 992 && !el.classList.contains('no-tilt')) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5.5;
        const rotateY = ((x - centerX) / centerX) * 5.5;

        el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      }
    });

    el.addEventListener('mouseleave', () => {
      if (window.innerWidth > 992 && !el.classList.contains('no-tilt')) {
        el.style.transform = '';
      }
    });
  });
}

function initStatCounters() {
  const highlightBoxes = document.querySelectorAll('.highlight-box');
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const numEl = entry.target.querySelector('.highlight-number');
        if (numEl && !numEl.dataset.animated) {
          numEl.dataset.animated = 'true';
          animateValue(numEl);
        }
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  highlightBoxes.forEach((box) => observer.observe(box));

  function animateValue(el) {
    const text = el.textContent.trim();
    if (text.includes('2.5+')) {
      let current = 0;
      const timer = setInterval(() => {
        current += 0.1;
        if (current >= 2.5) {
          el.textContent = '2.5+ Years';
          clearInterval(timer);
        } else {
          el.textContent = current.toFixed(1) + '+ Years';
        }
      }, 40);
    } else if (text.includes('15%')) {
      let current = 0;
      const timer = setInterval(() => {
        current += 1;
        if (current >= 15) {
          el.textContent = '~15%';
          clearInterval(timer);
        } else {
          el.textContent = '~' + current + '%';
        }
      }, 50);
    } else if (text.includes('99.9%')) {
      let current = 90.0;
      const timer = setInterval(() => {
        current += 0.5;
        if (current >= 99.9) {
          el.textContent = '99.9%';
          clearInterval(timer);
        } else {
          el.textContent = current.toFixed(1) + '%';
        }
      }, 35);
    }
  }
}

function initSkillBarAnimation() {
  const skillCards = document.querySelectorAll('.skill-card');
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-progress-fill');
        if (fill) {
          const targetWidth = fill.style.width || fill.getAttribute('data-width') || '85%';
          fill.style.width = '0%';
          setTimeout(() => {
            fill.style.width = targetWidth;
          }, 80);
        }
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  skillCards.forEach((card) => observer.observe(card));
}

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');
  const detailsBtns = document.querySelectorAll('.view-project-details');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalTech = document.getElementById('modal-tech');
  const modalMetrics = document.getElementById('modal-metrics');
  const modalLink = document.getElementById('modal-repo-link');

  if (!modal || !closeBtn) return;

  const projectData = {
    'microservices-pipeline': {
      title: 'Dockerized Microservices & Event Pipeline',
      desc: 'Distributed event-driven architecture featuring containerized Spring Boot microservices, Spring Cloud API Gateway, Apache Kafka event streaming, and PostgreSQL persistence. Orchestrated using Docker Compose with health checks and Eureka service discovery.',
      tech: ['Java 17', 'Spring Boot 3', 'Spring Cloud Gateway', 'Apache Kafka', 'Docker & Compose', 'PostgreSQL', 'Eureka'],
      metrics: 'Containerized deployment with sub-30ms inter-service latency and zero lost events under load.',
      url: 'https://github.com/limonislamborno'
    },
    'biznest': {
      title: 'BizNest Enterprise Management Platform',
      desc: 'An enterprise-grade business management and financial application built with Java, Spring Boot, Angular, and Oracle Database. Features complex SQL optimization, stored procedures, Hibernate persistence, Jasper Reports, and secure RESTful APIs.',
      tech: ['Java', 'Spring Boot', 'Angular', 'Tomcat', 'Hibernate', 'Oracle Database', 'jQuery', 'Bootstrap'],
      metrics: 'Achieved ~15% system performance boost via stored procedure tuning and SQL query indexing.',
      url: 'https://github.com/limonislamborno/BizNest'
    },
    'banking-system': {
      title: 'Dockerized Banking Management System',
      desc: 'Secure enterprise banking portal engineered with Spring Boot REST APIs and an Angular client, fully containerized with Docker. Manages customer account opening, transaction audit logging, deposit schemes, and role-based administrative control with MySQL persistence.',
      tech: ['Java', 'Spring Boot', 'Angular', 'Hibernate', 'MySQL', 'Docker Compose', 'REST APIs', 'Bootstrap'],
      metrics: 'Enforces ACID financial transaction boundaries with automated container health validation.',
      url: 'https://github.com/limonislamborno/Angular-With-Spring-Boot-Project'
    },
    'isdb-management': {
      title: 'IsDB Management Desktop System',
      desc: 'High-performance Java desktop solution utilizing Java Swing and JDBC for direct MySQL database connectivity. Provides fast data manipulation, institutional reporting, and efficient resource utilization.',
      tech: ['Java Swing', 'JDBC', 'MySQL', 'OOP Design Patterns'],
      metrics: 'Lightweight desktop client with zero network lag on local institutional networks.',
      url: 'https://github.com/limonislamborno/Swing-Project-With-Mysql'
    },
    'banking-flutter': {
      title: 'Banking Management Mobile Client App',
      desc: 'Cross-platform mobile banking interface engineered with Flutter and Dart. Integrates Firebase Authentication for secure multi-factor login and synchronizes account ledger records with a centralized MySQL backend.',
      tech: ['Flutter', 'Dart', 'Firebase Auth', 'MySQL', 'REST Endpoints'],
      metrics: 'Instant authentication response and smooth 60fps mobile user experience.',
      url: 'https://github.com/limonislamborno/Flutter-Project'
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

        if (modalLink) {
          modalLink.href = data.url;
        }

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

function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const statusBox = document.getElementById('form-status-msg');

  if (!form || !statusBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#sender-name').value.trim();
    const email = form.querySelector('#sender-email').value.trim();
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

    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending Message...</span>';

    setTimeout(() => {
      statusBox.className = 'form-status success';
      statusBox.textContent = `Thank you, ${name}! Your message has been received. I will get back to you at ${email} shortly.`;
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      setTimeout(() => {
        statusBox.style.display = 'none';
        statusBox.className = 'form-status';
      }, 5000);
    }, 700);
  });
}

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
