/* =========================
main.js (COMPLETO – COHERENTE)
BEM + estados UI + persistencia
========================= */

(() => {

  /* =================================================
  HEADER SCROLL STATE
  ================================================= */
  const header = document.querySelector('.header');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    });
  }

  /* =================================================
  ACTIVE NAV LINK (SCROLLSPY)
  ================================================= */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__link');

  const activateNav = () => {
    const scrollPos = window.scrollY + 160;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('is-active');
          if (link.getAttribute('href') === `#${section.id}`) {
            link.classList.add('is-active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', activateNav);
  activateNav();

  /* =================================================
  FAVORITES (LOCALSTORAGE)
  ================================================= */
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const favCounter = document.getElementById('favCount');

  const updateFavCounter = () => {
    if (favCounter) favCounter.textContent = favorites.length;
  };

  window.addFav = (item) => {
    if (!favorites.includes(item)) {
      favorites.push(item);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      updateFavCounter();
    }
  };

  updateFavCounter();

  /* =================================================
  CART (LOCALSTORAGE)
  ================================================= */
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCounter = document.getElementById('cartCount');

  const updateCartCounter = () => {
    if (cartCounter) cartCounter.textContent = cart.length;
  };

  window.addCart = (item, price) => {
    cart.push({ item, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
  };

  updateCartCounter();

  /* =================================================
  FORM UX
  ================================================= */
  const form = document.querySelector('.contact');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.reset();
      alert('Mensaje enviado correctamente');
    });
  }

})();
