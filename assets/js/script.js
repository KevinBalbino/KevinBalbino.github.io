document.addEventListener("DOMContentLoaded", () => {
  // 1. Alternância de Tema Dinâmico (Modo Claro / Modo Escuro)
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

  // 2. Controle da Sidebar Retrátil sem escurecimento de tela
  const menuToggle = document.getElementById("menuToggle");
  const sidebarCloseBtn = document.getElementById("sidebarCloseBtn");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-box-item a");

  const toggleSidebar = () => {
    menuToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  };

  const closeSidebar = () => {
    menuToggle.classList.remove("active");
    navMenu.classList.remove("active");
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", toggleSidebar);
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener("click", closeSidebar);
  }

  // Fecha a Sidebar ao clicar em qualquer link e navega suavemente até o contêiner
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      closeSidebar();
      
      const targetId = link.getAttribute("href");
      if (targetId && targetId.startsWith("#")) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  // 3. Interatividade de Compra via Modal Bootstrap
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

  // 4. Validação Dinâmica em JS e Simulação do Formulário
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

  // 5. Configuração do Carrossel de Galeria
  const carouselElement = document.getElementById("carouselGaleria");
  if (carouselElement) {
    bootstrap.Carousel.getOrCreateInstance(carouselElement, {
      interval: 4000,
      pause: "hover"
    });
  }
});