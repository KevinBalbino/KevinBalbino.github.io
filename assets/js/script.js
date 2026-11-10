document.addEventListener("DOMContentLoaded", () => {

  // =========================================================
  // 1. ALTERNÂNCIA DE TEMA (LIGHT / DARK MODE)
  // =========================================================
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const htmlTag = document.documentElement;

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      // Lê o tema atual no atributo data-theme da tag <html>
      const currentTheme = htmlTag.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";
      
      // Aplica o novo tema no atributo da tag <html>
      htmlTag.setAttribute("data-theme", newTheme);

      // Atualiza o texto e o ícone do botão conforme o tema ativo
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

  // Alterna o estado de exibição do menu lateral no mobile
  const toggleSidebar = () => {
    menuToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  };

  // Força o fechamento do menu lateral
  const closeSidebar = () => {
    menuToggle.classList.remove("active");
    navMenu.classList.remove("active");
  };

  if (menuToggle) menuToggle.addEventListener("click", toggleSidebar);
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener("click", closeSidebar);

  // Aplica rolagem suave para todas as âncoras internas
  anchorLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      
      closeSidebar(); // Fecha a sidebar ao clicar em um link

      if (targetId && targetId !== "#") {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault(); // Evita a mudança abrupta de URL/salto na tela
          targetElement.scrollIntoView({
            behavior: "smooth", // Deslocamento suave
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
    // Configura a transição CSS de alta performance via JS
    card.style.transition = "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.35s ease, filter 0.35s ease";
    
    // Eleva e amplia o card quando o cursor entra na área
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-8px) scale(1.03)";
      card.style.boxShadow = "0 18px 32px rgba(0, 0, 0, 0.18)";
      card.style.filter = "brightness(1.03)";
    });

    // Retorna o card ao estado original quando o cursor sai
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
    // Desloca os elementos gráficos proporcionalmente à posição do ponteiro do mouse
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

    // Reseta a posição dos círculos quando o mouse sai do Hero
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
      // Cria o elemento da onda de clique no local exato do evento
      const circle = document.createElement("span");
      const diameter = Math.max(btn.clientWidth, btn.clientHeight);
      const radius = diameter / 2;

      const rect = btn.getBoundingClientRect();
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add("js-ripple");

      // Remove animações anteriores pendentes
      const existingRipple = btn.querySelector(".js-ripple");
      if (existingRipple) existingRipple.remove();

      btn.appendChild(circle);
    });
  });

  // =========================================================
  // 6. EFEITOS JS: REVELAÇÃO DE SEÇÕES (SCROLL REVEAL)
  // =========================================================
  const observerOptions = {
    threshold: 0.15 // Dispara quando 15% da seção estiver visível
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active"); // Ativa transição de entrada
        observer.unobserve(entry.target); // Para de observar após revelar
      }
    });
  }, observerOptions);

  document.querySelectorAll(".page-section, .hero-section").forEach(sec => {
    sec.classList.add("reveal-hidden"); // Aplica estado inicial oculta
    scrollObserver.observe(sec);
  });

// =========================================================
  // 7. GALERIA CARROSSEL (100% MANUAL - ANIMAÇÃO INICIAL CORRIGIDA)
  // =========================================================
  const galleryCarouselElement = document.getElementById("galleryCarousel");

  if (galleryCarouselElement) {
    // 1. Remove o atributo HTML que força a reprodução automática do Bootstrap
    galleryCarouselElement.removeAttribute("data-bs-ride");

    // 2. Inicializa a instância do Bootstrap Carousel sem automação de slide
    const galleryCarousel = new bootstrap.Carousel(galleryCarouselElement, {
      interval: false,
      ride: false,
      pause: true,
      touch: true,
      wrap: true
    });

    galleryCarousel.pause();

    // Proporções exatas baseadas nas áreas em mm² (70mm², 125mm², 237mm²)
    const scaleStates = [
      [0.54, 0.73, 1.00], // Estado 1: [Pequeno, Médio, Grande]
      [1.00, 0.54, 0.73], // Estado 2: [Grande, Pequeno, Médio]
      [0.73, 1.00, 0.54]  // Estado 3: [Médio, Grande, Pequeno]
    ];

    let currentStep = 0;
    let isProcessing = false;

    // Reseta o estilo inline de TODAS as imagens para o padrão do CSS
    const resetAllImages = () => {
      const allImages = galleryCarouselElement.querySelectorAll(".grid-gallery-trio img");
      allImages.forEach(img => {
        img.style.transform = "";
      });
    };

    // Aplica o redimensionamento dinâmico sem passar o slide
    const triggerNextScaleStep = () => {
      if (!isProcessing) return;

      const activeSlide = galleryCarouselElement.querySelector(".carousel-item.active");
      if (!activeSlide) return;

      const images = activeSlide.querySelectorAll(".grid-gallery-trio img");
      if (images.length !== 3) return;

      const currentScales = scaleStates[currentStep % scaleStates.length];
      const targetImg = images[0];

      // Função que agenda o próximo passo ao término da transição
      const onTransitionEnd = (e) => {
        if (e.propertyName !== "transform") return;
        targetImg.removeEventListener("transitionend", onTransitionEnd);

        if (!isProcessing) return;

        currentStep++;

        // Intervalo de 500ms entre as alterações de tamanho
        setTimeout(() => {
          triggerNextScaleStep();
        }, 500);
      };

      // Registra o evento ANTES de aplicar o novo transform
      targetImg.addEventListener("transitionend", onTransitionEnd);

      // Usar requestAnimationFrame garante que o CSS perceba a mudança de escala
      // e dispara a transição com animação visual desde o 1º carregamento
      requestAnimationFrame(() => {
        images.forEach((img, idx) => {
          img.style.transform = `scale(${currentScales[idx]})`;
        });
      });
    };

    // Inicia a troca de tamanhos no slide visível
    const startSlideCycle = () => {
      isProcessing = true;
      currentStep = 0;
      resetAllImages();

      // Pequeno atraso para garantir que o DOM e o layout do primeiro carregamento estejam prontos
      requestAnimationFrame(() => {
        triggerNextScaleStep();
      });
    };

    // Executa assim que a página carrega
    startSlideCycle();

    // Quando o usuário solicita a troca de slide (setas, indicadores ou drag)
    galleryCarouselElement.addEventListener("slide.bs.carousel", () => {
      isProcessing = false;
      resetAllImages();
    });

    // Quando a transição de slide termina, inicia a animação no novo slide
    galleryCarouselElement.addEventListener("slid.bs.carousel", () => {
      startSlideCycle();
    });

    // --- Suporte a arrastar com o MOUSE no Desktop ---
    let startX = 0;
    let isDragging = false;

    galleryCarouselElement.addEventListener("mousedown", (e) => {
      startX = e.clientX;
      isDragging = true;
    });

    galleryCarouselElement.addEventListener("mouseup", (e) => {
      if (!isDragging) return;
      const endX = e.clientX;
      const diffX = startX - endX;

      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          galleryCarousel.next();
        } else {
          galleryCarousel.prev();
        }
      }
      isDragging = false;
    });

    galleryCarouselElement.addEventListener("mouseleave", () => {
      isDragging = false;
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

    // Captura cliques nos botões dos produtos e preenche o modal dinamicamente
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
      e.preventDefault(); // Impede o recarregamento padrão do navegador

      // Coleta e limpa os campos
      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const assunto = document.getElementById("assunto").value.trim();
      const mensagem = document.getElementById("mensagem").value.trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let isValid = true;

      // Validação de presença de conteúdo e formato do e-mail
      if (!nome || !email || !assunto || !mensagem || !emailRegex.test(email)) {
        isValid = false;
      }

      if (!isValid) {
        contactForm.classList.add("was-validated"); // Mostra feedbacks nativos do Bootstrap
        showAlert("Por favor, preencha todos os campos obrigatórios corretamente.", "danger");
      } else {
        contactForm.classList.remove("was-validated");
        showAlert("Enviando mensagem...", "info");
        
        // Simulação assíncrona de envio para e-mail
        setTimeout(() => {
          showAlert("Mensagem enviada com sucesso! Entraremos em contato em breve.", "success");
          contactForm.reset();
        }, 1200);
      }
    });
  }

  // Função auxiliar para exibição dinâmica dos alertas do formulário
  function showAlert(message, type) {
    if (formAlert) {
      formAlert.className = `alert alert-${type} mt-3`;
      formAlert.innerText = message;
      formAlert.classList.remove("d-none");
    }
  }
});