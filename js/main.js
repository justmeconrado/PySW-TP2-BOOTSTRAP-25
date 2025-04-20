/**
 * Archivo JavaScript principal para el sitio web FitLife
 * Consolida toda la funcionalidad del sitio
 *
 * @author Conrado Vargas
 * @version 2.0
 */

// Función de documento listo (usando jQuery)
$(document).ready(function () {
  // Inicializar animaciones AOS
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }

  // Inicializar todos los módulos según la página actual
  initCommonFeatures();
  initPageSpecificFeatures();

  // Añadir efectos hover a las tarjetas usando jQuery
  initCardHoverEffects();

  // Validación de formulario con efecto de spinner
  initFormValidation();

  // Animación de la sección hero
  initHeroAnimation();
});

/**
 * Inicializa características comunes a todas las páginas
 */
function initCommonFeatures() {
  // Inicializar el toggle de modo oscuro
  initDarkMode();

  // Inicializar menú móvil
  initMobileMenu();

  // Inicializar efectos de tarjetas
  initCardEffects();

  // Animar contadores con jQuery
  initAnimatedCounters();
}

/**
 * Inicializa características específicas de la página basadas en la URL
 */
function initPageSpecificFeatures() {
  const currentPage = window.location.pathname.split("/").pop();

  switch (currentPage) {
    case "index.html":
    case "":
      initHomePageFeatures();
      break;
    case "clases.html":
      initClassesPageFeatures();
      break;
    case "entrenadores.html":
      initTrainersPageFeatures();
      break;
    case "precios.html":
      initPricingPageFeatures();
      break;
    case "blog.html":
      initBlogPageFeatures();
      break;
    case "contacto.html":
      initContactPageFeatures();
      break;
    default:
      // Características predeterminadas para cualquier otra página
      break;
  }
}

/**
 * Inicializa características específicas de la página de inicio
 */
function initHomePageFeatures() {
  // Carrusel de testimonios
  initTestimonialCarousel();

  // Contadores animados
  $("[data-count]").each(function () {
    const $this = $(this);
    const target = parseInt($this.attr("data-count"));

    const observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        let current = 0;
        const duration = 2000;
        const increment = target / (duration / 16);

        const update = function () {
          current += increment;
          if (current < target) {
            $this.text(Math.floor(current));
            requestAnimationFrame(update);
          } else {
            $this.text(target);
          }
        };

        update();
        observer.disconnect();
      }
    });

    observer.observe(this);
  });
}

/**
 * Inicializa características específicas de la página de clases
 */
function initClassesPageFeatures() {
  // Filtrado de clases
  initClassFiltering();

  // Diseño de masonería
  initMasonryLayout();
}

/**
 * Inicializa características específicas de la página de entrenadores
 */
function initTrainersPageFeatures() {
  // Funcionalidad de volteo de tarjeta de entrenador
  initTrainerFeatures(); // Ensures flip effect works

  // Sistema de calificación por estrellas
  initStarRatingSystem(); // Initialize star rating

  // Animación de barras de progreso
  // Trigger animation initially for bars potentially visible without flipping
  animateProgressBars(".flip-card-back .progress-bar");

  // Re-animate progress bars when a card is flipped (hover/focus)
  $(".trainer-card").on("mouseenter focus", function () {
    // Find progress bars only within the currently hovered/focused card's back face
    const barsInCard = $(this).find(".flip-card-back .progress-bar");
    // Use a slight delay to allow the flip animation to start
    setTimeout(() => animateProgressBars(barsInCard), 300);
  });
}

/**
 * Inicializa características específicas de la página de precios
 */
function initPricingPageFeatures() {
  // Toggle de precios
  initPricingToggle();
}

/**
 * Inicializa características específicas de la página de blog
 */
function initBlogPageFeatures() {
  // Filtrado de publicaciones del blog
  initBlogFeatures();

  // Animación del botón de me gusta en comentarios
  $(".btn-outline-secondary i.far.fa-thumbs-up")
    .parent()
    .on("click", function () {
      const $this = $(this);
      const $icon = $this.find("i");
      const $count = $this.find("span");

      if ($icon.hasClass("far")) {
        $icon.removeClass("far").addClass("fas text-danger");
        $count.text(parseInt($count.text()) + 1);
      } else {
        $icon.removeClass("fas text-danger").addClass("far");
        $count.text(parseInt($count.text()) - 1);
      }
    });
}

/**
 * Inicializa características específicas de la página de contacto
 */
function initContactPageFeatures() {
  // Formulario de contacto
  initContactForm();
}

/**
 * Inicializa carrusel de testimonios con desplazamiento automático
 */
function initTestimonialCarousel() {
  // Usar API de carrusel de Bootstrap con opciones explícitas
  const carousel = $("#testimonialCarousel");
  
  // Verificar si el carrusel existe en la página
  if (carousel.length) {
    carousel.carousel({
      interval: 5000,  // Establecer intervalo a 5 segundos (más corto para pruebas)
      ride: 'carousel' // Iniciar automáticamente
    });
    
    // Forzar el inicio del carrusel
    carousel.carousel('cycle');
    
    console.log("Carrusel de testimonios inicializado");
  }
}

/**
 * Inicializa efectos hover de tarjetas
 */
function initCardHoverEffects() {
  $(".card").hover(
    function () {
      $(this).css({
        transform: "translateY(-10px)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "box-shadow": "0 10px 20px rgba(0,0,0,0.1)",
      });
    },
    function () {
      $(this).css({
        transform: "translateY(0)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "box-shadow": "0 0.125rem 0.25rem rgba(0,0,0,0.075)",
      });
    }
  );
}

/**
 * Inicializa validación de formulario con efecto de spinner
 */
function initFormValidation() {
  $("#newsletter-form").submit(function (event) {
    event.preventDefault();
    event.stopPropagation();

    const form = $(this);
    const button = $("#subscribe-btn");
    const originalContent = button.html();

    if (form[0].checkValidity()) {
      // Mostrar spinner
      button.html(
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
      );
      button.prop("disabled", true);

      // Simular envío de formulario (reemplazar con llamada AJAX real)
      setTimeout(function () {
        button.html('<i class="fas fa-check"></i>');
        setTimeout(function () {
          button.html(originalContent);
          button.prop("disabled", false);
          form.trigger("reset");
        }, 1500);
      }, 1500);
    }

    form.addClass("was-validated");
  });
}

/**
 * Inicializa animación de sección hero
 */
function initHeroAnimation() {
  $(".hero-content").hide().fadeIn(1000);
}

/**
 * Funcionalidad de Modo Oscuro
 * Maneja el cambio entre temas claro y oscuro
 */
function initDarkMode() {
  // Verificar preferencia de tema guardada o usar esquema de color preferido
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Establecer tema inicial basado en preferencia guardada o preferencia del sistema
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.body.classList.add("dark-mode");
    $("#dark-mode-toggle").prop("checked", true);
  }

  // Alternar modo oscuro cuando se hace clic en el interruptor
  $("#dark-mode-toggle").on("change", function () {
    if ($(this).is(":checked")) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }

    // Aplicar estilos específicos para elementos del blog
    updateBlogDarkModeStyles();
  });

  // Aplicar estilos de modo oscuro específicos del blog al cargar la página si es necesario
  if (document.body.classList.contains("dark-mode")) {
    updateBlogDarkModeStyles();
  }
}

// Función para actualizar elementos específicos del blog para modo oscuro
function updateBlogDarkModeStyles() {
  const isDarkMode = document.body.classList.contains("dark-mode");

  // Paginación del blog
  $(".pagination .page-link").each(function () {
    if (isDarkMode) {
      $(this).addClass("bg-dark text-light border-secondary");
    } else {
      $(this).removeClass("bg-dark text-light border-secondary");
    }
  });

  // Categorías del blog
  $(".filter-category").each(function () {
    if (isDarkMode) {
      $(this).removeClass("text-dark").addClass("text-light");
    } else {
      $(this).removeClass("text-light").addClass("text-dark");
    }
  });

  // Elementos de lista en la barra lateral
  $(".list-group-item").each(function () {
    if (isDarkMode) {
      $(this).addClass("bg-dark text-light border-secondary");
    } else {
      $(this).removeClass("bg-dark text-light border-secondary");
    }
  });

  // Artículos recientes
  $(".list-group-item-action").each(function () {
    if (isDarkMode) {
      $(this).addClass("bg-dark text-light border-secondary");
    } else {
      $(this).removeClass("bg-dark text-light border-secondary");
    }
  });

  // Etiquetas
  $(".badge.bg-light.text-dark").each(function () {
    if (isDarkMode) {
      $(this)
        .removeClass("bg-light text-dark")
        .addClass("bg-secondary text-light");
    } else {
      $(this)
        .removeClass("bg-secondary text-light")
        .addClass("bg-light text-dark");
    }
  });
}

/**
 * Funcionalidad de Contadores Animados
 * Anima contadores numéricos en la sección de estadísticas
 */
function initAnimatedCounters() {
  // Seleccionar todos los elementos con clase stat-number
  const counters = document.querySelectorAll(".stat-number");

  // Si no hay contadores en la página, finalizar ejecución
  if (!counters.length) return;

  /**
   * Función para animar un contador individual
   * @param {HTMLElement} counter - El elemento contador a animar
   */
  const animateCounter = (counter) => {
    // Obtener valor objetivo del atributo data-count
    const target = +counter.getAttribute("data-count");
    // Obtener valor actual del contador
    const count = +counter.innerText;
    // Calcular incremento para cada paso (1% del valor final)
    const increment = target / 100;

    // Si aún no hemos alcanzado el valor objetivo
    if (count < target) {
      // Actualizar valor del contador con incremento
      counter.innerText = Math.ceil(count + increment);
      // Programar siguiente paso de animación después de 20ms
      setTimeout(() => animateCounter(counter), 20);
    } else {
      // Asegurar que el valor final sea exactamente el objetivo
      counter.innerText = target;
    }
  };

  // Configuración del observador de intersección
  const observerOptions = {
    threshold: 0.5, // Se activa cuando al menos el 50% del elemento es visible
  };

  /**
   * Crea un observador que detecta cuando los elementos entran en el viewport
   * e inicia la animación del contador
   */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Si el elemento es visible en pantalla
      if (entry.isIntersecting) {
        // Seleccionar todos los contadores dentro del elemento
        const counters = entry.target.querySelectorAll(".stat-number");
        // Iniciar animación para cada contador
        counters.forEach((counter) => animateCounter(counter));
        // Dejar de observar el elemento una vez que la animación ha comenzado
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar todos los contenedores de cuadrícula de estadísticas en la página
  document.querySelectorAll(".stats-grid").forEach((grid) => {
    observer.observe(grid);
  });
}

/**
 * Funcionalidad de Filtrado de Clases
 * Maneja el filtrado de tarjetas de clases según la categoría
 */
function initClassFiltering() {
  // Obtener todos los botones de radio de filtro y elementos de clase
  const filterRadios = document.querySelectorAll(".btn-check[data-filter]");
  const classItems = document.querySelectorAll(".class-item");

  // Si no hay botones de filtro o elementos de clase, salir
  if (!filterRadios.length || !classItems.length) return;

  // Añadir evento de cambio a cada radio de filtro
  filterRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      // Obtener valor de filtro del atributo de datos
      const filter = this.getAttribute("data-filter");

      // Mostrar/ocultar elementos de clase según el filtro
      classItems.forEach((item) => {
        const categories = item.getAttribute("data-category").split(" ");

        if (filter === "all" || categories.includes(filter)) {
          item.style.display = "";
          item.classList.remove("d-none");
        } else {
          item.style.display = "none";
          item.classList.add("d-none");
        }
      });

      // Actualizar diseño de masonería después del filtrado
      if (typeof Masonry !== "undefined") {
        setTimeout(() => {
          new Masonry(document.querySelector("#classes-grid"), {
            percentPosition: true,
          });
        }, 300);
      }
    });
  });

  // Activar el filtro "all" al cargar la página
  const allFilter = document.querySelector('.btn-check[data-filter="all"]');
  if (allFilter) {
    allFilter.checked = true;
    const event = new Event("change");
    allFilter.dispatchEvent(event);
  }
}

/**
 * Funcionalidad del Formulario de Contacto
 * Maneja la validación y envío del formulario
 */
function initContactForm() {
  const $contactForm = $("#contactForm");
  if (!$contactForm.length) return;

  // Validación en tiempo real
  $("#name, #email, #message").on("input", function () {
    const $this = $(this);
    const value = $this.val().trim();

    if ($this.attr("id") === "email") {
      // Validación específica para email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && emailRegex.test(value)) {
        $this.removeClass("is-invalid").addClass("is-valid");
      } else {
        $this.removeClass("is-valid").addClass("is-invalid");
      }
    } else {
      // Validación para otros campos
      if (value) {
        $this.removeClass("is-invalid").addClass("is-valid");
      } else {
        $this.removeClass("is-valid").addClass("is-invalid");
      }
    }
  });

  // Manejo del envío del formulario
  $contactForm.on("submit", function (e) {
    e.preventDefault();

    // Validar todos los campos
    let isValid = true;

    $("#name, #email, #message").each(function () {
      const $this = $(this);
      const value = $this.val().trim();

      if ($this.attr("id") === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          $this.removeClass("is-valid").addClass("is-invalid");
          isValid = false;
        }
      } else if (!value) {
        $this.removeClass("is-valid").addClass("is-invalid");
        isValid = false;
      }
    });

    if (isValid) {
      // Obtener el botón de envío
      const $submitButton = $contactForm.find("button[type='submit']");
      const $spinner = $submitButton.find(".spinner-border");

      // Deshabilitar el botón y mostrar spinner con fadeIn
      $submitButton.prop("disabled", true);
      $spinner.removeClass("d-none").hide().fadeIn(200);

      // Simular envío de formulario (reemplazar con llamada AJAX real)
      setTimeout(function () {
        // Mostrar modal de confirmación
        $("#confirmation-modal").modal("show");

        // Reiniciar formulario
        $contactForm[0].reset();
        $("#name, #email, #message").removeClass("is-valid is-invalid");
        $submitButton.prop("disabled", false);
        $spinner.addClass("d-none");
      }, 1500);
    }
  });

  // Reiniciar validación al cerrar el modal
  $("#confirmation-modal").on("hidden.bs.modal", function () {
    $("#name, #email, #message").removeClass("is-valid is-invalid");
  });
}

/**
 * Funcionalidad de Toggle de Precios
 * Maneja el cambio entre precios mensuales y anuales
 */
function initPricingToggle() {
  const pricingToggle = document.getElementById("pricing-toggle");
  if (!pricingToggle) return;

  pricingToggle.addEventListener("change", function () {
    const isAnnual = this.checked;
    const monthlyPrices = document.querySelectorAll(".monthly-price");
    const annualPrices = document.querySelectorAll(".annual-price");

    if (isAnnual) {
      // Mostrar precios anuales, ocultar precios mensuales
      monthlyPrices.forEach((el) => el.classList.add("d-none"));
      annualPrices.forEach((el) => el.classList.remove("d-none"));
    } else {
      // Mostrar precios mensuales, ocultar precios anuales
      monthlyPrices.forEach((el) => el.classList.remove("d-none"));
      annualPrices.forEach((el) => el.classList.add("d-none"));
    }
  });
}

/**
 * Funcionalidad de Menú Móvil
 * Maneja el toggle del menú móvil y animaciones
 */
function initMobileMenu() {
  const menuToggle = document.querySelector(".navbar-toggler");
  if (!menuToggle) return;

  menuToggle.addEventListener("click", function () {
    // Añadir clase de animación a elementos del menú cuando se abre el menú
    if (this.getAttribute("aria-expanded") === "false") {
      setTimeout(function () {
        document
          .querySelectorAll(".navbar-nav .nav-item")
          .forEach((item, index) => {
            item.style.animation = `fadeInRight 0.3s ease forwards ${
              index * 0.1
            }s`;
          });
      }, 100);
    }
  });
}

/**
 * Funcionalidad de Efectos de Tarjeta
 * Maneja efectos hover y animaciones de tarjetas
 */
function initCardEffects() {
  // Añadir efectos hover a tarjetas de clase
  document.querySelectorAll(".class-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.querySelector("img").style.transform = "scale(1.05)";
    });

    card.addEventListener("mouseleave", function () {
      this.querySelector("img").style.transform = "scale(1)";
    });
  });
}

/**
 * Funcionalidad de Diseño de Masonería
 * Implementa un diseño de estilo masonería para la sección de clases
 */
function initMasonryLayout() {
  /**
   * Ajusta el tamaño de los elementos de la cuadrícula
   * Calcula la altura de cada elemento y establece el número de filas que debe ocupar
   */
  function resizeGridItems() {
    // Seleccionar el contenedor principal de la cuadrícula
    const grid = document.querySelector(".classes-masonry");
    if (!grid) return; // Si la cuadrícula no existe, finalizar función

    // Obtener altura base de fila desde CSS
    const rowHeight = Number.parseInt(
      window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
    );
    // Obtener espacio entre filas desde CSS
    const rowGap = Number.parseInt(
      window.getComputedStyle(grid).getPropertyValue("grid-row-gap")
    );

    // Para cada elemento visible en la cuadrícula
    document.querySelectorAll(".class-item:not(.hidden)").forEach((item) => {
      // Calcular cuántas filas debe ocupar según su altura real
      const rowSpan = Math.ceil(
        (item.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap)
      );
      // Aplicar el número de filas como valor grid-row-end
      item.style.gridRowEnd = "span " + rowSpan;
    });
  }

  // Ejecutar ajuste cuando la página termina de cargar
  window.addEventListener("load", resizeGridItems);
  // Ejecutar ajuste cuando se redimensiona la ventana
  window.addEventListener("resize", resizeGridItems);
}

/**
 * Funcionalidad de Características del Blog
 * Maneja el filtrado de publicaciones del blog y animaciones
 */
function initBlogFeatures() {
  // Filtrado de publicaciones del blog
  $(".filter-category").on("click", function (e) {
    e.preventDefault();

    // Obtener categoría seleccionada
    const category = $(this).data("category");

    // Resaltar categoría activa
    $(".filter-category").parent().removeClass("active");
    $(this).parent().addClass("active");

    // Filtrar publicaciones con animación
    if (category === "all") {
      $(".blog-post").fadeIn(400);
    } else {
      $(".blog-post").hide();
      $('.blog-post[data-category="' + category + '"]').fadeIn(400);
    }
  });

  // Funcionalidad de respuesta a comentarios
  $(".btn-reply").on("click", function () {
    const commentId = $(this).data("comment-id");
    const replyForm = $("#reply-form-" + commentId);

    // Alternar visibilidad del formulario de respuesta
    replyForm.slideToggle(300);

    // Enfocar en el área de texto cuando se muestra el formulario
    if (replyForm.is(":visible")) {
      replyForm.find("textarea").focus();
    }
  });

  // Manejar envío de formulario de comentarios
  $(".comment-form").on("submit", function (e) {
    e.preventDefault();

    const form = $(this);
    const submitBtn = form.find('button[type="submit"]');
    const textarea = form.find("textarea");
    const commentText = textarea.val().trim();

    if (commentText) {
      // Deshabilitar botón y mostrar estado de carga
      submitBtn
        .prop("disabled", true)
        .html(
          '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...'
        );

      // Simular solicitud AJAX
      setTimeout(function () {
        // Mostrar mensaje de éxito
        const successMessage = $(
          '<div class="alert alert-success mt-3" role="alert">Tu comentario ha sido enviado y está pendiente de moderación.</div>'
        );
        form.after(successMessage);

        // Reiniciar formulario
        form[0].reset();
        submitBtn.prop("disabled", false).html("Publicar");

        // Si es un formulario de respuesta, ocultarlo después del envío
        if (form.hasClass("reply-form")) {
          setTimeout(function () {
            form.slideUp(300);
            successMessage.fadeOut(300, function () {
              $(this).remove();
            });
          }, 3000);
        } else {
          // Eliminar mensaje de éxito después de 5 segundos
          setTimeout(function () {
            successMessage.fadeOut(300, function () {
              $(this).remove();
            });
          }, 5000);
        }
      }, 1500);
    } else {
      // Mostrar error de validación
      textarea.addClass("is-invalid");
    }
  });

  // Eliminar error de validación cuando el usuario comienza a escribir
  $(".comment-form textarea").on("input", function () {
    $(this).removeClass("is-invalid");
  });

  // Manejar suscripción al boletín en la barra lateral del blog
  $("#blog-newsletter-form").on("submit", function (e) {
    e.preventDefault();

    const form = $(this);
    const emailInput = form.find('input[type="email"]');
    const submitBtn = form.find("button");

    if (emailInput[0].checkValidity()) {
      // Mostrar estado de carga
      submitBtn
        .prop("disabled", true)
        .html(
          '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
        );

      // Simular solicitud AJAX
      setTimeout(function () {
        // Mostrar mensaje de éxito
        const successMessage = $(
          '<div class="alert alert-success mt-3" role="alert">¡Gracias por suscribirte a nuestro boletín!</div>'
        );
        form.after(successMessage);

        // Reiniciar formulario
        form[0].reset();
        submitBtn
          .prop("disabled", false)
          .html('<i class="fas fa-paper-plane"></i>');

        // Eliminar mensaje de éxito después de 5 segundos
        setTimeout(function () {
          successMessage.fadeOut(300, function () {
            $(this).remove();
          });
        }, 5000);
      }, 1500);
    } else {
      emailInput.addClass("is-invalid");
    }
  });
}

/**
 * Funcionalidad de Características de Entrenador
 * Maneja el volteo de tarjetas de entrenador y características de accesibilidad
 */
function initTrainerFeatures() {
  // Hacer que las tarjetas de entrenador sean accesibles mediante teclado
  const trainerCards = document.querySelectorAll(".trainer-card");

  trainerCards.forEach((card) => {
    card.setAttribute("tabindex", "0");

    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.classList.toggle("flipped");
      }
    });
  });

  // Animar barras de habilidades cuando entran en vista
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        $(entry.target)
          .find(".progress-bar")
          .each(function () {
            const skill = $(this).attr("aria-valuenow");
            $(this).animate(
              {
                width: skill + "%",
              },
              1000
            );
          });
        observer.unobserve(entry.target);
      }
    });
  });

  $(".progress").each(function () {
    observer.observe(this);
  });
}

// Añadir JavaScript para animar las barras de progreso
// Añadir dentro de la función initTrainersPageFeatures()

/**
 * Inicializa la funcionalidad del sistema de calificación por estrellas.
 */
function initStarRatingSystem() {
  console.log("Inicializando sistema de calificación por estrellas");

  // Manejar clic en una etiqueta de estrella
  $(".star-rating .star-label").on("click", function () {
    const $input = $(this).prev("input"); // Obtener el input radio asociado
    const ratingValue = $input.val();
    const $starRatingDiv = $(this).closest(".star-rating");
    const $ratingText = $starRatingDiv.next(".small").find(".rating-value"); // Encontrar el span para mostrar el valor

    // Marcar el botón radio (manejado visualmente por CSS basado en :checked)
    $input.prop("checked", true);

    // Actualizar el atributo data-rating (opcional, pero puede ser útil)
    $starRatingDiv.attr("data-rating", ratingValue);

    // Actualizar el texto mostrado
    if ($ratingText.length) {
      $ratingText.text(parseFloat(ratingValue).toFixed(1)); // Formatear a un decimal
    }

    console.log("Calificación establecida en: " + ratingValue);
  });

  // El efecto hover ahora es manejado puramente por CSS, no se necesita JS para los efectos visuales.
}

/**
 * Anima las barras de progreso hasta su ancho objetivo.
 * @param {jQuery|string} selector - Selector para las barras de progreso a animar.
 */
function animateProgressBars(selector) {
  $(selector).each(function () {
    const $progressBar = $(this);
    const targetWidth = $progressBar.attr("aria-valuenow") + "%";

    // Animar solo si el ancho actual no es el ancho objetivo (previene re-animación)
    if (
      ($progressBar.width() / $progressBar.parent().width()) * 100 !==
      parseFloat(targetWidth)
    ) {
      $progressBar
        .css("width", "0%") // Reiniciar ancho antes de animar
        .stop() // Detener animaciones previas
        .animate({ width: targetWidth }, 800); // Animar hasta el ancho objetivo
    }
  });
}

// Activar animación cuando se voltea la tarjeta
$(".trainer-card").on("mouseenter", function () {
  setTimeout(() => {
    // Pasar un selector específico a la función
    animateProgressBars($(this).find(".progress-bar"));
  }, 400); // Pequeño retraso para que coincida con la animación flip
});

// Inicialización adicional para el carrusel
$(document).ready(function() {
  $('.carousel').carousel();
  // Específicamente para el carrusel de testimonios
  $('#testimonialCarousel').carousel({
    interval: 5000
  });
});

