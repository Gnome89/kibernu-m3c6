JAVASCRIP CODIGO

/* =========================================
   LOGICA DEL SITIO - AROMA & GRANO
   Manipulación de estados SMACSS (is-*)
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // ---------------------------------------------
    // 1. EFECTO SCROLL EN HEADER
    // Objetivo: Añadir sombra cuando el usuario baja
    // ---------------------------------------------
    const header = document.querySelector('.l-header');

    window.addEventListener('scroll', () => {
        // Si bajamos más de 50px, añadimos la clase de estado
        if (window.scrollY > 50) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    });

    // ---------------------------------------------
    // 2. INTERACCIÓN BOTONES DE PEDIDO
    // Objetivo: Dar feedback visual al hacer clic
    // ---------------------------------------------
    
    // Seleccionamos todos los botones pequeños de las cards
    const orderButtons = document.querySelectorAll('.card .btn-small');

    orderButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentBtn = e.target;
            const originalText = currentBtn.innerText;

            // Evitamos que den clic muchas veces seguidas
            if(currentBtn.classList.contains('is-added')) return;

            // Cambiamos el estado visual
            currentBtn.classList.add('is-added');
            currentBtn.innerText = "¡Agregado! ✔";

            // Simulamos que pasaron 2 segundos y volvemos a la normalidad
            setTimeout(() => {
                currentBtn.classList.remove('is-added');
                currentBtn.innerText = originalText;
            }, 2000);
        });
    });

});
