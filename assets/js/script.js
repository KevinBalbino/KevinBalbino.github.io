document.addEventListener("DOMContentLoaded", () => {

  // =========================================================
  // 1. ALTERNÂNCIA DE TEMA (LIGHT / DARK MODE)
  // =========================================================
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const htmlTag = document.documentElement;

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = htmlTag.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";
      
      htmlTag.setAttribute("data-theme", newTheme);

      if (newTheme === "dark") {
        themeToggleBtn.innerHTML = '<i class="bi bi-sun-fill me-1"></i> Claro';
      } else {
        themeToggleBtn.innerHTML = '<i class="bi bi-moon-fill me-1"></i> Escuro';
      }
    });
  }

  // =========================================================
  // 2. NAVEGAÇÃO SUAVE (SMOOTH SCROLL) & SIDEBAR MOBILE
  // =========================================================
  const menuToggle = document.getElementById("menuToggle");
  const sidebarCloseBtn = document.getElementById("sidebarCloseBtn");
  const navMenu = document.getElementById("navMenu");
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  const toggleSidebar = () => {
    menuToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  };

  const closeSidebar = () => {
    menuToggle.classList.remove("active");
    navMenu.classList.remove("active");
  };

  if (menuToggle) menuToggle.addEventListener("click", toggleSidebar);
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener("click", closeSidebar);

  anchorLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      closeSidebar();

      if (targetId && targetId !== "#") {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    });
  });

  // =========================================================
  // 3. EFEITOS JS: HOVER DESKTOP vs. CENTRALIZAÇÃO EM TELAS MENORES
  // =========================================================
  const selectorTarget = ".botton-card, .testimonial-card, .secao2-block-green, .secao2-sub-green";
  const interactiveCards = document.querySelectorAll(selectorTarget);

  const applyHover = (el) => {
    if (!el) return;
    el.style.transform = "translateY(-8px) scale(1.03)";
    el.style.boxShadow = "0 18px 32px rgba(0, 0, 0, 0.18)";
    el.style.filter = "brightness(1.03)";
  };

  const resetHover = (el) => {
    if (!el) return;
    el.style.transform = "translateY(0) scale(1)";
    el.style.boxShadow = "none";
    el.style.filter = "brightness(1)";
  };

  // Aplica transição em todos os cards
  interactiveCards.forEach(card => {
    card.style.transition = "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.35s ease, filter 0.35s ease";
    
    // HOVER TRADICIONAL (Apenas telas de Computador > 992px)
    card.addEventListener("mouseenter", () => {
      if (window.innerWidth > 992) {
        applyHover(card);
      }
    });

    card.addEventListener("mouseleave", () => {
      if (window.innerWidth > 992) {
        resetHover(card);
      }
    });
  });

  // CENTRALIZAÇÃO DA TELA (Apenas telas menores <= 992px)
  let currentActiveCenterElement = null;
  let isTicking = false;

  const checkCenterHoverElement = () => {
    // Se for computador/tela grande, cancela a lógica de centralização
    if (window.innerWidth > 992) {
      if (currentActiveCenterElement) {
        resetHover(currentActiveCenterElement);
        currentActiveCenterElement = null;
      }
      return;
    }

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const elementAtCenter = document.elementFromPoint(centerX, centerY);
    const targetElement = elementAtCenter ? elementAtCenter.closest(selectorTarget) : null;

    if (targetElement !== currentActiveCenterElement) {
      if (currentActiveCenterElement) {
        resetHover(currentActiveCenterElement);
      }
      if (targetElement) {
        applyHover(targetElement);
      }
      currentActiveCenterElement = targetElement;
    }
  };

  const onScrollOrTouch = () => {
    if (!isTicking) {
      requestAnimationFrame(() => {
        checkCenterHoverElement();
        isTicking = false;
      });
      isTicking = true;
    }
  };

  // Eventos para escutar o movimento no mobile/telas menores
  window.addEventListener("scroll", onScrollOrTouch, { passive: true });
  window.addEventListener("touchmove", onScrollOrTouch, { passive: true });
  window.addEventListener("touchend", onScrollOrTouch, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 992 && currentActiveCenterElement) {
      resetHover(currentActiveCenterElement);
      currentActiveCenterElement = null;
    } else {
      onScrollOrTouch();
    }
  }, { passive: true });

  // Verificação inicial no carregamento
  checkCenterHoverElement();

  // =========================================================
  // 4. EFEITOS JS: PARALLAX NOS CÍRCULOS DO HERO
  // =========================================================
  const heroSection = document.querySelector(".hero-section");
  const circles = document.querySelectorAll(".circle-accent");

  if (heroSection && circles.length > 0) {
    heroSection.addEventListener("mousemove", (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const moveX = (clientX / innerWidth - 0.5) * 30;
      const moveY = (clientY / innerHeight - 0.5) * 30;

      circles.forEach((circle, idx) => {
        const factor = (idx + 1) * 0.4;
        circle.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
        circle.style.transition = "transform 0.1s ease-out";
      });
    });

    heroSection.addEventListener("mouseleave", () => {
      circles.forEach(circle => {
        circle.style.transform = "translate(0, 0)";
        circle.style.transition = "transform 0.5s ease-out";
      });
    });
  }

  // =========================================================
  // 5. EFEITOS JS: RIPPLE EFFECT NOS BOTÕES (ONDA AO CLICAR)
  // =========================================================
  const buttons = document.querySelectorAll(".btn, .theme-toggle-btn, .sidebar-close-btn");

  buttons.forEach(btn => {
    btn.style.position = "relative";
    btn.style.overflow = "hidden";

    btn.addEventListener("click", function (e) {
      const circle = document.createElement("span");
      const diameter = Math.max(btn.clientWidth, btn.clientHeight);
      const radius = diameter / 2;

      const rect = btn.getBoundingClientRect();
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add("js-ripple");

      const existingRipple = btn.querySelector(".js-ripple");
      if (existingRipple) existingRipple.remove();

      btn.appendChild(circle);
    });
  });

  // =========================================================
  // 6. EFEITOS JS: REVELAÇÃO DE SEÇÕES (SCROLL REVEAL)
  // =========================================================
  const observerOptions = { threshold: 0.15 };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".page-section, .hero-section").forEach(sec => {
    sec.classList.add("reveal-hidden");
    scrollObserver.observe(sec);
  });

  // =========================================================
  // 7. GALERIA CARROSSEL (SWIPER + WATCHDOG DE ANIMAÇÃO)
  // =========================================================
  const gallerySwiperElement = document.querySelector(".gallerySwiper");

  if (gallerySwiperElement) {
    const scaleStates = [
      [0.54, 0.73, 1.00],
      [1.00, 0.54, 0.73],
      [0.73, 1.00, 0.54]
    ];

    let currentStep = 0;
    let isProcessing = false;
    let lastStepTime = 0;
    let watchdogTimer = null;

    const resetAllImages = () => {
      const allImages = gallerySwiperElement.querySelectorAll(".grid-gallery-trio img");
      allImages.forEach(img => {
        img.style.transform = "";
      });
    };

    const triggerNextScaleStep = () => {
      if (!isProcessing) return;

      const activeSlide = gallerySwiperElement.querySelector(".swiper-slide-active");
      if (!activeSlide) return;

      const images = activeSlide.querySelectorAll(".grid-gallery-trio img");
      if (images.length !== 3) return;

      lastStepTime = Date.now();

      const currentScales = scaleStates[currentStep % scaleStates.length];
      const targetImg = images[0];

      const onTransitionEnd = (e) => {
        if (e.propertyName !== "transform") return;
        targetImg.removeEventListener("transitionend", onTransitionEnd);

        if (!isProcessing) return;

        currentStep++;

        setTimeout(() => {
          triggerNextScaleStep();
        }, 500);
      };

      targetImg.addEventListener("transitionend", onTransitionEnd);

      requestAnimationFrame(() => {
        images.forEach((img, idx) => {
          img.style.transform = `scale(${currentScales[idx]})`;
        });
      });
    };

    const startSlideCycle = () => {
      isProcessing = true;
      currentStep = 0;
      lastStepTime = Date.now();
      resetAllImages();

      requestAnimationFrame(() => {
        triggerNextScaleStep();
      });

      startWatchdog();
    };

    const stopSlideCycle = () => {
      isProcessing = false;
      stopWatchdog();
      resetAllImages();
    };

    const checkAnimationHealth = () => {
      if (!isProcessing) return;

      const now = Date.now();
      const timeSinceLastStep = now - lastStepTime;

      if (timeSinceLastStep > 2500) {
        console.warn("Watchdog: Falha detectada na troca de tamanho dos broches. Reiniciando ciclo...");
        
        const activeSlide = gallerySwiperElement.querySelector(".swiper-slide-active");
        if (activeSlide) {
          const images = activeSlide.querySelectorAll(".grid-gallery-trio img");
          if (images.length > 0) {
            images[0].removeEventListener("transitionend", triggerNextScaleStep);
          }
        }

        triggerNextScaleStep();
      }
    };

    const startWatchdog = () => {
      stopWatchdog();
      watchdogTimer = setInterval(checkAnimationHealth, 2000);
    };

    const stopWatchdog = () => {
      if (watchdogTimer) {
        clearInterval(watchdogTimer);
        watchdogTimer = null;
      }
    };

    const swiper = new Swiper(".gallerySwiper", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      loop: true,
      speed: 700,
      autoplay: false,
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 90,
        modifier: 1.8,
        slideShadows: false,
      },
      navigation: {
        nextEl: ".swiper-button-next-custom",
        prevEl: ".swiper-button-prev-custom",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      slideToClickedSlide: true,
      on: {
        init: function () {
          startSlideCycle();
        },
        slideChangeTransitionStart: function () {
          stopSlideCycle();
        },
        slideChangeTransitionEnd: function () {
          startSlideCycle();
        }
      }
    });
  }

  // =========================================================
  // 8. MODAL DINÂMICO DE PRODUTOS (BOOTSTRAP MODAL)
  // =========================================================
  const productModalElement = document.getElementById("productModal");
  if (productModalElement) {
    const productModal = new bootstrap.Modal(productModalElement);
    const modalTitle = document.getElementById("productModalTitle");
    const modalBody = document.getElementById("productModalBody");

    document.querySelectorAll(".open-modal-btn").forEach(button => {
      button.addEventListener("click", (e) => {
        const title = e.target.getAttribute("data-title");
        modalTitle.innerText = title;
        modalBody.innerText = `Você selecionou o item "${title}". Deseja prosseguir com a simulação de pedido?`;
        productModal.show();
      });
    });
  }

  // =========================================================
  // 9. VALIDAÇÃO E SIMULAÇÃO DE ENVIO DO FORMULÁRIO
  // =========================================================
  const contactForm = document.getElementById("contactForm");
  const formAlert = document.getElementById("formAlert");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const assunto = document.getElementById("assunto").value.trim();
      const mensagem = document.getElementById("mensagem").value.trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let isValid = true;

      if (!nome || !email || !assunto || !mensagem || !emailRegex.test(email)) {
        isValid = false;
      }

      if (!isValid) {
        contactForm.classList.add("was-validated");
        showAlert("Por favor, preencha todos os campos obrigatórios corretamente.", "danger");
      } else {
        contactForm.classList.remove("was-validated");
        showAlert("Enviando mensagem...", "info");
        
        setTimeout(() => {
          showAlert("Mensagem enviada com sucesso! Entraremos em contato em breve.", "success");
          contactForm.reset();
        }, 1200);
      }
    });
  }

  function showAlert(message, type) {
    if (formAlert) {
      formAlert.className = `alert alert-${type} mt-3`;
      formAlert.innerText = message;
      formAlert.classList.remove("d-none");
    }
  }
});