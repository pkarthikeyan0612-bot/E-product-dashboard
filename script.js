// =========================================
//   BOYS COSMETIC STORE — script.js
// =========================================

/* ── CART STATE ── */
let cart = [];

/* ── ADD TO CART ── */
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCartUI();
  showToast(`✅ ${name} added to cart!`);
  openCart();
}

/* ── REMOVE FROM CART ── */
function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  updateCartUI();
}

/* ── CHANGE QUANTITY ── */
function changeQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(name);
    else updateCartUI();
  }
}

/* ── UPDATE CART UI ── */
function updateCartUI() {
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  cartCount.textContent = totalQty;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <p>Your cart is empty</p>
      </div>`;
    cartTotal.textContent = '₹0';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString()}</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="changeQty('${item.name}', -1)">−</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="changeQty('${item.name}', 1)">+</button>
      </div>
      <button class="remove-btn" onclick="removeFromCart('${item.name}')">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  `).join('');

  cartTotal.textContent = '₹' + totalPrice.toLocaleString();
}

/* ── OPEN / CLOSE CART ── */
function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
}
function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

// Cart button in navbar opens cart
document.querySelector('.cart-btn').addEventListener('click', function(e) {
  e.preventDefault();
  toggleCart();
});

/* ── TOAST NOTIFICATION ── */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ── CHECKOUT ── */
function checkout() {
  if (cart.length === 0) {
    showToast('🛒 Add items first!');
    return;
  }
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  showToast(`🎉 Order placed! Total: ₹${total.toLocaleString()}`);
  cart = [];
  updateCartUI();
  toggleCart();
}

/* ── CATEGORY FILTER TABS ── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    const selected = this.getAttribute('data-category');
    const sections = document.querySelectorAll('.products-section');

    sections.forEach(section => {
      if (selected === 'all') {
        section.classList.remove('hidden');
      } else {
        const heading = section.querySelector('.cat-heading');
        const sectionCat = heading ? heading.getAttribute('data-category') : '';
        section.classList.toggle('hidden', sectionCat !== selected);
      }
    });
  });
});

/* ── HAMBURGER MENU ── */
document.getElementById('hamburger').addEventListener('click', function() {
  document.querySelector('.nav-links').classList.toggle('open');
});

/* ── WISHLIST TOGGLE ── */
document.querySelectorAll('.wishlist-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const icon = this.querySelector('i');
    if (icon.classList.contains('far')) {
      icon.classList.replace('far', 'fas');
      icon.style.color = '#ff4d4d';
      showToast('❤️ Added to Wishlist!');
    } else {
      icon.classList.replace('fas', 'far');
      icon.style.color = '';
      showToast('💔 Removed from Wishlist');
    }
  });
});

/* ── SMOOTH SCROLL for nav links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  if (!a.classList.contains('cart-btn')) {
    a.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.querySelector('.nav-links').classList.remove('open');
      }
    });
  }
});

/* ── NAVBAR SCROLL EFFECT ── */
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.6)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

/* ── IMAGE ERROR FALLBACK ── */
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    this.src = 'https://via.placeholder.com/400x300/1e1e1e/e8a020?text=Image+Not+Found';
  });
});

/* ── CARD ANIMATION ON SCROLL ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.product-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease, border-color 0.3s ease';
  observer.observe(card);
});
