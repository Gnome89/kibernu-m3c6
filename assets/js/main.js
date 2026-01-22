/* =========================
MAIN.JS
Funciones interactivas – ADITIVO
========================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
  SEARCH OVERLAY
  ========================= */

  const searchBtn = document.getElementById("searchBtn");
  const searchOverlay = document.getElementById("searchOverlay");
  const closeSearch = document.getElementById("closeSearch");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener("click", () => {
      searchOverlay.classList.add("is-active");
      searchInput?.focus();
    });
  }

  if (closeSearch) {
    closeSearch.addEventListener("click", () => {
      searchOverlay.classList.remove("is-active");
      searchInput.value = "";
      searchResults.innerHTML = "";
    });
  }

  if (searchOverlay) {
    searchOverlay.addEventListener("click", (e) => {
      if (e.target === searchOverlay) {
        searchOverlay.classList.remove("is-active");
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      searchResults.innerHTML = "";

      if (!query) return;

      const products = document.querySelectorAll(".product-card, .menu-card");

      products.forEach(item => {
        const title = item.querySelector("h3, h4");
        if (!title) return;

        if (title.textContent.toLowerCase().includes(query)) {
          const result = document.createElement("div");
          result.className = "search-result";
          result.textContent = title.textContent;
          searchResults.appendChild(result);
        }
      });
    });
  }

  /* =========================
  CART
  ========================= */

  let cartCount = 0;
  const cartCountEl = document.getElementById("cartCount");

  function updateCart() {
    if (cartCountEl) {
      cartCountEl.textContent = cartCount;
    }
  }

  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-name][data-price]");
    if (!btn) return;

    cartCount++;
    updateCart();
  });

  updateCart();

  /* =========================
  CAROUSEL AUTO SCROLL
  ========================= */

  const track = document.querySelector(".carousel__track");

  if (track) {
    let pos = 0;
    const speed = 0.3;

    function moveCarousel() {
      pos -= speed;
      if (Math.abs(pos) >= track.scrollWidth / 2) {
        pos = 0;
      }
      track.style.transform = `translateX(${pos}px)`;
      requestAnimationFrame(moveCarousel);
    }

    moveCarousel();
  }

  /* =========================
  SMOOTH SCROLL
  ========================= */

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });

});
