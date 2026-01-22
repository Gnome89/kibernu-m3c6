/* =========================================
   LOGICA DEL SITIO - AROMA & GRANO
   Sistema completo de carrito de compras
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // =============================================
    // VARIABLES GLOBALES Y CONFIGURACIÓN
    // =============================================
    
    const products = {
        1: { name: 'Espresso Romano', price: 3500, image: 'assets/img/productos/expresso romano.jpg' },
        2: { name: 'Flat White', price: 4500, image: 'assets/img/productos/flat white.jpg' },
        3: { name: 'Cold Brew', price: 4000, image: 'assets/img/productos/cold brew.jpeg' },
        4: { name: 'Cappuccino', price: 4200, image: 'assets/img/productos/cappuccino.jpeg' },
        5: { name: 'Macchiato', price: 3800, image: 'assets/img/productos/macchiato.jpeg' },
        6: { name: 'Americano', price: 3200, image: 'assets/img/productos/americano.jpeg' }
    };

    const STORAGE_KEY = 'aroma_grano_cart';
    let cart = loadCart();

    // =============================================
    // CLASE: CARRITO DE COMPRAS
    // =============================================
    
    class ShoppingCart {
        constructor() {
            this.items = cart;
        }

        addItem(productId, quantity = 1) {
            const product = products[productId];
            if (!product) return false;

            const existingItem = this.items.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                this.items.push({
                    id: productId,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity
                });
            }
            
            this.save();
            return true;
        }

        removeItem(productId) {
            this.items = this.items.filter(item => item.id !== productId);
            this.save();
        }

        updateQuantity(productId, quantity) {
            const item = this.items.find(item => item.id === productId);
            if (item) {
                if (quantity <= 0) {
                    this.removeItem(productId);
                } else {
                    item.quantity = quantity;
                    this.save();
                }
            }
        }

        getTotal() {
            return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        }

        getItemCount() {
            return this.items.reduce((count, item) => count + item.quantity, 0);
        }

        clear() {
            this.items = [];
            this.save();
        }

        save() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
            updateUI();
        }
    }

    const shoppingCart = new ShoppingCart();

    // =============================================
    // FUNCIONES DE LOCALSTORAGE
    // =============================================

    function loadCart() {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    }

    // =============================================
    // FUNCIONES DE UI
    // =============================================

    function updateUI() {
        updateCartCount();
        updateCartPanel();
    }

    function updateCartCount() {
        const count = shoppingCart.getItemCount();
        const badges = document.querySelectorAll('[data-cart-count]');
        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    function updateCartPanel() {
        const cartPanel = document.getElementById('cartPanel');
        if (!cartPanel) return;

        const cartItemsContainer = cartPanel.querySelector('.cart-panel__items');
        const cartTotal = cartPanel.querySelector('.cart-panel__total-amount');
        const emptyMessage = cartPanel.querySelector('.cart-panel__empty');

        if (shoppingCart.items.length === 0) {
            cartItemsContainer.innerHTML = '';
            emptyMessage.style.display = 'block';
            cartTotal.textContent = '$0';
            return;
        }

        emptyMessage.style.display = 'none';
        cartItemsContainer.innerHTML = shoppingCart.items.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item__image">
                <div class="cart-item__details">
                    <h4 class="cart-item__name">${item.name}</h4>
                    <p class="cart-item__price">$${item.price.toLocaleString('es-CL')}</p>
                </div>
                <div class="cart-item__quantity">
                    <button class="cart-item__btn-minus" data-action="decrease">−</button>
                    <input type="number" class="cart-item__input" value="${item.quantity}" min="1" data-action="input">
                    <button class="cart-item__btn-plus" data-action="increase">+</button>
                </div>
                <div class="cart-item__subtotal">$${(item.price * item.quantity).toLocaleString('es-CL')}</div>
                <button class="cart-item__remove" data-action="remove" title="Eliminar">✕</button>
            </div>
        `).join('');

        cartTotal.textContent = `$${shoppingCart.getTotal().toLocaleString('es-CL')}`;

        // Event listeners para los botones del carrito
        attachCartItemListeners(cartItemsContainer);
    }

    function attachCartItemListeners(container) {
        container.querySelectorAll('.cart-item__btn-minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('.cart-item').dataset.productId);
                const item = shoppingCart.items.find(i => i.id === productId);
                if (item) shoppingCart.updateQuantity(productId, item.quantity - 1);
            });
        });

        container.querySelectorAll('.cart-item__btn-plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('.cart-item').dataset.productId);
                const item = shoppingCart.items.find(i => i.id === productId);
                if (item) shoppingCart.updateQuantity(productId, item.quantity + 1);
            });
        });

        container.querySelectorAll('.cart-item__input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = parseInt(e.target.closest('.cart-item').dataset.productId);
                const quantity = parseInt(e.target.value) || 1;
                shoppingCart.updateQuantity(productId, quantity);
            });
        });

        container.querySelectorAll('.cart-item__remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('.cart-item').dataset.productId);
                shoppingCart.removeItem(productId);
                showNotification('Producto eliminado del carrito', 'info');
            });
        });
    }

    // =============================================
    // 1. NOTIFICACIÓN TOAST AL AGREGAR
    // =============================================

    function showCartNotification(product, quantity = 1) {
        const notification = document.createElement('div');
        notification.className = 'cart-toast';
        notification.innerHTML = `
            <div class="cart-toast__image"><img src="${product.image}" alt="${product.name}"></div>
            <div class="cart-toast__content">
                <div class="cart-toast__title">✓ Agregado al carrito</div>
                <div class="cart-toast__text">${product.name}</div>
                <div class="cart-toast__price">$${product.price.toLocaleString('es-CL')} x ${quantity}</div>
            </div>`;
        
        const cartNotification = document.getElementById('cartNotification');
        cartNotification.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('removing');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `cart-toast cart-toast--${type}`;
        notification.innerHTML = `
            <div class="cart-toast__content">
                <div class="cart-toast__text">${message}</div>
            </div>`;
        
        const cartNotification = document.getElementById('cartNotification');
        cartNotification.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('removing');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // =============================================
    // 2. BOTONES "AGREGAR AL CARRITO"
    // =============================================

    const addToCartBtns = document.querySelectorAll('.add-to-cart');

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = parseInt(btn.getAttribute('data-product'));
            const product = products[productId];
            
            if (shoppingCart.addItem(productId, 1)) {
                showCartNotification(product, 1);
                // Efecto visual en el botón
                btn.classList.add('is-added');
                setTimeout(() => btn.classList.remove('is-added'), 600);
            }
        });
    });

    // =============================================
    // 3. PANEL LATERAL DEL CARRITO
    // =============================================

    const cartToggle = document.getElementById('cartToggle');
    const cartPanel = document.getElementById('cartPanel');
    const cartClose = document.getElementById('cartClose');
    const cartCheckoutBtn = document.getElementById('cartCheckout');
    const cartClearBtn = document.getElementById('cartClear');

    if (cartToggle) {
        cartToggle.addEventListener('click', () => {
            cartPanel.classList.toggle('is-open');
        });
    }

    if (cartClose) {
        cartClose.addEventListener('click', () => {
            cartPanel.classList.remove('is-open');
        });
    }

    // Click fuera del panel para cerrar
    if (cartPanel) {
        cartPanel.addEventListener('click', (e) => {
            if (e.target === cartPanel) {
                cartPanel.classList.remove('is-open');
            }
        });
    }

    if (cartCheckoutBtn) {
        cartCheckoutBtn.addEventListener('click', () => {
            if (shoppingCart.items.length === 0) {
                showNotification('El carrito está vacío', 'warning');
                return;
            }
            openCheckout();
        });
    }

    if (cartClearBtn) {
        cartClearBtn.addEventListener('click', () => {
            if (confirm('¿Vaciar el carrito?')) {
                shoppingCart.clear();
                showNotification('Carrito vaciado', 'info');
            }
        });
    }

    // =============================================
    // 4. MODAL DE CHECKOUT
    // =============================================

    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckout = document.getElementById('closeCheckout');
    const checkoutOverlay = document.getElementById('checkoutOverlay');
    const confirmPayment = document.getElementById('confirmPayment');
    const cancelCheckout = document.getElementById('cancelCheckout');

    function openCheckout() {
        updateCheckoutSummary();
        checkoutModal.classList.remove('modal--hidden');
        cartPanel.classList.remove('is-open');
    }

    function closeCheckoutModal() {
        checkoutModal.classList.add('modal--hidden');
    }

    function updateCheckoutSummary() {
        const total = shoppingCart.getTotal();
        const count = shoppingCart.getItemCount();
        document.getElementById('checkoutTotal').textContent = `$${total.toLocaleString('es-CL')}`;
        document.getElementById('itemCount').textContent = `${count} ${count === 1 ? 'artículo' : 'artículos'}`;
    }

    if (closeCheckout) {
        closeCheckout.addEventListener('click', closeCheckoutModal);
    }

    if (checkoutOverlay) {
        checkoutOverlay.addEventListener('click', closeCheckoutModal);
    }

    if (cancelCheckout) {
        cancelCheckout.addEventListener('click', closeCheckoutModal);
    }

    if (confirmPayment) {
        confirmPayment.addEventListener('click', processPayment);
    }

    // =============================================
    // 5. PROCESAMIENTO DE PAGO
    // =============================================

    function processPayment() {
        const paymentMethod = document.querySelector('input[name="payment"]:checked');
        const name = document.getElementById('checkoutName').value.trim();
        const email = document.getElementById('checkoutEmail').value.trim();
        const phone = document.getElementById('checkoutPhone').value.trim();

        if (!paymentMethod) {
            showNotification('Selecciona un método de pago', 'warning');
            return;
        }

        if (!name || !email || !phone) {
            showNotification('Completa todos los datos de contacto', 'warning');
            return;
        }

        const selectedMethod = paymentMethod.value;
        const total = shoppingCart.getTotal();
        const cartItems = shoppingCart.items;

        // Validación de email
        if (!validateEmail(email)) {
            showNotification('Correo inválido', 'warning');
            return;
        }

        // Validación de teléfono chileno
        if (!validateChileanPhone(phone)) {
            showNotification('Teléfono debe ser válido (+56...)', 'warning');
            return;
        }

        // Procesamiento según el método de pago
        const orderData = {
            customer: { name, email, phone },
            items: cartItems,
            total: total,
            date: new Date().toLocaleString('es-CL'),
            method: selectedMethod
        };

        switch (selectedMethod) {
            case 'transfer':
                processBankTransfer(orderData);
                break;
            case 'webpay':
                processWebpay(orderData);
                break;
            case 'cash':
                processCash(orderData);
                break;
            case 'paypal':
                processPayPal(orderData);
                break;
            default:
                showNotification('Método de pago no válido', 'warning');
        }
    }

    function processBankTransfer(orderData) {
        const bankInfo = `
DATOS PARA TRANSFERENCIA BANCARIA
==================================
Banco: Banco de Chile (ó tu banco)
Cuenta: 123-456-789-0
Tipo: Cuenta Corriente
Titular: Aroma & Grano
RUT: 12.345.678-9
Correo de confirmación: pagos@aromagrano.cl

DETALLES DE TU ORDEN:
${generateOrderDetails(orderData)}

Envía tu comprobante a: pagos@aromagrano.cl
        `;
        showPaymentConfirmation('Transferencia Bancaria', bankInfo, orderData);
    }

    function processWebpay(orderData) {
        const total = orderData.total;
        const webpayMessage = `
COMPRA POR WEBPAY PLUS
=======================
Total a pagar: $${total.toLocaleString('es-CL')}

Serás redirigido a la plataforma segura de Webpay.
Por favor NO cierres esta ventana.

${generateOrderDetails(orderData)}
        `;
        
        // Simular redirección a Webpay
        confirmPayment.innerHTML = 'Procesando...';
        confirmPayment.disabled = true;
        
        setTimeout(() => {
            showPaymentConfirmation('Webpay Plus', webpayMessage, orderData);
            confirmPayment.innerHTML = 'Confirmar Pago';
            confirmPayment.disabled = false;
        }, 2000);
    }

    function processCash(orderData) {
        const cashInfo = `
PAGO EN EFECTIVO
================
Total a pagar: $${orderData.total.toLocaleString('es-CL')}

Tu pedido estará listo en 30-45 minutos.
Paga cuando vengas a retirar.

DIRECCIÓN DE RETIRO:
Calle Serrano 96, Santiago, Chile
Horario: Lunes a Viernes 7:00 AM - 8:00 PM
         Sábado y Domingo 8:00 AM - 9:00 PM

${generateOrderDetails(orderData)}

Número de orden: #${generateOrderNumber()}
        `;
        showPaymentConfirmation('Efectivo al Retirar', cashInfo, orderData);
    }

    function processPayPal(orderData) {
        const total = orderData.total;
        const paypalMessage = `
PAGO POR PAYPAL
===============
Total a pagar: $${total.toLocaleString('es-CL')}

Serás redirigido a PayPal para completar el pago.

${generateOrderDetails(orderData)}

IMPORTANTE:
- Asegúrate de usar una cuenta PayPal válida
- La transacción es segura y encriptada
- Recibirás confirmación por correo
        `;
        
        // Simular redirección a PayPal
        confirmPayment.innerHTML = 'Redirigiendo a PayPal...';
        confirmPayment.disabled = true;
        
        setTimeout(() => {
            showPaymentConfirmation('PayPal', paypalMessage, orderData);
            confirmPayment.innerHTML = 'Confirmar Pago';
            confirmPayment.disabled = false;
        }, 1500);
    }

    function generateOrderDetails(orderData) {
        const items = orderData.items.map(item => 
            `${item.name} x ${item.quantity} = $${(item.price * item.quantity).toLocaleString('es-CL')}`
        ).join('\n');
        
        return `
Nombre: ${orderData.customer.name}
Email: ${orderData.customer.email}
Teléfono: ${orderData.customer.phone}
Fecha: ${orderData.date}

PRODUCTOS:
${items}

TOTAL: $${orderData.total.toLocaleString('es-CL')}
        `;
    }

    function generateOrderNumber() {
        return 'ARG' + Date.now().toString().slice(-8);
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validateChileanPhone(phone) {
        const re = /^\+?56\d{8,9}$/;
        return re.test(phone.replace(/[\s-]/g, ''));
    }

    function showPaymentConfirmation(method, details, orderData) {
        closeCheckoutModal();
        
        const confirmation = document.createElement('div');
        confirmation.className = 'payment-confirmation';
        confirmation.innerHTML = `
            <div class="payment-confirmation__overlay"></div>
            <div class="payment-confirmation__box">
                <h3 class="payment-confirmation__title">✓ Compra Confirmada</h3>
                <p class="payment-confirmation__method">Método: ${method}</p>
                <pre class="payment-confirmation__details">${details}</pre>
                <div class="payment-confirmation__actions">
                    <button class="btn btn--primary payment-confirmation__btn">Cerrar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(confirmation);
        
        // Event listener para cerrar
        confirmation.querySelector('.payment-confirmation__btn').addEventListener('click', () => {
            confirmation.remove();
            shoppingCart.clear();
        });

        // Cerrar al hacer click en overlay
        confirmation.querySelector('.payment-confirmation__overlay').addEventListener('click', () => {
            confirmation.remove();
            shoppingCart.clear();
        });

        // Enviar email de confirmación (simulado)
        console.log('Enviando confirmación a:', orderData.customer.email);
    }

    // =============================================
    // 4. EFECTO SCROLL EN HEADER
    // =============================================
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    });

    // =============================================
    // 5. MODAL - VER MENÚ PDF
    // =============================================

    const viewMenuBtn = document.getElementById('viewMenuBtn');
    const menuModal = document.getElementById('menuModal');
    const closeMenuBtn = document.getElementById('closeMenu');
    const modalOverlay = document.getElementById('modalOverlay');

    if (viewMenuBtn) {
        viewMenuBtn.addEventListener('click', () => {
            menuModal.classList.remove('modal--hidden');
        });
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', () => {
            menuModal.classList.add('modal--hidden');
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => {
            menuModal.classList.add('modal--hidden');
        });
    }

    // =============================================
    // 6. INICIALIZACIÓN
    // =============================================
    updateUI();

});
