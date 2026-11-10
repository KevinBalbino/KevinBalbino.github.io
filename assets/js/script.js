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
  // 3. EFEITOS JS: HOVER INTERATIVO NOS CARDS
  // =========================================================
  const interactiveCards = document.querySelectorAll(".botton-card, .testimonial-card, .secao2-block-green, .secao2-sub-green");

  interactiveCards.forEach(card => {
    card.style.transition = "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.35s ease, filter 0.35s ease";
    
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-8px) scale(1.03)";
      card.style.boxShadow = "0 18px 32px rgba(0, 0, 0, 0.18)";
      card.style.filter = "brightness(1.03)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)";
      card.style.boxShadow = "none";
      card.style.filter = "brightness(1)";
    });
  });

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
    // Proporções exatas baseadas nas áreas em mm² (70mm², 125mm², 237mm²)
    const scaleStates = [
      [0.54, 0.73, 1.00], // Estado 1: [Pequeno, Médio, Grande]
      [1.00, 0.54, 0.73], // Estado 2: [Grande, Pequeno, Médio]
      [0.73, 1.00, 0.54]  // Estado 3: [Médio, Grande, Pequeno]
    ];

    let currentStep = 0;
    let isProcessing = false;
    let lastStepTime = 0;
    let watchdogTimer = null;

    // Função para limpar os estilos de broches em slides inativos
    const resetAllImages = () => {
      const allImages = gallerySwiperElement.querySelectorAll(".grid-gallery-trio img");
      allImages.forEach(img => {
        img.style.transform = "";
      });
    };

    // Alterna dinamicamente a escala dos 3 broches do slide ativo
    const triggerNextScaleStep = () => {
      if (!isProcessing) return;

      const activeSlide = gallerySwiperElement.querySelector(".swiper-slide-active");
      if (!activeSlide) return;

      const images = activeSlide.querySelectorAll(".grid-gallery-trio img");
      if (images.length !== 3) return;

      // Registra o timestamp da execução atual para o Watchdog verificar
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

    // Inicia o ciclo no slide visível
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

    // Parar temporizadores ao trocar de slide
    const stopSlideCycle = () => {
      isProcessing = false;
      stopWatchdog();
      resetAllImages();
    };

    // =========================================================
    // GATILHO WATCHDOG (VERIFICA SE A ANIMAÇÃO PAROU OU TRAVOU)
    // =========================================================
    const checkAnimationHealth = () => {
      if (!isProcessing) return;

      const now = Date.now();
      const timeSinceLastStep = now - lastStepTime;

      // O tempo normal de uma transição é ~1.1s (600ms CSS + 500ms de intervalo).
      // Se passar de 2.5s sem nenhuma troca, significa que houve travamento ou falha.
      if (timeSinceLastStep > 2500) {
        console.warn("Watchdog: Falha detectada na troca de tamanho dos broches. Reiniciando ciclo...");
        
        // Remove ouvintes pendentes que possam ter ficado órfãos
        const activeSlide = gallerySwiperElement.querySelector(".swiper-slide-active");
        if (activeSlide) {
          const images = activeSlide.querySelectorAll(".grid-gallery-trio img");
          if (images.length > 0) {
            images[0].removeEventListener("transitionend", triggerNextScaleStep);
          }
        }

        // Tenta reativar o ciclo
        triggerNextScaleStep();
      }
    };

    const startWatchdog = () => {
      stopWatchdog();
      // Verifica a cada 2 segundos o estado de saúde da animação
      watchdogTimer = setInterval(checkAnimationHealth, 2000);
    };

    const stopWatchdog = () => {
      if (watchdogTimer) {
        clearInterval(watchdogTimer);
        watchdogTimer = null;
      }
    };

    // Inicialização do Swiper.js com Coverflow
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