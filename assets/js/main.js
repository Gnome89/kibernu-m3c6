/* =========================
MAIN.JS
Integración aditiva (buscador + carrito)
========================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- SEARCH OVERLAY ---------- */

  const searchBtn = document.getElementById('searchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const closeSearch = document.getElementById('closeSearch');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', () => {
      searchOverlay.classList.add('is-open');
      searchInput.focus();
    });
  }

  if (closeSearch) {
    closeSearch.addEventListener('click', () => {
      searchOverlay.classList.remove('is-open');
      searchResults.innerHTML = '';
      searchInput.value = '';
    });
  }

  /* ---------- CART LOGIC ---------- */

  let cart = [];
  const cartCount = document.getElementById('cartCount');

  function updateCartCount() {
    if (cartCount) {
      cartCount.textContent = cart.length;
    }
  }

  function addToCart(name, price) {
    cart.push({ name, price });
    updateCartCount();
  }

  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-name][data-price]');
    if (!btn) return;

    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price, 10);

    addToCart(name, price);
    btn.classList.add('is-added');

    setTimeout(() => btn.classList.remove('is-added'), 600);
  });

  /* ---------- SEARCH FUNCTION ---------- */

  const products = Array.from(document.querySelectorAll('[data-name]'))
    .map(btn => ({
      name: btn.dataset.name,
      price: btn.dataset.price
    }))
    .filter(
      (value, index, self) =>
        index === self.findIndex(p => p.name === value.name)
    );

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      searchResults.innerHTML = '';

      if (!query) return;

      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(query)
      );

      if (!filtered.length) {
        searchResults.innerHTML = '<p>No se encontraron resultados</p>';
        return;
      }

      filtered.forEach(p => {
        const item = document.createElement('div');
        item.className = 'search-result';
        item.innerHTML = `
          <span>${p.name}</span>
          <span>$${p.price}</span>
        `;
        searchResults.appendChild(item);
      });
    });
  }

});
